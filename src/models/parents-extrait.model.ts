import {TypeParent} from "./type-parent.ts";

export class ParentExtrait {

  nomPrenoms: string;
  typeParent?: TypeParent

  constructor(nomPrenoms: string) {
    this.nomPrenoms = nomPrenoms;
  }
}
