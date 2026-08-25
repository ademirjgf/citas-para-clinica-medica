import fs from "fs";
import swaggerUi from "swagger-ui-express";
import { pacientesRouter } from "./routes/pacientes.routes.js";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import recetasRouter from "./routes/recetas.routes.js";
import { medicosRouter } from "./routes/medicos.routes.js";
import citasRouter from "./routes/citas.routes.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const swaggerFile = JSON.parse(
  fs.readFileSync(new URL("../swagger-output.json", import.meta.url), "utf-8")
);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerFile));

app.use("/pacientes", pacientesRouter);
app.use("/recetas", recetasRouter);
app.use("/medicos", medicosRouter);
app.use("/citas", citasRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});