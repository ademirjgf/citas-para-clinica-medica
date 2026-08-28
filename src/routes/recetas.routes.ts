import { Router } from "express";
import {
  getRecetas,
  getRecetaById,
  postReceta,
  putReceta,
  deleteReceta,
} from "../controllers/recetas.controller.js";
import { ValidateSchema } from "../middleware/validador.middleware.js";
import {
  createRecetaSchema,
  updateRecetaSchema,
} from "../schemas/recetas.schema.js";

const router = Router();

router.get(
  "/",
  getRecetas /* #swagger.tags = ['Recetas'] #swagger.summary = 'Ver todas las recetas' */,
);
router.get(
  "/:id",
  getRecetaById /* #swagger.tags = ['Recetas'] #swagger.summary = 'Ver una receta por ID' */,
);
router.post(
  "/",
  ValidateSchema(createRecetaSchema),
  postReceta /* #swagger.tags = ['Recetas'] #swagger.summary = 'Crear una nueva receta' */,
);
router.put(
  "/:id",
  ValidateSchema(updateRecetaSchema),
  putReceta /* #swagger.tags = ['Recetas'] #swagger.summary = 'Actualizar una receta' */,
);
router.delete(
  "/:id",
  deleteReceta /* #swagger.tags = ['Recetas'] #swagger.summary = 'Eliminar una receta' */,
);

export default router;
