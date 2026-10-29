import { Schema, model } from "mongoose";

const CategoriaSchema = new Schema(
  {
    nombre: { type: String, required: true },
    descripcion: { type: String, required: false },
    estado: { type: Boolean, default: true },
    idAdministrador: { type: Schema.Types.ObjectId, ref: "Administrador", required: true },
  },
  {
    timestamps: false,
    versionKey: false,
  }
);

const Categoria = model("Categoria", CategoriaSchema);

export { Categoria };
