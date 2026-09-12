import { Administrador } from "../models/Administrador.js";
import jwt from "jsonwebtoken";

export const login = async (req, res) => {
  const { correo, contraseña } = req.body;
  if (!correo || !contraseña) {
    return res.status(400).json({ message: "Por favor, envíe correo y contraseña" });
  }
  try {
    const admin = await Administrador.findOne({ correo });
    if (!admin) {
      return res.status(401).json({ message: "Credenciales inválidas" });
    }

    const isMatch = await admin.comparePassword(contraseña);
    if (!isMatch) {
      return res.status(401).json({ message: "Credenciales inválidas" });
    }

    const token = jwt.sign(
      { id: admin._id },
      process.env.JWT_SECRET || "secreto_desarrollo",
      { expiresIn: "1d" }
    );

    res.status(200).json({ 
      message: "Login exitoso",
      token,
      admin: {
        id: admin._id,
        nombre: admin.nombre,
        correo: admin.correo
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const logout = async (req, res) => {
  try {
    // En JWT, el logout normalmente se maneja en el frontend borrando el token.
    res.status(200).json({ message: "Logout exitoso. Por favor, borre el token en el cliente." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

