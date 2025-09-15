import {ENDPOINTS} from "../api/endpoints";
import {ApiError} from "../api/types.ts";
import {apiExtraitsDeces} from "../api/apiExtraitsDeces.ts";
import {ExtraitDecesEssentielVM} from "../models/ExtraitsDeces/extrait-deces-essentiel.model.ts";
import {ExtraitDecesDetailsVM} from "../models/ExtraitsDeces/extrait-deces-details.model.ts";
import {CreerExtraitDecesCommande} from "../pages/ExtraitsDeces/creer-extrait-deces.commande.ts";
import {
  ModifierExtraitDecesCommande
} from "../pages/ExtraitsDeces/modifier-extrait-deces.commande.ts";

export const listerExtraitsDeces = async (): Promise<ApiError | ExtraitDecesEssentielVM[]> => {
  return await apiExtraitsDeces.get<ExtraitDecesEssentielVM[]>(ENDPOINTS.extraitsDeces.list());
};

export const creerExtraitsDeces = async (commande: CreerExtraitDecesCommande): Promise<ApiError | ExtraitDecesDetailsVM> => {
  return await apiExtraitsDeces.post<ExtraitDecesDetailsVM>(ENDPOINTS.extraitsDeces.create(), commande);
};

export const modifierExtraitsDeces = async (commande: ModifierExtraitDecesCommande): Promise<ApiError | ExtraitDecesDetailsVM> => {
  return await apiExtraitsDeces.put<ExtraitDecesDetailsVM>(ENDPOINTS.extraitsDeces.update(), commande);
};

export const supprimerExtraitsDeces = async (id: number): Promise<ApiError | ExtraitDecesDetailsVM> => {
  return await apiExtraitsDeces.delete<ExtraitDecesDetailsVM>(ENDPOINTS.extraitsDeces.delete(id));
};

export const recupererExtraitDeces = async (id: number): Promise<ApiError | ExtraitDecesDetailsVM> => {
  return await apiExtraitsDeces.get<ExtraitDecesDetailsVM>(ENDPOINTS.extraitsDeces.get(id));
};

export const recupererExtraitDecesParRegistre = async (registre: string): Promise<ApiError | ExtraitDecesDetailsVM> => {
  return await apiExtraitsDeces.get<ExtraitDecesDetailsVM>(ENDPOINTS.extraitsDeces.getByRegistre(registre));
};
