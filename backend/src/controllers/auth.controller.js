import { Administrador } from "../models/Administrador.js";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

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
    res.status(200).json({ message: "Logout exitoso. Por favor, borre el token en el cliente." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const forgotPassword = async (req, res) => {
  const { correo } = req.body;
  if (!correo) return res.status(400).json({ message: "El correo es obligatorio" });

  try {
    const admin = await Administrador.findOne({ correo });
    if (!admin) return res.status(404).json({ message: "No existe un administrador con ese correo" });

    // Generar token que expira en 15 minutos. Usamos la contraseña actual como parte del secreto
    // Así, si cambia la contraseña, el token se invalida automáticamente.
    const secret = (process.env.JWT_SECRET || "secreto_desarrollo") + admin.contraseña;
    const token = jwt.sign({ correo: admin.correo, id: admin._id }, secret, { expiresIn: '15m' });

    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
    const resetLink = `${frontendUrl}/reset-password?token=${token}&id=${admin._id}`;

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: admin.correo,
      subject: 'Recuperación de Contraseña - ELECTRONOVA',
      html: `
        <h2>Recuperación de Contraseña</h2>
        <p>Hola ${admin.nombre},</p>
        <p>Has solicitado restablecer tu contraseña. Haz clic en el siguiente enlace para crear una nueva:</p>
        <a href="${resetLink}" style="display:inline-block; padding:10px 20px; background-color:#0d47a1; color:white; text-decoration:none; border-radius:5px;">Restablecer Contraseña</a>
        <p>Este enlace expirará en 15 minutos.</p>
        <p>Si no solicitaste este cambio, ignora este correo.</p>
      `
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "Se ha enviado un enlace de recuperación a su correo." });
  } catch (error) {
    console.error("Error enviando correo:", error);
    res.status(500).json({ message: "Error al procesar la solicitud o al enviar el correo. Verifique sus credenciales." });
  }
};

export const resetPassword = async (req, res) => {
  const { id, token, nuevaContrasena } = req.body;
  if (!id || !token || !nuevaContrasena) {
    return res.status(400).json({ message: "Faltan datos obligatorios" });
  }

  try {
    const admin = await Administrador.findById(id);
    if (!admin) return res.status(404).json({ message: "Administrador no encontrado" });

    const secret = (process.env.JWT_SECRET || "secreto_desarrollo") + admin.contraseña;
    
    // Verificar token (si falla lanzará un error)
    try {
      jwt.verify(token, secret);
    } catch (err) {
      return res.status(400).json({ message: "El enlace es inválido o ha expirado" });
    }

    admin.contraseña = nuevaContrasena;
    await admin.save(); // El pre('save') en el modelo se encarga de hashear la contraseña

    res.status(200).json({ message: "Contraseña actualizada exitosamente" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



