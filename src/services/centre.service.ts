import {apiMethodes} from "../api/apiMethodes";
import {ENDPOINTS} from "../api/endpoints";
import {Centre} from "../pages/Centres/types.ts";
import {ApiError} from "../api/types.ts";

export const fetchCentres = async (): Promise<ApiError | Centre[]> => {
  return await apiMethodes.get<Centre[]>(ENDPOINTS.centres.list());
};

export const createCentre = async (centre: any): Promise<ApiError | Centre> => {
  return await apiMethodes.post<Centre>(ENDPOINTS.centres.create(), centre);
};

export const updateCentre = async (centre: any): Promise<ApiError | Centre> => {
  return await apiMethodes.put<Centre>(ENDPOINTS.centres.update(), centre);
};

export const supprimerCentre = async (id: number): Promise<ApiError | Centre> => {
  return await apiMethodes.delete<Centre>(ENDPOINTS.centres.delete(id));
};
