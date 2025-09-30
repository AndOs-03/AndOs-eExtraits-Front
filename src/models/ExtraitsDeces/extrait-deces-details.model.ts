import {SituationMatrimoniale} from "../situation-matrimoniale.ts";
import {ParentExtrait} from "../parents-extrait.model.ts";

export class ExtraitDecesDetailsVM {

  readonly id!: number | null;
  readonly annee!: number | null;
  readonly numeroRegistre!: string | null;
  readonly dateRegistre!: string | null;
  readonly registre!: string | null;
  readonly dateDeces!: string | null;
  readonly lieuDeces!: string | null;
  readonly nom!: string | null;
  readonly prenoms!: string | null;
  readonly nationalite!: string | null;
  readonly profession!: string | null;
  readonly domicile!: string | null;
  readonly dateNaissance!: string | null;
  readonly lieuNaissance!: string | null;
  readonly etatCivil!: string | null;
  readonly centreEtatCivil!: string | null;
  readonly registreN!: string | null;
  readonly situationMatrimoniale!: SituationMatrimoniale | null;
  readonly pere!: ParentExtrait | null;
  readonly mere!: ParentExtrait | null;
}
