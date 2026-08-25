import { Router } from "express";
import {
  getCitas,
  getCitasById,
  getCitasByFecha,
  postCita,
  putCita,
  deleteCita,
} from "../controllers/citas.controller.js";

const citasRouter = Router();

citasRouter.get("/", getCitas);
citasRouter.get("/:id", getCitasById);
citasRouter.post("/", postCita);
citasRouter.put("/:id", putCita);
citasRouter.delete("/:id", deleteCita);
citasRouter.get("/fecha", getCitasByFecha);

export default citasRouter;