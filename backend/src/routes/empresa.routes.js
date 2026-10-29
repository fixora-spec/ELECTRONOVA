import { Router } from "express";
import { getEmpresa } from "../controllers/empresa.controller.js";

const empresaRoutes = Router();

empresaRoutes.get("/", getEmpresa);

export { empresaRoutes };
