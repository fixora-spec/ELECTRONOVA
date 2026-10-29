import express from "express";
import cors from "cors";
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

import { apiLimiter } from "./middlewares/rateLimiter.middleware.js";
import { authRoutes } from "./routes/auth.routes.js";
import { productosRoutes } from "./routes/productos.routes.js";
import { categoriasRoutes } from "./routes/categorias.routes.js";
import { empresaRoutes } from "./routes/empresa.routes.js";
import { usuariosRoutes } from "./routes/usuarios.routes.js";

dotenv.config();

const app = express();

app.disable("x-powered-by");

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    contentSecurityPolicy: false,
  })
);

const allowedOrigins = [
  process.env.ALLOWED_ORIGIN,
  process.env.FRONTEND_URL,
  "http://localhost:5173",
  "http://127.0.0.1:5173",
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Bloqueado por política CORS"));
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));
app.use(cookieParser());

app.use((req, res, next) => {
  try {
    if (req.body && typeof req.body === "object") mongoSanitize.sanitize(req.body);
    if (req.params && typeof req.params === "object") mongoSanitize.sanitize(req.params);
    if (req.query && typeof req.query === "object") mongoSanitize.sanitize(req.query);
    next();
  } catch (error) {
    next(error);
  }
});

app.use(apiLimiter);

app.get("/", (req, res) => {
  res.status(200).json({ message: "API ELECTRONOVA operativa" });
});

app.use("/auth", authRoutes);
app.use("/productos", productosRoutes);
app.use("/categorias", categoriasRoutes);
app.use("/empresa", empresaRoutes);
app.use("/usuarios", usuariosRoutes);

app.use((req, res) => {
  res.status(404).json({
    error: "Not Found",
    message: `La ruta '${req.originalUrl}' no existe.`,
  });
});

app.use((err, req, res, next) => {
  console.error("[Error]:", err.message || err);
  if (err.status) {
    return res.status(err.status).json({ message: err.message });
  }
  if (err.name === "MulterError") {
    return res.status(400).json({ message: err.message });
  }
  return res.status(500).json({
    message: "Error desconocido",
    error: err.message || "Error desconocido",
  });
});

export { app };
export default app;
