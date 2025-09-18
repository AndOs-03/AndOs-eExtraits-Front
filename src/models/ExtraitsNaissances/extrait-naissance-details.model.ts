import {PersonneExtraitNaissance} from "./personne-extrait-naissance.model.ts";
import {Centre} from "../../pages/Centres/types.ts";

export class ExtraitNaissanceDetailsVM {

  readonly id: number;
  readonly annee: number;
  readonly numeroRegistre: string;
  readonly dateRegistre: string;
  readonly registre: string;
  readonly numeroJugementSupletif: string;
  readonly dateJugementSupletif: string;
  readonly tribunalJugementSupletif: string;
  readonly extraitTypeTPI: boolean;
  readonly etatCivil: string;
  readonly centreEtatCivil: string;
  readonly registreN: string;
  readonly nouveauModel: boolean;
  readonly centre: Centre;
  readonly personne: PersonneExtraitNaissance;
}
