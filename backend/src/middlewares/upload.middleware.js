/**
 * @file upload.middleware.js
 * @description Middleware de subida de imágenes con Multer en memoria, validación de tipos MIME y cuotas de tamaño.
 * @module middlewares/upload
 */

import multer from "multer";

const storage = multer.memoryStorage();

// Lista blanca estricta de tipos MIME permitidos (se excluyen formatos con riesgo de script como SVG)
const ALLOWED_MIMES = ["image/jpeg", "image/png", "image/webp", "image/jpg"];

/**
 * Valida que los archivos recibidos pertenezcan a los formatos de imagen autorizados.
 */
const fileFilter = (req, file, cb) => {
  if (ALLOWED_MIMES.includes(file.mimetype.toLowerCase())) {
    cb(null, true);
  } else {
    cb(new Error("Formato de imagen inválido o no seguro. Solo se admiten JPG, PNG y WEBP."), false);
  }
};

/**
 * Instancia de Multer configurada con almacenamiento en buffer y límites de tamaño.
 */
const uploadMiddleware = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB por archivo
    files: 5,                  // Máximo 5 archivos por petición
  },
});

export { uploadMiddleware };


