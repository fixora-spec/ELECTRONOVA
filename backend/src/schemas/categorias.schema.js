import * as z from "zod";

export const categoriaSchema = z.object({
  nombre: z
    .string({ required_error: "El nombre de la categoría es obligatorio." })
    .trim()
    .min(2, "El nombre debe tener al menos 2 caracteres."),
  descripcion: z.string().optional(),
  estado: z.union([z.boolean(), z.string()]).optional(),
});
