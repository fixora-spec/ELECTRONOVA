import { Schema, model } from "mongoose";
import argon2 from "argon2";
import bcrypt from "bcrypt";

const UsuarioSchema = new Schema(
  {
    nombre: { type: String, required: true },
    firstname: { type: String },
    lastname: { type: String },
    gender: { type: String },
    birthdate: { type: Date },
    correo: { type: String, required: true, unique: true },
    contraseña: { type: String, required: true },
    rol: { type: String, default: "usuario" },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

UsuarioSchema.pre("validate", function () {
  if (!this.nombre && (this.firstname || this.lastname)) {
    this.nombre = [this.firstname, this.lastname].filter(Boolean).join(" ").trim() || "Usuario";
  }
});

UsuarioSchema.pre("save", async function () {
  if (!this.isModified("contraseña")) return;
  if (this.contraseña && this.contraseña.startsWith("$argon2")) return;
  this.contraseña = await argon2.hash(this.contraseña);
});

UsuarioSchema.methods.comparePassword = async function (candidatePassword) {
  try {
    if (this.contraseña && this.contraseña.startsWith("$argon2")) {
      return await argon2.verify(this.contraseña, candidatePassword);
    }
    return await bcrypt.compare(candidatePassword, this.contraseña);
  } catch {
    return false;
  }
};

const Usuario = model("Usuario", UsuarioSchema);

export { Usuario };
