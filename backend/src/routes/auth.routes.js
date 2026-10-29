import { Router } from "express";
import {
  authController,
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

authRoutes.post("/register", authLimiter, (req, res) => authController.register(req, res));
authRoutes.post("/login", authLimiter, (req, res) => authController.login(req, res));
authRoutes.post("/logout", (req, res) => authController.logout(req, res));
authRoutes.post("/forgot-password", authLimiter, (req, res) => authController.forgotPassword(req, res));
authRoutes.post("/reset-password", authLimiter, (req, res) => authController.resetPassword(req, res));
authRoutes.get("/me", authMiddleware, (req, res) => authController.getProfile(req, res));

export { authRoutes };
