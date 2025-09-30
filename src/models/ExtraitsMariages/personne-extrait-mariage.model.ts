import {ParentExtrait} from "../parents-extrait.model.ts";

export class PersonneExtraitMariage {

  nomPrenoms!: string | null;
  dateNaissance!: string | null;
  lieuNaissance!: string | null;
  domicile!: string | null;
  pere!: ParentExtrait | null;
  mere!: ParentExtrait | null;

  constructor(nomPrenoms: string, dateNaissance: string, lieuNaissance: string) {
    this.nomPrenoms = nomPrenoms;
    this.dateNaissance = dateNaissance;
    this.lieuNaissance = lieuNaissance;
  }
}
