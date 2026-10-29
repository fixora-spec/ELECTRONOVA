import { usuariosService } from "../services/usuarios.service.js";

const getUsuarios = async (req, res) => {
  try {
    const usuarios = await usuariosService.listarTodos();
    return res.status(200).json(usuarios);
  } catch (error) {
    return res.status(error.status || 500).json({
      message: error.message || "Error desconocido",
    });
  }
};

export { getUsuarios };
