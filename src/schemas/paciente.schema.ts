import z from "zod";

export const createPatientSchema = z.object({
  nombre: z
    .string({ message: "el nombre es Obligatorio!" })
    .min(3, "el nombre debe contener al menos 3 caracteres")
    .trim()
    .min(1),
  apellidos: z
    .string({ message: "los apellidos son Obligatorios!" })
    .min(3, "los apellidos debe contener al menos 3 caracteres")
    .trim()
    .min(1),
  edad: z
    .number({ message: "La edad es Obligatorio!" })
    .nonnegative("la edad Tiene que ser 0(CERO) o mayor "),
  telefono: z
    .string({ message: "El telefono es Obligatorio!" })
    .trim()
    .regex(/^\+[0-9-]+$/, {
      message:
        "El teléfono debe empezar con + y contener solo números y guiones",
    })
    .max(18)
    .min(1),
  seguro_medico: z.boolean().default(true),
});

export interface pacienteQueryParams {
  page?: string;
  limit?: string;
  searchName?: string;
  searchLstName?: string;
  minAge?: string;
  maxAge?: string;
  seguro_medico?: string;
}

export const updatePatientSchema = z.object({
  nombre: z
    .string({ error: "El nombre debe ser texto" })
    .trim()
    .min(3, "El nombre debe contener al menos 3 caracteres")
    .optional(),

  apellidos: z
    .string({ error: "Los apellidos deben ser texto, no números" })
    .trim()
    .min(3, "Los apellidos deben contener al menos 3 caracteres")
    .optional(),

  edad: z
    .number({ error: "La edad debe ser un número" })
    .nonnegative("La edad debe ser 0 o mayor")
    .optional(),

  telefono: z
    .string({ error: "El teléfono debe ser texto" })
    .trim()
    .regex(/^\+[0-9-]+$/, {
      message:
        "El teléfono debe empezar con + y contener solo números y guiones",
    })
    .max(18, "El teléfono es muy largo")
    .optional(),

  seguro_medico: z
    .boolean({ error: "seguro_medico debe ser verdadero o falso" })
    .optional(),
});
