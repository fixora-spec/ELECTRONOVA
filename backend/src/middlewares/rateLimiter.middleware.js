import rateLimit from "express-rate-limit";

const crearLimitador = (maxProd, maxDev, mensaje) =>
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: process.env.NODE_ENV === "production" ? maxProd : maxDev,
    standardHeaders: true,
    legacyHeaders: false,
    message: { message: mensaje },
  });

// Limitadores de peticiones
export const apiLimiter = crearLimitador(
  300,
  1000,
  "Demasiadas peticiones desde esta IP. Por favor, intente de nuevo en 15 minutos."
);

export const authLimiter = crearLimitador(
  15,
  200,
  "Demasiados intentos de autenticación. Intente de nuevo en 15 minutos."
);
