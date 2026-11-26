import { app } from "./app.js";
import { connectDB } from "./config/db.js";

// Configuración
const PORT = Number(process.env.PORT) || 3000;

// Conexión a base de datos
await connectDB();

// Inicio del servidor
const server = app.listen(PORT, "0.0.0.0", () => {
  console.log(`[Servidor] ELECTRONOVA escuchando en: http://localhost:${PORT}/ y en red local: http://192.168.1.5:${PORT}/`);
});

// Cierre controlado
const handleShutdown = (signal) => {
  console.log(`\n[Servidor] Señal ${signal} recibida. Cerrando...`);
  server.close(() => process.exit(0));
};

process.on("SIGINT", () => handleShutdown("SIGINT"));
process.on("SIGTERM", () => handleShutdown("SIGTERM"));
