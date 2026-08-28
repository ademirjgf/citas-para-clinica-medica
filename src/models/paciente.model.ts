import { pool } from "../config/db.js";
import type { updatePatientSchema } from "../schemas/paciente.schema.js";
import type z from "zod";

//TIPADO DE LA TABLA
export interface Paciente {
  id: number;
  nombre: string;
  apellidos: string;
  edad: number;
  telefono: string;
  seguro_medico: boolean;
}

export interface paginaResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
// apartir de el tipado crear otros types
export type CreatePatientInput = Omit<Paciente, "id">;
export type UpdatePatientInput = z.infer<typeof updatePatientSchema>;

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
      "INSERT INTO pacientes (nombre , apellidos, edad, telefono, seguro_medico) VALUES ($1,$2,$3,$4,true) RETURNING *;";
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
  findByName: async (name: string): Promise<Paciente | null> => {
    const { rows } = await pool.query<Paciente>(
      "SELECT * FROM pacientes WHERE LOWER(nombre) = LOWER($1);",
      [name],
    );
    return rows[0] || null;
  },
  findwithFilter: async (
    page: number = 1,
    limit: number = 10,
    searchName?: string,
    searchLstName?: string,
    minAge?: number,
    maxAge?: number,
    seguro_medico?: boolean,
  ): Promise<paginaResult<Paciente>> => {
    const condition: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    //construccion de condiciones
    if (searchName) {
      condition.push(`nombre ILIKE $${paramIndex}`);
      paramIndex++;
      values.push(`%${searchName}%`);
    }
    if (searchLstName) {
      condition.push(`apellidos ILIKE $${paramIndex}`);
      paramIndex++;
      values.push(`%${searchLstName}%`);
    }
    if (minAge !== undefined) {
      condition.push(`edad >= $${paramIndex}`);
      paramIndex++;
      values.push(minAge);
    }
    if (maxAge) {
      condition.push(`edad <= $${paramIndex}`);
      paramIndex++;
      values.push(maxAge);
    }
    if (seguro_medico !== undefined) {
      condition.push(`seguro_medico = $${paramIndex}`);
      paramIndex++;
      values.push(seguro_medico);
    }

    const WhereTogether =
      condition.length > 0 ? ` WHERE ${condition.join(` AND `)}` : "";

    //conteo de pacientes
    const contQuery = `SELECT COUNT(*) FROM pacientes ${WhereTogether}`;
    const countResult = await pool.query(contQuery, values);
    const total = Number(countResult.rows[0].count);
    //consulta de datos con limit y offset
    const offset = (page - 1) * limit;
    //Agregamos limit y offset
    const dataValues = [...values, limit, offset];
    const query = `SELECT * FROM pacientes ${WhereTogether} ORDER BY id ASC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;

    const { rows } = await pool.query(query, dataValues);

    return {
      data: rows,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1,
    };
  },
};
