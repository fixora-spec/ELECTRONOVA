/**
 * @file productos.service.js
 * @description Capa de servicio para operaciones de base de datos con Productos e Imágenes.
 * @module services/productos
 */

import { Producto } from "../models/Producto.js";
import { Imagen } from "../models/Imagen.js";
import { comprimirImagenABase64 } from "../utils/image.util.js";

const productosService = {
  /**
   * Obtiene productos con paginación y opción de filtrar por estado activo.
   *
   * @param {number} [page=1] - Número de página actual.
   * @param {number} [limit=10] - Cantidad de productos por página.
   * @param {boolean} [soloActivos=false] - Si es true, filtra solo productos con estado=true.
   */
  async getProductos(page = 1, limit = 10, soloActivos = false) {
    const pagina = Math.max(1, Number(page) || 1);
    const limite = Math.max(1, Number(limit) || 10);
    const skip = (pagina - 1) * limite;

    const query = soloActivos ? { estado: true } : {};

    const [productos, total] = await Promise.all([
      Producto.find(query)
        .populate("idCategoria")
        .populate({ path: "imagenes", perDocumentLimit: 1 })
        .sort({ updatedAt: -1, fechaRegistro: -1 })
        .skip(skip)
        .limit(limite),
      Producto.countDocuments(query),
    ]);

    const totalPages = Math.ceil(total / limite) || 1;

    return {
      productos,
      pagination: {
        total,
        page: pagina,
        limit: limite,
        totalPages,
        hasNextPage: pagina < totalPages,
        hasPrevPage: pagina > 1,
      },
    };
  },

  async listarTodos(page, limit) {
    return this.getProductos(page, limit);
  },

  /**
   * Obtiene un producto por ID con su categoría e imágenes relacionadas.
   * @param {string} id - ID del producto.
   */
  async getProductoById(id) {
    const producto = await Producto.findById(id)
      .populate("idCategoria")
      .populate("imagenes");

    if (!producto) {
      throw new Error("Producto no encontrado");
    }

    return producto;
  },

  async obtenerPorId(id) {
    return this.getProductoById(id);
  },

  /**
   * Guarda un nuevo producto y comprime sus imágenes asociadas a Base64.
   *
   * @param {Object} datosProducto - Campos del producto.
   * @param {Array<Express.Multer.File>} [archivos=[]] - Archivos de imagen procesados.
   */
  async crearProducto(datosProducto, archivos = []) {
    if (archivos && archivos.length > 5) {
      throw new Error("No se pueden subir más de 5 imágenes por producto.");

    }

    const nuevoProducto = new Producto(datosProducto);
    const guardado = await nuevoProducto.save();

    if (archivos && archivos.length > 0) {
      const promesasImagenes = archivos.map(async (file) => {
        const ubicacion = await comprimirImagenABase64(file.buffer);
        const nuevaImagen = new Imagen({
          idProducto: guardado._id,
          tipo: "image/jpeg",
          ubicacion,
        });
        return nuevaImagen.save();
      });

      await Promise.all(promesasImagenes);
    }

    return await Producto.findById(guardado._id)
      .populate("idCategoria")
      .populate("imagenes");
  },

  async crear(datos, archivos) {
    return this.crearProducto(datos, archivos);
  },

  async actualizarProducto(id, datos, archivos = [], imagenesExistentesRaw) {
    let urlsExistentes = [];
    if (imagenesExistentesRaw) {
      try {
        const parseadas = JSON.parse(imagenesExistentesRaw);
        urlsExistentes = parseadas.map((u) => {
          const match = u.match(/(\/uploads\/.*)/);
          return match ? match[1] : u;
        });
      } catch (e) {
        console.error("[productosService] Error al parsear imagenesExistentes:", e);
      }
    }

    const totalImages = urlsExistentes.length + (archivos ? archivos.length : 0);
    if (totalImages > 5) {
      throw new Error("No se pueden tener más de 5 imágenes en total por producto.");
    }

    if (datos.productoDestacado === "true") datos.productoDestacado = true;
    if (datos.productoDestacado === "false") datos.productoDestacado = false;
    if (datos.estado === "true") datos.estado = true;
    if (datos.estado === "false") datos.estado = false;
    datos.fechaActualizacion = new Date();

    const productoActualizado = await Producto.findByIdAndUpdate(id, datos, {
      returnDocument: "after",
    });

    if (!productoActualizado) {
      throw new Error("Producto no encontrado");
    }

    if (imagenesExistentesRaw !== undefined || (archivos && archivos.length > 0)) {
      const imagenesDB = await Imagen.find({ idProducto: id });

      const imagenesABorrar = imagenesDB.filter(
        (img) => !urlsExistentes.includes(img.ubicacion)
      );

      for (const img of imagenesABorrar) {
        await Imagen.findByIdAndDelete(img._id);
      }

      if (archivos && archivos.length > 0) {
        const promesasImagenes = archivos.map(async (file) => {
          const ubicacion = await comprimirImagenABase64(file.buffer);
          const nuevaImagen = new Imagen({
            idProducto: id,
            tipo: "image/jpeg",
            ubicacion,
          });
          return nuevaImagen.save();
        });

        await Promise.all(promesasImagenes);
      }
    }

    return await Producto.findById(id)
      .populate("idCategoria")
      .populate("imagenes");
  },

  async actualizar(id, datos, archivos, raw) {
    return this.actualizarProducto(id, datos, archivos, raw);
  },

  async eliminarProducto(id) {
    const productoEliminado = await Producto.findByIdAndDelete(id);
    if (!productoEliminado) {
      throw new Error("Producto no encontrado");
    }

    await Imagen.deleteMany({ idProducto: id });
    return productoEliminado;
  },

  async eliminar(id) {
    return this.eliminarProducto(id);
  },

  async buscar(termino, page = 1, limit = 10) {
    if (!termino || !termino.trim()) {
      return this.getProductos(page, limit);
    }

    const pagina = Math.max(1, Number(page) || 1);
    const limite = Math.max(1, Number(limit) || 10);
    const skip = (pagina - 1) * limite;

    // Sanitización contra ReDoS (Regular Expression Denial of Service)
    const terminoSanitizado = termino.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    const query = {
      $or: [
        { nombre: { $regex: terminoSanitizado, $options: "i" } },
        { descripcionCorta: { $regex: terminoSanitizado, $options: "i" } },
        { descripcionCompleta: { $regex: terminoSanitizado, $options: "i" } },
      ],
    };

    const [productos, total] = await Promise.all([
      Producto.find(query)
        .populate("idCategoria")
        .populate({ path: "imagenes", perDocumentLimit: 1 })
        .sort({ updatedAt: -1, fechaRegistro: -1 })
        .skip(skip)
        .limit(limite),
      Producto.countDocuments(query),
    ]);

    const totalPages = Math.ceil(total / limite) || 1;

    return {
      productos,
      pagination: {
        total,
        page: pagina,
        limit: limite,
        totalPages,
        hasNextPage: pagina < totalPages,
        hasPrevPage: pagina > 1,
      },
    };
  },

  async filtrarPorCategoria(idCategoria, page = 1, limit = 10) {
    const pagina = Math.max(1, Number(page) || 1);
    const limite = Math.max(1, Number(limit) || 10);
    const skip = (pagina - 1) * limite;

    const query = idCategoria ? { idCategoria } : {};

    const [productos, total] = await Promise.all([
      Producto.find(query)
        .populate("idCategoria")
        .populate({ path: "imagenes", perDocumentLimit: 1 })
        .sort({ updatedAt: -1, fechaRegistro: -1 })
        .skip(skip)
        .limit(limite),
      Producto.countDocuments(query),
    ]);

    const totalPages = Math.ceil(total / limite) || 1;

    return {
      productos,
      pagination: {
        total,
        page: pagina,
        limit: limite,
        totalPages,
        hasNextPage: pagina < totalPages,
        hasPrevPage: pagina > 1,
      },
    };
  },
};

export { productosService };
