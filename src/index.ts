import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { recetasRouter } from './routes/recetas.routes.js';
import citasRouter from "./routes/citas.routes.js"

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/recetas', recetasRouter);
app.use('/citas',citasRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
