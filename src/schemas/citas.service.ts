import { citaModel } from "../models/citas.model.js";
import type { citasQueryParams } from "../schemas/citas.schema.js";
import type { paginaResult, citaMedica } from "../models/citas.model.js";

export const citaService = {
  getCitasFilters: async (
    query: citasQueryParams,
  ): Promise<paginaResult<citaMedica>> => {
    let page = 1;
    let limit = 10;
    if (query.page) {
      page = Number(query.page);
    }
    if (query.limit) {
      limit = Number(query.limit);
    }
    const search = query.search?.trim();
    const minPrice = query.minFecha //? Number(query.minFecha) : undefined;
    const maxPrice = query.maxFecha //? Number(query.maxFecha) : undefined;

    return await citaModel.findWhitFilter(
      page,
      limit,
      search,
      minPrice,
      maxPrice,
    );
  },
};