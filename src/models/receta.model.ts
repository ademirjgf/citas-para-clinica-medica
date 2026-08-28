import { pool } from "../config/db.js";

export interface Receta {
  id: number;
  citaId: number;
  medicamentos: string[];
  indicaciones: string | null;
  fechaEmision: string;
}

export interface CrearRecetaInput {
  citaId: number;
  medicamentos: string[];
  indicaciones?: string;
  fechaEmision?: string;
}

export interface ActualizarRecetaInput {
  medicamentos?: string[];
  indicaciones?: string;
}

export interface paginaResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

function mapRow(row: any): Receta {
  return {
    id: row.id,
    citaId: row.cita_id,
    medicamentos: row.medicamentos,
    indicaciones: row.indicaciones,
    fechaEmision: row.fecha_emision,
  };
}

export const RecetaModel = {
  findAll: async (citaId?: number): Promise<Receta[]> => {
    const result = citaId
      ? await pool.query("SELECT * FROM recetas WHERE cita_id = $1 ORDER BY id", [citaId])
      : await pool.query("SELECT * FROM recetas ORDER BY id");
    return result.rows.map(mapRow);
  },

  findById: async (id: number): Promise<Receta | null> => {
    const result = await pool.query("SELECT * FROM recetas WHERE id = $1", [id]);
    return result.rows[0] ? mapRow(result.rows[0]) : null;
  },

  create: async (dato: CrearRecetaInput): Promise<Receta> => {
    const { citaId, medicamentos, indicaciones, fechaEmision } = dato;
    const result = await pool.query(
      `INSERT INTO recetas (cita_id, medicamentos, indicaciones, fecha_emision)
       VALUES ($1, $2, $3, COALESCE($4::date, CURRENT_DATE))
       RETURNING *`,
      [citaId, medicamentos, indicaciones ?? null, fechaEmision ?? null]
    );
    return mapRow(result.rows[0]);
  },

  update: async (id: number, dato: ActualizarRecetaInput): Promise<Receta | null> => {
    const { medicamentos, indicaciones } = dato;
    const result = await pool.query(
      `UPDATE recetas
       SET medicamentos = COALESCE($1::text[], medicamentos),
           indicaciones = COALESCE($2, indicaciones)
       WHERE id = $3
       RETURNING *`,
      [medicamentos ?? null, indicaciones ?? null, id]
    );
    return result.rows[0] ? mapRow(result.rows[0]) : null;
  },

  delete: async (id: number): Promise<boolean> => {
    const result = await pool.query("DELETE FROM recetas WHERE id = $1", [id]);
    return (result.rowCount ?? 0) > 0;
  },

  findWithFilter: async (
    page: number,
    limit: number,
    citaId?: number,
    search?: string,
  ): Promise<paginaResult<Receta>> => {
    const offset = (page - 1) * limit;
    const condiciones: string[] = [];
    const valores: any[] = [];
    let contador = 1;

    if (citaId) {
      condiciones.push(`cita_id = $${contador}`);
      valores.push(citaId);
      contador++;
    }

    if (search) {
      condiciones.push(
        `EXISTS (SELECT 1 FROM unnest(medicamentos) AS med WHERE med ILIKE $${contador})`
      );
      valores.push(`%${search}%`);
      contador++;
    }

    const whereClause = condiciones.length > 0 ? `WHERE ${condiciones.join(" AND ")}` : "";

    const totalResult = await pool.query(
      `SELECT COUNT(*) FROM recetas ${whereClause}`,
      valores,
    );
    const total = Number(totalResult.rows[0].count);

    const dataResult = await pool.query(
      `SELECT * FROM recetas ${whereClause} ORDER BY id LIMIT $${contador} OFFSET $${contador + 1}`,
      [...valores, limit, offset],
    );

    return {
      data: dataResult.rows.map(mapRow),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  },
};