import {ENDPOINTS} from "../api/endpoints";
import {ApiError} from "../api/types.ts";
import {apiExtraitsMariages} from "../api/apiExtraitsMariages.ts";
import {ExtraitDecesDetailsVM} from "../models/ExtraitsDeces/extrait-deces-details.model.ts";
import {
  ExtraitMariageEssentielVM
} from "../models/ExtraitsMariages/extrait-mariage-essentiel.model.ts";
import {
  CreerExtraitMariageCommande
} from "../pages/ExtraitsMariages/creer-extrait-mariage.commande.ts";
import {ExtraitMariageDetailsVM} from "../models/ExtraitsMariages/extrait-mariage-details.model.ts";
import {
  ModifierExtraitMariageCommande
} from "../pages/ExtraitsMariages/modifier-extrait-mariage.commande.ts";

export const listerExtraitsMariages = async (): Promise<ApiError | ExtraitMariageEssentielVM[]> => {
  return await apiExtraitsMariages.get<ExtraitMariageEssentielVM[]>(ENDPOINTS.extraitsMariages.list());
};

export const creerExtraitsMariages = async (commande: CreerExtraitMariageCommande): Promise<ApiError | ExtraitMariageDetailsVM> => {
  return await apiExtraitsMariages.post<ExtraitMariageDetailsVM>(ENDPOINTS.extraitsMariages.create(), commande);
};

export const modifierExtraitsMariages = async (commande: ModifierExtraitMariageCommande): Promise<ApiError | ExtraitMariageDetailsVM> => {
  return await apiExtraitsMariages.put<ExtraitMariageDetailsVM>(ENDPOINTS.extraitsMariages.update(), commande);
};

export const supprimerExtraitsMariages = async (id: number): Promise<ApiError | ExtraitMariageDetailsVM> => {
  return await apiExtraitsMariages.delete<ExtraitMariageDetailsVM>(ENDPOINTS.extraitsMariages.delete(id));
};

export const recupererExtraitMariages = async (id: number): Promise<ApiError | ExtraitMariageDetailsVM> => {
  return await apiExtraitsMariages.get<ExtraitMariageDetailsVM>(ENDPOINTS.extraitsMariages.get(id));
};

export const recupererExtraitMariagesParRegistre = async (registre: string): Promise<ApiError | ExtraitDecesDetailsVM> => {
  return await apiExtraitsMariages.get<ExtraitDecesDetailsVM>(ENDPOINTS.extraitsMariages.getByRegistre(registre));
};
