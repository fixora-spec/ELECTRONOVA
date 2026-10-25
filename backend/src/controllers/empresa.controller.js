/**
 * @file empresa.controller.js
 * @description Controlador para consultar la información corporativa de ELECTRONOVA.
 * @module controllers/empresa
 */

import { empresaService } from "../services/empresa.service.js";

/**
 * Obtiene los datos institucionales de la empresa (contacto, dirección, redes).
 * @route GET /empresa
 */
const getEmpresa = async (req, res) => {
  try {
    const empresa = await empresaService.obtenerDatos();
    if (!empresa) {
      return res.status(404).json({ message: "Datos de empresa no encontrados" });
    }
    return res.status(200).json(empresa);
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

export { getEmpresa };


