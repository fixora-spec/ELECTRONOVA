/**
 * @file usuarios.service.js
 * @description Capa de servicio para consultas administrativas de usuarios y administradores.
 * @module services/usuarios
 */

import { Administrador } from "../models/Administrador.js";
import { Usuario } from "../models/Usuario.js";

const usuariosService = {
  /**
   * Obtiene la lista conjunta de administradores y clientes, excluyendo hashes de contraseñas.
   */
  async listarTodos() {
    const admins = await Administrador.find().select("-contraseña");
    const usuarios = await Usuario.find().select("-contraseña");
    return [...admins, ...usuarios];
  },
};

export { usuariosService };

