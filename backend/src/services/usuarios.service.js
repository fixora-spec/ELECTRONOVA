import { Administrador } from "../models/Administrador.js";
import { Usuario } from "../models/Usuario.js";

const usuariosService = {
  async listarTodos() {
    const admins = await Administrador.find().select("-contraseña");
    const usuarios = await Usuario.find().select("-contraseña");
    return [...admins, ...usuarios];
  },
};

export { usuariosService };
