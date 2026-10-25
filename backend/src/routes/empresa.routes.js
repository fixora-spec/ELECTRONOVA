/**
 * @file empresa.routes.js
 * @description Ruta REST para obtener información institucional de la empresa.
 * @module routes/empresa
 */

import { Router } from "express";
import { getEmpresa } from "../controllers/empresa.controller.js";

const empresaRoutes = Router();

empresaRoutes.get("/", getEmpresa);

export { empresaRoutes };

