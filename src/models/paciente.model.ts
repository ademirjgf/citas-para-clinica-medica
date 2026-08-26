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
export type UpdatePatientInput = {
  nombre?: string;
  apellidos?: string;
  edad?: number;
  telefono?: string;
  seguro_medico?: boolean;
};

//FUNCIONES Q CONSULTAN A LA BASE DE DATOS
export const PatientModel = {
  findAll: async (seguro_medico?: string): Promise<Paciente[]> => {
    let consulta = "SELECT * FROM pacientes";
    let valores: boolean[] = []; // ✅ LET en lugar de CONST

    if (seguro_medico !== undefined) {
      const valor = seguro_medico.toLowerCase();
      if (valor !== "true" && valor !== "false") {
        throw new Error("seguro_medico debe ser true o false");
      }
      const filtro = valor === "true";
      consulta += " WHERE seguro_medico = $1";
      valores = [filtro]; // ✅ Mejor así en lugar de push
    }

    consulta += " ORDER BY id ASC"; // ✅ Sin punto y coma aquí

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
    const { nombre, apellidos, edad, telefono, seguro_medico } = dato;
    const query =
      "INSERT INTO pacientes (nombre , apellidos, edad, telefono, seguro_medico) VALUES ($1,$2,$3,$4,$5) RETURNING *;";
    const { rows } = await pool.query(query, [
      nombre,
      apellidos,
      edad,
      telefono,
      seguro_medico,
    ]);
    return rows[0];
  },
  update: async (
    id: number,
    dato: UpdatePatientInput,
  ): Promise<Paciente | null> => {
    //ir armando la consulta DINÁMICAMENTE
    const campos: string[] = [];
    const valores: any[] = [];
    let indice = 1;

    //Solo agrega el campo si VIENE en el dato
    if (dato.nombre !== undefined) {
      campos.push(`nombre = $${indice}`);
      valores.push(dato.nombre);
      indice++;
    }
    if (dato.apellidos !== undefined) {
      campos.push(`apellidos = $${indice}`);
      valores.push(dato.apellidos);
      indice++;
    }
    if (dato.edad !== undefined) {
      campos.push(`edad = $${indice}`);
      valores.push(dato.edad);
      indice++;
    }
    if (dato.telefono !== undefined) {
      campos.push(`telefono = $${indice}`);
      valores.push(dato.telefono);
      indice++;
    }
    if (dato.seguro_medico !== undefined) {
      campos.push(`seguro_medico = $${indice}`);
      valores.push(dato.seguro_medico);
      indice++;
    }

    //Si NO envió NINGÚN campo
    if (campos.length === 0) {
      throw new Error("Debes enviar al menos un dato para actualizar");
    }

    //Agregamos el ID al final
    valores.push(id);

    //Armado de la consulta final
    const consulta = `
    UPDATE pacientes
    SET ${campos.join(", ")}
    WHERE id = $${indice}
    RETURNING *;
  `;

    const { rows } = await pool.query(consulta, valores);
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
