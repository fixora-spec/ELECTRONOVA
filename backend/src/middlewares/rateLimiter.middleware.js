/**
 * @file rateLimiter.middleware.js
 * @description Middlewares de control de frecuencia (Rate Limiting) para protección contra ataques DoS y Fuerza Bruta.
 * @module middlewares/rateLimiter
 */

import rateLimit from "express-rate-limit";

/**
 * Limitador global para todas las rutas de la API.
 * Permite hasta 300 peticiones cada 15 minutos por dirección IP.
 */
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: process.env.NODE_ENV === "production" ? 300 : 1000,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: "Demasiadas peticiones desde esta IP. Por favor, intente de nuevo en 15 minutos.",
  },
});

/**
 * Limitador estricto para rutas de autenticación sensible (Login, Registro, Recuperación de contraseña).
 * Bloquea la IP tras demasiados intentos para evitar ataques de fuerza bruta.
 */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: process.env.NODE_ENV === "production" ? 15 : 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: "Demasiados intentos de autenticación. Por motivos de seguridad, la cuenta o IP ha sido bloqueada temporalmente por 15 minutos.",
  },
});

