import { Router } from "express";
import { getEmpresa } from "../controllers/empresa.controller.js";

// Rutas de empresa
const empresaRoutes = Router();

empresaRoutes.get("/", getEmpresa);

export { empresaRoutes };
