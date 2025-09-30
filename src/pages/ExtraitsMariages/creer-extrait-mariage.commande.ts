import {PersonneExtraitMariage} from "../../models/ExtraitsMariages/personne-extrait-mariage.model.ts";

export class CreerExtraitMariageCommande {

  annee!: number | null;
  numeroRegistre!: string | null;
  dateRegistre!: string | null;
  dateMariage!: string | null;
  etatCivil!: string | null;
  centreEtatCivil!: string | null;
  registreN!: string | null;
  epoux!: PersonneExtraitMariage | null;
  epouse!: PersonneExtraitMariage | null;

  constructor(annee: number) {
    this.annee = annee;
  }
}