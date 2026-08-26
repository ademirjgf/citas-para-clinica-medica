import type { Request, Response } from "express";
import { MedicoModel } from "../models/medico.model.js";

//obtenemos todos los médicos
export async function getMedicos(req: Request, res: Response) {
    try{
        const medicos = await MedicoModel.findAll();

        res.json({ total: medicos.length, data: medicos });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al obtener los médicos"});
    }
}

//obtenemos un médico por su id
export async function getMedicoById(req: Request, res: Response) {
    try{
        const id = Number(req.params.id);

        if (isNaN(id)) {
            res.status(400).json({ error: "El id debe ser numérico"});
            return;
        }

        const medico = await MedicoModel.findById(id);

        if (!medico) {
            res.status(404).json({ error: "Médico no encontrado" });
            return;
        }

        res.json({ data: medico });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al obtener el médico" });
    }
}

//creamos un nuevo médico
export async function postMedico(req: Request, res: Response) {
    try {
        const { nombre, especialidad, telefono, turno, activo } = req.body;

        //verificamos que estén los datos obligatorios
        if (!nombre || !especialidad || !turno) {
            res.status(400).json({
                error: "nombre, especialidad y turno son obligatorios"
            });
            return;
        }  

        const nuevoMedico = await MedicoModel.create({
            nombre,
            especialidad,
            telefono: telefono ?? null,
            turno,
            activo: activo ?? true
        });

        res.status(201).json({ data: nuevoMedico });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al crear al médico"});
    }
}

//actualizamos los datos de un médico
export async function putMedico(req: Request, res: Response) {
    try {
        const id = Number(req.params.id);

        //verificamos que el id sea de tipo number
        if (isNaN(id)) {
            res.status(400).json({ error: "El id debe ser numérico"});
            return;
        }

        const { turno, telefono, activo } = req.body;

        //actualizamos el médico usando el model
        const medicoActualizado = await MedicoModel.update(id,{
            turno,
            telefono: telefono ?? null,
            activo
        });

        //verificamos si el médico existe
        if (!medicoActualizado) {
            res.status(404).json({ error: "Médico no encontrado"});
            return;
        }

        res.json({ data: medicoActualizado });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al actualizar el médico" });
    }
}

//eliminamos un médico
export async function deleteMedico(req: Request, res: Response) {
    try {
        const id = Number(req.params.id);

        //verificamos que el id sea de tipo number
        if (isNaN(id)) {
            res.status(400).json({ error: "El id debe ser numérico" });
            return;
        }

        //eliminamos el médico con el módel
        const eliminado = await MedicoModel.delete(id);

        //verificamos que el médico exista
        if (!eliminado) {
            res.status(404).json({ error: "Médico no encontrado" });
            return;
        }

        res.status(200).json({
            message: "Médico eliminado exitosamente"
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al eliminar el médico" });
    }

}








