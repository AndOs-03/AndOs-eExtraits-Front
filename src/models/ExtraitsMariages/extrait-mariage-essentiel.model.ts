import {PersonneExtraitMariage} from "./personne-extrait-mariage.model.ts";

export class ExtraitMariageEssentielVM {

  readonly id!: number | null;
  readonly annee!: number | null;
  readonly numeroRegistre!: string | null;
  readonly registre!: string | null;
  readonly dateMariage!: string | null;
  readonly registreN!: string | null;
  readonly epoux!: PersonneExtraitMariage | null;
  readonly epouse!: PersonneExtraitMariage | null;
}
