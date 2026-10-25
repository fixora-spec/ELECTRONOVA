/**
 * @file auth.routes.js
 * @description Definición de rutas REST para autenticación y control de accesos en ELECTRONOVA.
 * @module routes/auth
 */

import { Router } from "express";
import {
  register,
  login,
  logout,
  getProfile,
  forgotPassword,
  resetPassword,
} from "../controllers/auth.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { authLimiter } from "../middlewares/rateLimiter.middleware.js";

const authRoutes = Router();

// ==========================================
// Rutas de Autenticación Pública (con Rate Limit)
// ==========================================
authRoutes.post("/register", authLimiter, register);
authRoutes.post("/login", authLimiter, login);
authRoutes.post("/logout", logout);
authRoutes.post("/forgot-password", authLimiter, forgotPassword);
authRoutes.post("/reset-password", authLimiter, resetPassword);

// ==========================================
// Rutas Protegidas de Sesión
// ==========================================
authRoutes.get("/me", authMiddleware, getProfile);

export { authRoutes };


