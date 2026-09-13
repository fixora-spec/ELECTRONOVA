import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const dbURI = process.env.MONGODB_URI || "mongodb://localhost:27017/electronova";

export const connectDB = async () => {
  try {
    await mongoose.connect(dbURI);
    console.log("Conectado exitosamente a MongoDB compass");
  } catch (error) {
    console.error("Error al conectar a MongoDB:", error);
    process.exit(1);
  }
};
