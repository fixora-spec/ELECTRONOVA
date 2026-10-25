/**
 * @file Imagen.js
 * @description Modelo de Mongoose para el almacenamiento de imágenes de productos en formato Base64.
 * @module models/Imagen
 */

import { Schema, model } from "mongoose";

const ImagenSchema = new Schema(
  {
    idProducto: { type: Schema.Types.ObjectId, ref: "Producto", required: true },
    tipo: { type: String, required: false },
    ubicacion: { type: String, required: true },
    almacenamiento: { type: String, required: false, default: "base64" },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const Imagen = model("Imagen", ImagenSchema);

export { Imagen };

