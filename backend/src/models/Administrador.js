import { Schema, model } from "mongoose";
import argon2 from "argon2";

// Esquema de Administrador
const AdministradorSchema = new Schema(
  {
    nombre: { type: String, required: true },
    correo: { type: String, required: true, unique: true },
    contraseña: { type: String, required: true },
    rol: { type: String, default: "ADMINISTRATOR" },
  },
  {
    timestamps: false,
    versionKey: false,
  }
);

// Hooks y métodos de contraseña
export const configurarPasswordSchema = (schema) => {
  schema.pre("save", async function () {
    if (!this.isModified("contraseña")) return;
    if (this.contraseña && this.contraseña.startsWith("$argon2")) return;
    this.contraseña = await argon2.hash(this.contraseña);
  });

  schema.methods.comparePassword = async function (candidatePassword) {
    try {
      return await argon2.verify(this.contraseña, candidatePassword);
    } catch {
      return false;
    }
  };
};

configurarPasswordSchema(AdministradorSchema);

const Administrador = model("Administrador", AdministradorSchema);

export { Administrador };
