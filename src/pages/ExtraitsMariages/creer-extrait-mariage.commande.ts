import {PersonneExtraitMariage} from "../../models/personne-extrait-mariage.model.ts";

export class CreerExtraitMariageCommande {

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