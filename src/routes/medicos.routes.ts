import { Router } from "express";
import { getMedicos, getMedicoById, postMedico, putMedico, deleteMedico } from "../controllers/medico.controller.js"; 

//router para médicos
const medicosRouter: Router = Router();

//obtenemos todos los médicos
medicosRouter.get("/", getMedicos);

//obtenemos un médico por su id
medicosRouter.get("/:id", getMedicoById);

//creamos un nuevo médico
medicosRouter.post("/", postMedico);

//actualizamos un médico
medicosRouter.put("/:id", putMedico);

//eliminamos un médico
medicosRouter.delete("/:id", deleteMedico);

export { medicosRouter }; //exporto el router para poder usarlo en index.ts
