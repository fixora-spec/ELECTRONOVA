/**
 * @file usuarios.controller.js
 * @description Controlador para la visualización administrativa de cuentas de usuario y administradores.
 * @module controllers/usuarios
 */

import { usuariosService } from "../services/usuarios.service.js";

/**
 * Obtiene la lista unificada de todos los administradores y clientes registrados.
 * @route GET /usuarios
 */
const getUsuarios = async (req, res) => {
  try {
    const usuarios = await usuariosService.listarTodos();
    return res.status(200).json(usuarios);
  } catch (error) {
    if (error.status) {
      return res.status(error.status).json({ message: error.message });
    } else {
      return res.status(500).json({
        message: "Error desconocido",
        error: error.message,
      });
    }
  }
};

export { getUsuarios };


