/**
 * @file auth.service.js
 * @description Capa de servicio para lógica de autenticación, generación de tokens JWT y recuperación de contraseñas.
 * @module services/auth
 */

import jwt from "jsonwebtoken";
import { Administrador } from "../models/Administrador.js";
import { Usuario } from "../models/Usuario.js";
import { enviarCorreoRecuperacion } from "../utils/email.util.js";

const authService = {
  /**
   * Registra un nuevo usuario/cliente en la base de datos y genera su token JWT.
   *
   * @param {Object} param0
   * @param {string} param0.nombre - Nombre completo del usuario.
   * @param {string} param0.correo - Correo electrónico único.
   * @param {string} param0.contraseña - Contraseña en texto plano.
   * @returns {Promise<{token: string, user: Object}>}
   */
  async registro({ nombre, correo, contraseña }) {
    const adminExiste = await Administrador.findOne({ correo });
    const usuarioExiste = await Usuario.findOne({ correo });

    if (adminExiste || usuarioExiste) {
      const err = new Error("El correo electrónico ya se encuentra registrado.");
      err.status = 400;
      throw err;
    }

    const nuevoUsuario = new Usuario({
      nombre,
      correo,
      contraseña,
      rol: "usuario",
    });

    await nuevoUsuario.save();

    const token = jwt.sign(
      { id: nuevoUsuario._id, correo: nuevoUsuario.correo, rol: "usuario" },
      process.env.JWT_SECRET || "super_secreto_desarrollo_2026",
      { expiresIn: "7d" }
    );

    return {
      token,
      user: {
        id: nuevoUsuario._id,
        nombre: nuevoUsuario.nombre,
        correo: nuevoUsuario.correo,
        rol: "usuario",
      },
    };
  },

  /**
   * Inicio de sesión unificado. Detecta automáticamente si las credenciales pertenecen a un Administrador o a un Cliente.
   *
   * @param {string} correo - Correo registrado.
   * @param {string} contraseña - Contraseña ingresada.
   * @param {boolean} [recordarme=false] - Si es true, el token durará 30 días en lugar de 1 día.
   * @returns {Promise<Object>} Datos del usuario y token JWT.
   */
  async login(correo, contraseña, recordarme = false) {
    const duracionToken = recordarme ? "30d" : "1d";

    // 1. Verificar si es Administrador
    const admin = await Administrador.findOne({ correo });
    if (admin) {
      const esValida = await admin.comparePassword(contraseña);
      if (!esValida) {
        const err = new Error("Credenciales inválidas.");
        err.status = 401;
        throw err;
      }

      const token = jwt.sign(
        { id: admin._id, correo: admin.correo, rol: "admin" },
        process.env.JWT_SECRET || "super_secreto_desarrollo_2026",
        { expiresIn: duracionToken }
      );

      return {
        token,
        user: {
          id: admin._id,
          nombre: admin.nombre,
          correo: admin.correo,
          rol: "admin",
        },
        admin: {
          id: admin._id,
          nombre: admin.nombre,
          correo: admin.correo,
          rol: "admin",
        },
      };
    }

    // 2. Si no es admin, verificar si es Usuario/Cliente
    const usuario = await Usuario.findOne({ correo });
    if (usuario) {
      const esValida = await usuario.comparePassword(contraseña);
      if (!esValida) {
        const err = new Error("Credenciales inválidas.");
        err.status = 401;
        throw err;
      }

      const token = jwt.sign(
        { id: usuario._id, correo: usuario.correo, rol: usuario.rol || "usuario" },
        process.env.JWT_SECRET || "super_secreto_desarrollo_2026",
        { expiresIn: duracionToken }
      );

      return {
        token,
        user: {
          id: usuario._id,
          nombre: usuario.nombre,
          correo: usuario.correo,
          rol: usuario.rol || "usuario",
        },
      };
    }

    // 3. Ni admin ni usuario encontrado
    const err = new Error("Credenciales inválidas.");
    err.status = 401;
    throw err;
  },

  /**
   * Obtiene la información del perfil del usuario autenticado sin exponer la contraseña.
   *
   * @param {string} id - ID del usuario/administrador.
   */
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
      rol,
    };
  },

  /**
   * Genera un token firmado temporal y envía el enlace de recuperación al correo.
   *
   * @param {string} correo - Correo registrado.
   */
  async solicitarRecuperacion(correo) {
    let cuenta = await Administrador.findOne({ correo });
    if (!cuenta) {
      cuenta = await Usuario.findOne({ correo });
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

  /**
   * Valida el token temporal y actualiza la contraseña del usuario/administrador.
   *
   * @param {string} id - ID de la cuenta.
   * @param {string} token - Token de recuperación.
   * @param {string} nuevaContrasena - Nueva contraseña en texto plano.
   */
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

