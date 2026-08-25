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
};