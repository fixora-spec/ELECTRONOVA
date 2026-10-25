/**
 * @file auth.schema.js
 * @description Esquemas de validación Zod para operaciones de autenticación.
 * @module schemas/auth
 */

import * as z from "zod";

/**
 * Esquema de validación para registro de nuevos clientes.
 */
export const registerSchema = z.object({
  nombre: z
    .string({ required_error: "El nombre es obligatorio." })
    .trim()
    .min(2, "El nombre debe tener al menos 2 caracteres."),
  correo: z
    .string({ required_error: "El correo electrónico es obligatorio." })
    .trim()
    .email("El formato del correo electrónico no es válido."),
  contraseña: z
    .string({ required_error: "La contraseña es obligatoria." })
    .min(6, "La contraseña debe tener al menos 6 caracteres."),
});

/**
 * Esquema de validación para inicio de sesión.
 */
export const loginSchema = z.object({
  correo: z
    .string({ required_error: "El correo electrónico es obligatorio." })
    .trim()
    .email("El formato del correo electrónico no es válido."),
  contraseña: z
    .string({ required_error: "La contraseña es obligatoria." })
    .min(1, "La contraseña es obligatoria."),
  recordarme: z.boolean().optional().default(false),
});

/**
 * Esquema de validación para solicitud de recuperación de contraseña.
 */
export const forgotPasswordSchema = z.object({
  correo: z
    .string({ required_error: "El correo electrónico es obligatorio." })
    .trim()
    .email("El formato del correo electrónico no es válido."),
});

/**
 * Esquema de validación para restablecimiento final de contraseña.
 */
export const resetPasswordSchema = z.object({
  id: z
    .string({ required_error: "El ID es obligatorio." })
    .min(1, "El ID es obligatorio."),
  token: z
    .string({ required_error: "El token es obligatorio." })
    .min(1, "El token es obligatorio."),
  nuevaContrasena: z
    .string({ required_error: "La nueva contraseña es obligatoria." })
    .min(6, "La nueva contraseña debe tener al menos 6 caracteres."),
});

