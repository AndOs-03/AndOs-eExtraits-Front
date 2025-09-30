import {TypeParent} from "./type-parent.ts";

export class ParentExtrait {

  nomPrenoms!: string | null;
  typeParent!: TypeParent | null

  constructor(nomPrenoms: string) {
    this.nomPrenoms = nomPrenoms;
  }
}
