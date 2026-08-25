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
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fs from "fs";
import swaggerUi from "swagger-ui-express";
import recetasRouter from './routes/recetas.routes.js';
import { medicosRouter } from "./routes/medicos.routes.js";
import { citasRouter } from "./routes/citas.routes.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const swaggerFile = JSON.parse(
  fs.readFileSync(new URL("../swagger-output.json", import.meta.url), "utf-8")
);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerFile));

app.get("/pacientes", getpatients);
app.get("/pacientes/:id", getPatientsById);
app.post("/pacientes", postPatients);
app.put("/pacientes/:id", putPatientsById);
app.delete("/pacientes/:id", deletePatientByID);
app.use("/recetas", recetasRouter);
app.use("/medicos", medicosRouter); //conectamos las rutas de médicos
app.use("/citas", citasRouter);

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
