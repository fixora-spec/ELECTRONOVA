import dotenv from "dotenv";
import { connectDB } from "../config/db.js";
import { Administrador } from "../models/Administrador.js";
import { Categoria } from "../models/Categoria.js";
import { Empresa } from "../models/Empresa.js";
import { Producto } from "../models/Producto.js";
import { Imagen } from "../models/Imagen.js";

dotenv.config();

const seedDatabase = async () => {
  try {
    await connectDB();
    console.log("Limpiando la base de datos...");
    await Administrador.deleteMany({});
    await Categoria.deleteMany({});
    await Empresa.deleteMany({});
    await Producto.deleteMany({});
    await Imagen.deleteMany({});

    console.log("Insertando datos de prueba...");

    // 1. Insertar Administrador
    const admin = new Administrador({
      nombre: "Admin Principal",
      correo: "admin@electronova.com",
      contraseña: "password123"
    });
    const savedAdmin = await admin.save();

    // 2. Insertar Empresa
    const empresa = new Empresa({
      nombre: "ELECTRONOVA S.A.C.",
      descripcion: "Catálogo virtual de productos eléctricos",
      direccion: "Av. Principal 123, Lima",
      horarioAtencion: "Lunes a Viernes de 9am a 6pm",
      contacto: "+51 987654321"
    });
    await empresa.save();

    // 3. Insertar Categoria
    const categoria = new Categoria({
      nombre: "Cables Eléctricos",
      descripcion: "Todo tipo de cables para instalaciones",
      idAdministrador: savedAdmin._id
    });
    const savedCategoria = await categoria.save();

    // 4. Insertar Producto
    const producto = new Producto({
      nombre: "Cable THW 12 AWG",
      productoDestacado: true,
      especificacionesTec: "Cable de cobre, 600V, resistente al calor y humedad.",
      idCategoria: savedCategoria._id,
      idAdministrador: savedAdmin._id,
      precio: 120.50,
      caracteristicas: "Rollo de 100 metros. Color Rojo.",
      descripcionCorta: "Cable ideal para instalaciones domésticas",
      descripcionCompleta: "El cable THW es un conductor de cobre suave o recocido..."
    });
    await producto.save();

    console.log("¡Base de datos inicializada con éxito!");
    process.exit(0);
  } catch (error) {
    console.error("Error al inicializar la base de datos:", error);
    process.exit(1);
  }
};

seedDatabase();
