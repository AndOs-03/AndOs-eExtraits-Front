import {apiMethodes} from "../api/apiMethodes";
import {ENDPOINTS} from "../api/endpoints";
import {ApiError} from "../api/types.ts";
import {JwtTokenModel} from "../models/Auth/jwt.token.model.ts";
import {ConnexionCommande} from "../pages/AuthPages/connexion-utilisateur.commande.ts";
import {CreerUtilisateurCommande} from "../pages/AuthPages/creer-compte-utilisateur.commande.ts";
import {UtilisateurVM} from "../models/Auth/utilisateur.model.ts";

export const login = async (commande: ConnexionCommande): Promise<ApiError | JwtTokenModel> => {
  return await apiMethodes.post<JwtTokenModel>(ENDPOINTS.auth.login(), commande);
};

export const register = async (commande: CreerUtilisateurCommande): Promise<ApiError | JwtTokenModel> => {
  return await apiMethodes.post<JwtTokenModel>(ENDPOINTS.auth.register(), commande);
};

export const recupererParNomUtilisateur = async (nomUtilisateur: string): Promise<ApiError | UtilisateurVM> => {
  return await apiMethodes.get<UtilisateurVM>(ENDPOINTS.auth.getByUsername(nomUtilisateur));
};

export const recupererParUtilisateurId = async (utilisateurId: number): Promise<ApiError | UtilisateurVM> => {
  return await apiMethodes.get<UtilisateurVM>(ENDPOINTS.auth.getByUserId(utilisateurId));
};
