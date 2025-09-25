export class JwtTokenModel {

  id: string;
  nomUtilisateur: string;
  nomComplet: string;
  token: string;
  expirer: boolean;
  revoquer: boolean;
  userId: number;
}