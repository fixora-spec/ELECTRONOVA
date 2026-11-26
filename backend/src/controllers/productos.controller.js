import mongoose from "mongoose";
import * as z from "zod";
import { productosService } from "../services/productos.service.js";
import { productoSchema } from "../schemas/productos.schema.js";
import { resolverIdAdministrador } from "../middlewares/auth.middleware.js";

// Listado y consulta de productos
const getProductos = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 12;
    const soloActivos = req.query.soloActivos === "true" || req.query.estado === "true";
    const { q, categoria } = req.query;

    if (q || categoria) {
      const response = await productosService.buscar(q || "", page, limit, { categoria, soloActivos });
      return res.status(200).json({
        message: "Productos Obtenidos",
        data: response.productos,
        pagination: response.pagination,
      });
    }

    const response = await productosService.getProductos(page, limit, soloActivos);
    return res.status(200).json({
      message: "Productos Obtenidos",
      data: response.productos,
      pagination: response.pagination,
    });
  } catch (error) {
    return res.status(error.status || 500).json({ message: error.message || "Error desconocido" });
  }
};

const getProductoById = async (req, res) => {
  try {
    const producto = await productosService.getProductoById(req.params.id);
    return res.status(200).json({
      message: "Producto encontrado",
      data: producto,
    });
  } catch (error) {
    const status =
      error.message === "Producto no encontrado" ? 404 : error.name === "CastError" ? 400 : error.status || 500;
    return res.status(status).json({ message: error.message || "Error desconocido" });
  }
};

// Creación, actualización y eliminación
const createProducto = async (req, res) => {
  try {
    const validatedBody = productoSchema.parse(req.body);
    const idAdministrador = await resolverIdAdministrador(req);

    const nuevoProducto = await productosService.crearProducto(
      { ...req.body, ...validatedBody, idAdministrador },
      req.files
    );
    return res.status(201).json({
      message: "Producto creado con éxito",
      data: nuevoProducto,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        message: error.issues[0]?.message || "Datos del producto inválidos.",
        issues: error.issues,
      });
    }
    return res.status(error.status || 400).json({ message: error.message || "Error desconocido" });
  }
};

const updateProducto = async (req, res) => {
  try {
    const { id } = req.params;
    const bodyLimpio = { ...req.body };
    if (bodyLimpio.idAdministrador && !mongoose.Types.ObjectId.isValid(bodyLimpio.idAdministrador)) {
      delete bodyLimpio.idAdministrador;
    }
    const validatedBody = productoSchema.partial().parse(bodyLimpio);

    const productoActualizado = await productosService.actualizarProducto(
      id,
      { ...bodyLimpio, ...validatedBody },
      req.files,
      req.body.imagenesExistentes
    );

    return res.status(200).json({
      message: "Producto actualizado con éxito",
      data: productoActualizado,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        message: error.issues[0]?.message || "Datos del producto inválidos.",
        issues: error.issues,
      });
    }
    const status = error.message === "Producto no encontrado" ? 404 : error.status || 400;
    return res.status(status).json({ message: error.message || "Error desconocido" });
  }
};

const deleteProducto = async (req, res) => {
  try {
    await productosService.eliminarProducto(req.params.id);
    return res.status(200).json({ message: "Producto eliminado con éxito" });
  } catch (error) {
    const status = error.message === "Producto no encontrado" ? 404 : error.status || 500;
    return res.status(status).json({ message: error.message || "Error desconocido" });
  }
};

// Búsqueda y filtrado
const searchProductos = async (req, res) => {
  try {
    const { q, categoria } = req.query;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 12;
    const soloActivos = req.query.soloActivos === "true" || req.query.estado === "true";

    const response = await productosService.buscar(q, page, limit, { categoria, soloActivos });
    return res.status(200).json({
      message: "Búsqueda completada",
      data: response.productos,
      pagination: response.pagination,
    });
  } catch (error) {
    return res.status(error.status || 500).json({ message: error.message || "Error desconocido" });
  }
};

const filterProductos = async (req, res) => {
  try {
    const { categoria, q } = req.query;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 12;
    const soloActivos = req.query.soloActivos === "true" || req.query.estado === "true";

    const response = await productosService.filtrarPorCategoria(categoria, page, limit, { soloActivos, q });
    return res.status(200).json({
      message: "Filtro aplicado",
      data: response.productos,
      pagination: response.pagination,
    });
  } catch (error) {
    return res.status(error.status || 500).json({ message: error.message || "Error desconocido" });
  }
};

export {
  getProductos,
  getProductoById,
  createProducto,
  updateProducto,
  deleteProducto,
  searchProductos,
  filterProductos,
};
