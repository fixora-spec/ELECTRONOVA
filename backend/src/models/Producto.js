import { Schema, model } from "mongoose";

const ProductoSchema = new Schema({
  nombre: { type: String, required: true },
  productoDestacado: { type: Boolean, default: false },
  especificacionesTec: { type: String, required: false },
  idCategoria: { type: Schema.Types.ObjectId, ref: "Categoria", required: true },
  idAdministrador: { type: Schema.Types.ObjectId, ref: "Administrador", required: true },
  fechaRegistro: { type: Date, default: Date.now },
  fechaActualizacion: { type: Date, default: Date.now },
  estado: { type: Boolean, default: true },
  precio: { type: Number, required: true },
  caracteristicas: { type: String, required: false },
  descripcionCorta: { type: String, required: false },
  descripcionCompleta: { type: String, required: false }
}, {
  timestamps: true,
  versionKey: false,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

ProductoSchema.virtual('imagenes', {
  ref: 'Imagen',
  localField: '_id',
  foreignField: 'idProducto'
});

export const Producto = model("Producto", ProductoSchema);
