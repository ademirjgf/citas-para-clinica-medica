//datos de un medico
export interface Medico {
    id: number;
    nombre: string;
    especialidad: string;
    telefono: string | null; //puede no tener telefono
    turno: "mañana" | "tarde"; // o |
    activo: boolean;
}