import { pool } from "./config/db.js";
import type { Request, Response } from "express";
import totalmem from "node:os";
import { Result } from "pg";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fs from "fs";
import swaggerUi from "swagger-ui-express";
import recetasRouter from './routes/recetas.routes.js';
import { medicosRouter } from "./routes/medicos.routes.js";
import citasRouter from "./routes/citas.routes.js";
import {
  getPatients,
  getPatientsById,
  postPatients,
  putPatientsById,
  deletePatientByID,
} from "./controllers/paciente.controller.js";

dotenv.config();

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

const swaggerFile = JSON.parse(
  fs.readFileSync(new URL("../swagger-output.json", import.meta.url), "utf-8")
);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerFile));

app.get("/pacientes", getPatients);
app.get("/pacientes/:id", getPatientsById);
app.post("/pacientes", postPatients);
app.put("/pacientes/:id", putPatientsById);
app.delete("/pacientes/:id", deletePatientByID);
app.use("/recetas", recetasRouter);
app.use("/medicos", medicosRouter);
app.use("/citas", citasRouter);

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
