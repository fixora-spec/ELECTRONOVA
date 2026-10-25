/**
 * @file usuarios.routes.js
 * @description Ruta REST para listar usuarios y administradores (acceso exclusivo para administradores).
 * @module routes/usuarios
 */

import { Router } from "express";
import { getUsuarios } from "../controllers/usuarios.controller.js";
import { authMiddleware, adminMiddleware } from "../middlewares/auth.middleware.js";

const usuariosRoutes = Router();

// Protegido: únicamente administradores autenticados
usuariosRoutes.get("/", authMiddleware, adminMiddleware, getUsuarios);

export { usuariosRoutes };

