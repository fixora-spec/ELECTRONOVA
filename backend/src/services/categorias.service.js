import { Categoria } from "../models/Categoria.js";
import { Producto } from "../models/Producto.js";

const categoriasService = {
  async listarTodas() {
    return await Categoria.find().sort({ nombre: 1 });
  },

  async obtenerPorId(id) {
    return await Categoria.findById(id);
  },

  async crear(datos) {
    const nuevaCategoria = new Categoria(datos);
    return await nuevaCategoria.save();
  },

  async actualizar(id, datos) {
    return await Categoria.findByIdAndUpdate(id, datos, { returnDocument: "after" });
  },

  async eliminar(id) {
    const productosAsociados = await Producto.countDocuments({ idCategoria: id });
    if (productosAsociados > 0) {
      const error = new Error(`No se puede eliminar la categoría porque tiene ${productosAsociados} producto(s) asociado(s).`);
      error.status = 400;
      throw error;
    }
    return await Categoria.findByIdAndDelete(id);
  },
};

export { categoriasService };
