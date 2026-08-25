import { pool } from "./config/db.js";
import { totalmem } from "node:os";
import { json } from "node:stream/consumers";
import { Result } from "pg";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import recetasRouter from './routes/recetas.routes.js';
import { medicosRouter } from "./routes/medicos.routes.js";
import  citasRouter  from "./routes/citas.routes.js";
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use('/recetas', recetasRouter);
app.use('/citas',citasRouter);
app.use("/recetas", recetasRouter);
app.use("/medicos", medicosRouter); //conectamos las rutas de médicos


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
