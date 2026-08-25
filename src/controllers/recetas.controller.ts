import type { Request, Response } from "express";
import { RecetaModel } from "../models/receta.model.js";

export async function getRecetas(req: Request, res: Response) {
  try {
    const citaId = req.query.citaId ? Number(req.query.citaId) : undefined;
    const recetas = await RecetaModel.findAll(citaId);
    res.json({ total: recetas.length, data: recetas });
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
    if (!citaId || !Array.isArray(medicamentos) || medicamentos.length === 0) {
      res.status(400).json({ error: "citaId y medicamentos (array) son obligatorios" });
      return;
    }
    const nuevaReceta = await RecetaModel.create({ citaId, medicamentos, indicaciones, fechaEmision });
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
    const { medicamentos, indicaciones } = req.body;
    const recetaActualizada = await RecetaModel.update(id, { medicamentos, indicaciones });
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