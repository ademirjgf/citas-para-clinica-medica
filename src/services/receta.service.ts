import { RecetaModel } from "../models/receta.model.js";
import type { recetaQueryParams } from "../schemas/recetas.schema.js";
import type {
  paginaResult,
  Receta,
} from "../models/receta.model.js";

export const recetaService = {
  createReceta: async function (
    citaId: number,
    medicamentos: string[],
    indicaciones?: string,
    fechaEmision?: string,
  ): Promise<Receta> {
    // limpiar espacios vacios al inicio y final de cada medicamento e indicaciones
    const cleanMedicamentos = medicamentos.map((med) => med.trim());
    const cleanIndicaciones = indicaciones?.trim();

    // exactOptionalPropertyTypes no deja asignar "undefined" a una prop opcional:
    // solo se puede omitir. Por eso se arma el objeto con spread condicional.
    return await RecetaModel.create({
      citaId,
      medicamentos: cleanMedicamentos,
      ...(cleanIndicaciones !== undefined && { indicaciones: cleanIndicaciones }),
      ...(fechaEmision !== undefined && { fechaEmision }),
    });
  },
  getRecetasFilters: async (
    query: recetaQueryParams,
  ): Promise<paginaResult<Receta>> => {
    let page = 1;
    let limit = 10;
    if (query.page) {
      page = Number(query.page);
    }
    if (query.limit) {
      limit = Number(query.limit);
    }
    const citaId = query.citaId ? Number(query.citaId) : undefined;
    const search = query.search?.trim();

    return await RecetaModel.findWithFilter(page, limit, citaId, search);
  },
};
