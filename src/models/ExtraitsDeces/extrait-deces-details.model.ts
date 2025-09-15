import {SituationMatrimoniale} from "../situation-matrimoniale.ts";
import {ParentExtrait} from "../parents-extrait.model.ts";

export class ExtraitDecesDetailsVM {

  readonly id: number;
  readonly annee: number;
  readonly numeroRegistre: string;
  readonly dateRegistre: string;
  readonly registre: string;
  readonly dateDeces: string;
  readonly lieuDeces: string;
  readonly nom: string;
  readonly prenoms: string;
  readonly nationalite: string;
  readonly profession: string;
  readonly domicile: string;
  readonly dateNaissance: string;
  readonly lieuNaissance: string;
  readonly etatCivil: string;
  readonly centreEtatCivil: string;
  readonly registreN: string;
  readonly situationMatrimoniale: SituationMatrimoniale;
  readonly pere: ParentExtrait;
  readonly mere: ParentExtrait;
}
