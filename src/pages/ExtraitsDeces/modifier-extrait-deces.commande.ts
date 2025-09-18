import {SituationMatrimoniale} from "../../models/situation-matrimoniale.ts";
import {ParentExtrait} from "../../models/parents-extrait.model.ts";

export class ModifierExtraitDecesCommande {

  id: number | null;
  annee: number | null;
  numeroRegistre: string | null;
  dateRegistre: string | null;
  dateDeces: string | null;
  lieuDeces?: string;
  nom: string | null;
  prenoms: string | null;
  nationalite?: string;
  profession?: string;
  domicile?: string;
  dateNaissance: string | null;
  lieuNaissance?: string;
  etatCivil: string | null;
  centreEtatCivil: string | null;
  registreN?: string;
  situationMatrimoniale: SituationMatrimoniale | null;
  pere?: ParentExtrait;
  mere?: ParentExtrait;
}