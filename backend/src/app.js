import express from "express";
import cors from "cors";
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";
import dotenv from "dotenv";

import { apiLimiter } from "./middlewares/rateLimiter.middleware.js";
import { authRoutes } from "./routes/auth.routes.js";
import { productosRoutes } from "./routes/productos.routes.js";
import { categoriasRoutes } from "./routes/categorias.routes.js";
import { empresaRoutes } from "./routes/empresa.routes.js";
import { usuariosRoutes } from "./routes/usuarios.routes.js";

dotenv.config();

const app = express();

// Ocultar cabecera que delata tecnología Express
app.disable("x-powered-by");

// 1. Cabeceras HTTP de seguridad avanzada (CSP, HSTS, Clickjacking, MIME-Sniffing)
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }, // Permite servir imágenes y recursos al frontend
    contentSecurityPolicy: false,                          // Para APIs REST puras
  })
);

// 2. Control de Acceso CORS Estricto
const allowedOrigins = [
  process.env.ALLOWED_ORIGIN,
  process.env.FRONTEND_URL,
  "http://localhost:5173",
  "http://127.0.0.1:5173",
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Permitir peticiones sin origen (por ejemplo Postman, Bruno, apps móviles o del mismo servidor)
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Bloqueado por política CORS: origen no autorizado"));
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// 3. Limitación de tamaño de payload contra ataques de saturación de memoria (DoS)
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));

// 4. Sanitización contra NoSQL Injection (Compatible con Express 5 donde req.query es solo getter)
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

// 5. Limitador global de peticiones (Rate Limiting)
app.use(apiLimiter);

// Rutas
app.get("/", (req, res) => {
  res.status(200).json({
    message: "API ELECTRONOVA operativa y asegurada",
  });
});

app.use("/auth", authRoutes);
app.use("/productos", productosRoutes);
app.use("/categorias", categoriasRoutes);
app.use("/empresa", empresaRoutes);
app.use("/usuarios", usuariosRoutes);

// Manejo de ruta no encontrada (404)
app.use((req, res) => {
  res.status(404).json({
    error: "Not Found",
    message: `La ruta '${req.originalUrl}' no existe.`,
  });
});

// Manejo global de errores (500)
app.use((err, req, res, next) => {
  console.error("[Error]:", err.message || err);
  if (err.status) {
    return res.status(err.status).json({
      message: err.message,
    });
  } else if (err.name === "MulterError") {
    return res.status(400).json({
      message: err.message,
    });
  } else {
    return res.status(500).json({
      message: "Error desconocido",
      error: err.message || "Error desconocido",
    });
  }
});

export { app };
export default app;
