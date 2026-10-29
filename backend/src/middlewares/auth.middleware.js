import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  let token = null;

  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
  } else if (req.cookies && req.cookies.authToken) {
    token = req.cookies.authToken;
  }

  if (!token) {
    return res.status(401).json({ message: "No autorizado. Token no proporcionado o formato inválido." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "super_secreto_desarrollo_2026");
    req.admin = decoded;
    req.user = decoded;
    return next();
  } catch (error) {
    if (error.name === "TokenExpiredError" || error.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "No autorizado. Token inválido o expirado." });
    }
    return res.status(500).json({ message: "Error desconocido", error: error.message });
  }
};

const adminMiddleware = (req, res, next) => {
  try {
    const rol = req.user?.rol || req.admin?.rol;
    if (rol !== "admin") {
      return res.status(403).json({ message: "Acceso denegado. Se requieren permisos de administrador." });
    }
    return next();
  } catch (error) {
    return res.status(500).json({ message: "Error desconocido", error: error.message });
  }
};

export { authMiddleware, adminMiddleware };
