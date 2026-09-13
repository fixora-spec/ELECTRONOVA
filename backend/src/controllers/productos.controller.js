import { Producto } from "../models/Producto.js";

export const getProductos = async (req, res) => {
  try {
    const productos = await Producto.find().populate("idCategoria");
    res.status(200).json(productos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getProductoById = async (req, res) => {
  try {
    const producto = await Producto.findById(req.params.id).populate("idCategoria");
    if (!producto) return res.status(404).json({ message: "Producto no encontrado" });
    res.status(200).json(producto);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createProducto = async (req, res) => {
  try {
    const nuevoProducto = new Producto(req.body);
    const productoGuardado = await nuevoProducto.save();
    res.status(201).json(productoGuardado);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateProducto = async (req, res) => {
  try {
    const productoActualizado = await Producto.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!productoActualizado) return res.status(404).json({ message: "Producto no encontrado" });
    res.status(200).json(productoActualizado);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteProducto = async (req, res) => {
  try {
    const productoEliminado = await Producto.findByIdAndDelete(req.params.id);
    if (!productoEliminado) return res.status(404).json({ message: "Producto no encontrado" });
    res.status(200).json({ message: "Producto eliminado" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const searchProductos = async (req, res) => {
  try {
    // Implementación básica de búsqueda para la plantilla
    res.status(200).json({ message: "Buscando productos" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const filterProductos = async (req, res) => {
  try {
    // Implementación básica de filtrado para la plantilla
    res.status(200).json({ message: "Filtrando productos" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
