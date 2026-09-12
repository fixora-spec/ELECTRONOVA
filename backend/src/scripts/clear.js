import dotenv from "dotenv";
import { connectDB } from "../config/db.js";
import { Administrador } from "../models/Administrador.js";
import { Categoria } from "../models/Categoria.js";
import { Empresa } from "../models/Empresa.js";
import { Producto } from "../models/Producto.js";
import { Imagen } from "../models/Imagen.js";

dotenv.config();

const clearDatabase = async () => {
  try {
    await connectDB();
    console.log("Eliminando todos los datos de prueba...");
    await Administrador.deleteMany({});
    await Categoria.deleteMany({});
    await Empresa.deleteMany({});
    await Producto.deleteMany({});
    await Imagen.deleteMany({});

    console.log("¡Base de datos limpiada con éxito!");
    process.exit(0);
  } catch (error) {
    console.error("Error al limpiar la base de datos:", error);
    process.exit(1);
  }
};

clearDatabase();
