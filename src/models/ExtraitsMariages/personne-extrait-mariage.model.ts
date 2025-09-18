import {ParentExtrait} from "../parents-extrait.model.ts";

export class PersonneExtraitMariage {

  nomPrenoms: string;
  dateNaissance: string;
  lieuNaissance: string;
  domicile?: string;
  pere?: ParentExtrait;
  mere?: ParentExtrait;

  constructor(nomPrenoms: string, dateNaissance: string, lieuNaissance: string) {
    this.nomPrenoms = nomPrenoms;
    this.dateNaissance = dateNaissance;
    this.lieuNaissance = lieuNaissance;
  }
}
