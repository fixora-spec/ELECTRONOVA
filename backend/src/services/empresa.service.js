import { Empresa } from "../models/Empresa.js";

const empresaService = {
  async obtenerDatos() {
    return await Empresa.findOne();
  },
};

export { empresaService };
