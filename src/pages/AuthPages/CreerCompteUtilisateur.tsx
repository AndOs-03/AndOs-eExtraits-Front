import {useState} from "react";
import {Link, useNavigate} from "react-router";
import {EyeCloseIcon, EyeIcon, Spinner} from "../../icons";
import Label from "../../components/form/Label.tsx";
import Input from "../../components/form/input/InputField.tsx";
import Button from "../../components/ui/button/Button.tsx";
import {register} from "../../services/auth.service.ts";
import {setAccessToken} from "../../api/apiMethodes.ts";
import {CreerUtilisateurCommande} from "./creer-compte-utilisateur.commande.ts";
import ModalRetourAppelApi from "../../components/ui/modal/modal-retour-appel-api.tsx";

export default function CreerCompteUtilisateur() {

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [nom, setNom] = useState<string>("");
  const [prenom, setPrenom] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [nomUtilisateur, setNomUtilisateur] = useState<string>("");
  const [motPasse, setMotPasse] = useState<string>("");

  const [errorNom, setErrorNom] = useState<string | null>(null);
  const [errorPrenom, setErrorPrenom] = useState<string | null>(null);
  const [errorEmail, setErrorEmail] = useState<string | null>(null);
  const [errorUsername, setErrorUsername] = useState<string | null>(null);
  const [errorMotPasse, setErrorMotPasse] = useState<string | null>(null);

  const [isReponseApiOpen, setIsReponseApiOpen] = useState<boolean>(false)
  const [messageReponseApi, setMessageReponseApi] = useState<string>("")
  const [typeReponseApi, setTypeReponseApi] = useState<"success" | "error" | "">("")

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validationDuFormulaire()) {
      return;
    }

    setLoading(true);
    setErrorNom(null);
    setErrorPrenom(null);
    setErrorEmail(null);
    setErrorUsername(null);
    setErrorMotPasse(null);

    try {
      const commande = new CreerUtilisateurCommande(nom, prenom, nomUtilisateur, motPasse);
      commande.email = email;
      const reponse = await register(commande);
      if ("message" in reponse) {
        setLoading(false);
        setIsReponseApiOpen(true);
        setMessageReponseApi(reponse.message);
        setTypeReponseApi("error");
      } else {
        setIsReponseApiOpen(true);
        setMessageReponseApi("Compte crée avec succès !");
        setTypeReponseApi("success");
        setLoading(false);

        setNom("");
        setPrenom("");
        setEmail("");
        setNomUtilisateur("");
        setMotPasse("");
      }
    } catch (err: any) {
      setLoading(false);
      setIsReponseApiOpen(true);
      setMessageReponseApi(err);
      setTypeReponseApi("error");
    }
  }

  const validationDuFormulaire = (): boolean => {
    let isValid = true;

    if (!nom.trim() || nom.length < 3) {
      setErrorNom("Nom invalide !");
      isValid = false;
    }

    if (!prenom.trim() || prenom.length < 3) {
      setErrorPrenom("Prénom invalide !");
      isValid = false;
    }

    if (email !== "" && !validateEmail(email)) {
      setErrorEmail("Adresse email invalide !");
      isValid = false;
    }

    if (!nomUtilisateur.trim() || nomUtilisateur.length < 4) {
      setErrorUsername("Nom d'utilisateur invalide (minimum 4 caractères) !");
      isValid = false;
    }

    if (!motPasse.trim() || motPasse.length < 6) {
      setErrorMotPasse("Mot de passe invalide (minimum 6 caractères) !");
      isValid = false;
    }

    return isValid;
  }

  const validateEmail = (value: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(value);
  };

  const handleModalReponseApiClose = () => {
    setIsReponseApiOpen(false)
    setMessageReponseApi("")
    setTypeReponseApi("")
  }

  return (
      <div className="flex items-center justify-center min-h-screen w-screen bg-gray-200">
        <div className="w-full max-w-md">
          <div className="p-5 m-5 rounded-lg shadow-lg bg-white">

            <div>
              <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
                Créer un compte
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Remplissez le formulaire !
              </p>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200 dark:border-gray-800"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="p-2 text-gray-400 bg-white dark:bg-gray-900 sm:px-5 sm:py-2">
                  ---
                </span>
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="space-y-6">
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div className="sm:col-span-1">
                    <Label>
                      Nom<span className="text-error-500">*</span>
                    </Label>
                    <Input
                        value={nom}
                        onChange={(e) => {
                          const value = e.target.value;
                          setNom(value);
                          if (value.trim()) setErrorNom(null);
                        }}
                        type="text"
                        id="fname"
                        name="fname"
                        placeholder="Entrer votre nom"
                    />
                    {errorNom && (
                        <p className="text-red-500 italic text-sm mt-1">{errorNom}</p>
                    )}
                  </div>

                  <div className="sm:col-span-1">
                    <Label>
                      Prénom<span className="text-error-500">*</span>
                    </Label>
                    <Input
                        value={prenom}
                        onChange={(e) => {
                          const value = e.target.value;
                          setPrenom(value);
                          if (value.trim()) setErrorPrenom(null);
                        }}
                        type="text"
                        id="lname"
                        name="lname"
                        placeholder="Entrer votre prénom"
                    />
                    {errorPrenom && (
                        <p className="text-red-500 italic text-sm mt-1">{errorPrenom}</p>
                    )}
                  </div>
                </div>

                <div>
                  <Label>
                    Email<span className="text-error-500"></span>
                  </Label>
                  <Input
                      value={email}
                      onChange={(e) => {
                        const value = e.target.value;
                        setEmail(value);
                        if (value !== "" && validateEmail(value)) setErrorEmail(null);
                      }}
                      type="email"
                      id="email"
                      name="email"
                      placeholder="exemple@gmail.com"
                  />
                  {errorEmail && (
                      <p className="text-red-500 italic text-sm mt-1">{errorEmail}</p>
                  )}
                </div>

                <div>
                  <Label>
                    Non d'utilisateur <span className="text-error-500">*</span>{" "}
                  </Label>
                  <Input
                      value={nomUtilisateur}
                      onChange={(e) => {
                        const value = e.target.value;
                        setNomUtilisateur(value);
                        if (value.trim()) setErrorUsername(null);
                      }}
                      placeholder="Entrer votre nom d'utilisateur"
                  />
                  {errorUsername && (
                      <p className="text-red-500 italic text-sm mt-1">{errorUsername}</p>
                  )}
                </div>

                <div>
                  <Label>
                    Mot de passe <span className="text-error-500">*</span>{" "}
                  </Label>
                  <div className="relative">
                    <Input
                        value={motPasse}
                        onChange={(e) => {
                          const value = e.target.value;
                          setMotPasse(value);
                          if (value.trim()) setErrorMotPasse(null);
                        }}
                        type={showPassword ? "text" : "password"}
                        placeholder="Entrer votre mode de passe"
                    />
                    <span
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                    >
                      {showPassword ? (
                          <EyeIcon className="fill-gray-500 dark:fill-gray-400 size-5"/>
                      ) : (
                          <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 size-5"/>
                      )}
                    </span>
                  </div>
                  {errorMotPasse && (
                      <p className="text-red-500 italic text-sm mt-1">{errorMotPasse}</p>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <Link
                      to="/reset-password"
                      className="text-sm text-brand-500 hover:text-brand-600 dark:text-brand-400"
                  >
                    Mot de passe oublié ?
                  </Link>
                </div>

                <div>
                  <Button className="w-full" size="sm">
                    S'inscrire
                    {loading && (<Spinner/>)}
                  </Button>
                </div>
              </div>
            </form>

            <div className="mt-5">
              <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
                Déjà un compte ? {""}
                <Link
                    to="/login"
                    className="text-brand-500 hover:text-brand-600 dark:text-brand-400"
                >
                  Connecter vous
                </Link>
              </p>
            </div>
          </div>
        </div>

        {
            isReponseApiOpen && (
                <ModalRetourAppelApi
                    onClose={handleModalReponseApiClose}
                    isOpen={isReponseApiOpen}
                    message={messageReponseApi}
                    type={typeReponseApi}
                />
            )
        }
      </div>
  );
}
