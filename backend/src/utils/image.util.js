import sharp from "sharp";

// Compresión y conversión de imagen a Base64
const comprimirImagenABase64 = async (buffer) => {
  const compressedBuffer = await sharp(buffer)
    .resize(800, 800, { fit: "inside", withoutEnlargement: true })
    .jpeg({ quality: 80 })
    .toBuffer();

  const base64Data = compressedBuffer.toString("base64");
  return `data:image/jpeg;base64,${base64Data}`;
};

export { comprimirImagenABase64 };
