import { empresaService } from "../services/empresa.service.js";

const getEmpresa = async (req, res) => {
  try {
    const empresa = await empresaService.obtenerDatos();
    if (!empresa) {
      return res.status(404).json({ message: "Datos de empresa no encontrados" });
    }
    return res.status(200).json(empresa);
  } catch (error) {
    return res.status(error.status || 500).json({
      message: error.message || "Error desconocido",
    });
  }
};

export { getEmpresa };
