import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { authRoutes } from "./routes/auth.routes.js";
import { productosRoutes } from "./routes/productos.routes.js";
import { categoriasRoutes } from "./routes/categorias.routes.js";
import { empresaRoutes } from "./routes/empresa.routes.js";
import { usuariosRoutes } from "./routes/usuarios.routes.js";
import { connectDB } from "./config/db.js";

dotenv.config();

const app = express();

// conectar base de datos
connectDB();


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const allowedOrigin = process.env.ALLOWED_ORIGIN || `http://localhost:${process.env.PORT || 5173}`;
app.use(
  cors({
    origin: allowedOrigin,
  }),
);

app.get("/", (req, res) => {
  res.json({ mensaje: "Conexión exitosa al backend de Electronova" });
});

// rutas
app.use("/auth", authRoutes);
app.use("/productos", productosRoutes);
app.use("/categorias", categoriasRoutes);
app.use("/empresa", empresaRoutes);
app.use("/usuarios", usuariosRoutes);

const PORT = Number(process.env.PORT) || 3000;

app.listen(PORT, () => {
  console.log(`Servidor en: http://localhost:${PORT}/`);
});