import { Router } from "express";
import { login, logout, forgotPassword, resetPassword } from "../controllers/auth.controller.js";

const authRoutes = Router();

authRoutes.post("/login", login);
authRoutes.post("/logout", logout);
authRoutes.post("/forgot-password", forgotPassword);
authRoutes.post("/reset-password", resetPassword);

export { authRoutes };
