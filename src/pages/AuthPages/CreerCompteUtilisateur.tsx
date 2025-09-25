import {useState} from "react";
import {Link} from "react-router";
import {EyeCloseIcon, EyeIcon} from "../../icons";
import Label from "../../components/form/Label.tsx";
import Input from "../../components/form/input/InputField.tsx";
import Button from "../../components/ui/button/Button.tsx";

export default function CreerCompteUtilisateur() {
  const [showPassword, setShowPassword] = useState(false);

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

            <form>
              <div className="space-y-6">
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div className="sm:col-span-1">
                    <Label>
                      Nom<span className="text-error-500">*</span>
                    </Label>
                    <Input
                        type="text"
                        id="fname"
                        name="fname"
                        placeholder="Entrer votre nom"
                    />
                  </div>

                  <div className="sm:col-span-1">
                    <Label>
                      Prénom<span className="text-error-500">*</span>
                    </Label>
                    <Input
                        type="text"
                        id="lname"
                        name="lname"
                        placeholder="Entrer votre prénom"
                    />
                  </div>
                </div>

                <div>
                  <Label>
                    Email<span className="text-error-500"></span>
                  </Label>
                  <Input
                      type="email"
                      id="email"
                      name="email"
                      placeholder="exemple@gmail.com"
                  />
                </div>

                <div>
                  <Label>
                    Non d'utilisateur <span className="text-error-500">*</span>{" "}
                  </Label>
                  <Input min="4" placeholder="Entrer votre nom d'utilisateur"/>
                </div>

                <div>
                  <Label>
                    Mot de passe <span className="text-error-500">*</span>{" "}
                  </Label>
                  <div className="relative">
                    <Input
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
                    Se connecter
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
      </div>
  );
}
