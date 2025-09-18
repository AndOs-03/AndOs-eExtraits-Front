import {
  PersonneExtraitNaissance
} from "../../models/ExtraitsNaissances/personne-extrait-naissance.model.ts";

export class ModifierExtraitNaissanceCommande {

  id: number | null;
  annee: number | null;
  numeroRegistre: string | null;
  dateRegistre: string | null;
  etatCivil: string | null;
  centreEtatCivil: string | null;
  registreN?: string;
  numeroJugementSupletif?: string;
  dateJugementSupletif?: string;
  tribunalJugementSupletif?: string;
  extraitTypeTPI: boolean;
  nouveauModel: boolean;
  centreId?: number | null;
  personne?: PersonneExtraitNaissance;
}