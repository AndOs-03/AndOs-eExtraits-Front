export class InstitutionVM {

  readonly id!: number | null;
  readonly departement!: string | null;
  readonly centreEtatCivil!: string | null;
  readonly etatCivil!: string | null;
  readonly tribunal!: string | null;
  readonly ville!: string | null;
  readonly officier!: string | null;
  readonly titreOfficier!: string | null

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
