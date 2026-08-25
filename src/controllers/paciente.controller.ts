import type { Request, Response } from "express";
import { PatientModel } from "../models/paciente.model.js";

export async function getPatients(req: Request, res: Response) {
  // #swagger.tags = ['Pacientes']
  // #swagger.summary = 'Ver todos los Pacientes'
  try {
    const paciente = await PatientModel.findAll();
    res.json({ totalPacientes: paciente.length, data: paciente });
  } catch (error) {
    console.error("error al consultar PostgreSQL: ");
    res.status(500).json({
      message: "error al intentar conectar a la base de datos :c",
    });
  }
}

export async function getPatientsById(req: Request, res: Response) {
  // #swagger.tags = ['Pacientes']
  // #swagger.summary = 'Ver todos los Pacientes por ID'
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ error: "el Id debe ser numerico" });
      return;
    }
    const paciente = await PatientModel.findById(id);
    if (!paciente) {
      res.status(400).json({ error: "Paciente no encotnrado" });
      return;
    }
    res.json({ data: paciente });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

export async function postPatients(req: Request, res: Response) {
  // #swagger.tags = ['Pacientes']
  // #swagger.summary = 'Crear un nuevo Paciente'
  try {
    const { nombre, apellidos, edad, telefono, seguro_medico } = req.body;
    if (!nombre || !apellidos || !edad || !telefono) {
      res.status(400).json({ error: "faltan datos que son obligatorios" });
    }
    const nuevoPaciente = await PatientModel.create({
      nombre,
      apellidos,
      edad,
      telefono,
      seguro_medico,
    });
    res.status(201).json({ data: nuevoPaciente });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

export async function putPatientsById(req: Request, res: Response) {
  // #swagger.tags = ['Pacientes']
  // #swagger.summary = 'Actualizar un Paciente'
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ error: "El ID debe ser un numero" });
    }
    const pacienteUpdate = await PatientModel.update(id, req.body);
    if (!pacienteUpdate) {
      res.status(404).json({ error: "Paciente no encontrado" });
      return;
    }
    res.json({ data: pacienteUpdate });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

export async function deletePatientByID(req: Request, res: Response) {
  // #swagger.tags = ['Pacientes']
  // #swagger.summary = 'Eliminar un Paciente'
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ error: "El ID debe se un numero" });
    }
    const pacienteEliminado = await PatientModel.delete(id);
    if (pacienteEliminado) {
      res.status(200).json({ message: "paciente eliminado exitosamente" });
    } else {
      res.status(404).json({ message: "paciente no encontrado" });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}
