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

// Configuración inicial
dotenv.config();
const app = express();
app.disable("x-powered-by");

// Seguridad y CORS
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
  "http://192.168.1.5:5173",
].filter(Boolean);

const isLocalNetworkOrigin = (origin) =>
  /^https?:\/\/(localhost|127\.0\.0\.1|192\.168\.\d+\.\d+|10\.\d+\.\d+\.\d+|172\.(1[6-9]|2\d|3[0-1])\.\d+\.\d+)(:\d+)?$/.test(
    origin
  );

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin) || isLocalNetworkOrigin(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Bloqueado por política CORS"));
    },
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// Middlewares globales
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
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

// Rutas
app.get("/", (req, res) => {
  res.status(200).json({ message: "API ELECTRONOVA operativa" });
});

app.use(["/auth", "/api/auth"], authRoutes);
app.use(["/refresh", "/api/refresh"], (req, res, next) => {
  req.url = "/refresh";
  authRoutes(req, res, next);
});
app.use(["/productos", "/api/productos"], productosRoutes);
app.use(["/categorias", "/api/categorias"], categoriasRoutes);
app.use(["/empresa", "/api/empresa"], empresaRoutes);
app.use(["/usuarios", "/api/usuarios"], usuariosRoutes);

// Manejo de errores
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
