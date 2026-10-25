import { configDotenv as confDotenv } from "dotenv";
import { app } from "./app.js";
import { connectDB } from "./config/db.js";

confDotenv();

const PORT = Number(process.env.PORT) || 3000;

// Conexión a Base de Datos
await connectDB();

// Inicio del servidor
const server = app.listen(PORT, () => {
  console.log(`[Servidor] ELECTRONOVA escuchando en: http://localhost:${PORT}/`);
});

// Cierre controlado
const handleShutdown = (signal) => {
  console.log(`\n[Servidor] Señal ${signal} recibida. Cerrando...`);
  server.close(() => process.exit(0));
};

process.on("SIGINT", () => handleShutdown("SIGINT"));
process.on("SIGTERM", () => handleShutdown("SIGTERM"));