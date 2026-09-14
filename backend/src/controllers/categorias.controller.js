import { Categoria } from "../models/Categoria.js";

export const getCategorias = async (req, res) => {
  try {
    const categorias = await Categoria.find();
    res.status(200).json(categorias);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getCategoriaById = async (req, res) => {
  try {
    const categoria = await Categoria.findById(req.params.id);
    if (!categoria) return res.status(404).json({ message: "Categoría no encontrada" });
    res.status(200).json(categoria);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createCategoria = async (req, res) => {
  try {
    const nuevaCategoria = new Categoria(req.body);
    const categoriaGuardada = await nuevaCategoria.save();
    res.status(201).json(categoriaGuardada);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateCategoria = async (req, res) => {
  try {
    const categoriaActualizada = await Categoria.findByIdAndUpdate(req.params.id, req.body, { returnDocument: 'after' });
    if (!categoriaActualizada) return res.status(404).json({ message: "Categoría no encontrada" });
    res.status(200).json(categoriaActualizada);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteCategoria = async (req, res) => {
  try {
    const categoriaEliminada = await Categoria.findByIdAndDelete(req.params.id);
    if (!categoriaEliminada) return res.status(404).json({ message: "Categoría no encontrada" });
    res.status(200).json({ message: "Categoría eliminada" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
