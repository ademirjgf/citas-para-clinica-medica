import { create } from "node:domain";
import { pool } from "../config/db.js";

//TIPADO DE LA TABLA
export interface Paciente {
  id: number;
  nombre: string;
  apellidos: string;
  edad: number;
  telefono: string;
  seguro_medico: boolean;
}
// apartir de el tipado crear otros types
export type CreatePatientInput = Omit<Paciente, "id">;
export type UpdatePatientInput = Partial<CreatePatientInput>;

//FUNCIONES Q CONSULTAN A LA BASE DE DATOS
export const PatientModel = {
  findAll: async (seguro_medico?: string): Promise<Paciente[]> => {
    let consulta = "SELECT * FROM pacientes";
    const valores: boolean[] = [];

    if (seguro_medico !== undefined) {
      const valor = seguro_medico.toLowerCase();

      if (valor !== "true" && valor !== "false") {
        throw new Error("seguro_medico debe ser true o false");
      }

      const filtro = valor === "true";

      consulta += " WHERE seguro_medico = $1";
      valores.push(filtro);
    }

    consulta += " ORDER BY id ASC;";

    const { rows } = await pool.query(consulta, valores);

    return rows;
  },
  findById: async (id: number): Promise<Paciente | null> => {
    const { rows } = await pool.query(
      "SELECT * FROM pacientes WHERE id = $1;",
      [id],
    );
    return rows[0] || null;
  },
  create: async (dato: CreatePatientInput): Promise<Paciente> => {
    const { nombre, apellidos, edad, telefono } = dato;
    const query =
      "INSERT INTO pacientes (nombre , apellidos, edad, telefono, seguro_medico) VALUES ($1,$2,$3,$4,true) RETURNING *;";
    const { rows } = await pool.query(query, [
      nombre,
      apellidos,
      edad,
      telefono,
    ]);
    return rows[0];
  },
  update: async (
    id: number,
    dato: UpdatePatientInput,
  ): Promise<Paciente | null> => {
    const { rows } = await pool.query(
      `UPDATE pacientes
            SET nombre = $1,
            apellidos = $2,
            edad = $3,
            telefono = $4,
            seguro_medico = $5
            WHERE id = $6
            RETURNING *;
`,
      [
        dato.nombre,
        dato.apellidos,
        dato.edad,
        dato.telefono,
        dato.seguro_medico,
        id,
      ],
    );
    return rows[0] || null;
  },
  delete: async (id: number): Promise<boolean> => {
    const { rowCount } = await pool.query(
      "DELETE FROM pacientes WHERE id = $1;",
      [id],
    );
    return (rowCount ?? 0) > 0;
  },
};
