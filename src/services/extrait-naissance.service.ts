import {ENDPOINTS} from "../api/endpoints";
import {ApiError} from "../api/types.ts";
import {apiMethodes} from "../api/apiMethodes.ts";
import {
  ExtraitNaissanceEssentielVM
} from "../models/ExtraitsNaissances/extrait-naissance-essentiel.model.ts";
import {
  CreerExtraitNaissanceCommande
} from "../pages/ExtraitsNaissances/creer-extrait-naissance.commande.ts";
import {
  ExtraitNaissanceDetailsVM
} from "../models/ExtraitsNaissances/extrait-naissance-details.model.ts";
import {
  ModifierExtraitNaissanceCommande
} from "../pages/ExtraitsNaissances/modifier-extrait-naissance.commande.ts";

export const listerExtraitsNaissances = async (centreId: number): Promise<ApiError | ExtraitNaissanceEssentielVM[]> => {
  return await apiMethodes.get<ExtraitNaissanceEssentielVM[]>(ENDPOINTS.extraitsNaissances.list(centreId));
};

export const creerExtraitsNaissances = async (commande: CreerExtraitNaissanceCommande): Promise<ApiError | ExtraitNaissanceDetailsVM> => {
  return await apiMethodes.post<ExtraitNaissanceDetailsVM>(ENDPOINTS.extraitsNaissances.create(), commande);
};

export const modifierExtraitsNaissances = async (commande: ModifierExtraitNaissanceCommande): Promise<ApiError | ExtraitNaissanceDetailsVM> => {
  return await apiMethodes.put<ExtraitNaissanceDetailsVM>(ENDPOINTS.extraitsNaissances.update(), commande);
};

export const supprimerExtraitsNaissances = async (id: number): Promise<ApiError | ExtraitNaissanceDetailsVM> => {
  return await apiMethodes.delete<ExtraitNaissanceDetailsVM>(ENDPOINTS.extraitsNaissances.delete(id));
};

export const recupererExtraitNaissances = async (id: number): Promise<ApiError | ExtraitNaissanceDetailsVM> => {
  return await apiMethodes.get<ExtraitNaissanceDetailsVM>(ENDPOINTS.extraitsNaissances.get(id));
};

export const recupererExtraitNaissanceEssentiel = async (id: number): Promise<ApiError | ExtraitNaissanceEssentielVM> => {
  return await apiMethodes.get<ExtraitNaissanceEssentielVM>(ENDPOINTS.extraitsNaissances.getEssentiel(id));
};

export const recupererExtraitNaissancesParRegistre = async (centreId: number, registre: string): Promise<ApiError | ExtraitNaissanceDetailsVM> => {
  return await apiMethodes.get<ExtraitNaissanceDetailsVM>(ENDPOINTS.extraitsNaissances.getByRegistre(centreId, registre));
};

export const genererFichierExtrait = async (id: number, institutionId: number, centreId: number): Promise<ApiError | Blob> => {
  return await apiMethodes.getFile<any>(ENDPOINTS.extraitsNaissances.genererExtrait(id, institutionId, centreId));
};
