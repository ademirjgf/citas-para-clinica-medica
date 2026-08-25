import { Router } from "express";
import {
  deletePatientByID,
  getPatients,
  getPatientsById,
  postPatients,
  putPatientsById,
} from "../controllers/paciente.controller.js";

export const pacientesRouter = Router();

//Rutas

pacientesRouter.get("/", getPatients);
pacientesRouter.get("/:id", getPatientsById);
pacientesRouter.post("/", postPatients);
pacientesRouter.put("/:id", putPatientsById);
pacientesRouter.delete("/:id", deletePatientByID);
