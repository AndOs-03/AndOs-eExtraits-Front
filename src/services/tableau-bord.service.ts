import {apiMethodes} from "../api/apiMethodes";
import {ENDPOINTS} from "../api/endpoints";
import {ApiError} from "../api/types.ts";
import {TableauBordExtraitsVM} from "../models/tableau-bord-extraits.model.ts";

export const tableauBordExtraits = async (institutionId: number | null): Promise<ApiError | TableauBordExtraitsVM> => {
  return await apiMethodes.get<TableauBordExtraitsVM>(ENDPOINTS.tableauBord.tableauBordExtraits(institutionId));
};
