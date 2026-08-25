import { Router } from "express";
import type { Request, Response } from "express";
import { pool } from "../config/db.js";
import type { Receta } from "../models/receta.types.js";

export const recetasRouter = Router();

function mapRow(row: any): Receta {
  return {
    id: row.id,
    citaId: row.cita_id,
    medicamentos: row.medicamentos,
    indicaciones: row.indicaciones,
    fechaEmision: row.fecha_emision,
  };
}

// GET /recetas  (?citaId=1 para filtrar por cita)
recetasRouter.get("/", async (req: Request, res: Response) => {
  const { citaId } = req.query;
  try {
    const result = citaId
      ? await pool.query(
          "SELECT * FROM recetas WHERE cita_id = $1 ORDER BY id",
          [citaId],
        )
      : await pool.query("SELECT * FROM recetas ORDER BY id");
    res.json(result.rows.map(mapRow));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener las recetas" });
  }
});

// GET /recetas/:id
recetasRouter.get("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const result = await pool.query("SELECT * FROM recetas WHERE id = $1", [
      id,
    ]);
    if (result.rows.length === 0) {
      res.status(404).json({ error: "Receta no encontrada" });
      return;
    }
    res.json(mapRow(result.rows[0]));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener la receta" });
  }
});

// POST /recetas  { citaId, medicamentos, indicaciones, fechaEmision }
recetasRouter.post("/", async (req: Request, res: Response) => {
  const { citaId, medicamentos, indicaciones, fechaEmision } = req.body;

  if (!citaId || !Array.isArray(medicamentos) || medicamentos.length === 0) {
    res
      .status(400)
      .json({ error: "citaId y medicamentos (array) son obligatorios" });
    return;
  }

  try {
    const result = await pool.query(
      `INSERT INTO recetas (cita_id, medicamentos, indicaciones, fecha_emision)
       VALUES ($1, $2, $3, COALESCE($4::date, CURRENT_DATE))
       RETURNING *`,
      [citaId, medicamentos, indicaciones ?? null, fechaEmision ?? null],
    );
    res.status(201).json(mapRow(result.rows[0]));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al crear la receta" });
  }
});

// PUT /recetas/:id  { medicamentos?, indicaciones? }
recetasRouter.put("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const { medicamentos, indicaciones } = req.body;

  try {
    const existing = await pool.query("SELECT * FROM recetas WHERE id = $1", [
      id,
    ]);
    if (existing.rows.length === 0) {
      res.status(404).json({ error: "Receta no encontrada" });
      return;
    }

    const result = await pool.query(
      `UPDATE recetas
       SET medicamentos = COALESCE($1::text[], medicamentos),
           indicaciones = COALESCE($2, indicaciones)
       WHERE id = $3
       RETURNING *`,
      [medicamentos ?? null, indicaciones ?? null, id],
    );
    res.json(mapRow(result.rows[0]));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al actualizar la receta" });
  }
});

// DELETE /recetas/:id
recetasRouter.delete("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      "DELETE FROM recetas WHERE id = $1 RETURNING *",
      [id],
    );
    if (result.rows.length === 0) {
      res.status(404).json({ error: "Receta no encontrada" });
      return;
    }
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al eliminar la receta" });
  }
});
