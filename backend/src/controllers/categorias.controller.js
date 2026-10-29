import mongoose from "mongoose";
import * as z from "zod";
import { categoriasService } from "../services/categorias.service.js";
import { categoriaSchema } from "../schemas/categorias.schema.js";

const getCategorias = async (req, res) => {
  try {
    const categorias = await categoriasService.listarTodas();
    return res.status(200).json(categorias);
  } catch (error) {
    return res.status(error.status || 500).json({ message: error.message || "Error desconocido" });
  }
};

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
    return res.status(error.status || 500).json({ message: error.message || "Error desconocido" });
  }
};

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
    }
    return res.status(error.status || 500).json({ message: error.message || "Error desconocido" });
  }
};

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
    }
    return res.status(error.status || 500).json({ message: error.message || "Error desconocido" });
  }
};

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
    return res.status(error.status || 500).json({ message: error.message || "Error desconocido" });
  }
};

export {
  getCategorias,
  getCategoriaById,
  createCategoria,
  updateCategoria,
  deleteCategoria,
};
