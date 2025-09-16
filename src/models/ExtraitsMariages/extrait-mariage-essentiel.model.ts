import {PersonneExtraitMariage} from "../personne-extrait-mariage.model.ts";

export class ExtraitMariageEssentielVM {

  readonly id: number;
  readonly annee: number;
  readonly numeroRegistre: string;
  readonly registre: string;
  readonly dateMariage: string;
  readonly registreN: string;
  readonly epoux: PersonneExtraitMariage;
  readonly epouse: PersonneExtraitMariage;
}
