import { Producto } from "../models/Producto.js";
import { Imagen } from "../models/Imagen.js";
import sharp from "sharp";

export const getProductos = async (req, res) => {
  try {
    const productos = await Producto.find().populate("idCategoria").populate({ path: "imagenes", perDocumentLimit: 1 });
    res.status(200).json(productos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getProductoById = async (req, res) => {
  try {
    const producto = await Producto.findById(req.params.id).populate("idCategoria").populate("imagenes");
    if (!producto) return res.status(404).json({ message: "Producto no encontrado" });
    res.status(200).json(producto);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createProducto = async (req, res) => {
  try {
    const data = { ...req.body };
    
    if (req.files && req.files.length > 5) {
      return res.status(400).json({ message: "No se pueden subir más de 5 imágenes por producto." });
    }

    const nuevoProducto = new Producto(data);
    const productoGuardado = await nuevoProducto.save();

    if (req.files && req.files.length > 0) {
      const imagenesPromises = req.files.map(async file => {
        const compressedBuffer = await sharp(file.buffer)
          .resize(800, 800, { fit: 'inside', withoutEnlargement: true })
          .jpeg({ quality: 80 })
          .toBuffer();
          
        const base64Data = compressedBuffer.toString('base64');
        const ubicacion = `data:image/jpeg;base64,${base64Data}`;
        const nuevaImagen = new Imagen({
          idProducto: productoGuardado._id,
          tipo: 'image/jpeg',
          ubicacion: ubicacion
        });
        return nuevaImagen.save();
      });
      await Promise.all(imagenesPromises);
    }
    
    const productoFinal = await Producto.findById(productoGuardado._id).populate("imagenes");
    res.status(201).json(productoFinal);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateProducto = async (req, res) => {
  try {
    const data = { ...req.body };
    // 1. Recibir las imágenes que ya existían y que el usuario NO borró
    let urlsExistentes = [];
    if (req.body.imagenesExistentes) {
      try {
        const parseadas = JSON.parse(req.body.imagenesExistentes);
        urlsExistentes = parseadas.map(u => {
          const match = u.match(/(\/uploads\/.*)/);
          return match ? match[1] : u;
        });
      } catch (e) {
        console.error("Error al parsear imagenesExistentes", e);
      }
    }

    const totalImages = urlsExistentes.length + (req.files ? req.files.length : 0);
    if (totalImages > 5) {
      return res.status(400).json({ message: "No se pueden tener más de 5 imágenes en total por producto." });
    }

    if (data.productoDestacado === 'true') data.productoDestacado = true;
    if (data.productoDestacado === 'false') data.productoDestacado = false;
    const productoActualizado = await Producto.findByIdAndUpdate(req.params.id, data, { returnDocument: 'after' });
    if (!productoActualizado) return res.status(404).json({ message: "Producto no encontrado" });

    // Si hubo interacción con imágenes (vienen nuevas o vienen existentes)
    if (req.body.imagenesExistentes !== undefined || (req.files && req.files.length > 0)) {
      const imagenesDB = await Imagen.find({ idProducto: req.params.id });
      
      const imagenesABorrar = imagenesDB.filter(img => !urlsExistentes.includes(img.ubicacion));
      for (const img of imagenesABorrar) {
        await Imagen.findByIdAndDelete(img._id);
      }

      if (req.files && req.files.length > 0) {
        const imagenesPromises = req.files.map(async file => {
          const compressedBuffer = await sharp(file.buffer)
            .resize(800, 800, { fit: 'inside', withoutEnlargement: true })
            .jpeg({ quality: 80 })
            .toBuffer();

          const base64Data = compressedBuffer.toString('base64');
          const ubicacion = `data:image/jpeg;base64,${base64Data}`;
          const nuevaImagen = new Imagen({
            idProducto: req.params.id,
            tipo: 'image/jpeg',
            ubicacion: ubicacion
          });
          return nuevaImagen.save();
        });
        await Promise.all(imagenesPromises);
      }
    }

    const productoFinal = await Producto.findById(req.params.id).populate("imagenes");
    res.status(200).json(productoFinal);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteProducto = async (req, res) => {
  try {
    const productoEliminado = await Producto.findByIdAndDelete(req.params.id);
    if (!productoEliminado) return res.status(404).json({ message: "Producto no encontrado" });
    
    await Imagen.deleteMany({ idProducto: req.params.id });

    res.status(200).json({ message: "Producto eliminado" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const searchProductos = async (req, res) => {
  try {
    const { q } = req.query;
    const query = {
      $or: [
        { nombre: { $regex: q, $options: 'i' } },
        { descripcionCorta: { $regex: q, $options: 'i' } },
        { descripcionCompleta: { $regex: q, $options: 'i' } }
      ]
    };
    const productos = await Producto.find(query).populate("idCategoria").populate({ path: "imagenes", perDocumentLimit: 1 });
    res.status(200).json(productos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const filterProductos = async (req, res) => {
  try {
    const { categoria } = req.query;
    let query = {};
    if (categoria) {
      query.idCategoria = categoria;
    }
    const productos = await Producto.find(query).populate("idCategoria").populate({ path: "imagenes", perDocumentLimit: 1 });
    res.status(200).json(productos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
