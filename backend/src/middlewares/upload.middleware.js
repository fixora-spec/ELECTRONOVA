import multer from "multer";
import path from "path";

const storage = multer.memoryStorage();

// Filtro para aceptar solo imágenes
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("No es una imagen. Por favor sube solo imágenes."), false);
  }
};

export const uploadMiddleware = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // Límite de 5MB por archivo
    fieldSize: 25 * 1024 * 1024 // Límite de 25MB para campos de texto (para soportar base64 largos)
  }
});
