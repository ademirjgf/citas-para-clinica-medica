import { Router } from "express";
import {
  getRecetas,
  getRecetaById,
  postReceta,
  putReceta,
  deleteReceta,
} from "../controllers/recetas.controller.js";

const router = Router();

router.get("/", getRecetas /* #swagger.tags = ['Recetas'] #swagger.summary = 'Ver todas las recetas' */);
router.get("/:id", getRecetaById /* #swagger.tags = ['Recetas'] #swagger.summary = 'Ver una receta por ID' */);
router.post("/", postReceta /* #swagger.tags = ['Recetas'] #swagger.summary = 'Crear una nueva receta' */);
router.put("/:id", putReceta /* #swagger.tags = ['Recetas'] #swagger.summary = 'Actualizar una receta' */);
router.delete("/:id", deleteReceta /* #swagger.tags = ['Recetas'] #swagger.summary = 'Eliminar una receta' */);

export default router;