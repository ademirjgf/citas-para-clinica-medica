import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fs from "fs";
import swaggerUi from "swagger-ui-express";
import recetasRouter from "./routes/recetas.routes.js";
import { medicosRouter } from "./routes/medicos.routes.js";
import citasRouter from "./routes/citas.routes.js";
import { pacientesRouter } from "./routes/pacientes.routes.js";

dotenv.config();

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const swaggerFile = JSON.parse(
  fs.readFileSync(new URL("../swagger-output.json", import.meta.url), "utf-8"),
);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerFile));

app.use("/pacientes", pacientesRouter);
app.use("/recetas", recetasRouter);
app.use("/medicos", medicosRouter);
app.use("/citas", citasRouter);

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
