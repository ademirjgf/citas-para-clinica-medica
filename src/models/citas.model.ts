import type { z } from "zod";
import { pool } from "../config/db.js";
import type { updateCitaSchema } from "../schemas/citas.schema.js";


export interface citaMedica{
    id: number;
    paciente_id: number;
    medico_id: number;
    fecha_hora: string;
    motivo: string;
    estado: string;
}

export interface paginaResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export type createCitaInput = Omit<citaMedica, "id">;
export type updateCitaInput = z.infer<typeof updateCitaSchema>;

export const citaModel = {
    findAll: async (): Promise<citaMedica[]> => {
        const { rows } = await pool.query(
            "SELECT * FROM citas ORDER BY id ASC;",
        );
        return rows;
    },
    findById: async (id: number): Promise<citaMedica | null> => {
    const { rows } = await pool.query(
      "SELECT * FROM citas WHERE id = $1;",
      [id],
    );
    return rows[0] || null;
    },
    create: async (dato: createCitaInput): Promise<citaMedica> => {
    const { paciente_id, medico_id, fecha_hora, motivo, estado } = dato;
    const query =
      "INSERT INTO citas (paciente_id, medico_id, fecha_hora, motivo, estado) VALUES ($1,$2,$3,$4,$5) RETURNING *;";
    const { rows } = await pool.query(query, [paciente_id, medico_id, fecha_hora, motivo, estado]);
    return rows[0];
  },
  findFechaByquery: async(fecha:any): Promise<citaMedica[]> =>{
    const query =
        `
      SELECT *
      FROM citas
      WHERE TO_CHAR(fecha_hora, 'YYYY-MM-DD HH24:MI:SS')
      LIKE $1`;
    const result = await pool.query(query, [`%${fecha}%`]);
    return result.rows;
  },
  update: async (
    id: number,
    dato: updateCitaInput,
  ): Promise<citaMedica | null> => {
    const { rows } = await pool.query(
      `UPDATE citas
            SET paciente_id = $1,
            medico_id = $2,
            fecha_hora = $3,
            motivo = $4,
            estado = $5
            WHERE id = $6
            RETURNING *;
`,
      [dato.paciente_id ?? (await pool.query('SELECT paciente_id FROM citas WHERE id = $1 ',[id])).rows[0].paciente_id,
        dato.medico_id ?? (await pool.query('SELECT medico_id FROM citas WHERE id = $1 ',[id])).rows[0].medico_id,
        dato.fecha_hora ?? (await pool.query('SELECT fecha_hora FROM citas WHERE id = $1 ',[id])).rows[0].fecha_hora,
        dato.motivo ?? (await pool.query('SELECT motivo FROM citas WHERE id = $1 ',[id])).rows[0].motivo,
        dato.estado ?? (await pool.query('SELECT estado FROM citas WHERE id = $1 ',[id])).rows[0].estado,
        id],
    );
    return rows[0] || null;
  },
  delete: async (id: number): Promise<boolean> => {
    const { rowCount } = await pool.query(
      "DELETE FROM citas WHERE id = $1;",
      [id],
    );
    return (rowCount ?? 0) > 0;
  },
  findByName: async (estado: string): Promise<citaMedica | null> => {
    const { rows } = await pool.query<citaMedica>(
      "SELECT * FROM citas WHERE LOWER(estado) = LOWER($1);",
      [estado],
    );
    return rows[0] || null;
  },
    findWhitFilter: async (
      page: number = 1,
      limit: number = 10,
      search?: string,
      minFecha?: string,
      maxFecha?: string,
    ): Promise<paginaResult<citaMedica>> => {

    const conditions: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    // Filtro por estado
    if (search) {
      conditions.push(`estado ILIKE $${paramIndex}`);
      paramIndex++;
      values.push(`%${search}%`);
    }

    // Fecha mínima
    if (minFecha !== undefined) {
      conditions.push(`fecha_hora >= $${paramIndex}`);
      paramIndex++;
      values.push(minFecha);
    }

    // Fecha máxima
    if (maxFecha !== undefined) {
      conditions.push(`fecha_hora <= $${paramIndex}`);
      paramIndex++;
      values.push(maxFecha);
    }

    // WHERE
    const whereUnited =
      conditions.length > 0
        ? `WHERE ${conditions.join(" AND ")}`
        : "";

    // COUNT
    const countQuery = `
      SELECT COUNT(*)
      FROM citas
      ${whereUnited}
    `;

    const countResult = await pool.query(countQuery, values);

    const total = Number(countResult.rows[0].count);

    // Paginación
    const offset = (page - 1) * limit;

    const dataValues = [...values, limit, offset];

    const dataQuery = `
      SELECT *
      FROM citas
      ${whereUnited}
      ORDER BY id ASC
      LIMIT $${paramIndex}
      OFFSET $${paramIndex + 1}
    `;

    const { rows } = await pool.query(dataQuery, dataValues);

    return {
      data: rows,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1,
    };
  }
}