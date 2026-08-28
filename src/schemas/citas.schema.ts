import { z } from "zod";

export const createCitaSchema = z.object({
    paciente_id: z.number("El paciente_id debe ser un numero"),
    medico_id:z.number("El medico_id debe ser un numero"),
    fecha_hora:z.string("La fecha debe estar en el formato YYYY-MM-DD").trim().min(1),
    motivo:z.string("Motivo invalido").trim().min(1),
    estado:z.enum(['confirmada', 'cancelada', 'completada']),
});

export const updateCitaSchema = createCitaSchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: "Debes enviar al menos un campo para actualizar",
  });

export interface citasQueryParams {
  page?: string;
  limit?: string;
  search?: string;
  minFecha?: string;
  maxFecha?: string;
}