import * as z from "zod";
import { authService } from "../services/auth.service.js";
import { registerUserSchema, loginUserSchema } from "../schemas/auth.schema.js";

// Opciones de cookies
const getRefreshTokenCookieOptions = () => {
  const isProd = process.env.NODE_ENV === "production";
  return {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: "/",
  };
};

const getAuthTokenCookieOptions = () => {
  const isProd = process.env.NODE_ENV === "production";
  return {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "none" : "lax",
    maxAge: 15 * 60 * 1000,
    path: "/",
  };
};

// Registro de usuario
const register = async (req, res) => {
  const {
    firstname,
    lastname,
    nombres,
    apellidos,
    gender,
    birthdate,
    email,
    password,
    rePassword,
    nombre,
    correo,
    contraseña,
    contrasena,
    confirmarContraseña,
    rol,
  } = req.body;

  const resolvedFirstname = firstname || nombres || (nombre ? nombre.split(" ")[0] : undefined);
  const resolvedLastname =
    lastname || apellidos || (nombre ? nombre.split(" ").slice(1).join(" ") || nombre : undefined);
  const resolvedEmail = email || correo;
  const resolvedPassword = password || contraseña || contrasena;
  const resolvedRePassword = rePassword || confirmarContraseña || resolvedPassword;
  const resolvedRol = rol || "CLIENTE";
  const resolvedNombreCompleto =
    [resolvedFirstname, resolvedLastname].filter(Boolean).join(" ").trim() || nombre;

  try {
    await registerUserSchema.parseAsync({
      firstname: resolvedFirstname,
      lastname: resolvedLastname,
      nombres: resolvedFirstname,
      apellidos: resolvedLastname,
      nombre: resolvedNombreCompleto,
      gender,
      birthdate,
      email: resolvedEmail,
      correo: resolvedEmail,
      password: resolvedPassword,
      contraseña: resolvedPassword,
      rePassword: resolvedRePassword,
      confirmarContraseña: resolvedRePassword,
      rol: resolvedRol,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.json({ issues: error.issues });
    }
  }

  try {
    const newUser = await authService.register({
      firstname: resolvedFirstname,
      lastname: resolvedLastname,
      nombres: resolvedFirstname,
      apellidos: resolvedLastname,
      nombre: resolvedNombreCompleto || "Usuario",
      gender,
      birthdate,
      email: resolvedEmail,
      correo: resolvedEmail,
      password: resolvedPassword,
      contraseña: resolvedPassword,
      rol: resolvedRol,
    });

    const tokenFinal = newUser.accessToken || newUser.jwtToken;
    res.cookie("authToken", tokenFinal, getAuthTokenCookieOptions());
    if (newUser.refreshToken) {
      res.cookie("refreshToken", newUser.refreshToken, getRefreshTokenCookieOptions());
    }

    return res.status(201).json({
      message: "Registro exitoso. ¡Bienvenido a ELECTRONOVA!",
      accessToken: tokenFinal,
      jwtToken: tokenFinal,
      refreshToken: newUser.refreshToken,
      user: newUser.user,
    });
  } catch (error) {
    if (error.code === "INVALID_EMAIL_DOMAIN") {
      return res.json({
        issues: [
          {
            expected: "string",
            code: "invalid_email",
            path: ["email"],
            message: error.message,
          },
        ],
      });
    }
    if (error.code === "P2002" || error.code === 11000 || error.status === 400) {
      return res.json({
        issues: [
          {
            expected: "string",
            code: "unique",
            path: ["email"],
            message: "El email ya esta registrado",
          },
        ],
      });
    }
    return res.json({
      issues: [
        {
          expected: "any",
          code: "any",
          path: ["any"],
          message: "Error desconocido",
        },
      ],
    });
  }
};

// Inicio de sesión
const login = async (req, res) => {
  const { email, password, correo, contraseña, contrasena, recordarme } = req.body;
  const resolvedEmail = email || correo;
  const resolvedPassword = password || contraseña || contrasena;

  try {
    await loginUserSchema.parseAsync({
      email: resolvedEmail,
      password: resolvedPassword,
      correo: resolvedEmail,
      contraseña: resolvedPassword,
      recordarme: Boolean(recordarme),
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.json({ issues: error.issues });
    }
  }

  const result = await authService.login({
    email: resolvedEmail,
    password: resolvedPassword,
    recordarme: Boolean(recordarme),
    browser: req.headers["user-agent"] || "",
    ip: req.ip || "",
  });

  if (result.error === "INVALID_CREDENTIALS") {
    return res.json({
      issues: [
        {
          expected: "any",
          code: "any",
          path: ["email"],
          message: "Email y/o contraseña incorrectos",
        },
      ],
    });
  }

  const { user, jwtToken, refreshToken, accessToken } = result;
  const tokenFinal = accessToken || jwtToken;

  res.cookie("authToken", tokenFinal, getAuthTokenCookieOptions());
  res.cookie("refreshToken", refreshToken, getRefreshTokenCookieOptions());

  const nombreMostrar = (user.nombres ? `${user.nombres} ${user.apellidos || ""}`.trim() : user.correo).trim();

  return res.json({
    message: `Bienvenido, ${nombreMostrar}`,
    accessToken: tokenFinal,
    jwtToken: tokenFinal,
    refreshToken,
    user,
  });
};

// Renovación de tokens (Refresh Token)
const refresh = async (req, res) => {
  const refreshToken = req.cookies?.refreshToken || req.body?.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({ message: "No autorizado. Refresh token no encontrado." });
  }

  try {
    const result = await authService.refrescarToken({
      refreshToken,
      browser: req.headers["user-agent"] || "",
      ip: req.ip || "",
    });

    res.cookie("authToken", result.accessToken, getAuthTokenCookieOptions());
    res.cookie("refreshToken", result.refreshToken, getRefreshTokenCookieOptions());

    return res.json({
      message: "Token renovado exitosamente",
      accessToken: result.accessToken,
      jwtToken: result.accessToken,
      user: result.user,
    });
  } catch (error) {
    res.clearCookie("authToken", { path: "/" });
    res.clearCookie("refreshToken", { path: "/" });
    return res.status(error.status || 403).json({
      message: error.message || "Token inválido o expirado",
    });
  }
};

// Cierre de sesión
const logout = async (req, res) => {
  const refreshToken = req.cookies?.refreshToken || req.body?.refreshToken;
  const userId = req.user?.id || req.admin?.id;

  res.clearCookie("authToken", { path: "/" });
  res.clearCookie("refreshToken", { path: "/" });

  try {
    await authService.logout({ refreshToken, userId });
  } catch {}

  return res.json({ message: "Sesión cerrada correctamente" });
};

// Perfil de usuario autenticado
const getProfile = async (req, res) => {
  try {
    const user = await authService.obtenerPerfil(req.user?.id || req.admin?.id);
    const isAdmin = ["ADMIN", "ADMINISTRATOR", "ADMINISTRADOR"].includes((user.rol || "").toUpperCase());
    return res.json({
      message: "Perfil obtenido exitosamente.",
      user,
      admin: isAdmin ? user : null,
    });
  } catch (error) {
    return res.status(error.status || 500).json({ message: error.message || "Error desconocido" });
  }
};

// Solicitud de recuperación de contraseña
const forgotPassword = async (req, res) => {
  try {
    const email = req.body.email || req.body.correo;
    if (!email) {
      return res.status(400).json({ message: "El correo electrónico es obligatorio." });
    }
    await authService.solicitarRecuperacion(email, req.headers.origin);
    return res.json({ message: "Se ha enviado un enlace de recuperación a su correo electrónico." });
  } catch (error) {
    return res.status(error.status || 500).json({ message: error.message || "Error al procesar la solicitud" });
  }
};

// Restablecimiento de contraseña
const resetPassword = async (req, res) => {
  try {
    const { id, token, password, nuevaContrasena } = req.body;
    const nuevaPass = password || nuevaContrasena;
    if (!id || !token || !nuevaPass) {
      return res.status(400).json({ message: "Todos los datos son obligatorios para restablecer la contraseña." });
    }
    await authService.restablecerContraseña(id, token, nuevaPass);
    return res.json({ message: "Contraseña actualizada exitosamente." });
  } catch (error) {
    return res.status(error.status || 500).json({ message: error.message || "Error al restablecer la contraseña" });
  }
};

const authController = {
  register,
  login,
  refresh,
  logout,
  getProfile,
  forgotPassword,
  resetPassword,
};

export {
  authController,
  register,
  login,
  refresh,
  logout,
  getProfile,
  forgotPassword,
  resetPassword,
};
