import {PersonneExtraitNaissance} from "./personne-extrait-naissance.model.ts";
import {Centre} from "../../pages/Centres/types.ts";

export class ExtraitNaissanceDetailsVM {

  readonly id!: number | null;
  readonly annee!: number | null;
  readonly numeroRegistre!: string | null;
  readonly dateRegistre!: string | null;
  readonly registre!: string | null;
  readonly numeroJugementSupletif!: string | null;
  readonly dateJugementSupletif!: string | null;
  readonly tribunalJugementSupletif!: string | null;
  readonly extraitTypeTPI!: boolean | null;
  readonly etatCivil!: string | null;
  readonly centreEtatCivil!: string | null;
  readonly registreN!: string | null;
  readonly nouveauModel!: boolean | null;
  readonly centre!: Centre | null;
  readonly personne!: PersonneExtraitNaissance | null;
}
