import jwt from "jsonwebtoken";
import dns from "node:dns/promises";
import { Administrador } from "../models/Administrador.js";
import { Usuario } from "../models/Usuario.js";
import { Sesion } from "../models/Sesion.js";
import { enviarCorreoRecuperacion } from "../utils/email.util.js";

// Listas de dominios de correo
const DOMINIOS_TEMPORALES = new Set([
  "olipii.com",
  "mailinator.com",
  "tempmail.com",
  "temp-mail.org",
  "10minutemail.com",
  "guerrillamail.com",
  "yopmail.com",
  "trashmail.com",
  "sharklasers.com",
  "getnada.com",
  "maildrop.cc",
  "dispostable.com",
  "fakeinbox.com",
  "throwawaymail.com",
  "mohmal.com",
  "emailondeck.com",
]);

const DOMINIOS_CONFIABLES = new Set([
  "gmail.com",
  "googlemail.com",
  "hotmail.com",
  "hotmail.es",
  "outlook.com",
  "outlook.es",
  "live.com",
  "msn.com",
  "yahoo.com",
  "yahoo.es",
  "icloud.com",
  "protonmail.com",
  "proton.me",
  "electronova.com",
  "unc.edu.pe",
  "example.com",
  "test.com",
]);

// Utilidades de validación y formato
async function verificarCorreoExistente(email) {
  const partes = String(email || "").toLowerCase().trim().split("@");
  if (partes.length !== 2 || !partes[0] || !partes[1]) {
    return { valido: false, motivo: "El formato del correo electrónico no es válido" };
  }

  const [usuarioLocal, dominio] = partes;

  if (usuarioLocal.length < 2 || !dominio.includes(".")) {
    return { valido: false, motivo: "El correo electrónico ingresado no es válido" };
  }

  if (DOMINIOS_TEMPORALES.has(dominio)) {
    return { valido: false, motivo: "No se permiten correos temporales o desechables. Usa un correo real" };
  }

  if (DOMINIOS_CONFIABLES.has(dominio)) {
    return { valido: true };
  }

  try {
    const mxRecords = await Promise.race([
      dns.resolveMx(dominio),
      new Promise((_, reject) => setTimeout(() => reject(new Error("DNS_TIMEOUT")), 2500)),
    ]);
    if (!mxRecords || mxRecords.length === 0) {
      return { valido: false, motivo: "El dominio del correo electrónico no existe o no puede recibir mensajes" };
    }
    const tieneServidorValido = mxRecords.some((r) => r && r.exchange && r.exchange.trim() !== "" && r.exchange !== ".");
    if (!tieneServidorValido) {
      return { valido: false, motivo: "El correo electrónico ingresado no cuenta con un servidor de correo válido" };
    }
    return { valido: true };
  } catch (err) {
    if (["ENOTFOUND", "ENODATA", "ESERVFAIL", "EBADNAME"].includes(err.code)) {
      return { valido: false, motivo: "El dominio del correo electrónico no existe. Ingresa un correo real" };
    }
    return { valido: true };
  }
}

const capitalizarTexto = (texto = "") =>
  String(texto)
    .trim()
    .replace(/\s{2,}/g, " ")
    .replace(
      /(^|\s)([a-záéíóúñüA-ZÁÉÍÓÚÑÜ])([a-záéíóúñüA-ZÁÉÍÓÚÑÜ]*)/g,
      (_, espacio, primera, resto) => `${espacio}${primera.toUpperCase()}${resto.toLowerCase()}`
    );

const normalizarRol = (rol) => {
  const rolUpper = String(rol || "CLIENTE").toUpperCase();
  if (["ADMIN", "ADMINISTRATOR", "ADMINISTRADOR"].includes(rolUpper)) return "ADMINISTRATOR";
  if (rolUpper === "VENDEDOR") return "VENDEDOR";
  return "CLIENTE";
};

const formatearCredenciales = (cuenta, rolStr) => {
  return {
    _id: cuenta._id,
    nombres: cuenta.nombres || cuenta.firstname || cuenta.nombre || "",
    apellidos: cuenta.apellidos || cuenta.lastname || "",
    correo: cuenta.correo,
    rol: rolStr,
  };
};

