import {ParentExtrait} from "../parents-extrait.model.ts";
import {MentionsEventuelle} from "./mentions-eventuelle.model.ts";

export class PersonneExtraitNaissance {

  nom: string;
  prenoms: string;
  dateNaissance: string;
  lieuNaissance: string;
  sexe: string;
  mentionsEventuelle?: MentionsEventuelle;
  pere?: ParentExtrait;
  mere?: ParentExtrait;

  constructor(nom: string, prenoms: string, dateNaissance: string, lieuNaissance: string, sexe: string) {
    this.nom = nom;
    this.prenoms = prenoms;
    this.dateNaissance = dateNaissance;
    this.lieuNaissance = lieuNaissance;
    this.sexe = sexe;
  }
}
