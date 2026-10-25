/**
 * @file productos.controller.js
 * @description Controlador para la gestión de productos del catálogo ELECTRONOVA.
 * Incluye validaciones con Zod y manejo estructurado de errores con try...catch.
 * @module controllers/productos
 */

import * as z from "zod";
import { productosService } from "../services/productos.service.js";
import { productoSchema } from "../schemas/productos.schema.js";

const productosController = {
  /**
   * Obtiene la lista paginada de productos, con opción de filtrar solo activos.
   * @route GET /productos
   */
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
      if (error.status) {
        return res.status(error.status).json({ message: error.message });
      } else {
        return res.status(500).json({
          message: "Error desconocido",
          error: error.message,
        });
      }
    }
  },

  /**
   * Obtiene el detalle de un producto por su identificador único.
   * @route GET /productos/:id
   */
  getProductoById: async (req, res) => {
    try {
      const { id } = req.params;
      const producto = await productosService.getProductoById(id);

      return res.status(200).json({
        message: "Producto encontrado",
        data: producto,
      });
    } catch (error) {
      if (error.message === "Producto no encontrado") {
        return res.status(404).json({ message: error.message });
      } else if (error.name === "CastError") {
        return res.status(400).json({ message: "ID de producto inválido" });
      } else if (error.status) {
        return res.status(error.status).json({ message: error.message });
      } else {
        return res.status(500).json({
          message: "Error desconocido",
          error: error.message,
        });
      }
    }
  },

  /**
   * Crea un nuevo producto validando los campos con Zod y procesando imágenes.
   * @route POST /productos
   */
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
      } else if (error.name === "ValidationError") {
        return res.status(400).json({ message: error.message });
      } else if (error.message === "No se pueden subir más de 5 imágenes por producto.") {
        return res.status(400).json({ message: error.message });
      } else if (error.status) {
        return res.status(error.status).json({ message: error.message });
      } else {
        return res.status(500).json({
          message: "Error desconocido",
          error: error.message,
        });
      }
    }
  },

  /**
   * Actualiza los datos o imágenes de un producto existente.
   * @route PUT /productos/:id
   */
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
      } else if (error.message === "Producto no encontrado") {
        return res.status(404).json({ message: error.message });
      } else if (error.name === "CastError") {
        return res.status(400).json({ message: "ID de producto inválido" });
      } else if (error.name === "ValidationError") {
        return res.status(400).json({ message: error.message });
      } else if (error.message?.includes("más de 5 imágenes")) {
        return res.status(400).json({ message: error.message });
      } else if (error.status) {
        return res.status(error.status).json({ message: error.message });
      } else {
        return res.status(500).json({
          message: "Error desconocido",
          error: error.message,
        });
      }
    }
  },

  /**
   * Elimina un producto y sus imágenes asociadas.
   * @route DELETE /productos/:id
   */
  deleteProducto: async (req, res) => {
    try {
      const { id } = req.params;
      await productosService.eliminarProducto(id);

      return res.status(200).json({
        message: "Producto eliminado con éxito",
      });
    } catch (error) {
      if (error.message === "Producto no encontrado") {
        return res.status(404).json({ message: error.message });
      } else if (error.name === "CastError") {
        return res.status(400).json({ message: "ID de producto inválido" });
      } else if (error.status) {
        return res.status(error.status).json({ message: error.message });
      } else {
        return res.status(500).json({
          message: "Error desconocido",
          error: error.message,
        });
      }
    }
  },

  /**
   * Realiza búsquedas de productos por coincidencia de texto.
   * @route GET /productos/buscar
   */
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
      if (error.name === "CastError") {
        return res.status(400).json({ message: "Parámetro de búsqueda inválido" });
      } else if (error.status) {
        return res.status(error.status).json({ message: error.message });
      } else {
        return res.status(500).json({
          message: "Error desconocido",
          error: error.message,
        });
      }
    }
  },

  /**
   * Filtra productos pertenecientes a una categoría específica.
   * @route GET /productos/filtrar
   */
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
      if (error.name === "CastError") {
        return res.status(400).json({ message: "ID de categoría inválido" });
      } else if (error.status) {
        return res.status(error.status).json({ message: error.message });
      } else {
        return res.status(500).json({
          message: "Error desconocido",
          error: error.message,
        });
      }
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

