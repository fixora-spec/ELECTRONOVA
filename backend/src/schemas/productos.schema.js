/**
 * @file productos.schema.js
 * @description Esquemas de validación Zod para productos del catálogo ELECTRONOVA.
 * @module schemas/productos
 */

import * as z from "zod";

/**
 * Esquema de validación para creación y actualización de productos.
 * Soporta coerción numérica para payloads multipart/form-data.
 */
export const productoSchema = z.object({
  nombre: z
    .string({ required_error: "El nombre del producto es obligatorio." })
    .trim()
    .min(2, "El nombre debe tener al menos 2 caracteres."),
  precio: z.coerce
    .number({ invalid_type_error: "El precio debe ser un número." })
    .min(0, "El precio no puede ser negativo."),
  idCategoria: z
    .string({ required_error: "La categoría es obligatoria." })
    .min(1, "La categoría es obligatoria."),
  productoDestacado: z.union([z.boolean(), z.string()]).optional(),
  especificacionesTec: z.string().optional(),
  caracteristicas: z.string().optional(),
  descripcionCorta: z.string().optional(),
  descripcionCompleta: z.string().optional(),
  estado: z.union([z.boolean(), z.string()]).optional(),
});

