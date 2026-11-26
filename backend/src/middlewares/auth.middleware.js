import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { Administrador } from "../models/Administrador.js";

const JWT_SECRET = process.env.JWT_SECRET || "super_secreto_desarrollo_2026";
const ROLES_ADMIN = ["ADMIN", "ADMINISTRATOR", "ADMINISTRADOR"];

// Verificación de autenticación JWT
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  let token = null;

  if (authHeader?.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
  } else if (req.cookies?.authToken) {
    token = req.cookies.authToken;
  } else if (req.cookies?.accessToken) {
    token = req.cookies.accessToken;
  } else if (req.headers?.["x-access-token"]) {
    token = req.headers["x-access-token"];
  }

  if (!token) {
    return res.status(401).json({ message: "No autorizado. Token no proporcionado o formato inválido." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || JWT_SECRET);
    req.admin = decoded;
    req.user = decoded;
    return next();
  } catch (error) {
    if (error.name === "TokenExpiredError" || error.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "No autorizado. Token inválido o expirado." });
    }
    return res.status(500).json({ message: "Error desconocido", error: error.message });
  }
};

// Verificación de rol de administrador
const adminMiddleware = (req, res, next) => {
  try {
    const rol = (req.user?.rol || req.admin?.rol || "").toUpperCase();
    if (!ROLES_ADMIN.includes(rol)) {
      return res.status(403).json({ message: "Acceso denegado. Se requieren permisos de administrador." });
    }
    return next();
  } catch (error) {
    return res.status(500).json({ message: "Error desconocido", error: error.message });
  }
};

// Resolución de ID de administrador
const resolverIdAdministrador = async (req) => {
  const id =
    req.admin?.id ||
    req.admin?._id ||
    req.user?.id ||
    req.user?._id ||
    (mongoose.Types.ObjectId.isValid(req.body?.idAdministrador) ? req.body.idAdministrador : null);

  if (id) return id;
  const primerAdmin = await Administrador.findOne().select("_id");
  return primerAdmin?._id;
};

export { authMiddleware, adminMiddleware, resolverIdAdministrador };
