import type { Request, Response } from "express";
import { citaModel } from "../models/citas.model.js";
import {
  createCitaSchema,
  updateCitaSchema,
} from "../schemas/citas.schema.js";
import { citaService } from "../schemas/citas.service.js";

export async function getCitas(req: Request, res: Response) {
  // #swagger.tags = ['Citas']
  // #swagger.summary = 'Ver todas las Citas'
  try {
     const result = await citaService.getCitasFilters(req.query);
    res.json(result);
  } catch (error) {
    console.error("error al consultar PostgreSQL: ");
    res.status(500).json({
      message: "error al intentar conectar a la base de datos :c",
    });
  }
}

export async function getCitasById(req: Request, res: Response) {
  // #swagger.tags = ['Citas']
  // #swagger.summary = 'Ver la Cita por Id'
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ error: "el Id debe ser numerico" });
      return;
    }
    const cita = await citaModel.findById(id);
    if (!cita) {
      res.status(400).json({ error: "cita no encontrada" });
      return;
    }
    res.json({ data: cita });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

export async function getCitasByFecha(req: Request, res: Response) {
    try {
      const  fecha_hora  = req.query;

      if (!fecha_hora) {
        return res.status(400).json({
          error: "Falta el parámetro fecha_hora",
        });
        }
        const cita = await citaModel.findFechaByquery(fecha_hora);
        res.json({ totalCitas: cita.length, data: cita });
        return;
    } catch (error) {
      console.error("Error al consultar PostgreSQL:", error);

      res.status(500).json({
        message: "Error al intentar conectar a la base de datos :c",
      });
    }
}

export async function postCita(req: Request, res: Response) {
  // #swagger.tags = ['Citas']
  // #swagger.summary = 'Crear una nueva Cita'
  try {
    const result = createCitaSchema.safeParse(req.body);
    console.log(result);

    if (!result.success) {
      return res.status(400).json({ error: result.error.issues });
    }
    const newCita = await citaModel.create(result.data);
    res.status(201).json({ data: newCita });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

export async function putCita(req: Request, res: Response) {
  // #swagger.tags = ['Citas']
  // #swagger.summary = 'Modificar la Cita por Id'
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ error: "EL ID DEBE SER UN VALOR NUMERICO" });
      return;
    }

    const result = updateCitaSchema.safeParse(req.body);
    if (!result.success) {
      res.status(400).json({ error: result.error.issues });
      return;
    }

    const productoUpdate = await citaModel.update(id, result.data);
    if (!productoUpdate) {
      res.status(404).json({ error: "producto no encontrado" });
      return;
    }
    res.json({ data: productoUpdate });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

export async function deleteCita(req: Request, res: Response) {
  // #swagger.tags = ['Citas']
  // #swagger.summary = 'Eliminar la Cita por Id'
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ error: "EL ID DEBE SER UN VALOR NUMERICO" });
    }
    const citaEliminada = await citaModel.delete(id);
    if (citaEliminada) {
      res.status(200).json({ message: "cita eliminada exitosamente" });
    } else {
      res.status(404).json({ message: "cita no encontrada" });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}