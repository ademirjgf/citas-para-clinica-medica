import { Router } from "express";
import {
  getRecetas,
  getRecetaById,
  postReceta,
  putReceta,
  deleteReceta,
} from "../controllers/recetas.controller.js";

const router = Router();

router.get("/", getRecetas);
router.get("/:id", getRecetaById);
router.post("/", postReceta);
router.put("/:id", putReceta);
router.delete("/:id", deleteReceta);

export default router;