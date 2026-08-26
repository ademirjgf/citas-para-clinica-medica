import { Router } from "express";
import { pool } from "../config/db.js"; //pool para consultas a postgreSql

//router para médicos
const medicosRouter: Router = Router();

//endpoint obtener todos los médicos
medicosRouter.get("/", async (req, res) => {
  const { especialidad } = req.query;

  //filtramos si se recibe especialidad
  if (especialidad) {
    const result = await pool.query(
      "SELECT * FROM medicos WHERE especialidad = $1",
      [especialidad], // Pasamos la especialidad de forma segura
    );

    return res.json(result.rows);
  }

  //si no se recibe especialidad, mostramos todos los medicos
  const result = await pool.query("SELECT * FROM medicos");

  res.json(result.rows);
});

//médico por su id
medicosRouter.get("/:id", async (req, res) => {
  const id = Number(req.params.id);

  const result = await pool.query(
    "SELECT * FROM medicos WHERE id = $1",
    [id], //$1", [id] permiten pasar el id de forma segura a la consulta sql
  );

  //verificamos si existe el medico
  if (result.rows.length === 0) {
    return res.status(404).json({
      mensaje: "Médico no encontrado",
    });
  }

  res.json(result.rows[0]); //devolvemos los datos del médico encontrado
});

//crear nuevo médico
medicosRouter.post("/", async (req, res) => {
  const { nombre, especialidad, turno, activo, telefono } = req.body;

  const result = await pool.query(
    `INSERT INTO medicos (nombre, especialidad, turno, activo, telefono)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *`,
    [nombre, especialidad, turno, activo, telefono],
  );

  res.status(201).json(result.rows[0]);
});

//actualizamos datos de un médico
medicosRouter.put("/:id", async (req, res) => {
  const id = Number(req.params.id);
  const { turno, telefono, activo } = req.body;

  const result = await pool.query(
    `UPDATE medicos
        SET turno = $1, telefono = $2, activo = $3
        WHERE id = $4
        RETURNING *`,
    [turno, telefono, activo, id],
  );

  //Verificamos si existe el medico
  if (result.rows.length === 0) {
    return res.status(404).json({
      mensaje: "Medico no encontrado",
    });
  }

  //devolvemos el médico actualizado
  res.json(result.rows[0]);
});

//eliminamos un medico por su id
medicosRouter.delete("/:id", async (req, res) => {
  const id = Number(req.params.id);

  const result = await pool.query(
    "DELETE FROM medicos WHERE id = $1 RETURNING *",
    [id], //pasamos el id de forma segura a la consulta sql
  );

  //verificamos si existe el médico
  if (result.rows.length === 0) {
    return res.status(404).json({
      mensaje: "Médico no encontrado",
    });
  }

  //confirmamos que el medico fue eliminado
  res.json({
    mensaje: "Medico eliminado correctamente",
    medico: result.rows[0],
  });
});

export { medicosRouter }; //exporto el router para poder usarlo en index.ts
