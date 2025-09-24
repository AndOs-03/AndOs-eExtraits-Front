import {InstitutionActif} from "../pages/Institutions/types.ts";

export function recupererInstitutionActif(): InstitutionActif | null {
  try {
    const institutionActif = localStorage.getItem("eExtraitInstitutionActif");
    if (!institutionActif) return null;
    return JSON.parse(institutionActif) as InstitutionActif;
  } catch (err) {
    console.error("Erreur lors de la récupération de institutionActif : ", err);
    return null;
  }
}