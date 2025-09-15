import {useEffect, useState} from "react";
import {
  creerExtraitsDeces,
  modifierExtraitsDeces,
  recupererExtraitDeces
} from "../../../services/extrait-deces.service.ts";
import {ExtraitDecesDetailsVM} from "../../../models/ExtraitsDeces/extrait-deces-details.model.ts";
import {CreerExtraitDecesCommande} from "../creer-extrait-deces.commande.ts";
import {ModifierExtraitDecesCommande} from "../modifier-extrait-deces.commande.ts";
import {ParentExtrait} from "../../../models/parents-extrait.model.ts";
import DatePicker from "../../../components/form/date-picker.tsx";
import Select from "../../../components/form/Select.tsx";
import {SituationMatrimoniale} from "../../../models/situation-matrimoniale.ts";

interface Props {
  id: number | undefined
  isOpen: boolean;
  onClose: () => void;
  setLoaderStatus: (status: "idle" | "loading" | "success" | "error", message?: string) => void;
  setElementAdded: (extrait: ExtraitDecesDetailsVM | null) => void;
}

export default function EditerExtraitDecesModal(
    {
      id,
      isOpen,
      onClose,
      setLoaderStatus,
      setElementAdded
    }: Props) {

  const [extrait, setExtrait] = useState<ExtraitDecesDetailsVM | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errorAnnee, setErrorAnnee] = useState<string | null>(null);
  const [errorNumeroRegistre, setErrorNumeroRegistre] = useState<string | null>(null);
  const [errorDateRegistre, setErrorDateRegistre] = useState<string | null>(null);
  const [errorDateDeces, setErrorDateDeces] = useState<string | null>(null);
  const [errorNom, setErrorNom] = useState<string | null>(null);
  const [errorPrenoms, setErrorPrenom] = useState<string | null>(null);
  const [errorDateNaissance, setErrorDateNaissance] = useState<string | null>(null);
  const [errorEtatCivil, setErrorEtatCivil] = useState<string | null>(null);
  const [errorCentreEtatCivil, setErrorCentreEtatCivil] = useState<string | null>(null);
  const [errorSituationMatrimoniale, setErrorSituationMatrimoniale] = useState<string | null>(null);

  const [commande, setCommande] = useState<CreerExtraitDecesCommande>({
    annee: new Date().getFullYear(),
    numeroRegistre: null,
    dateRegistre: null,
    dateDeces: null,
    nom: null,
    prenoms: null,
    dateNaissance: null,
    etatCivil: null,
    centreEtatCivil: null,
    situationMatrimoniale: null
  });

  const [modifierCommande, setModifierCommande] = useState<ModifierExtraitDecesCommande>({
    id: null,
    annee: null,
    numeroRegistre: null,
    dateRegistre: null,
    dateDeces: null,
    nom: null,
    prenoms: null,
    dateNaissance: null,
    etatCivil: null,
    centreEtatCivil: null,
    situationMatrimoniale: null
  });

  const loadExtrait = async () => {
    try {
      if (id) {
        setLoading(true);
        setLoaderStatus("loading", "Chargement...");

        const reponse = await recupererExtraitDeces(id);
        if ("message" in reponse) {
          setLoaderStatus("error", reponse.message || "Erreur de récupération de l'institution");
        } else {
          setModifierCommande((prev) => ({
            ...prev,
            id: id,
            annee: reponse.annee,
            numeroRegistre: reponse.numeroRegistre,
            dateRegistre: reponse.dateRegistre,
            dateDeces: reponse.dateDeces,
            lieuDeces: reponse.lieuDeces,
            nom: reponse.nom,
            prenoms: reponse.prenoms,
            nationalite: reponse.nationalite,
            profession: reponse.profession,
            domicile: reponse.domicile,
            dateNaissance: reponse.dateNaissance,
            lieuNaissance: reponse.lieuNaissance,
            etatCivil: reponse.etatCivil,
            centreEtatCivil: reponse.centreEtatCivil,
            registreN: reponse.registreN,
            situationMatrimoniale: reponse.situationMatrimoniale,
            pere: reponse.pere,
            mere: reponse.mere
          } as ModifierExtraitDecesCommande));
          setExtrait(reponse);
          setLoaderStatus("success");
        }
      }
    } catch (err: any) {
      setLoaderStatus("error", err.message || "Erreur lors du chargement");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = () => {
      loadExtrait().catch((err) => {
        console.error(err);
      });
    };

    fetchData();
  }, []);

  const handleSubmit = async () => {
    if (!validationDuFormulaire(id ? modifierCommande : commande)) {
      return;
    }

    setLoading(true);
    setError(null);
    setErrorAnnee(null);
    setErrorNumeroRegistre(null);
    setErrorDateRegistre(null);
    setErrorDateDeces(null);
    setErrorNom(null);
    setErrorPrenom(null);
    setErrorDateNaissance(null);
    setErrorEtatCivil(null);
    setErrorCentreEtatCivil(null);
    setErrorSituationMatrimoniale(null);

    try {
      setLoaderStatus("loading", "Enregistrement...");
      let reponse;
      if (id) {
        reponse = await modifierExtraitsDeces(modifierCommande)
      } else {
        reponse = await creerExtraitsDeces(commande)
      }

      if ("message" in reponse) {
        setLoaderStatus("error", reponse.message || "Erreur lors de l'enregistrement");
      } else {
        setLoaderStatus("success", `${id ? "Modifié" : "Enregistré"} avec succès ✅`);
        handleOnClose();
        setElementAdded(extrait);
      }
    } catch (err: any) {
      setError(err.message || "Erreur lors de l'ajout");
    } finally {
      setLoading(false);
    }
  };

  function handleOnClose() {
    setErrorAnnee(null);
    setErrorNumeroRegistre(null);
    setErrorDateRegistre(null);
    setErrorDateDeces(null);
    setErrorNom(null);
    setErrorPrenom(null);
    setErrorDateNaissance(null);
    setErrorEtatCivil(null);
    setErrorCentreEtatCivil(null);
    setErrorSituationMatrimoniale(null);

    setCommande(null);
    setModifierCommande(null);

    const annee = new Date().getFullYear();
    setModifierCommande((prev) => ({
      ...prev,
      annee: annee
    } as ModifierExtraitDecesCommande));
    setCommande((prev) => ({
      ...prev,
      annee: annee
    } as CreerExtraitDecesCommande));

    if (id) {
      onClose();
    }
  }

  const validationDuFormulaire = (commande: CreerExtraitDecesCommande | ModifierExtraitDecesCommande): boolean => {
    let isValid = true;

    if (commande.annee === null || commande.annee < 1) {
      setErrorAnnee("L'année est obligatoire !");
      isValid = false;
    }
    if (!commande.numeroRegistre?.trim()) {
      setErrorNumeroRegistre("Le numéro d'acte est obligatoire !");
      isValid = false;
    }
    if (!estDateValide(commande.dateRegistre!)) {
      setErrorDateRegistre("La date du registre est obligatoire !");
      isValid = false;
    }
    if (!estDateValide(commande.dateDeces!)) {
      setErrorDateDeces("La date du décès est obligatoire !");
      isValid = false;
    }
    if (!commande.nom?.trim()) {
      setErrorNom("Le nom est obligatoire !");
      isValid = false;
    }
    if (!commande!.prenoms?.trim()) {
      setErrorPrenom("Le prénom est obligatoire !");
      isValid = false;
    }
    if (!estDateValide(commande.dateNaissance!)) {
      setErrorDateNaissance("La date de naissance est obligatoire !");
      isValid = false;
    }
    if (!commande.etatCivil?.trim()) {
      setErrorEtatCivil("L'État Civil est obligatoire !");
      isValid = false;
    }
    if (!commande.centreEtatCivil?.trim()) {
      setErrorCentreEtatCivil("Le centre d'État Civil est obligatoire !");
      isValid = false;
    }
    if (!commande.situationMatrimoniale?.trim()) {
      setErrorSituationMatrimoniale("Choisir la situation matrimoniale !");
      isValid = false;
    }

    return isValid;
  };

  const estDateValide = (dateString: string): boolean => {
    const date = new Date(dateString);
    return !isNaN(date.getTime());
  };

  const valeursSelectSituationMatrimoniale = () => {
    return [
      { value: "", label: "-- Sélectionnez une situation --" },
      ...Object.entries(SituationMatrimoniale).map(([situation, label]) => ({
        value: situation,
        label: label,
      })),
    ];
  };

  if (!isOpen) return null;

  return (
      <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 pt-6 md:pt-12">
        <div className="flex items-start justify-center min-h-screen px-4 py-6">
          <div
              className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-5xl overflow-y-auto">

            <h2 className="text-lg font-bold sticky top-0 bg-white dark:bg-gray-800">
              {id ? "Modifier l'extrait" : "Crée un extrait"}
            </h2>
            {/* Affichage des erreurs globales */}
            {error && <p className="text-red-500 mb-2 italic">{error}</p>}

            <div className="relative flex py-3 pb-1 items-center">
              <div className="flex-grow border-t border-gray-400"></div>
              <span className="flex-shrink mx-4 text-gray-400">EXTRAIT</span>
              <div className="flex-grow border-t border-gray-400"></div>
            </div>

            {/* Grid pour 2 champs par ligne */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-2">
              <div className="mb-2">
                <p className="text-red-500 italic h-5 mb-1"></p>
                <input
                    type="text"
                    placeholder="Registre"
                    value={id ? modifierCommande?.registreN ?? "" : commande?.registreN ?? ""}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (id) {
                        setModifierCommande((prev) => ({
                          ...prev,
                          registreN: value
                        } as ModifierExtraitDecesCommande));
                      } else {
                        setCommande((prev) => ({
                          ...prev,
                          registreN: value
                        } as CreerExtraitDecesCommande));
                      }
                    }}
                    className="w-full border p-2 rounded"
                />
              </div>

              <div className="mb-2">
                <p className="text-red-500 italic h-5 mb-1">
                  {errorAnnee ? errorAnnee : ""}
                </p>
                <input
                    type="number"
                    placeholder="Année"
                    min="1"
                    value={id ? modifierCommande?.annee ?? "" : commande?.annee ?? ""}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (id) {
                        setModifierCommande((prev) => ({
                          ...prev,
                          annee: value
                        } as ModifierExtraitDecesCommande));
                      } else {
                        setCommande((prev) => ({
                          ...prev,
                          annee: value
                        } as CreerExtraitDecesCommande));
                      }
                      if (value.trim()) setErrorAnnee(null);
                    }}
                    className="w-full border p-2 rounded"
                />
              </div>

              <div className="mb-2">
                <p className="text-red-500 italic h-5 mb-1">
                  {errorNumeroRegistre ? errorNumeroRegistre : ""}
                </p>
                <input
                    type="text"
                    placeholder="Nº Acte"
                    value={id ? modifierCommande?.numeroRegistre ?? "" : commande?.numeroRegistre ?? ""}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (id) {
                        setModifierCommande((prev) => ({
                          ...prev,
                          numeroRegistre: value
                        } as ModifierExtraitDecesCommande));
                      } else {
                        setCommande((prev) => ({
                          ...prev,
                          numeroRegistre: value
                        } as CreerExtraitDecesCommande));
                      }
                      if (value.trim()) setErrorNumeroRegistre(null);
                    }}
                    className="w-full border p-2 rounded"
                />
              </div>

              <div className="mb-2">
                <p className="text-red-500 italic h-5 mb-1">
                  {errorDateRegistre ? errorDateRegistre : ""}
                </p>
                <DatePicker
                    id="dateRegistre"
                    defaultDate={id ? modifierCommande?.dateRegistre ?? "" : commande?.dateRegistre ?? ""}
                    placeholder="Date de Régistre"
                    onChange={(dates, currentDateString) => {
                      if (id) {
                        setModifierCommande((prev) => ({
                          ...prev,
                          dateRegistre: currentDateString
                        } as ModifierExtraitDecesCommande));
                      } else {
                        setCommande((prev) => ({
                          ...prev,
                          dateRegistre: currentDateString
                        } as CreerExtraitDecesCommande));
                      }

                      if (estDateValide(currentDateString)) {
                        setErrorDateRegistre(null);
                      }
                    }}
                />
              </div>

              <div className="mb-2">
                <p className="text-red-500 italic h-5 mb-1">
                  {errorEtatCivil ? errorEtatCivil : ""}
                </p>
                <input
                    type="text"
                    placeholder="État Civil"
                    value={id ? modifierCommande?.etatCivil ?? "" : commande?.etatCivil ?? ""}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (id) {
                        setModifierCommande((prev) => ({
                          ...prev,
                          etatCivil: value
                        } as ModifierExtraitDecesCommande));
                      } else {
                        setCommande((prev) => ({
                          ...prev,
                          etatCivil: value
                        } as CreerExtraitDecesCommande));
                      }
                      if (value.trim()) setErrorEtatCivil(null);
                    }}
                    className="w-full border p-2 rounded"
                />
              </div>

              <div className="mb-2">
                <p className="text-red-500 italic h-5 mb-1">
                  {errorCentreEtatCivil ? errorCentreEtatCivil : ""}
                </p>
                <input
                    type="text"
                    placeholder="Centre d'État Civil"
                    value={id ? modifierCommande?.centreEtatCivil ?? "" : commande?.centreEtatCivil ?? ""}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (id) {
                        setModifierCommande((prev) => ({
                          ...prev,
                          centreEtatCivil: value
                        } as ModifierExtraitDecesCommande));
                      } else {
                        setCommande((prev) => ({
                          ...prev,
                          centreEtatCivil: value
                        } as CreerExtraitDecesCommande));
                      }
                      if (value.trim()) setErrorCentreEtatCivil(null);
                    }}
                    className="w-full border p-2 rounded"
                />
              </div>
            </div>
            <div className="relative flex py-3 items-center">
              <div className="flex-grow border-t border-gray-400"></div>
              <span className="flex-shrink mx-4 text-gray-400">INFOS PERSONNELLES</span>
              <div className="flex-grow border-t border-gray-400"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-2">
              <div className="mb-2">
                <p className="text-red-500 italic h-5 mb-1">
                  {errorNom ? errorNom : ""}
                </p>
                <input
                    type="text"
                    placeholder="Nom"
                    value={id ? modifierCommande?.nom ?? "" : commande?.nom ?? ""}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (id) {
                        setModifierCommande((prev) => ({
                          ...prev,
                          nom: value
                        } as ModifierExtraitDecesCommande));
                      } else {
                        setCommande((prev) => ({
                          ...prev,
                          nom: value
                        } as CreerExtraitDecesCommande));
                      }
                      if (value.trim()) setErrorNom(null);
                    }}
                    className="w-full border p-2 rounded"
                />
              </div>

              <div className="mb-2">
                <p className="text-red-500 italic h-5 mb-1">
                  {errorPrenoms ? errorPrenoms : ""}
                </p>
                <input
                    type="text"
                    placeholder="Prénoms"
                    value={id ? modifierCommande?.prenoms ?? "" : commande?.prenoms ?? ""}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (id) {
                        setModifierCommande((prev) => ({
                          ...prev,
                          prenoms: value
                        } as ModifierExtraitDecesCommande));
                      } else {
                        setCommande((prev) => ({
                          ...prev,
                          prenoms: value
                        } as CreerExtraitDecesCommande));
                      }
                      if (value.trim()) setErrorPrenom(null);
                    }}
                    className="w-full border p-2 rounded"
                />
              </div>

              <div className="mb-2">
                <p className="text-red-500 italic h-5 mb-1">
                  {errorDateNaissance ? errorDateNaissance : ""}
                </p>
                <DatePicker
                    id="dateNaissance"
                    defaultDate={id ? modifierCommande?.dateNaissance ?? "" : commande?.dateNaissance ?? ""}
                    placeholder="Date de Naissance"
                    onChange={(dates, currentDateString) => {
                      if (id) {
                        setModifierCommande((prev) => ({
                          ...prev,
                          dateNaissance: currentDateString
                        } as ModifierExtraitDecesCommande));
                      } else {
                        setCommande((prev) => ({
                          ...prev,
                          dateNaissance: currentDateString
                        } as CreerExtraitDecesCommande));
                      }

                      if (estDateValide(currentDateString)) {
                        setErrorDateNaissance(null);
                      }
                    }}
                />
              </div>

              <div className="mb-2">
                <p className="text-red-500 italic h-5 mb-1"></p>
                <input
                    type="text"
                    placeholder="Lieu de Naissance"
                    value={id ? modifierCommande?.lieuNaissance ?? "" : commande?.lieuNaissance ?? ""}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (id) {
                        setModifierCommande((prev) => ({
                          ...prev,
                          lieuNaissance: value
                        } as ModifierExtraitDecesCommande));
                      } else {
                        setCommande((prev) => ({
                          ...prev,
                          lieuNaissance: value
                        } as CreerExtraitDecesCommande));
                      }
                    }}
                    className="w-full border p-2 rounded"
                />
              </div>

              <div className="mb-2">
                <p className="text-red-500 italic h-5 mb-1"></p>
                <input
                    type="text"
                    placeholder="Profession"
                    value={id ? modifierCommande?.profession ?? "" : commande?.profession ?? ""}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (id) {
                        setModifierCommande((prev) => ({
                          ...prev,
                          profession: value
                        } as ModifierExtraitDecesCommande));
                      } else {
                        setCommande((prev) => ({
                          ...prev,
                          profession: value
                        } as CreerExtraitDecesCommande));
                      }
                    }}
                    className="w-full border p-2 rounded"
                />
              </div>

              <div className="mb-2">
                <p className="text-red-500 italic h-5 mb-1"></p>
                <input
                    type="text"
                    placeholder="Domicile"
                    value={id ? modifierCommande?.domicile ?? "" : commande?.domicile ?? ""}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (id) {
                        setModifierCommande((prev) => ({
                          ...prev,
                          domicile: value
                        } as ModifierExtraitDecesCommande));
                      } else {
                        setCommande((prev) => ({
                          ...prev,
                          domicile: value
                        } as CreerExtraitDecesCommande));
                      }
                    }}
                    className="w-full border p-2 rounded"
                />
              </div>

              <div className="mb-2">
                <p className="text-red-500 italic h-5 mb-1"></p>
                <input
                    type="text"
                    placeholder="Nationalité"
                    value={id ? modifierCommande?.nationalite ?? "" : commande?.nationalite ?? ""}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (id) {
                        setModifierCommande((prev) => ({
                          ...prev,
                          nationalite: value
                        } as ModifierExtraitDecesCommande));
                      } else {
                        setCommande((prev) => ({
                          ...prev,
                          nationalite: value
                        } as CreerExtraitDecesCommande));
                      }
                    }}
                    className="w-full border p-2 rounded"
                />
              </div>

              <div className="mb-2">
                <p className="text-red-500 italic h-5 mb-1">
                  {errorSituationMatrimoniale ? errorSituationMatrimoniale : ""}
                </p>
                <Select
                    defaultValue={id ? modifierCommande?.situationMatrimoniale ?? "" : commande?.situationMatrimoniale ?? ""}
                    placeholder="Situation Matrimoniale"
                    onChange={value => {
                      console.log(value);
                      if (id) {
                        setModifierCommande((prev) => ({
                          ...prev,
                          situationMatrimoniale: value
                        } as ModifierExtraitDecesCommande));
                      } else {
                        setCommande((prev) => ({
                          ...prev,
                          situationMatrimoniale: value
                        } as CreerExtraitDecesCommande));
                      }
                      if (value.trim()) setErrorSituationMatrimoniale(null);
                    }}
                    className="dark:bg-dark-900"
                    options={valeursSelectSituationMatrimoniale()}
                />
              </div>

              <div className="mb-2">
                <p className="text-red-500 italic h-5 mb-1">
                  {errorDateDeces ? errorDateDeces : ""}
                </p>
                <DatePicker
                    id="dateDeces"
                    defaultDate={id ? modifierCommande?.dateDeces ?? "" : commande?.dateDeces ?? ""}
                    placeholder="Date de Décès"
                    onChange={(dates, currentDateString) => {
                      if (id) {
                        setModifierCommande((prev) => ({
                          ...prev,
                          dateDeces: currentDateString
                        } as ModifierExtraitDecesCommande));
                      } else {
                        setCommande((prev) => ({
                          ...prev,
                          dateDeces: currentDateString
                        } as CreerExtraitDecesCommande));
                      }

                      if (estDateValide(currentDateString)) {
                        setErrorDateDeces(null);
                      }
                    }}
                />
              </div>

              <div className="mb-2">
                <p className="text-red-500 italic h-5 mb-1"></p>
                <input
                    type="text"
                    placeholder="Lieu de Décès"
                    value={id ? modifierCommande?.lieuDeces ?? "" : commande?.lieuDeces ?? ""}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (id) {
                        setModifierCommande((prev) => ({
                          ...prev,
                          lieuDeces: value
                        } as ModifierExtraitDecesCommande));
                      } else {
                        setCommande((prev) => ({
                          ...prev,
                          lieuDeces: value
                        } as CreerExtraitDecesCommande));
                      }
                    }}
                    className="w-full border p-2 rounded"
                />
              </div>
            </div>

            <div className="relative flex py-3 items-center">
              <div className="flex-grow border-t border-gray-400"></div>
              <span className="flex-shrink mx-4 text-gray-400">PARENTS</span>
              <div className="flex-grow border-t border-gray-400"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-2">
              <div className="mb-2">
                <input
                    type="text"
                    placeholder="Nom Prénoms du Père"
                    value={id ? modifierCommande?.pere?.nomPrenoms ?? "" : commande?.pere?.nomPrenoms ?? ""}
                    onChange={(e) => {
                      const value = e.target.value;
                      const pere = new ParentExtrait(value)
                      if (id) {
                        setModifierCommande((prev) => ({
                          ...prev,
                          pere: pere
                        } as ModifierExtraitDecesCommande));
                      } else {
                        setCommande((prev) => ({
                          ...prev,
                          pere: pere
                        } as CreerExtraitDecesCommande));
                      }
                    }}
                    className="w-full border p-2 rounded"
                />
              </div>
              <div className="mb-2">
                <input
                    type="text"
                    placeholder="Nom Prénoms de la Mère"
                    value={id ? modifierCommande?.mere?.nomPrenoms ?? "" : commande?.mere?.nomPrenoms ?? ""}
                    onChange={(e) => {
                      const value = e.target.value;
                      const mere = new ParentExtrait(value)
                      if (id) {
                        setModifierCommande((prev) => ({
                          ...prev,
                          mere: mere
                        } as ModifierExtraitDecesCommande));
                      } else {
                        setCommande((prev) => ({
                          ...prev,
                          mere: mere
                        } as CreerExtraitDecesCommande));
                      }
                    }}
                    className="w-full border p-2 rounded"
                />
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-2 mt-6">
              <button
                  onClick={() => {
                    handleOnClose();
                    onClose();
                  }}
                  className="px-4 py-2 bg-gray-300 dark:bg-gray-700 rounded hover:bg-gray-400 dark:hover:bg-gray-600"
              >
                Annuler
              </button>
              <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? "Enregistrement..." : "Enregistrer"}
              </button>
            </div>
          </div>
        </div>
      </div>
  );
}
