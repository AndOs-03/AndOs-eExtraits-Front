import React, {useEffect, useState} from "react";
import {Link, useNavigate} from "react-router";
import {EyeCloseIcon, EyeIcon, Spinner} from "../../icons";
import Label from "../../components/form/Label.tsx";
import Input from "../../components/form/input/InputField.tsx";
import Button from "../../components/ui/button/Button.tsx";
import {login} from "../../services/auth.service.ts";
import {ConnexionCommande} from "./connexion-utilisateur.commande.ts";
import ModalRetourAppelApi from "../../components/ui/modal/modal-retour-appel-api.tsx";
import {clearAccessToken, setAccessToken} from "../../api/apiMethodes.ts";

export default function Connexion() {

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [nomUtilisateur, setNomUtilisateur] = useState<string>("");
  const [motPasse, setMotPasse] = useState<string>("");

  const [errorUsername, setErrorUsername] = useState<string | null>(null);
  const [errorMotPasse, setErrorMotPasse] = useState<string | null>(null);

  const [isReponseApiOpen, setIsReponseApiOpen] = useState<boolean>(false)
  const [messageReponseApi, setMessageReponseApi] = useState<string>("")
  const [typeReponseApi, setTypeReponseApi] = useState<"success" | "error" | "">("")

  useEffect(() => {
    clearAccessToken();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validationDuFormulaire()) {
      return;
    }

    setLoading(true);
    setErrorUsername(null);
    setErrorMotPasse(null);

    try {
      const reponse = await login(new ConnexionCommande(nomUtilisateur, motPasse));
      if ("message" in reponse) {
        setLoading(false);
        setIsReponseApiOpen(true);
        setMessageReponseApi(reponse.message);
        setTypeReponseApi("error");
      } else {
        setAccessToken(reponse.token);
        navigate("/");
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

    if (!nomUtilisateur.trim()) {
      setErrorUsername("Le nom d'utilisateur est obligatoire !");
      isValid = false;
    }

    if (!motPasse.trim()) {
      setErrorMotPasse("Le mot de passe est obligatoire !");
      isValid = false;
    }

    return isValid;
  }

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
                Connexion
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Entrer votre nom d'utilisateur et votre mot de passe !
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
                <div>
                  <Label>
                    Non d'utilisateur <span className="text-error-500">*</span>{" "}
                  </Label>
                  <Input
                      value={nomUtilisateur}
                      onChange={(e) => {
                        const value = e.target.value;
                        setNomUtilisateur(value);
                        if (value.trim()) setErrorMotPasse(null);
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
                  <Button
                      disabled={nomUtilisateur === "" || motPasse === ""}
                      className="w-full"
                      size="sm"
                  >
                    Se connecter
                    {loading && (<Spinner/>)}
                  </Button>
                </div>
              </div>
            </form>

            <div className="mt-5">
              <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
                Pas de compte ? {""}
                <Link
                    to="/register"
                    className="text-brand-500 hover:text-brand-600 dark:text-brand-400"
                >
                  Créer un compte
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
