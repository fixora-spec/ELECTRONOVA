/**
 * @file Administrador.js
 * @description Modelo de Mongoose para la entidad Administrador con hashing Argon2.
 * @module models/Administrador
 */

import { Schema, model } from "mongoose";
import argon2 from "argon2";
import bcrypt from "bcrypt";

const AdministradorSchema = new Schema(
  {
    nombre: { type: String, required: true },
    correo: { type: String, required: true, unique: true },
    contraseña: { type: String, required: true },
    rol: { type: String, default: "admin" },
  },
  {
    timestamps: false,
    versionKey: false,
  }
);

/**
 * Middleware pre-save para hashear la contraseña con Argon2 antes de persistir.
 */
AdministradorSchema.pre("save", async function () {
  if (!this.isModified("contraseña")) return;
  if (this.contraseña && this.contraseña.startsWith("$argon2")) return;
  this.contraseña = await argon2.hash(this.contraseña);
});

/**
 * Compara una contraseña candidata en texto plano contra el hash almacenado.
 * Admite tanto hashes Argon2 como hashes heredados de Bcrypt.
 *
 * @param {string} candidatePassword - Contraseña en texto plano a verificar.
 * @returns {Promise<boolean>} Retorna true si coincide, de lo contrario false.
 */
AdministradorSchema.methods.comparePassword = async function (candidatePassword) {
  try {
    if (this.contraseña.startsWith("$argon2")) {
      return await argon2.verify(this.contraseña, candidatePassword);
    }
    return await bcrypt.compare(candidatePassword, this.contraseña);
  } catch {
    return false;
  }
};

const Administrador = model("Administrador", AdministradorSchema);

export { Administrador };


