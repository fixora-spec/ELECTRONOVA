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

categoriasRoutes.get("/", getCategorias);
categoriasRoutes.get("/:id", getCategoriaById);
categoriasRoutes.post("/", authMiddleware, adminMiddleware, createCategoria);
categoriasRoutes.put("/:id", authMiddleware, adminMiddleware, updateCategoria);
categoriasRoutes.delete("/:id", authMiddleware, adminMiddleware, deleteCategoria);

export { categoriasRoutes };
