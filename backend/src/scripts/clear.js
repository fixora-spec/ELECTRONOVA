import dotenv from "dotenv";
import { connectDB } from "../config/db.js";
import { Administrador } from "../models/Administrador.js";
import { Usuario } from "../models/Usuario.js";
import { Sesion } from "../models/Sesion.js";
import { Categoria } from "../models/Categoria.js";
import { Empresa } from "../models/Empresa.js";
import { Producto } from "../models/Producto.js";
import { Imagen } from "../models/Imagen.js";

dotenv.config();

// Limpieza de base de datos
const clearDatabase = async () => {
  try {
    await connectDB();
    console.log("Eliminando todos los datos de prueba...");
    await Promise.all([
      Administrador.deleteMany({}),
      Usuario.deleteMany({}),
      Sesion.deleteMany({}),
      Categoria.deleteMany({}),
      Empresa.deleteMany({}),
      Producto.deleteMany({}),
      Imagen.deleteMany({}),
    ]);

    console.log("¡Base de datos limpiada con éxito!");
    process.exit(0);
  } catch (error) {
    console.error("Error al limpiar la base de datos:", error);
    process.exit(1);
  }
};

clearDatabase();
