import { Router } from "express";
import { pool } from "../db.js"; //pool para consultas a postgreSql

//router para médicos
const medicosRouter = Router();

//endpoint obtener todos los médicos
medicosRouter.get("/", async (_req, res) => {
    const result = await pool.query("SELECT * FROM medicos");

    res.json(result.rows);
});



export { medicosRouter}; //exporto el router para poder usarlo en index.ts