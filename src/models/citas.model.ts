import { pool } from "../config/db.js";

export interface citaMedica{
    id: number;
    paciente_id: number;
    medico_id: number;
    fecha_hora: string;
    motivo: string;
    estado: string;
}

export type createCitaInput = Omit<citaMedica, "id">;
export type updateCitaInput = Partial<createCitaInput>;

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
      `UPDATE productos
            SET paciente_id = $1,
            medico_id = $2,
            fecha_hora = $3,
            motivo = $4,
            estado = $ 5
            WHERE id = $6
            RETURNING *;
`,
      [dato.paciente_id, dato.medico_id, dato.fecha_hora, dato.motivo, dato.estado, id],
    );
    return rows[0] || null;
  },
  delete: async (id: number): Promise<boolean> => {
    const { rowCount } = await pool.query(
      "DELETE FROM productos WHERE id = $1;",
      [id],
    );
    return (rowCount ?? 0) > 0;
  },
}