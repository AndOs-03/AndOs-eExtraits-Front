export class CreerUtilisateurCommande {

  nom: string;
  prenom: string;
  nomUtilisateur: string;
  motPasse: string;
  email!: string | null;

  constructor(nom: string, prenom: string, nomUtilisateur: string, motPasse: string) {
    this.nom = nom;
    this.prenom = prenom;
    this.nomUtilisateur = nomUtilisateur;
    this.motPasse = motPasse;
  }
}
