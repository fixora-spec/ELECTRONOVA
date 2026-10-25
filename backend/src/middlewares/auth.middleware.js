/**
 * @file auth.middleware.js
 * @description Middlewares de autenticación y autorización mediante JSON Web Tokens (JWT).
 * @module middlewares/auth
 */

import jwt from "jsonwebtoken";

/**
 * Middleware para validar el token JWT en las cabeceras de autorización.
 * Extrae el payload decodificado y lo asigna a req.user y req.admin.
 *
 * @param {import('express').Request} req - Objeto de solicitud Express.
 * @param {import('express').Response} res - Objeto de respuesta Express.
 * @param {import('express').NextFunction} next - Función para continuar la ejecución.
 */
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      message: "No autorizado. Token no proporcionado o formato inválido.",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "super_secreto_desarrollo_2026"
    );

    req.admin = decoded;
    req.user = decoded;
    return next();
  } catch (error) {
    if (error.name === "TokenExpiredError" || error.name === "JsonWebTokenError") {
      return res.status(401).json({
        message: "No autorizado. Token inválido o expirado.",
      });
    } else {
      return res.status(500).json({
        message: "Error desconocido",
        error: error.message,
      });
    }
  }
};

/**
 * Middleware para restringir acceso exclusivamente a usuarios con rol 'admin'.
 * Requiere haberse ejecutado previamente authMiddleware.
 *
 * @param {import('express').Request} req - Objeto de solicitud Express.
 * @param {import('express').Response} res - Objeto de respuesta Express.
 * @param {import('express').NextFunction} next - Función para continuar la ejecución.
 */
const adminMiddleware = (req, res, next) => {
  try {
    const rol = req.user?.rol || req.admin?.rol;

    if (rol !== "admin") {
      return res.status(403).json({
        message: "Acceso denegado. Se requieren permisos de administrador para realizar esta acción.",
      });
    }

    return next();
  } catch (error) {
    return res.status(500).json({
      message: "Error desconocido",
      error: error.message,
    });
  }
};

export { authMiddleware, adminMiddleware };


