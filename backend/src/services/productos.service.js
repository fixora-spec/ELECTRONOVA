import { Producto } from "../models/Producto.js";
import { Imagen } from "../models/Imagen.js";
import { Categoria } from "../models/Categoria.js";
import { comprimirImagenABase64 } from "../utils/image.util.js";

// Utilidades de paginación e imágenes
const consultarPaginado = async (query = {}, page = 1, limit = 10) => {
  const pagina = Math.max(1, Number(page) || 1);
  const limite = Math.max(1, Number(limit) || 10);
  const skip = (pagina - 1) * limite;

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
};

const guardarImagenesProducto = async (idProducto, archivos = []) => {
  if (!archivos || archivos.length === 0) return;

  const promesas = archivos.map(async (file) => {
    const ubicacion = await comprimirImagenABase64(file.buffer);
    const nuevaImagen = new Imagen({
      idProducto,
      tipo: "image/jpeg",
      ubicacion,
    });
    return nuevaImagen.save();
  });

  await Promise.all(promesas);
};

// Servicio de productos
const productosService = {
  async getProductos(page = 1, limit = 10, soloActivos = false) {
    const query = soloActivos ? { estado: true } : {};
    return consultarPaginado(query, page, limit);
  },

  async getProductoById(id) {
    const producto = await Producto.findById(id)
      .populate("idCategoria")
      .populate("imagenes");

    if (!producto) {
      throw new Error("Producto no encontrado");
    }

    return producto;
  },

  async crearProducto(datosProducto, archivos = []) {
    if (archivos && archivos.length > 5) {
      throw new Error("No se pueden subir más de 5 imágenes por producto.");
    }

    const nuevoProducto = new Producto(datosProducto);
    const guardado = await nuevoProducto.save();

    await guardarImagenesProducto(guardado._id, archivos);

    return await Producto.findById(guardado._id)
      .populate("idCategoria")
      .populate("imagenes");
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
      const imagenesABorrar = imagenesDB.filter((img) => !urlsExistentes.includes(img.ubicacion));

      await Promise.all(imagenesABorrar.map((img) => Imagen.findByIdAndDelete(img._id)));
      await guardarImagenesProducto(id, archivos);
    }

    return await Producto.findById(id)
      .populate("idCategoria")
      .populate("imagenes");
  },

  async eliminarProducto(id) {
    const productoEliminado = await Producto.findByIdAndDelete(id);
    if (!productoEliminado) {
      throw new Error("Producto no encontrado");
    }

    await Imagen.deleteMany({ idProducto: id });
    return productoEliminado;
  },

  async buscar(termino = "", page = 1, limit = 10, { categoria, soloActivos = false } = {}) {
    const query = {};

    if (soloActivos) {
      query.estado = true;
    }

    if (categoria) {
      query.idCategoria = categoria;
    }

    const textoLimpio = typeof termino === "string" ? termino.trim() : "";
    if (!textoLimpio) {
      return consultarPaginado(query, page, limit);
    }

    const STOP_WORDS = new Set([
      "de", "del", "la", "el", "los", "las", "un", "una", "unos", "unas",
      "y", "en", "para", "por", "con", "a"
    ]);

    const allTokens = textoLimpio.split(/\s+/).filter(Boolean);
    const significant = allTokens.filter((t) => !STOP_WORDS.has(t.toLowerCase()));
    const tokens = significant.length > 0 ? significant : allTokens;

    const buildTokenRegex = (token) => {
      const numUnitMatch = token.match(/^(\d+)([a-zA-Z]+)$/);
      let basePattern;
      if (numUnitMatch) {
        basePattern = `${numUnitMatch[1]}\\s*${numUnitMatch[2]}`;
      } else {
        basePattern = token.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      }

      const accentMap = {
        a: "[aáàäâAÁÀÄÂ]",
        e: "[eéèëêEÉÈËÊ]",
        i: "[iíìïîIÍÌÏÎ]",
        o: "[oóòöôOÓÒÖÔ]",
        u: "[uúùüûUÚÙÜÛ]",
        n: "[nñNÑ]",
        á: "[aáàäâAÁÀÄÂ]",
        é: "[eéèëêEÉÈËÊ]",
        í: "[iíìïîIÍÌÏÎ]",
        ó: "[oóòöôOÓÒÖÔ]",
        ú: "[uúùüûUÚÙÜÛ]",
        ñ: "[nñNÑ]",
      };

      const regexString = basePattern
        .split("")
        .map((char) => accentMap[char.toLowerCase()] || char)
        .join("");

      return new RegExp(regexString, "i");
    };

    const tokenConditions = await Promise.all(
      tokens.map(async (tok) => {
        const reg = buildTokenRegex(tok);

        const categoriasCoincidentes = await Categoria.find({
          $or: [{ nombre: reg }, { descripcion: reg }],
        }).select("_id");

        const catIds = categoriasCoincidentes.map((c) => c._id);

        const orFields = [
          { nombre: reg },
          { descripcionCorta: reg },
          { descripcionCompleta: reg },
          { especificacionesTec: reg },
          { caracteristicas: reg },
        ];

        if (catIds.length > 0) {
          orFields.push({ idCategoria: { $in: catIds } });
        }

        const numVal = Number(tok);
        if (!isNaN(numVal) && tok.length <= 6) {
          orFields.push({ precio: numVal });
        }

        return { $or: orFields };
      })
    );

    if (tokenConditions.length > 0) {
      query.$and = tokenConditions;
    }

    return consultarPaginado(query, page, limit);
  },

  async filtrarPorCategoria(idCategoria, page = 1, limit = 10, { soloActivos = false } = {}) {
    return this.buscar("", page, limit, { categoria: idCategoria, soloActivos });
  },
};

export { productosService };
