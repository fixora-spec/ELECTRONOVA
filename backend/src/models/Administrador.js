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

AdministradorSchema.pre("save", async function () {
  if (!this.isModified("contraseña")) return;
  if (this.contraseña && this.contraseña.startsWith("$argon2")) return;
  this.contraseña = await argon2.hash(this.contraseña);
});

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
