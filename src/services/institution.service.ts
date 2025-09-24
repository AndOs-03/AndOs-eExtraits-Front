import {apiMethodes} from "../api/apiMethodes.ts";
import {ENDPOINTS} from "../api/endpoints";
import {ApiError} from "../api/types.ts";
import {InstitutionVM} from "../models/institution.model.ts";
import {EditerInstitutionCommande} from "../pages/Institutions/editer-institution.commande.ts";

export const fetchInstitutions = async (): Promise<ApiError | InstitutionVM[]> => {
  return await apiMethodes.get<InstitutionVM[]>(ENDPOINTS.institutions.list());
};

export const editeInstitutions = async (institution: EditerInstitutionCommande): Promise<ApiError | InstitutionVM> => {
  return await apiMethodes.post<InstitutionVM>(ENDPOINTS.institutions.create(), institution);
};

export const supprimerInstitution = async (id: number): Promise<ApiError | InstitutionVM> => {
  return await apiMethodes.delete<InstitutionVM>(ENDPOINTS.institutions.delete(id));
};

export const recupererInstitution = async (id: number): Promise<ApiError | InstitutionVM> => {
  return await apiMethodes.get<InstitutionVM>(ENDPOINTS.institutions.get(id));
};
