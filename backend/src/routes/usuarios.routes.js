import { Router } from "express";
import { getUsuarios } from "../controllers/usuarios.controller.js";
import { authMiddleware, adminMiddleware } from "../middlewares/auth.middleware.js";

const usuariosRoutes = Router();

usuariosRoutes.get("/", authMiddleware, adminMiddleware, getUsuarios);

export { usuariosRoutes };
