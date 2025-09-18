import {PersonneExtraitMariage} from "../../models/ExtraitsMariages/personne-extrait-mariage.model.ts";

export class ModifierExtraitMariageCommande {

  id: number | null;
  annee: number | null;
  numeroRegistre: string | null;
  dateRegistre: string | null;
  dateMariage: string | null;
  etatCivil: string | null;
  centreEtatCivil: string | null;
  registreN?: string;
  epoux?: PersonneExtraitMariage;
  epouse?: PersonneExtraitMariage;
}