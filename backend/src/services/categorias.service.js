/**
 * @file categorias.service.js
 * @description Capa de servicio para operaciones de base de datos relacionadas con Categorías.
 * @module services/categorias
 */

import { Categoria } from "../models/Categoria.js";
import { Producto } from "../models/Producto.js";

const categoriasService = {
  /**
   * Obtiene todas las categorías ordenadas ascendentemente por nombre.
   */
  async listarTodas() {
    return await Categoria.find().sort({ nombre: 1 });
  },

  /**
   * Busca una categoría por su identificador.
   * @param {string} id - ID de la categoría.
   */
  async obtenerPorId(id) {
    return await Categoria.findById(id);
  },

  /**
   * Crea una nueva categoría en la base de datos.
   * @param {Object} datos - Atributos de la categoría.
   */
  async crear(datos) {
    const nuevaCategoria = new Categoria(datos);
    return await nuevaCategoria.save();
  },

  /**
   * Actualiza una categoría existente.
   * @param {string} id - ID de la categoría.
   * @param {Object} datos - Nuevos atributos a actualizar.
   */
  async actualizar(id, datos) {
    return await Categoria.findByIdAndUpdate(id, datos, {
      returnDocument: "after",
    });
  },

  /**
   * Elimina una categoría si no contiene productos vinculados.
   * @param {string} id - ID de la categoría.
   */
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

