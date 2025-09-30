import {
  PersonneExtraitNaissance
} from "../../models/ExtraitsNaissances/personne-extrait-naissance.model.ts";

export class ModifierExtraitNaissanceCommande {

  id!: number | null;
  annee!: number | null;
  numeroRegistre!: string | null;
  dateRegistre!: string | null;
  etatCivil!: string | null;
  centreEtatCivil!: string | null;
  registreN!: string | null;
  numeroJugementSupletif!: string | null;
  dateJugementSupletif!: string | null;
  tribunalJugementSupletif!: string | null;
  extraitTypeTPI!: boolean | null;
  nouveauModel!: boolean | null;
  centreId!: number | null;
  personne!: PersonneExtraitNaissance | null;

  constructor(annee: number) {
    this.annee = annee;
  }
}