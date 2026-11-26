import { Administrador } from "../models/Administrador.js";
import { Usuario } from "../models/Usuario.js";

// Servicio de usuarios
const usuariosService = {
  async listarTodos() {
    const [admins, usuarios] = await Promise.all([
      Administrador.find().select("-contraseña"),
      Usuario.find().select("-contraseña"),
    ]);
    return [...admins, ...usuarios];
  },
};

export { usuariosService };
