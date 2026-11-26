import { Categoria } from "../models/Categoria.js";
import { Producto } from "../models/Producto.js";

// Servicio de categorías
const categoriasService = {
  async listarTodas() {
    return await Categoria.find().sort({ nombre: 1 });
  },

  async obtenerPorId(id) {
    return await Categoria.findById(id);
  },

  async crear(datos) {
    const nombreLimpio = datos.nombre ? datos.nombre.trim() : "";
    const existe = await Categoria.findOne({
      nombre: { $regex: `^${nombreLimpio.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, $options: "i" },
    });
    if (existe) {
      const error = new Error(`Ya existe una categoría con el nombre "${nombreLimpio}".`);
      error.status = 400;
      throw error;
    }

    const nuevaCategoria = new Categoria({ ...datos, nombre: nombreLimpio });
    return await nuevaCategoria.save();
  },

  async actualizar(id, datos) {
    if (datos.nombre) {
      const nombreLimpio = datos.nombre.trim();
      const existe = await Categoria.findOne({
        _id: { $ne: id },
        nombre: { $regex: `^${nombreLimpio.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, $options: "i" },
      });
      if (existe) {
        const error = new Error(`Ya existe otra categoría con el nombre "${nombreLimpio}".`);
        error.status = 400;
        throw error;
      }
      datos.nombre = nombreLimpio;
    }
    return await Categoria.findByIdAndUpdate(id, datos, { returnDocument: "after" });
  },

  async eliminar(id) {
    const productosAsociados = await Producto.countDocuments({ idCategoria: id });
    if (productosAsociados > 0) {
      const error = new Error(
        `No se puede eliminar la categoría porque tiene ${productosAsociados} producto(s) asociado(s).`
      );
      error.status = 400;
      throw error;
    }
    return await Categoria.findByIdAndDelete(id);
  },
};

export { categoriasService };
