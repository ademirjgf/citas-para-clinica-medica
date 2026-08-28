import type { Request, Response } from "express";
import { RecetaModel } from "../models/receta.model.js";
import { recetaService } from "../services/receta.service.js";
import type { recetaQueryParams } from "../schemas/recetas.schema.js";

export async function getRecetas(req: Request, res: Response) {
  try {
    const resultado = await recetaService.getRecetasFilters(
      req.query as recetaQueryParams,
    );
    res.json(resultado);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener las recetas" });
  }
}

export async function getRecetaById(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ error: "El id debe ser numerico" });
      return;
    }
    const receta = await RecetaModel.findById(id);
    if (!receta) {
      res.status(404).json({ error: "Receta no encontrada" });
      return;
    }
    res.json({ data: receta });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener la receta" });
  }
}

export async function postReceta(req: Request, res: Response) {
  try {
    const { citaId, medicamentos, indicaciones, fechaEmision } = req.body;
    const nuevaReceta = await recetaService.createReceta(
      citaId,
      medicamentos,
      indicaciones,
      fechaEmision,
    );
    res.status(201).json({ data: nuevaReceta });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al crear la receta" });
  }
}

export async function putReceta(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ error: "El id debe ser numerico" });
      return;
    }
    const recetaActualizada = await RecetaModel.update(id, req.body);
    if (!recetaActualizada) {
      res.status(404).json({ error: "Receta no encontrada" });
      return;
    }
    res.json({ data: recetaActualizada });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al actualizar la receta" });
  }
}
export async function deleteReceta(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ error: "El id debe ser numerico" });
      return;
    }
    const eliminado = await RecetaModel.delete(id);
    if (!eliminado) {
      res.status(404).json({ error: "Receta no encontrada" });
      return;
    }
    res.status(200).json({ message: "Receta eliminada exitosamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al eliminar la receta" });
  }
}
