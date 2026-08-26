import { pool } from "../config/db.js";
import type { Medico } from "./medico.types.js";

//Modelo para realizar consultas relacionadas con médicos
export const MedicoModel = {
    findAll: async () => {
        const result = await pool.query(
            "SELECT * FROM medicos ORDER BY id"
        );

        return result.rows;
    },

    findById: async (id: number) => {
        const result = await pool.query(
            "SELECT * FROM medicos WHERE id = $1", [id]
        );

        return result.rows[0] ?? null; //devolvemos el médico encontrado, si no existe devuelve null
    },

    create: async (dato: Omit<Medico, "id">) => {
        const result = await pool.query(
            `INSERT INTO medicos (nombre, especialidad, telefono, turno, activo)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *`,
            [
                dato.nombre,
                dato.especialidad,
                dato.telefono,
                dato.turno,
                dato.activo
            ]
        );

        return result.rows[0]; //devolvemos el medico creado
    },

    update: async (
        id: number,
        dato: { turno: Medico["turno"]; telefono: string | null; activo: boolean }) => {
            const result = await pool.query(
                `UPDATE medicos
                SET turno = $1, telefono = $2, activo = $3
                WHERE id = $4
                RETURNING *`,
                [dato.turno, dato.telefono, dato.activo, id]
            );

            return result.rows[0] ?? null; //devolvemos el médico actualizado y si no existe, devuelve null
        },

    delete: async (id: number) => {
        const result = await pool.query(
            "DELETE FROM medicos WHERE id = $1", [id]
        );

        return (result.rowCount ?? 0) > 0;
    },  


    
};

