import { Schema, model } from "mongoose";
import { configurarPasswordSchema } from "./Administrador.js";

// Esquema de Usuario
const UsuarioSchema = new Schema(
  {
    nombre: { type: String, required: true },
    nombres: { type: String },
    apellidos: { type: String },
    firstname: { type: String },
    lastname: { type: String },
    gender: { type: String },
    birthdate: { type: Date },
    correo: { type: String, required: true, unique: true },
    contraseña: { type: String, required: true },
    rol: {
      type: String,
      enum: ["CLIENTE", "ADMINISTRATOR", "VENDEDOR", "usuario", "admin"],
      default: "CLIENTE",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Normalización y seguridad
UsuarioSchema.pre("validate", function () {
  const n = this.nombres || this.firstname;
  const a = this.apellidos || this.lastname;
  if (!this.nombre && (n || a)) {
    this.nombre = [n, a].filter(Boolean).join(" ").trim() || "Usuario";
  }
});

configurarPasswordSchema(UsuarioSchema);

const Usuario = model("Usuario", UsuarioSchema);

export { Usuario };
