export interface Receta {
  id: number;
  citaId: number;
  medicamentos: string[];
  indicaciones: string | null;
  fechaEmision: string;
}

export interface CrearRecetaInput {
  citaId: number;
  medicamentos: string[];
  indicaciones?: string;
  fechaEmision?: string;
}

export interface ActualizarRecetaInput {
  medicamentos?: string[];
  indicaciones?: string;
}
