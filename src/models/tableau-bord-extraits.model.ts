export class TableauBordExtraitsVM {

  readonly nombreExtraitsDeces!: number | null;
  readonly nombreExtraitsMariages!: number | null;
  readonly nombreExtraitsNaissance!: number | null;

  constructor(
      nombreExtraitsDeces: number,
      nombreExtraitsMariages: number,
      nombreExtraitsNaissance: number
  ) {
    this.nombreExtraitsDeces = nombreExtraitsDeces;
    this.nombreExtraitsMariages = nombreExtraitsMariages;
    this.nombreExtraitsNaissance = nombreExtraitsNaissance;
  }
}
