/**
 * @file categorias.controller.js
 * @description Controlador para la administración del catálogo de categorías en ELECTRONOVA.
 * Incluye validaciones con Zod y control de errores mediante try...catch.
 * @module controllers/categorias
 */

import mongoose from "mongoose";
import * as z from "zod";
import { categoriasService } from "../services/categorias.service.js";
import { categoriaSchema } from "../schemas/categorias.schema.js";

/**
 * Obtiene el listado completo de categorías ordenadas alfabéticamente.
 * @route GET /categorias
 */
const getCategorias = async (req, res) => {
  try {
    const categorias = await categoriasService.listarTodas();
    return res.status(200).json(categorias);
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
};

/**
 * Obtiene el detalle de una categoría por su ID de MongoDB.
 * @route GET /categorias/:id
 */
const getCategoriaById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "ID de categoría inválido" });
    }

    const categoria = await categoriasService.obtenerPorId(id);
    if (!categoria) {
      return res.status(404).json({ message: "Categoría no encontrada" });
    }

    return res.status(200).json(categoria);
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
};

/**
 * Registra una nueva categoría en el sistema (requiere rol de administrador).
 * @route POST /categorias
 */
const createCategoria = async (req, res) => {
  try {
    const validatedData = categoriaSchema.parse(req.body);
    const categoriaGuardada = await categoriasService.crear({
      ...validatedData,
      idAdministrador: req.admin?.id || req.body.idAdministrador,
    });
    return res.status(201).json(categoriaGuardada);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        message: error.issues[0]?.message || "Datos de categoría inválidos.",
        issues: error.issues,
      });
    } else if (error.name === "ValidationError") {
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
};

/**
 * Actualiza los datos de una categoría existente.
 * @route PUT /categorias/:id
 */
const updateCategoria = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "ID de categoría inválido" });
    }

    const validatedData = categoriaSchema.partial().parse(req.body);

    const categoriaActualizada = await categoriasService.actualizar(id, validatedData);
    if (!categoriaActualizada) {
      return res.status(404).json({ message: "Categoría no encontrada" });
    }

    return res.status(200).json(categoriaActualizada);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        message: error.issues[0]?.message || "Datos de categoría inválidos.",
        issues: error.issues,
      });
    } else if (error.name === "CastError") {
      return res.status(400).json({ message: "ID de categoría inválido" });
    } else if (error.name === "ValidationError") {
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
};

/**
 * Elimina una categoría si no tiene productos asociados.
 * @route DELETE /categorias/:id
 */
const deleteCategoria = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "ID de categoría inválido" });
    }

    const categoriaEliminada = await categoriasService.eliminar(id);
    if (!categoriaEliminada) {
      return res.status(404).json({ message: "Categoría no encontrada" });
    }

    return res.status(200).json({ message: "Categoría eliminada exitosamente" });
  } catch (error) {
    if (error.status) {
      return res.status(error.status).json({ message: error.message });
    } else if (error.name === "CastError") {
      return res.status(400).json({ message: "ID de categoría inválido" });
    } else {
      return res.status(500).json({
        message: "Error desconocido",
        error: error.message,
      });
    }
  }
};

export {
  getCategorias,
  getCategoriaById,
  createCategoria,
  updateCategoria,
  deleteCategoria,
};


