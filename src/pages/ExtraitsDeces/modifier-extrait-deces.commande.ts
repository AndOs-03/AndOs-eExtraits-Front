import {SituationMatrimoniale} from "../../models/situation-matrimoniale.ts";
import {ParentExtrait} from "../../models/parents-extrait.model.ts";

export class ModifierExtraitDecesCommande {

  id!: number | null;
  annee!: number | null;
  numeroRegistre!: string | null;
  dateRegistre!: string | null;
  dateDeces!: string | null;
  lieuDeces!: string | null;
  nom!: string | null;
  prenoms!: string | null;
  nationalite!: string | null;
  profession!: string | null;
  domicile!: string | null;
  dateNaissance!: string | null;
  lieuNaissance!: string | null;
  etatCivil!: string | null;
  centreEtatCivil!: string | null;
  registreN!: string | null;
  situationMatrimoniale!: SituationMatrimoniale | null;
  pere!: ParentExtrait | null;
  mere!: ParentExtrait | null;

  constructor(annee: number) {
    this.annee = annee;
  }
}