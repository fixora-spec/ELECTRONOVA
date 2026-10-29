import * as z from "zod";
import { authService } from "../services/auth.service.js";
import { registerUserSchema, loginUserSchema } from "../schemas/auth.schema.js";

class AuthController {
  async register(req, res) {
    const {
      firstname,
      lastname,
      gender,
      birthdate,
      email,
      password,
      rePassword,
      role,
      nombre,
      correo,
      contraseña,
      confirmarContraseña,
      rol,
    } = req.body;

    const resolvedFirstname = firstname || (nombre ? nombre.split(" ")[0] : undefined);
    const resolvedLastname = lastname || (nombre ? nombre.split(" ").slice(1).join(" ") || nombre : undefined);
    const resolvedEmail = email || correo;
    const resolvedPassword = password || contraseña;
    const resolvedRePassword = rePassword || confirmarContraseña || resolvedPassword;
    const resolvedRole = role || rol || "usuario";

    try {
      await registerUserSchema.parseAsync({
        firstname: resolvedFirstname,
        lastname: resolvedLastname,
        nombre: nombre || (resolvedFirstname ? `${resolvedFirstname} ${resolvedLastname || ""}`.trim() : undefined),
        gender,
        birthdate,
        email: resolvedEmail,
        correo: resolvedEmail,
        password: resolvedPassword,
        contraseña: resolvedPassword,
        rePassword: resolvedRePassword,
        confirmarContraseña: resolvedRePassword,
        role: resolvedRole,
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
        nombre: nombre || (resolvedFirstname ? `${resolvedFirstname} ${resolvedLastname || ""}`.trim() : "Usuario"),
        gender,
        birthdate,
        email: resolvedEmail,
        correo: resolvedEmail,
        password: resolvedPassword,
        contraseña: resolvedPassword,
        role: resolvedRole,
      });

      return res.json({
        message: "Registro exitoso. ¡Bienvenido a ELECTRONOVA!",
        newUser,
        user: newUser,
        token: newUser.token,
      });
    } catch (error) {
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
  }

  async login(req, res) {
    const { email, password, correo, contraseña, recordarme } = req.body;
    const resolvedEmail = email || correo;
    const resolvedPassword = password || contraseña;

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

    const { credentials, jwtToken, refreshToken } = result;

    const NODE_ENV = process.env.NODE_ENV || "developer";
    res.cookie("authToken", jwtToken, {
      httpOnly: NODE_ENV === "developer" ? false : true,
      secure: NODE_ENV === "developer" ? false : true,
      sameSite: "lax",
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: NODE_ENV === "developer" ? false : true,
      secure: NODE_ENV === "developer" ? false : true,
      sameSite: "lax",
    });

    return res.json({
      message: `Bienvenido, ${credentials.email}`,
      token: jwtToken,
      jwtToken,
      refreshToken,
      user: result.user || credentials,
      admin: result.admin || null,
      credentials,
    });
  }

  logout(req, res) {
    res.clearCookie("authToken");
    res.clearCookie("refreshToken");
    return res.json({ message: "Sesión cerrada correctamente" });
  }

  async getProfile(req, res) {
    try {
      const user = await authService.obtenerPerfil(req.user?.id || req.admin?.id);
      return res.json({
        message: "Perfil obtenido exitosamente.",
        user,
        admin: user.rol === "admin" ? user : null,
      });
    } catch (error) {
      return res.status(error.status || 500).json({ message: error.message || "Error desconocido" });
    }
  }

  async forgotPassword(req, res) {
    try {
      const email = req.body.email || req.body.correo;
      await authService.solicitarRecuperacion(email);
      return res.json({ message: "Se ha enviado un enlace de recuperación a su correo electrónico." });
    } catch (error) {
      return res.status(error.status || 500).json({ message: error.message || "Error al procesar la solicitud" });
    }
  }

  async resetPassword(req, res) {
    try {
      const { id, token, password, nuevaContrasena } = req.body;
      await authService.restablecerContraseña(id, token, password || nuevaContrasena);
      return res.json({ message: "Contraseña actualizada exitosamente." });
    } catch (error) {
      return res.status(error.status || 500).json({ message: error.message || "Error al restablecer la contraseña" });
    }
  }
}

const authController = new AuthController();

export { authController, AuthController };

export const register = (req, res) => authController.register(req, res);
export const login = (req, res) => authController.login(req, res);
export const logout = (req, res) => authController.logout(req, res);
export const getProfile = (req, res) => authController.getProfile(req, res);
export const forgotPassword = (req, res) => authController.forgotPassword(req, res);
export const resetPassword = (req, res) => authController.resetPassword(req, res);
