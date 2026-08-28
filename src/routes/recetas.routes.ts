import { Router } from "express";
import {
  getRecetas,
  getRecetaById,
  postReceta,
  putReceta,
  deleteReceta,
} from "../controllers/recetas.controller.js";
import { ValidateSchema } from "../middleware/validador.middleware.js";
import { createRecetaSchema, updateRecetaSchema } from "../schemas/recetas.schema.js";

const router = Router();

router.get("/", getRecetas);
router.get("/:id", getRecetaById);
router.post("/", ValidateSchema(createRecetaSchema), postReceta);
router.put("/:id", ValidateSchema(updateRecetaSchema), putReceta);
router.delete("/:id", deleteReceta);

export default router;
