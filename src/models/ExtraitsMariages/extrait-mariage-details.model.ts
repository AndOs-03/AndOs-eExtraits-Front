import {PersonneExtraitMariage} from "./personne-extrait-mariage.model.ts";

export class ExtraitMariageDetailsVM {

  readonly id: number;
  readonly annee: number;
  readonly numeroRegistre: string;
  readonly dateRegistre: string;
  readonly registre: string;
  readonly dateMariage: string;
  readonly etatCivil: string;
  readonly centreEtatCivil: string;
  readonly registreN: string;
  readonly epoux: PersonneExtraitMariage;
  readonly epouse: PersonneExtraitMariage;
}
