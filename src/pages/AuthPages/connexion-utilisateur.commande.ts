export class ConnexionCommande {

  nomUtilisateur: string;
  motPasse: string;

  constructor(nomUtilisateur: string, motPasse: string) {
    this.nomUtilisateur = nomUtilisateur;
    this.motPasse = motPasse;
  }
}
