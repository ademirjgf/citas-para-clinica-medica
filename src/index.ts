import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import {
  deletePatientByID,
  getpatients,
  getPatientsById,
  pacientesRouter,
  postPatients,
  putPatientsById,
} from "./routes/pacientes.routes.js";
import { pool } from "./db.js";
import type { Request, Response } from "express";
import { totalmem } from "node:os";
import { json } from "node:stream/consumers";
import { Result } from "pg";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

dotenv.config();

app.use(cors());
app.use(express.json());

app.get("/pacientes", getpatients);
app.get("/pacientes/:id", getPatientsById);
app.post("/pacientes", postPatients);
app.put("/pacientes/:id", putPatientsById);
app.delete("/pacientes/:id", deletePatientByID);

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
