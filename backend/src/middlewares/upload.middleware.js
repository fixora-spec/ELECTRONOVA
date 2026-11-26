import multer from "multer";

// Configuración de almacenamiento y filtro de imágenes
const storage = multer.memoryStorage();
const ALLOWED_MIMES = ["image/jpeg", "image/png", "image/webp", "image/jpg", "image/svg+xml"];

const fileFilter = (req, file, cb) => {
  if (ALLOWED_MIMES.includes(file.mimetype.toLowerCase())) {
    cb(null, true);
  } else {
    cb(new Error("Formato de imagen no permitido. Solo se admiten JPG, PNG y WEBP."), false);
  }
};

// Middleware de carga de archivos
const uploadMiddleware = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
    fieldSize: 25 * 1024 * 1024,
    files: 5,
  },
});

export { uploadMiddleware };
