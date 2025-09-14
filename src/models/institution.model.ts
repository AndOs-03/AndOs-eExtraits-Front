export class InstitutionVM {
  readonly id: number;
  readonly departement: string;
  readonly centreEtatCivil: string;
  readonly etatCivil: string;
  readonly tribunal: string;
  readonly ville!: string;
  readonly officier!: string;
  readonly titreOfficier!: string

  constructor(
      id: number,
      departement: string,
      centreEtatCivil: string,
      etatCivil: string,
      tribunal: string
  ) {
    this.id = id;
    this.departement = departement;
    this.centreEtatCivil = centreEtatCivil;
    this.etatCivil = etatCivil;
    this.tribunal = tribunal;
  }
}
