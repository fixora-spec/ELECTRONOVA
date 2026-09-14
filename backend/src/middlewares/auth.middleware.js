import jwt from "jsonwebtoken";

export const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No autorizado. Token no provisto o con formato incorrecto." });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secreto_desarrollo");
    req.admin = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "No autorizado. Token inválido o expirado." });
  }
};
