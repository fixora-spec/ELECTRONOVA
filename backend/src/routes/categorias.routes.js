import { Router } from "express";
import {
  getCategorias,
  getCategoriaById,
  createCategoria,
  updateCategoria,
  deleteCategoria
} from "../controllers/categorias.controller.js";

import { authMiddleware } from "../middlewares/auth.middleware.js";

const categoriasRoutes = Router();

categoriasRoutes.get("/", getCategorias);
categoriasRoutes.get("/:id", getCategoriaById);
categoriasRoutes.post("/", authMiddleware, createCategoria);
categoriasRoutes.put("/:id", authMiddleware, updateCategoria);
categoriasRoutes.delete("/:id", authMiddleware, deleteCategoria);

export { categoriasRoutes };
