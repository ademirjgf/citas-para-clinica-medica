//datos de un medico
export interface Medico {
    id: number;
    nombre: string;
    especialidad: string;
    telefono: string;
    turno: "mañana" | "tarde"; // o |
    activo: boolean;
}