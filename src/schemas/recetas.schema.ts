import { z } from "zod";

export const createRecetaSchema = z.object({
  citaId: z
    .number({ message: "El citaId debe ser obligatorio" })
    .int("el citaId debe ser un numero entero")
    .positive("el citaId debe ser mayor a 0"),
  medicamentos: z
    .array(z.string().trim().min(1, "el medicamento no puede estar vacio"))
    .min(1, "debes indicar al menos un medicamento"),
  indicaciones: z.string().trim().optional(),
  fechaEmision: z.string().optional(),
});

export const updateRecetaSchema = z
  .object({
    medicamentos: z
      .array(z.string().trim().min(1, "el medicamento no puede estar vacio"))
      .min(1, "debes indicar al menos un medicamento")
      .optional(),
    indicaciones: z.string().trim().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "Debes enviar al menos un campo para actualizar",
  });

export interface recetaQueryParams {
  page?: string;
  limit?: string;
  citaId?: string;
  search?: string;
}
