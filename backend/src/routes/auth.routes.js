import { Router } from "express";
import {
  register,
  login,
  refresh,
  logout,
  getProfile,
  forgotPassword,
  resetPassword,
} from "../controllers/auth.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { authLimiter } from "../middlewares/rateLimiter.middleware.js";

// Rutas de autenticación
const authRoutes = Router();

authRoutes.post("/register", authLimiter, register);
authRoutes.post("/login", authLimiter, login);
authRoutes.post("/refresh", refresh);
authRoutes.get("/refresh", refresh);
authRoutes.post("/logout", logout);
authRoutes.delete("/logout", logout);
authRoutes.post("/forgot-password", authLimiter, forgotPassword);
authRoutes.post("/reset-password", authLimiter, resetPassword);
authRoutes.get("/me", authMiddleware, getProfile);

export { authRoutes };
