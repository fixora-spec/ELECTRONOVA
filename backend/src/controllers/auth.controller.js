/**
 * @file auth.controller.js
 * @description Controlador de autenticación y gestión de sesiones para Administradores y Clientes.
 * Integra validación de esquemas con Zod y control de errores mediante try...catch.
 * @module controllers/auth
 */

import * as z from "zod";
import { authService } from "../services/auth.service.js";
import {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from "../schemas/auth.schema.js";

/**
 * Registro de un nuevo usuario/cliente en la plataforma.
 * @route POST /auth/register
 */
const register = async (req, res) => {
  try {
    const validatedData = registerSchema.parse({
      nombre: req.body.nombre,
      correo: req.body.correo,
      contraseña: req.body.contraseña || req.body.contrasena || req.body.password,
    });

    const resultado = await authService.registro({
      nombre: validatedData.nombre,
      correo: validatedData.correo.toLowerCase(),
      contraseña: validatedData.contraseña,
    });

    return res.status(201).json({
      message: "Registro exitoso. ¡Bienvenido a ELECTRONOVA!",
      ...resultado,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        message: error.issues[0]?.message || "Datos de registro inválidos.",
        issues: error.issues,
      });
    } else if (error.status) {
      return res.status(error.status).json({ message: error.message });
    } else if (error.name === "ValidationError") {
      return res.status(400).json({ message: error.message });
    } else {
      return res.status(500).json({
        message: "Error desconocido",
        error: error.message,
      });
    }
  }
};

/**
 * Inicio de sesión unificado. Detecta automáticamente si la cuenta es Administrador o Cliente.
 * @route POST /auth/login
 */
const login = async (req, res) => {
  try {
    const validatedData = loginSchema.parse({
      correo: req.body.correo,
      contraseña: req.body.contraseña || req.body.contrasena || req.body.password,
      recordarme: Boolean(req.body.recordarme),
    });

    const resultado = await authService.login(
      validatedData.correo.toLowerCase(),
      validatedData.contraseña,
      validatedData.recordarme
    );

    return res.status(200).json({
      message: "Inicio de sesión exitoso",
      ...resultado,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        message: error.issues[0]?.message || "Datos de acceso inválidos.",
        issues: error.issues,
      });
    } else if (error.status) {
      return res.status(error.status).json({ message: error.message });
    } else {
      return res.status(500).json({
        message: "Error desconocido",
        error: error.message,
      });
    }
  }
};

/**
 * Cierre de sesión. Notifica al cliente para que elimine el token en su almacenamiento local.
 * @route POST /auth/logout
 */
const logout = async (req, res) => {
  try {
    return res.status(200).json({
      message: "Cierre de sesión exitoso. Por favor, elimine el token en el cliente.",
    });
  } catch (error) {
    if (error.status) {
      return res.status(error.status).json({ message: error.message });
    } else {
      return res.status(500).json({
        message: "Error desconocido",
        error: error.message,
      });
    }
  }
};

/**
 * Obtiene el perfil de la cuenta autenticada según el token JWT suministrado.
 * @route GET /auth/me
 */
const getProfile = async (req, res) => {
  try {
    const user = await authService.obtenerPerfil(req.user?.id || req.admin?.id);
    return res.status(200).json({
      message: "Perfil obtenido exitosamente.",
      user,
      admin: user.rol === "admin" ? user : null,
    });
  } catch (error) {
    if (error.status) {
      return res.status(error.status).json({ message: error.message });
    } else if (error.name === "CastError") {
      return res.status(400).json({ message: "ID de usuario inválido." });
    } else {
      return res.status(500).json({
        message: "Error desconocido",
        error: error.message,
      });
    }
  }
};

/**
 * Solicita enlace temporal para recuperar contraseña por correo electrónico.
 * @route POST /auth/forgot-password
 */
const forgotPassword = async (req, res) => {
  try {
    const validatedData = forgotPasswordSchema.parse({
      correo: req.body.correo,
    });

    await authService.solicitarRecuperacion(validatedData.correo.toLowerCase());
    return res.status(200).json({
      message: "Se ha enviado un enlace de recuperación a su correo electrónico.",
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        message: error.issues[0]?.message || "Correo inválido.",
        issues: error.issues,
      });
    } else if (error.status) {
      return res.status(error.status).json({ message: error.message });
    } else {
      return res.status(500).json({
        message: "Error desconocido",
        error: error.message,
      });
    }
  }
};

/**
 * Restablece la contraseña utilizando el token firmado y enviado al correo.
 * @route POST /auth/reset-password
 */
const resetPassword = async (req, res) => {
  try {
    const validatedData = resetPasswordSchema.parse({
      id: req.body.id,
      token: req.body.token,
      nuevaContrasena: req.body.nuevaContrasena || req.body.nuevaContraseña || req.body.password,
    });

    await authService.restablecerContraseña(
      validatedData.id,
      validatedData.token,
      validatedData.nuevaContrasena
    );
    return res.status(200).json({ message: "Contraseña actualizada exitosamente." });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        message: error.issues[0]?.message || "Datos para restablecer contraseña inválidos.",
        issues: error.issues,
      });
    } else if (error.status) {
      return res.status(error.status).json({ message: error.message });
    } else if (error.name === "CastError") {
      return res.status(400).json({ message: "ID de usuario inválido." });
    } else {
      return res.status(500).json({
        message: "Error desconocido",
        error: error.message,
      });
    }
  }
};

export { register, login, logout, getProfile, forgotPassword, resetPassword };



