import { Router } from "express";
import type { Request, Response } from "express";
import { pool } from "../config/db.js";

export const pacientesRouter = Router();

// GET /patients  (?citaId=1 para filtrar por cita)
export async function getpatients(req: Request, res: Response) {
  try {
    const result = await pool.query("SELECT * FROM pacientes");
    res.json({
      message: "conexion exitosa",
      total: result.rowCount,
      data: result.rows,
    });
  } catch (error) {
    console.log("error al consultar en postgres");
    res
      .status(500)
      .json({ message: "error al conectar con la base de datos " });
  }
}

// GET /pacientes/:id
export async function getPatientsById(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ error: "el Id debe ser in valor numerico" });
    }
    const resu = await pool.query("SELECT * FROM pacientes WHERE id= $1", [id]);
    if (resu.rows.length === 0) {
      res.status(404).json({ error: "pacientes no encontrado" });
      return;
    }
    res.json(resu.rows[0]);
  } catch (error) {
    res.status(500).json({
      error: "error del servidor, mala conexion con la base de datos",
    });
  }
}
// POST /recetas  { citaId, medicamentos, indicaciones, fechaEmision }
export async function postPatients(req: Request, res: Response) {
  try {
    const { nombre, apellidos, edad, telefono, seguro_medico } = req.body;
    if (!nombre || !apellidos || !edad || !telefono || !seguro_medico) {
      res.status(400).json({ message: "faltan datos obligatorios" });
    }
    const query = `INSERT INTO pacientes (nombre, apellidos, edad, telefono, seguro_medico) VALUES ($1,$2,$3,$4,$5) RETURNING * ;`;
    const result = await pool.query(query, [
      nombre,
      apellidos,
      edad,
      telefono,
      seguro_medico,
    ]);
    res.status(200).json(result.rows[0]);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

// PUT /Paciente/:id  { medicamentos?, indicaciones? }
export async function putPatientsById(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ error: "el Id debe ser in valor numerico" });
    }
    const resu = await pool.query("SELECT * FROM pacientes WHERE id= $1", [id]);
    if (resu.rows.length === 0) {
      res.status(404).json({ error: "paciente no encontrado" });
      return;
    }
    const { nombre, apellidos, edad, telefono, seguro_medico } = req.body;
    if (!nombre || !apellidos || !edad || !telefono || !seguro_medico) {
      res.status(400).json({ message: "faltan datos obligatorios" });
    }
    const query = `UPDATE pacientes
            SET nombre = $1,
            apellidos = $2,
            edad = $3,
            telefono = $4,
            seguro_medico = $5
            WHERE id = $6
            RETURNING *;
`;
    const result = await pool.query(query, [
      nombre,
      apellidos,
      edad,
      telefono,
      seguro_medico,
      id,
    ]);
    res.status(202).json(result.rows[0]);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

// DELETE /pacientes/:id
export async function deletePatientByID(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ error: "El id Debe de ser un valor Numerico" });
    }
    const resu = await pool.query("DELETE FROM pacientes WHERE id = $1;", [id]);
    res.status(200).json({ message: "paciente eliminado exitosamente" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}
