import * as z from "zod";
import { productosService } from "../services/productos.service.js";
import { productoSchema } from "../schemas/productos.schema.js";

const productosController = {
  getProductos: async (req, res) => {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 12;
      const soloActivos = req.query.soloActivos === "true" || req.query.estado === "true";

      const response = await productosService.getProductos(page, limit, soloActivos);
      return res.status(200).json({
        message: "Productos Obtenidos",
        data: response.productos,
        pagination: response.pagination,
      });
    } catch (error) {
      return res.status(error.status || 500).json({ message: error.message || "Error desconocido" });
    }
  },

  getProductoById: async (req, res) => {
    try {
      const { id } = req.params;
      const producto = await productosService.getProductoById(id);
      return res.status(200).json({
        message: "Producto encontrado",
        data: producto,
      });
    } catch (error) {
      const status = error.message === "Producto no encontrado" ? 404 : (error.name === "CastError" ? 400 : (error.status || 500));
      return res.status(status).json({ message: error.message || "Error desconocido" });
    }
  },

  createProducto: async (req, res) => {
    try {
      const validatedBody = productoSchema.parse(req.body);
      const datosProducto = {
        ...req.body,
        ...validatedBody,
        idAdministrador: req.admin?.id || req.body.idAdministrador,
      };

      const nuevoProducto = await productosService.crearProducto(datosProducto, req.files);
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
  },

  updateProducto: async (req, res) => {
    try {
      const { id } = req.params;
      const validatedBody = productoSchema.partial().parse(req.body);
      const datosProducto = {
        ...req.body,
        ...validatedBody,
      };

      const productoActualizado = await productosService.actualizarProducto(
        id,
        datosProducto,
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
      const status = error.message === "Producto no encontrado" ? 404 : (error.status || 400);
      return res.status(status).json({ message: error.message || "Error desconocido" });
    }
  },

  deleteProducto: async (req, res) => {
    try {
      const { id } = req.params;
      await productosService.eliminarProducto(id);
      return res.status(200).json({ message: "Producto eliminado con éxito" });
    } catch (error) {
      const status = error.message === "Producto no encontrado" ? 404 : (error.status || 500);
      return res.status(status).json({ message: error.message || "Error desconocido" });
    }
  },

  searchProductos: async (req, res) => {
    try {
      const { q } = req.query;
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 12;

      const response = await productosService.buscar(q, page, limit);
      return res.status(200).json({
        message: "Búsqueda completada",
        data: response.productos,
        pagination: response.pagination,
      });
    } catch (error) {
      return res.status(error.status || 500).json({ message: error.message || "Error desconocido" });
    }
  },

  filterProductos: async (req, res) => {
    try {
      const { categoria } = req.query;
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 12;

      const response = await productosService.filtrarPorCategoria(categoria, page, limit);
      return res.status(200).json({
        message: "Filtro aplicado",
        data: response.productos,
        pagination: response.pagination,
      });
    } catch (error) {
      return res.status(error.status || 500).json({ message: error.message || "Error desconocido" });
    }
  },
};

const getProductos = productosController.getProductos;
const getProductoById = productosController.getProductoById;
const createProducto = productosController.createProducto;
const updateProducto = productosController.updateProducto;
const deleteProducto = productosController.deleteProducto;
const searchProductos = productosController.searchProductos;
const filterProductos = productosController.filterProductos;

export {
  productosController,
  getProductos,
  getProductoById,
  createProducto,
  updateProducto,
  deleteProducto,
  searchProductos,
  filterProductos,
};
