import { Router } from "express";
import type { Request, Response } from "express";
import { pool } from "../config/db.js";
import type { citaFiltrada } from "../models/citas.types.js";

export const citasRouter = Router();

citasRouter.get("/", async function (req: Request, res: Response) {
  try {
    const result = await pool.query("SELECT * FROM citas;");
    res.json({
      message: "Conexion exitosa a la base de datos :D",
      total: result.rowCount,
      data: result.rows,
    });
  } catch (error) {
    console.error("error al consultar PostgreSQL: ");
    res.status(500).json({
      message: "error al intentar conectar a la base de datos :c",
    });
  }
});

citasRouter.get(
  "/fecha",
  async function (req: Request<{}, {}, {}, citaFiltrada>, res: Response) {
    try {
      const { fecha_hora } = req.query;

      if (!fecha_hora) {
        return res.status(400).json({
          error: "Falta el parámetro fecha_hora",
        });
      }

      const query = `
      SELECT *
      FROM citas
      WHERE TO_CHAR(fecha_hora, 'YYYY-MM-DD HH24:MI:SS')
      LIKE $1
    `;

      const result = await pool.query(query, [`%${fecha_hora}%`]);

      res.status(200).json(result.rows);
    } catch (error) {
      console.error("Error al consultar PostgreSQL:", error);

      res.status(500).json({
        message: "Error al intentar conectar a la base de datos :c",
      });
    }
  },
);

citasRouter.put("/:id", async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ error: "EL ID DEBE SER UN VALOR NUMERICO" });
    }
    const resu = await pool.query("SELECT * FROM citas WHERE id =$1", [id]);
    if (resu.rows.length === 0) {
      res.status(404).json({ error: "Cita no encontrada" });
      return;
    }
    const { paciente_id, medico_id, fecha_hora, motivo, estado } = req.body;
    if (!paciente_id || !medico_id || !fecha_hora || !motivo || !estado) {
      res.status(400).json({ error: "faltan datos obligatorios" });
    }
    const query = `UPDATE citas
            SET paciente_id = $1,
            medico_id = $2,
            fecha_hora = $3
            motivo = $4,
            estado = $5,
            WHERE id = $6
            RETURNING *;
`;
    const result = await pool.query(query, [
      paciente_id,
      medico_id,
      fecha_hora,
      motivo,
      estado,
      id,
    ]);
    res.status(202).json(result.rows[0]);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

citasRouter.delete("/:id", async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ error: "EL ID DEBE SER UN VALOR NUMERICO" });
    }
    const resu = await pool.query("DELETE FROM citas WHERE id = $1;", [id]);
    res.status(200).json({ message: "producto eliminado exitosamente" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});
