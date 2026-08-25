export interface citaMedica{
    id: number;
    paciente_id: number;
    medico_id: number;
    fecha_hora: string;
    motivo: string;
    estado: string;
}
export interface citaFiltrada{
    fecha_hora: string;
}

