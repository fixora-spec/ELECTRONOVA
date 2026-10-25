/**
 * @file categorias.routes.js
 * @description Definición de rutas REST para la gestión de categorías en ELECTRONOVA.
 * @module routes/categorias
 */

import { Router } from "express";
import {
  getCategorias,
  getCategoriaById,
  createCategoria,
  updateCategoria,
  deleteCategoria,
} from "../controllers/categorias.controller.js";
import { authMiddleware, adminMiddleware } from "../middlewares/auth.middleware.js";

const categoriasRoutes = Router();

// ==========================================
// Rutas Públicas (Invitados y Clientes)
// ==========================================
categoriasRoutes.get("/", getCategorias);
categoriasRoutes.get("/:id", getCategoriaById);

// ==========================================
// Rutas Privadas (Exclusivas Administrador)
// ==========================================
categoriasRoutes.post("/", authMiddleware, adminMiddleware, createCategoria);
categoriasRoutes.put("/:id", authMiddleware, adminMiddleware, updateCategoria);
categoriasRoutes.delete("/:id", authMiddleware, adminMiddleware, deleteCategoria);

export { categoriasRoutes };

