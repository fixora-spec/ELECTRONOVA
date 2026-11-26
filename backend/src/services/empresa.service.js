import { Empresa } from "../models/Empresa.js";

// Servicio de empresa
const empresaService = {
  async obtenerDatos() {
    return await Empresa.findOne();
  },
};

export { empresaService };
