import {ParentExtrait} from "../parents-extrait.model.ts";
import {MentionsEventuelle} from "./mentions-eventuelle.model.ts";

export class PersonneExtraitNaissance {

  nom!: string | null;
  prenoms!: string | null;
  dateNaissance!: string | null;
  lieuNaissance!: string | null;
  sexe!: string | null;
  mentionsEventuelle!: MentionsEventuelle | null;
  pere!: ParentExtrait | null;
  mere!: ParentExtrait | null;

  constructor(nom: string, prenoms: string, dateNaissance: string, lieuNaissance: string, sexe: string) {
    this.nom = nom;
    this.prenoms = prenoms;
    this.dateNaissance = dateNaissance;
    this.lieuNaissance = lieuNaissance;
    this.sexe = sexe;
  }
}
