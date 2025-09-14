import {Centre} from "../pages/Centres/types.ts";

export function recupererCentreActif(): Centre | null {
  try {
    const centreActif = localStorage.getItem("eExtraitCentreActif");
    if (!centreActif) return null;
    return JSON.parse(centreActif) as Centre;
  } catch (err) {
    console.error("Erreur lors de la récupération du centreActif : ", err);
    return null;
  }
}