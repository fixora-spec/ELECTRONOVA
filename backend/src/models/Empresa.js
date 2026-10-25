/**
 * @file Empresa.js
 * @description Modelo de Mongoose para la configuración e información institucional de ELECTRONOVA.
 * @module models/Empresa
 */

import { Schema, model } from "mongoose";

const EmpresaSchema = new Schema(
  {
    nombre: { type: String, required: true },
    descripcion: { type: String, required: false },
    direccion: { type: String, required: false },
    horarioAtencion: { type: String, required: false },
    redesSociales: { type: String, required: false },
    contacto: { type: String, required: false },
  },
  {
    timestamps: false,
    versionKey: false,
  }
);

const Empresa = model("Empresa", EmpresaSchema);

export { Empresa };

