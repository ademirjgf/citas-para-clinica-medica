import { PatientModel } from "../models/paciente.model.js";
import type { pacienteQueryParams } from "../schemas/paciente.schema.js";
import type { paginaResult, Paciente } from "../models/paciente.model.js";

export const pacientService = {
  createPatient: async function (
    nombre: string,
    apellidos: string,
    edad: number,
    telefono: string,
    seguro_medico: boolean,
  ): Promise<Paciente> {
    // limpiar espacios vacios al final e inicio del nombre apellidos y telefono
    const cleanName = nombre.trim();
    const cleanlastname = apellidos.trim();
    const cleanphone = telefono.trim();

    //evitar q existan 2 productos q tengan el mismo nombre
    const patientExist = await PatientModel.findByName(nombre);
    if (patientExist) {
      throw new Error("El paciente ya existe");
    }
    return await PatientModel.create({
      nombre,
      apellidos,
      edad,
      telefono,
      seguro_medico,
    });
  },
  getPatienFilter: async (
    query: pacienteQueryParams,
  ): Promise<paginaResult<Paciente>> => {
    let page = 1;
    let limit = 10;
    if (query.page) {
      page = Number(query.page);
    }
    if (query.limit) {
      limit = Number(query.limit);
    }
    const searchName = query.searchName?.trim();
    const searchLstName = query.searchLstName?.trim();
    const minAge = query.minAge ? Number(query.minAge) : undefined;
    const maxAge = query.maxAge ? Number(query.maxAge) : undefined;
    const seguro_medico =
      typeof query.seguro_medico === "string"
        ? query.seguro_medico.toLowerCase() === "true"
        : undefined;

    return await PatientModel.findwithFilter(
      page,
      limit,
      searchName,
      searchLstName,
      minAge,
      maxAge,
      seguro_medico,
    );
  },
};