const crearSesionYTokens = async ({ cuenta, rolStr, duracionToken = "15m", browser, ip }) => {
  const jwtSecret = process.env.JWT_SECRET || "super_secreto_desarrollo_2026";

  const accessToken = jwt.sign(
    { id: cuenta._id, correo: cuenta.correo, rol: rolStr },
    jwtSecret,
    { expiresIn: duracionToken }
  );

  const refreshToken = jwt.sign(
    { id: cuenta._id, type: "refresh" },
    jwtSecret,
    { expiresIn: "7d" }
  );

  await Sesion.create({
    userId: cuenta._id,
    refreshToken,
    browser,
    ip,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  });

  const user = formatearCredenciales(cuenta, rolStr);

  return {
    accessToken,
    jwtToken: accessToken,
    refreshToken,
    user,
  };
};

// Servicio de autenticación
const authService = {
  async register(datos) {
    const {
      firstname,
      lastname,
      nombres,
      apellidos,
      nombre,
      gender,
      birthdate,
      email,
      correo,
      password,
      contraseña,
      rol,
    } = datos;

    const emailFinal = (email || correo || "").toLowerCase().trim();
    const passwordFinal = password || contraseña;
    const nombresFinal = capitalizarTexto(nombres || firstname || "");
    const apellidosFinal = capitalizarTexto(apellidos || lastname || "");
    const nombreFinal =
      [nombresFinal, apellidosFinal].filter(Boolean).join(" ").trim() ||
      capitalizarTexto(nombre || "") ||
      "Usuario";
    const rolFinal = normalizarRol(rol);

    const [adminExiste, usuarioExiste] = await Promise.all([
      Administrador.findOne({ correo: emailFinal }),
      Usuario.findOne({ correo: emailFinal }),
    ]);

    if (adminExiste || usuarioExiste) {
      const err = new Error("El email ya esta registrado");
      err.code = "P2002";
      err.status = 400;
      throw err;
    }

    const verificacionCorreo = await verificarCorreoExistente(emailFinal);
    if (!verificacionCorreo.valido) {
      const err = new Error(verificacionCorreo.motivo);
      err.code = "INVALID_EMAIL_DOMAIN";
      err.status = 400;
      throw err;
    }

    const nuevoUsuario = new Usuario({
      nombre: nombreFinal,
      nombres: nombresFinal,
      apellidos: apellidosFinal,
      firstname: nombresFinal,
      lastname: apellidosFinal,
      gender,
      birthdate,
      correo: emailFinal,
      contraseña: passwordFinal,
      rol: rolFinal,
    });

    await nuevoUsuario.save();

    return crearSesionYTokens({
      cuenta: nuevoUsuario,
      rolStr: rolFinal,
      duracionToken: "15m",
      browser: datos.browser || "",
      ip: datos.ip || "",
    });
  },

  async login(credenciales, passwordParam, recordarmeParam = false) {
    const esObjeto = typeof credenciales === "object" && credenciales !== null;
    const email = (esObjeto ? credenciales.email || credenciales.correo : credenciales || "")
      .toLowerCase()
      .trim();
    const password = esObjeto ? credenciales.password || credenciales.contraseña || "" : passwordParam || "";
    const recordarme = Boolean(esObjeto ? credenciales.recordarme : recordarmeParam);
    const browser = esObjeto ? credenciales.browser || "" : "";
    const ip = esObjeto ? credenciales.ip || "" : "";
    const duracionToken = recordarme ? "30d" : "1d";

    const admin = await Administrador.findOne({ correo: email });
    if (admin) {
      if (!(await admin.comparePassword(password))) {
        return { error: "INVALID_CREDENTIALS" };
      }
      return crearSesionYTokens({
        cuenta: admin,
        rolStr: "ADMINISTRATOR",
        duracionToken,
        browser,
        ip,
      });
    }

    const usuario = await Usuario.findOne({ correo: email });
    if (usuario) {
      if (!(await usuario.comparePassword(password))) {
        return { error: "INVALID_CREDENTIALS" };
      }
      return crearSesionYTokens({
        cuenta: usuario,
        rolStr: normalizarRol(usuario.rol),
        duracionToken,
        browser,
        ip,
      });
    }

    return { error: "INVALID_CREDENTIALS" };
  },

  async refrescarToken({ refreshToken, browser = "", ip = "" }) {
    if (!refreshToken) {
      const err = new Error("No autorizado. Refresh token no proporcionado");
      err.status = 401;
      throw err;
    }

    const jwtSecret = process.env.JWT_SECRET || "super_secreto_desarrollo_2026";

    // 1. Verificar firma y expiración del refresh token
    let payload;
    try {
      payload = jwt.verify(refreshToken, jwtSecret);
    } catch {
      const err = new Error("Token inválido o expirado");
      err.status = 403;
      throw err;
    }

    if (!payload?.id || payload.type !== "refresh") {
      const err = new Error("Token de tipo inválido");
      err.status = 403;
      throw err;
    }

    // 2. Buscar en la Base de Datos si ese token sigue siendo válido (no revocado)
    const sesion = await Sesion.findOne({
      refreshToken,
      isRevoked: { $ne: true },
    });

    if (!sesion) {
      const err = new Error("Token de refresco inválido o expirado. Inicia sesión nuevamente.");
      err.status = 403;
      throw err;
    }

    // 3. Obtener datos actualizados del usuario o administrador
    let cuenta = await Administrador.findById(payload.id);
    let rolStr = "ADMINISTRATOR";

    if (!cuenta) {
      cuenta = await Usuario.findById(payload.id);
      if (cuenta) {
        rolStr = normalizarRol(cuenta.rol);
      }
    }

    if (!cuenta) {
      await Sesion.deleteOne({ _id: sesion._id });
      const err = new Error("Usuario no encontrado");
      err.status = 404;
      throw err;
    }

    // 4. Rotación de Refresh Token (generar un nuevo Access Token y un nuevo Refresh Token)
    const newAccessToken = jwt.sign(
      { id: cuenta._id, correo: cuenta.correo, rol: rolStr },
      jwtSecret,
      { expiresIn: "15m" }
    );

    const newRefreshToken = jwt.sign(
      { id: cuenta._id, type: "refresh" },
      jwtSecret,
      { expiresIn: "7d" }
    );

    // Actualizar la sesión en la base de datos con el nuevo token (rotación)
    sesion.refreshToken = newRefreshToken;
    sesion.browser = browser || sesion.browser;
    sesion.ip = ip || sesion.ip;
    sesion.expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await sesion.save();

    const user = formatearCredenciales(cuenta, rolStr);

    return {
      accessToken: newAccessToken,
      jwtToken: newAccessToken,
      refreshToken: newRefreshToken,
      user,
    };
  },

  async logout({ refreshToken, userId }) {
    if (refreshToken) {
      await Sesion.deleteMany({ refreshToken });
    }
    if (userId) {
      await Sesion.deleteMany({ userId });
    }
    return { message: "Sesión cerrada correctamente" };
  },

  async obtenerPerfil(id) {
    let cuenta = await Administrador.findById(id).select("-contraseña");
    let rolStr = "ADMINISTRATOR";

    if (!cuenta) {
      cuenta = await Usuario.findById(id).select("-contraseña");
      rolStr = normalizarRol(cuenta?.rol);
    }

    if (!cuenta) {
      const err = new Error("Usuario no encontrado.");
      err.status = 404;
      throw err;
    }

    return formatearCredenciales(cuenta, rolStr);
  },

  async solicitarRecuperacion(correo, originUrl) {
    const emailNormalizado = (correo || "").toLowerCase().trim();
    const cuenta =
      (await Administrador.findOne({ correo: emailNormalizado })) ||
      (await Usuario.findOne({ correo: emailNormalizado }));

    if (!cuenta) {
      const err = new Error("No existe una cuenta registrada con ese correo.");
      err.status = 404;
      throw err;
    }

    const secret = (process.env.JWT_SECRET || "super_secreto_desarrollo_2026") + cuenta.contraseña;
    const token = jwt.sign({ correo: cuenta.correo, id: cuenta._id }, secret, {
      expiresIn: "15m",
    });

    const frontendUrl = originUrl || process.env.FRONTEND_URL || "http://localhost:5173";
    const resetLink = `${frontendUrl}/reset-password?token=${token}&id=${cuenta._id}`;

    const nombreDestinatario = cuenta.nombres
      ? `${cuenta.nombres} ${cuenta.apellidos || ""}`.trim()
      : (cuenta.nombre || "Usuario");

    await enviarCorreoRecuperacion({
      destinatario: cuenta.correo,
      nombre: nombreDestinatario,
      resetLink,
    });
  },

  async restablecerContraseña(id, token, nuevaContrasena) {
    const cuenta = (await Administrador.findById(id)) || (await Usuario.findById(id));

    if (!cuenta) {
      const err = new Error("Cuenta no encontrada.");
      err.status = 404;
      throw err;
    }

    const secret = (process.env.JWT_SECRET || "super_secreto_desarrollo_2026") + cuenta.contraseña;

    try {
      jwt.verify(token, secret);
    } catch {
      const err = new Error("El enlace de recuperación es inválido o ha expirado.");
      err.status = 400;
      throw err;
    }

    cuenta.contraseña = nuevaContrasena;
    await cuenta.save();
  },
};

export { authService };
