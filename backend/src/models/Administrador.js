import { Schema, model } from "mongoose";
import bcrypt from "bcrypt";

const AdministradorSchema = new Schema({
  nombre: { type: String, required: true },
  correo: { type: String, required: true, unique: true },
  contraseña: { type: String, required: true }
}, {
  timestamps: false,
  versionKey: false
});

AdministradorSchema.pre("save", async function () {
  if (!this.isModified("contraseña")) return;
  const salt = await bcrypt.genSalt(10);
  this.contraseña = await bcrypt.hash(this.contraseña, salt);
});

AdministradorSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.contraseña);
};

export const Administrador = model("Administrador", AdministradorSchema);

