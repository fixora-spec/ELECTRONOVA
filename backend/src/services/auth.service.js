import jwt from "jsonwebtoken";
import { Administrador } from "../models/Administrador.js";
import { Usuario } from "../models/Usuario.js";
import { enviarCorreoRecuperacion } from "../utils/email.util.js";

const authService = {
  async register(datos) {
    const {
      firstname,
      lastname,
      nombre,
      gender,
      birthdate,
      email,
      correo,
      password,
      contraseña,
      role,
      rol,
    } = datos;

    const emailFinal = (email || correo || "").toLowerCase().trim();
    const passwordFinal = password || contraseña;
    const nombreFinal =
      nombre ||
      [firstname, lastname].filter(Boolean).join(" ") ||
      "Usuario";

    let rolFinal = "usuario";
    const rolInput = (role || rol || "").toLowerCase();
    if (rolInput === "admin" || rolInput === "administrator") {
      rolFinal = "admin";
    }

    const adminExiste = await Administrador.findOne({ correo: emailFinal });
    const usuarioExiste = await Usuario.findOne({ correo: emailFinal });

    if (adminExiste || usuarioExiste) {
      const err = new Error("El email ya esta registrado");
      err.code = "P2002";
      err.status = 400;
      throw err;
    }

    const nuevoUsuario = new Usuario({
      nombre: nombreFinal,
      firstname,
      lastname,
      gender,
      birthdate,
      correo: emailFinal,
      contraseña: passwordFinal,
      rol: rolFinal,
    });

    await nuevoUsuario.save();

    const jwtSecret = process.env.JWT_SECRET || "super_secreto_desarrollo_2026";
    const token = jwt.sign(
      { id: nuevoUsuario._id, correo: nuevoUsuario.correo, rol: nuevoUsuario.rol },
      jwtSecret,
      { expiresIn: "7d" }
    );

    return {
      id: nuevoUsuario._id,
      _id: nuevoUsuario._id,
      nombre: nuevoUsuario.nombre,
      firstname: nuevoUsuario.firstname,
      lastname: nuevoUsuario.lastname,
      email: nuevoUsuario.correo,
      correo: nuevoUsuario.correo,
      role: nuevoUsuario.rol === "admin" ? "ADMINISTRATOR" : "CLIENTE",
      rol: nuevoUsuario.rol,
      token,
    };
  },

  async registro(datos) {
    return this.register(datos);
  },

  async login(credenciales, passwordParam, recordarmeParam = false) {
    let email = "";
    let password = "";
    let recordarme = false;

    if (typeof credenciales === "object" && credenciales !== null) {
      email = (credenciales.email || credenciales.correo || "").toLowerCase().trim();
      password = credenciales.password || credenciales.contraseña || "";
      recordarme = Boolean(credenciales.recordarme);
    } else {
      email = String(credenciales || "").toLowerCase().trim();
      password = passwordParam || "";
      recordarme = Boolean(recordarmeParam);
    }

    const duracionToken = recordarme ? "30d" : "1d";
    const jwtSecret = process.env.JWT_SECRET || "super_secreto_desarrollo_2026";

    // 1. Verificar Administrador
    const admin = await Administrador.findOne({ correo: email });
    if (admin) {
      const esValida = await admin.comparePassword(password);
      if (!esValida) {
        return { error: "INVALID_CREDENTIALS" };
      }

      const jwtToken = jwt.sign(
        { id: admin._id, correo: admin.correo, email: admin.correo, rol: "admin", role: "ADMINISTRATOR" },
        jwtSecret,
        { expiresIn: duracionToken }
      );

      const refreshToken = jwt.sign(
        { id: admin._id, type: "refresh" },
        jwtSecret,
        { expiresIn: "30d" }
      );

      const credentials = {
        id: admin._id,
        nombre: admin.nombre,
        email: admin.correo,
        correo: admin.correo,
        role: "ADMINISTRATOR",
        rol: "admin",
      };

      return {
        credentials,
        jwtToken,
        refreshToken,
        token: jwtToken,
        user: credentials,
        admin: credentials,
      };
    }

    // 2. Verificar Usuario / Cliente
    const usuario = await Usuario.findOne({ correo: email });
    if (usuario) {
      const esValida = await usuario.comparePassword(password);
      if (!esValida) {
        return { error: "INVALID_CREDENTIALS" };
      }

      const rol = usuario.rol || "usuario";
      const roleStr = rol === "admin" ? "ADMINISTRATOR" : "CLIENTE";

      const jwtToken = jwt.sign(
        { id: usuario._id, correo: usuario.correo, email: usuario.correo, rol, role: roleStr },
        jwtSecret,
        { expiresIn: duracionToken }
      );

      const refreshToken = jwt.sign(
        { id: usuario._id, type: "refresh" },
        jwtSecret,
        { expiresIn: "30d" }
      );

      const credentials = {
        id: usuario._id,
        nombre: usuario.nombre,
        email: usuario.correo,
        correo: usuario.correo,
        role: roleStr,
        rol,
      };

      return {
        credentials,
        jwtToken,
        refreshToken,
        token: jwtToken,
        user: credentials,
        admin: rol === "admin" ? credentials : null,
      };
    }

    return { error: "INVALID_CREDENTIALS" };
  },

  async obtenerPerfil(id) {
    let cuenta = await Administrador.findById(id).select("-contraseña");
    let rol = "admin";

    if (!cuenta) {
      cuenta = await Usuario.findById(id).select("-contraseña");
      rol = cuenta?.rol || "usuario";
    }

    if (!cuenta) {
      const err = new Error("Usuario no encontrado.");
      err.status = 404;
      throw err;
    }

    return {
      id: cuenta._id,
      nombre: cuenta.nombre,
      correo: cuenta.correo,
      email: cuenta.correo,
      rol,
      role: rol === "admin" ? "ADMINISTRATOR" : "CLIENTE",
    };
  },

  async solicitarRecuperacion(correo) {
    const emailNormalizado = (correo || "").toLowerCase().trim();
    let cuenta = await Administrador.findOne({ correo: emailNormalizado });
    if (!cuenta) {
      cuenta = await Usuario.findOne({ correo: emailNormalizado });
    }

    if (!cuenta) {
      const err = new Error("No existe una cuenta registrada con ese correo.");
      err.status = 404;
      throw err;
    }

    const secret = (process.env.JWT_SECRET || "super_secreto_desarrollo_2026") + cuenta.contraseña;
    const token = jwt.sign({ correo: cuenta.correo, id: cuenta._id }, secret, {
      expiresIn: "15m",
    });

    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
    const resetLink = `${frontendUrl}/reset-password?token=${token}&id=${cuenta._id}`;

    await enviarCorreoRecuperacion({
      destinatario: cuenta.correo,
      nombre: cuenta.nombre,
      resetLink,
    });
  },

  async restablecerContraseña(id, token, nuevaContrasena) {
    let cuenta = await Administrador.findById(id);
    if (!cuenta) {
      cuenta = await Usuario.findById(id);
    }

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
