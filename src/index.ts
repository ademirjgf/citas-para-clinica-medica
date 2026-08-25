import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { recetasRouter } from './routes/recetas.routes.js';
import citasRouter from "./routes/citas.routes.js"
import {
  deletePatientByID,
  getpatients,
  getPatientsById,
  pacientesRouter,
  postPatients,
  putPatientsById,
} from "./routes/pacientes.routes.js";
import { pool } from "./config/db.js";
import type { Request, Response } from "express";
import { totalmem } from "node:os";
import { json } from "node:stream/consumers";
import { Result } from "pg";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use('/recetas', recetasRouter);
app.use('/citas',citasRouter);
app.get("/pacientes", getpatients);
app.get("/pacientes/:id", getPatientsById);
app.post("/pacientes", postPatients);
app.put("/pacientes/:id", putPatientsById);
app.delete("/pacientes/:id", deletePatientByID);
app.use("/recetas", recetasRouter);
app.use("/medicos", medicosRouter); //conectamos las rutas de médicos
app.use("/citas", citasRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
