export class JwtTokenModel {

  readonly id!: string | null;
  readonly nomUtilisateur!: string | null;
  readonly nomComplet!: string | null;
  readonly token!: string | null;
  readonly expirer!: boolean | null;
  readonly revoquer!: boolean | null;
  readonly userId!: number | null;
}