/**
 * @file empresa.service.js
 * @description Capa de servicio para consultar la información institucional de la empresa.
 * @module services/empresa
 */

import { Empresa } from "../models/Empresa.js";

const empresaService = {
  /**
   * Obtiene el registro único con los datos de contacto y dirección de la empresa.
   */
  async obtenerDatos() {
    return await Empresa.findOne();
  },
};

export { empresaService };

