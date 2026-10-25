/**
 * @file categorias.schema.js
 * @description Esquemas de validación Zod para categorías de productos.
 * @module schemas/categorias
 */

import * as z from "zod";

/**
 * Esquema de validación para creación y actualización de categorías.
 */
export const categoriaSchema = z.object({
  nombre: z
    .string({ required_error: "El nombre de la categoría es obligatorio." })
    .trim()
    .min(2, "El nombre debe tener al menos 2 caracteres."),
  descripcion: z.string().optional(),
  estado: z.union([z.boolean(), z.string()]).optional(),
});

