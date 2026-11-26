import mongoose from "mongoose";
import dotenv from "dotenv";

// Configuración
dotenv.config();
const dbURI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/electronova";

// Conexión a MongoDB
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(dbURI);
    console.log(`[MongoDB] Conexión establecida con éxito en: ${conn.connection.host}/${conn.connection.name}`);
  } catch (error) {
    console.error("[MongoDB] Error de conexión:", error.message);
    process.exit(1);
  }
};

export { connectDB };
