import type { Request, Response } from "express";
import {
  PatientModel,
  type UpdatePatientInput,
} from "../models/paciente.model.js";
import {
  createPatientSchema,
  updatePatientSchema,
} from "../schemas/paciente.schema.js";

import { pacientService } from "../services/paciente.service.js";

export async function getPatients(req: Request, res: Response) {
  // #swagger.tags = ['Pacientes']
  // #swagger.summary = 'Ver todos los Pacientes'
  try {
    const result = await pacientService.getPatienFilter(req.query);
    res.json(result);
  } catch (error) {
    console.error("error al consultar PostgreSQL:");
    res.status(500).json({
      message: "error al intentar conectar a la base de datos",
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
    const resultado = createPatientSchema.safeParse(req.body);
    if (!resultado.success) {
      return res.status(400).json({ error: resultado.error.issues });
    }
    const { nombre, apellidos, edad, telefono, seguro_medico } = resultado.data;
    const nuevoPaciente = await pacientService.createPatient(
      nombre,
      apellidos,
      edad,
      telefono,
      seguro_medico,
    );
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
      return res.status(400).json({ error: "El ID debe ser un número" });
    }
    const validacion = updatePatientSchema.safeParse(req.body);
    if (!validacion.success) {
      return res.status(400).json({ error: validacion.error.issues });
    }

    // ✅ SOLO enviamos los campos que SÍ tienen valor
    const entrada = validacion.data;
    const datosParaEnviar: Partial<UpdatePatientInput> = {};

    if (entrada.nombre) datosParaEnviar.nombre = entrada.nombre;
    if (entrada.apellidos) datosParaEnviar.apellidos = entrada.apellidos;
    if (entrada.edad !== undefined) datosParaEnviar.edad = entrada.edad;
    if (entrada.telefono) datosParaEnviar.telefono = entrada.telefono;
    if (entrada.seguro_medico !== undefined)
      datosParaEnviar.seguro_medico = entrada.seguro_medico;

    const pacienteUpdate = await PatientModel.update(id, datosParaEnviar);

    if (!pacienteUpdate) {
      return res.status(404).json({ error: "Paciente no encontrado" });
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
