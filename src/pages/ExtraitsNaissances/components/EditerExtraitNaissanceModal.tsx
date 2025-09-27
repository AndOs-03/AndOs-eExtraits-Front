import {useEffect, useState} from "react";
import {estDateValide} from "../../../services/common.service.ts";
import {
  ExtraitNaissanceDetailsVM
} from "../../../models/ExtraitsNaissances/extrait-naissance-details.model.ts";
import {CreerExtraitNaissanceCommande} from "../creer-extrait-naissance.commande.ts";
import {ModifierExtraitNaissanceCommande} from "../modifier-extrait-naissance.commande.ts";
import {
  creerExtraitsNaissances,
  modifierExtraitsNaissances,
  recupererExtraitNaissanceEssentiel,
  recupererExtraitNaissances
} from "../../../services/extrait-naissance.service.ts";
import {Sexe} from "../../../models/sexe-enum.ts";
import SwitchPersonalise from "../../../components/form/switch/SwitchPersonalise.tsx";
import {ParentExtrait} from "../../../models/parents-extrait.model.ts";
import {
  PersonneExtraitNaissance
} from "../../../models/ExtraitsNaissances/personne-extrait-naissance.model.ts";
import {recupererCentreActif} from "../../../services/centre-actif.service.ts";
import {Centre} from "../../Centres/types.ts";
import {
  ExtraitNaissanceEssentielVM
} from "../../../models/ExtraitsNaissances/extrait-naissance-essentiel.model.ts";
import ModalRetourAppelApi from "../../../components/ui/modal/modal-retour-appel-api.tsx";
import {Spinner} from "../../../icons";

interface Props {
  id: number | undefined
  isOpen: boolean;
  onClose: () => void;
  setElementAdded: (extrait: ExtraitNaissanceDetailsVM | ExtraitNaissanceEssentielVM | null) => void;
}

export default function EditerExtraitNaissanceModal(
    {
      id,
      isOpen,
      onClose,
      setElementAdded
    }: Props) {

  const [loading, setLoading] = useState(false);

  const [extrait, setExtrait] = useState<ExtraitNaissanceDetailsVM | null>(null);
  const [centreActif, setCentreActif] = useState<Centre | null>(null);

  const [extraitTPI, setExtraitTPI] = useState(false);
  const [mariage, setMariage] = useState(false);
  const [divorce, setDivorce] = useState(false);
  const [decede, setDecede] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [errorAnnee, setErrorAnnee] = useState<string | null>(null);
  const [errorNumeroRegistre, setErrorNumeroRegistre] = useState<string | null>(null);
  const [errorDateRegistre, setErrorDateRegistre] = useState<string | null>(null);
  const [errorEtatCivil, setErrorEtatCivil] = useState<string | null>(null);
  const [errorCentreEtatCivil, setErrorCentreEtatCivil] = useState<string | null>(null);

  const [errorNumeroJugementSupletif, setErrorNumeroJugementSupletif] = useState<string | null>(null);
  const [errorDateJugementSupletif, setErrorDateJugementSupletif] = useState<string | null>(null);
  const [errorTribunalJugementSupletif, setErrorTribunalJugementSupletif] = useState<string | null>(null);

  const [errorNom, setErrorNom] = useState<string | null>(null);
  const [errorPrenoms, setErrorPrenoms] = useState<string | null>(null);
  const [errorDateNaissance, setErrorDateNaissance] = useState<string | null>(null);
  const [errorLieuNaissance, setErrorLieuNaissance] = useState<string | null>(null);
  const [errorNomPere, setErrorNomPere] = useState<string | null>(null);
  const [errorNomMere, setErrorNomMere] = useState<string | null>(null);

  const [sexeChoisi, setSexeChoisi] = useState(false);

  const [commande, setCommande] = useState<CreerExtraitNaissanceCommande>({
    annee: new Date().getFullYear(),
    numeroRegistre: null,
    dateRegistre: null,
    etatCivil: null,
    centreEtatCivil: null,
    extraitTypeTPI: false,
    nouveauModel: false,
  });

  const [modifierCommande, setModifierCommande] = useState<ModifierExtraitNaissanceCommande>({
    id: null,
    annee: new Date().getFullYear(),
    numeroRegistre: null,
    dateRegistre: null,
    etatCivil: null,
    centreEtatCivil: null,
    extraitTypeTPI: false,
    nouveauModel: false,
  });

  const [isReponseApiOpen, setIsReponseApiOpen] = useState<boolean>(false)
  const [messageReponseApi, setMessageReponseApi] = useState<string>("")
  const [typeReponseApi, setTypeReponseApi] = useState<"success" | "error" | "">("")

  const loadExtrait = async () => {
    try {
      const centre = recupererCentreActif();
      setCentreActif(centre);

      if (id) {
        const reponse = await recupererExtraitNaissances(id);
        if ("message" in reponse) {
          setIsReponseApiOpen(true);
          setMessageReponseApi(reponse.message || "Erreur de récupération de l'extrait");
          setTypeReponseApi("error");
        } else {
          setModifierCommande((prev) => ({
            ...prev,
            id: id,
            annee: reponse.annee,
            numeroRegistre: reponse.numeroRegistre,
            dateRegistre: reponse.dateRegistre,
            etatCivil: reponse.etatCivil,
            centreEtatCivil: reponse.centreEtatCivil,
            registreN: reponse.registreN,
            numeroJugementSupletif: reponse.numeroJugementSupletif,
            dateJugementSupletif: reponse.dateJugementSupletif,
            tribunalJugementSupletif: reponse.tribunalJugementSupletif,
            extraitTypeTPI: reponse.extraitTypeTPI,
            nouveauModel: reponse.nouveauModel,
            centreId: reponse.centre.id,
            personne: reponse.personne,
          } as ModifierExtraitNaissanceCommande));
          setExtrait(reponse);

          setSexeChoisi(reponse.personne.sexe != "MASCULIN");
          setMariage(reponse.personne.mentionsEventuelle?.mariage ?? false);
          setDivorce(reponse.personne.mentionsEventuelle?.divorce ?? false);
          setDecede(reponse.personne.mentionsEventuelle?.decede ?? false);
          setExtraitTPI(reponse.extraitTypeTPI ?? false);
        }
      } else {
        const personne = new PersonneExtraitNaissance("", "", "", "", "MASCULIN");
        setCommande((prev) => ({
          ...prev,
          id: null,
          annee: new Date().getFullYear(),
          personne: personne,
        } as CreerExtraitNaissanceCommande));
      }
    } catch (err: any) {
      setIsReponseApiOpen(true);
      setMessageReponseApi(err);
      setTypeReponseApi("error");
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
    setErrorEtatCivil(null);
    setErrorCentreEtatCivil(null);

    setErrorNumeroJugementSupletif(null);
    setErrorDateJugementSupletif(null);
    setErrorTribunalJugementSupletif(null);

    setErrorNom(null);
    setErrorPrenoms(null);
    setErrorDateNaissance(null);
    setErrorLieuNaissance(null);
    setErrorNomPere(null);
    setErrorNomMere(null);

    try {
      let reponse;
      if (id) {
        reponse = await modifierExtraitsNaissances(modifierCommande)
      } else {
        commande.centreId = centreActif?.id;
        reponse = await creerExtraitsNaissances(commande)
      }

      if ("message" in reponse) {
        setIsReponseApiOpen(true);
        setMessageReponseApi(reponse.message);
        setTypeReponseApi("error");
      } else {
        setIsReponseApiOpen(true);
        setMessageReponseApi(`${id ? "Modifié" : "Enregistré"} avec succès`);
        setTypeReponseApi("success");

        if (id) {
          const extraitUpdated = await recupererExtraitNaissanceEssentiel(id);
          if (!("message" in extraitUpdated)) {
            setElementAdded(extraitUpdated as ExtraitNaissanceEssentielVM);
          }
        } else {
          setElementAdded(extrait);
        }
      }
      setLoading(false);
    } catch (err: any) {
      setLoading(false);
      setError(err.message || "Erreur lors de l'ajout");
      setIsReponseApiOpen(true);
      setMessageReponseApi(err);
      setTypeReponseApi("error");
    }
  };

  function handleOnClose() {
    setErrorAnnee(null);
    setErrorNumeroRegistre(null);
    setErrorDateRegistre(null);
    setErrorEtatCivil(null);
    setErrorCentreEtatCivil(null);

    setErrorNumeroJugementSupletif(null);
    setErrorDateJugementSupletif(null);
    setErrorTribunalJugementSupletif(null);

    setErrorNom(null);
    setErrorPrenoms(null);
    setErrorDateNaissance(null);
    setErrorLieuNaissance(null);
    setErrorNomPere(null);
    setErrorNomMere(null);

    setSexeChoisi(false);
    setMariage(false);
    setDivorce(false);
    setDecede(false);

    setCommande(null);
    setModifierCommande(null);

    const annee = new Date().getFullYear();
    setModifierCommande((prev) => ({
      ...prev,
      annee: annee
    } as ModifierExtraitNaissanceCommande));
    setCommande((prev) => ({
      ...prev,
      annee: annee
    } as CreerExtraitNaissanceCommande));

    if (id) {
      onClose();
    }
  }

  const validationDuFormulaire = (commande: CreerExtraitNaissanceCommande | ModifierExtraitNaissanceCommande): boolean => {
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
    if (!commande.etatCivil?.trim()) {
      setErrorEtatCivil("L'État Civil est obligatoire !");
      isValid = false;
    }
    if (!commande.centreEtatCivil?.trim()) {
      setErrorCentreEtatCivil("Le centre d'État Civil est obligatoire !");
      isValid = false;
    }

    if (extraitTPI) {
      if (!commande.numeroJugementSupletif?.trim()) {
        setErrorNumeroJugementSupletif("Numéro J.S obligatoire !");
        isValid = false;
      }
      if (!estDateValide(commande.dateJugementSupletif!)) {
        setErrorDateJugementSupletif("Date J.S obligatoire !");
        isValid = false;
      }
      if (!commande.tribunalJugementSupletif?.trim()) {
        setErrorTribunalJugementSupletif("Tribunal J.S obligatoire !");
        isValid = false;
      }
    }

    if (!commande.personne?.nom?.trim()) {
      setErrorNom("Le nom est obligatoire !");
      isValid = false;
    }
    if (!commande.personne?.prenoms?.trim()) {
      setErrorPrenoms("Le prénom est obligatoire !");
      isValid = false;
    }
    if (!estDateValide(commande.personne?.dateNaissance!)) {
      setErrorDateNaissance("La date de naissance est obligatoire !");
      isValid = false;
    }
    if (!commande.personne?.lieuNaissance?.trim()) {
      setErrorLieuNaissance("Le lieu de naissance est obligatoire !");
      isValid = false;
    }
    if (!commande.personne?.pere?.nomPrenoms?.trim()) {
      setErrorNomPere("Le nom du père est obligatoire !");
      isValid = false;
    }
    if (!commande.personne?.mere?.nomPrenoms?.trim()) {
      setErrorNomMere("Le nom de la mère est obligatoire !");
      isValid = false;
    }

    return isValid;
  };

  const handleSexeChange = (valeur: boolean) => {
    setSexeChoisi(valeur);

    if (id) {
      setModifierCommande((prev) => ({
        ...prev,
        personne: {
          ...prev.personne,
          sexe: valeur ? "FEMININ" : "MASCULIN",
        },
      } as ModifierExtraitNaissanceCommande));
    } else {
      setCommande((prev) => ({
        ...prev,
        personne: {
          ...prev.personne,
          sexe: valeur ? "FEMININ" : "MASCULIN",
        },
      } as CreerExtraitNaissanceCommande));
    }
  };

  const handleModalReponseApiClose = () => {
    setIsReponseApiOpen(false)
    setMessageReponseApi("")
    setTypeReponseApi("")
    handleOnClose();
  }

  if (!isOpen) return null;

  return (
      <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 pt-6 md:pt-12">
        <div className="flex items-start justify-center min-h-screen px-4 py-6">
          <div
              className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-5xl overflow-y-auto text-left">

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
            <div className="p-6 py-1 rounded-lg shadow-md mb-2 border border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-x-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-2">
                  <div className="mb-2 flex items-center">
                    <label className="flex items-center text-sm font-medium text-gray-700">
                      <span className="mr-2">Nouveau ?</span>
                      <input
                          type="checkbox"
                          checked={id ? modifierCommande?.nouveauModel! : commande?.nouveauModel!}
                          onChange={(e) => {
                            const checked = e.target.checked;
                            if (id) {
                              setModifierCommande((prev) => ({
                                ...prev,
                                nouveauModel: checked,
                              } as ModifierExtraitNaissanceCommande));
                            } else {
                              setCommande((prev) => ({
                                ...prev,
                                nouveauModel: checked,
                              } as CreerExtraitNaissanceCommande));
                            }
                          }}
                          className="w-10 h-5 border rounded"
                      />
                    </label>
                  </div>
                  <div className="mb-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Registre</label>
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
                            } as ModifierExtraitNaissanceCommande));
                          } else {
                            setCommande((prev) => ({
                              ...prev,
                              registreN: value
                            } as CreerExtraitNaissanceCommande));
                          }
                        }}
                        className="w-full border p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div className="mb-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Année</label>
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
                          } as ModifierExtraitNaissanceCommande));
                        } else {
                          setCommande((prev) => ({
                            ...prev,
                            annee: value
                          } as CreerExtraitNaissanceCommande));
                        }
                        if (value.trim()) setErrorAnnee(null);
                      }}
                      className="w-full border p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                  {errorAnnee && (
                      <p className="text-red-500 italic text-sm mt-1">{errorAnnee}</p>
                  )}
                </div>

                <div className="mb-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nº Acte</label>
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
                          } as ModifierExtraitNaissanceCommande));
                        } else {
                          setCommande((prev) => ({
                            ...prev,
                            numeroRegistre: value
                          } as CreerExtraitNaissanceCommande));
                        }
                        if (value.trim()) setErrorNumeroRegistre(null);
                      }}
                      className="w-full border p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                  {errorNumeroRegistre && (
                      <p className="text-red-500 italic text-sm mt-1">{errorNumeroRegistre}</p>
                  )}
                </div>

                <div className="mb-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Du</label>
                  <input
                      type="date"
                      value={id ? modifierCommande?.dateRegistre ?? "" : commande?.dateRegistre ?? ""}
                      placeholder="Ex: 01/01/2000"
                      onChange={(e) => {
                        const currentDateString = e.target.value;
                        if (id) {
                          setModifierCommande((prev) => ({
                            ...prev,
                            dateRegistre: currentDateString
                          } as ModifierExtraitNaissanceCommande));
                        } else {
                          setCommande((prev) => ({
                            ...prev,
                            dateRegistre: currentDateString
                          } as CreerExtraitNaissanceCommande));
                        }

                        if (estDateValide(currentDateString)) {
                          setErrorDateRegistre(null);
                        }
                      }}
                      className="w-full border p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                  {errorDateRegistre && (
                      <p className="text-red-500 italic text-sm mt-1">{errorDateRegistre}</p>
                  )}
                </div>

                <div className="mb-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">État Civil</label>
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
                          } as ModifierExtraitNaissanceCommande));
                        } else {
                          setCommande((prev) => ({
                            ...prev,
                            etatCivil: value
                          } as CreerExtraitNaissanceCommande));
                        }
                        if (value.trim()) setErrorEtatCivil(null);
                      }}
                      className="w-full border p-2 rounded"
                  />
                  {errorEtatCivil && (
                      <p className="text-red-500 italic text-sm mt-1">{errorEtatCivil}</p>
                  )}
                </div>

                <div className="mb-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Centre d'État
                    Civil</label>
                  <input
                      type="text"
                      placeholder="Centre"
                      value={id ? modifierCommande?.centreEtatCivil ?? "" : commande?.centreEtatCivil ?? ""}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (id) {
                          setModifierCommande((prev) => ({
                            ...prev,
                            centreEtatCivil: value
                          } as ModifierExtraitNaissanceCommande));
                        } else {
                          setCommande((prev) => ({
                            ...prev,
                            centreEtatCivil: value
                          } as CreerExtraitNaissanceCommande));
                        }
                        if (value.trim()) setErrorCentreEtatCivil(null);
                      }}
                      className="w-full border p-2 rounded"
                  />
                  {errorCentreEtatCivil && (
                      <p className="text-red-500 italic text-sm mt-1">{errorCentreEtatCivil}</p>
                  )}
                </div>
              </div>

              <div className="mb-2 flex items-center">
                <label className="flex items-center text-sm font-medium text-gray-700">
                  <span className="mr-2">Type TPI ?</span>
                  <input
                      type="checkbox"
                      checked={id ? modifierCommande?.extraitTypeTPI! : commande?.extraitTypeTPI!}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        setExtraitTPI(checked);
                        if (id) {
                          setModifierCommande((prev) => ({
                            ...prev,
                            extraitTypeTPI: checked,
                          } as ModifierExtraitNaissanceCommande));
                        } else {
                          setCommande((prev) => ({
                            ...prev,
                            extraitTypeTPI: checked,
                          } as CreerExtraitNaissanceCommande));
                        }
                      }}
                      className="w-10 h-5 border rounded"
                  />
                </label>
              </div>

              {extraitTPI ? (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-x-2">
                    <div className="mb-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">J.S Nº</label>
                      <input
                          type="text"
                          placeholder="Nº J.S"
                          value={id ? modifierCommande?.numeroJugementSupletif ?? "" : commande?.numeroJugementSupletif ?? ""}
                          onChange={(e) => {
                            const value = e.target.value;
                            if (id) {
                              setModifierCommande((prev) => ({
                                ...prev,
                                numeroJugementSupletif: value
                              } as ModifierExtraitNaissanceCommande));
                            } else {
                              setCommande((prev) => ({
                                ...prev,
                                numeroJugementSupletif: value
                              } as CreerExtraitNaissanceCommande));
                            }
                            if (value.trim()) setErrorNumeroJugementSupletif(null);
                          }}
                          className="w-full border p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      />
                      {errorNumeroJugementSupletif && (
                          <p className="text-red-500 italic text-sm mt-1">{errorNumeroJugementSupletif}</p>
                      )}
                    </div>

                    <div className="mb-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Du</label>
                      <input
                          type="date"
                          value={id ? modifierCommande?.dateJugementSupletif ?? "" : commande?.dateJugementSupletif ?? ""}
                          placeholder="Ex: 01/01/2000"
                          onChange={(e) => {
                            const currentDateString = e.target.value;
                            if (id) {
                              setModifierCommande((prev) => ({
                                ...prev,
                                dateJugementSupletif: currentDateString
                              } as ModifierExtraitNaissanceCommande));
                            } else {
                              setCommande((prev) => ({
                                ...prev,
                                dateJugementSupletif: currentDateString
                              } as CreerExtraitNaissanceCommande));
                            }

                            if (estDateValide(currentDateString)) {
                              setErrorDateJugementSupletif(null);
                            }
                          }}
                          className="w-full border p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      />
                      {errorDateJugementSupletif && (
                          <p className="text-red-500 italic text-sm mt-1">{errorDateJugementSupletif}</p>
                      )}
                    </div>

                    <div className="mb-2">
                      <label
                          className="block text-sm font-medium text-gray-700 mb-1">Tribunal</label>
                      <input
                          type="text"
                          placeholder="Tribunal"
                          value={id ? modifierCommande?.tribunalJugementSupletif ?? "" : commande?.tribunalJugementSupletif ?? ""}
                          onChange={(e) => {
                            const value = e.target.value;
                            if (id) {
                              setModifierCommande((prev) => ({
                                ...prev,
                                tribunalJugementSupletif: value
                              } as ModifierExtraitNaissanceCommande));
                            } else {
                              setCommande((prev) => ({
                                ...prev,
                                tribunalJugementSupletif: value
                              } as CreerExtraitNaissanceCommande));
                            }
                            if (value.trim()) setErrorTribunalJugementSupletif(null);
                          }}
                          className="w-full border p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      />
                      {errorTribunalJugementSupletif && (
                          <p className="text-red-500 italic text-sm mt-1">{errorTribunalJugementSupletif}</p>
                      )}
                    </div>
                  </div>
              ) : null}
            </div>

            <div className="relative flex py-1 items-center">
              <div className="flex-grow border-t border-gray-400"></div>
              <span className="flex-shrink mx-4 text-gray-400">INFOS PERSONNELLES</span>
              <div className="flex-grow border-t border-gray-400"></div>
            </div>

            <div className="p-6 py-1 rounded-lg shadow-md mb-2 border border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-x-2">
                <div className="mb-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
                  <input
                      type="text"
                      placeholder="Nom"
                      value={id ? modifierCommande?.personne?.nom ?? "" : commande?.personne?.nom ?? ""}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (id) {
                          setModifierCommande((prev) => ({
                            ...prev,
                            personne: {
                              ...prev.personne,
                              nom: value
                            }
                          } as ModifierExtraitNaissanceCommande));
                        } else {
                          setCommande((prev) => ({
                            ...prev,
                            personne: {
                              ...prev.personne,
                              nom: value
                            }
                          } as CreerExtraitNaissanceCommande));
                        }
                        if (value.trim()) setErrorNom(null);
                      }}
                      className="w-full border p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                  {errorNom && (
                      <p className="text-red-500 italic text-sm mt-1">{errorNom}</p>
                  )}
                </div>

                <div className="mb-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Prénom</label>
                  <input
                      type="text"
                      placeholder="Prénom"
                      value={id ? modifierCommande?.personne?.prenoms ?? "" : commande?.personne?.prenoms ?? ""}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (id) {
                          setModifierCommande((prev) => ({
                            ...prev,
                            personne: {
                              ...prev.personne,
                              prenoms: value
                            }
                          } as ModifierExtraitNaissanceCommande));
                        } else {
                          setCommande((prev) => ({
                            ...prev,
                            personne: {
                              ...prev.personne,
                              prenoms: value
                            }
                          } as CreerExtraitNaissanceCommande));
                        }
                        if (value.trim()) setErrorPrenoms(null);
                      }}
                      className="w-full border p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                  {errorPrenoms && (
                      <p className="text-red-500 italic text-sm mt-1">{errorPrenoms}</p>
                  )}
                </div>

                <div className="mb-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date de
                    Naissance</label>
                  <input
                      type="date"
                      value={id ? modifierCommande?.personne?.dateNaissance ?? "" : commande?.personne?.dateNaissance ?? ""}
                      placeholder="Ex: 01/01/2000"
                      onChange={(e) => {
                        const currentDateString = e.target.value;
                        if (id) {
                          setModifierCommande((prev) => ({
                            ...prev,
                            personne: {
                              ...prev.personne,
                              dateNaissance: currentDateString
                            }
                          } as ModifierExtraitNaissanceCommande));
                        } else {
                          setCommande((prev) => ({
                            ...prev,
                            personne: {
                              ...prev.personne,
                              dateNaissance: currentDateString
                            }
                          } as CreerExtraitNaissanceCommande));
                        }

                        if (estDateValide(currentDateString)) {
                          setErrorDateNaissance(null);
                        }
                      }}
                      className="w-full border p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                  {errorDateNaissance && (
                      <p className="text-red-500 italic text-sm mt-1">{errorDateNaissance}</p>
                  )}
                </div>

                <div className="mb-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Lieu de
                    Naissance</label>
                  <input
                      type="text"
                      placeholder="Lieu de Naissance"
                      value={id ? modifierCommande?.personne?.lieuNaissance ?? "" : commande?.personne?.lieuNaissance ?? ""}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (id) {
                          setModifierCommande((prev) => ({
                            ...prev,
                            personne: {
                              ...prev.personne,
                              lieuNaissance: value
                            }
                          } as ModifierExtraitNaissanceCommande));
                        } else {
                          setCommande((prev) => ({
                            ...prev,
                            personne: {
                              ...prev.personne,
                              lieuNaissance: value
                            }
                          } as CreerExtraitNaissanceCommande));
                        }
                        if (value.trim()) setErrorLieuNaissance(null);
                      }}
                      className="w-full border p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                  {errorLieuNaissance && (
                      <p className="text-red-500 italic text-sm mt-1">{errorLieuNaissance}</p>
                  )}
                </div>

                <div className="mb-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Père</label>
                  <input
                      type="text"
                      placeholder="Nom et Prénoms du Père"
                      value={id ? modifierCommande?.personne?.pere?.nomPrenoms ?? "" : commande?.personne?.pere?.nomPrenoms ?? ""}
                      onChange={(e) => {
                        const value = e.target.value;
                        const pere = new ParentExtrait(value)
                        if (id) {
                          setModifierCommande((prev) => ({
                            ...prev,
                            personne: {
                              ...prev.personne,
                              pere: pere
                            }
                          } as ModifierExtraitNaissanceCommande));
                        } else {
                          setCommande((prev) => ({
                            ...prev,
                            personne: {
                              ...prev.personne,
                              pere: pere
                            }
                          } as CreerExtraitNaissanceCommande));
                        }
                        if (value.trim()) setErrorNomPere(null);
                      }}
                      className="w-full border p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                  {errorNomPere && (
                      <p className="text-red-500 italic text-sm mt-1">{errorNomPere}</p>
                  )}
                </div>

                <div className="mb-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mère</label>
                  <input
                      type="text"
                      placeholder="Nom et Prénoms de la Mère"
                      value={id ? modifierCommande?.personne?.mere?.nomPrenoms ?? "" : commande?.personne?.mere?.nomPrenoms ?? ""}
                      onChange={(e) => {
                        const value = e.target.value;
                        const mere = new ParentExtrait(value)
                        if (id) {
                          setModifierCommande((prev) => ({
                            ...prev,
                            personne: {
                              ...prev.personne,
                              mere: mere
                            }
                          } as ModifierExtraitNaissanceCommande));
                        } else {
                          setCommande((prev) => ({
                            ...prev,
                            personne: {
                              ...prev.personne,
                              mere: mere
                            }
                          } as CreerExtraitNaissanceCommande));
                        }
                        if (value.trim()) setErrorNomMere(null);
                      }}
                      className="w-full border p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                  {errorNomMere && (
                      <p className="text-red-500 italic text-sm mt-1">{errorNomMere}</p>
                  )}
                </div>

                <div className="mb-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sexe</label>
                  <div className="flex items-center justify-between w-full p-2 shadow-sm">
                  <span className="block text-sm font-medium text-gray-700 mb-1 cursor-pointer"
                        onClick={() => handleSexeChange(false)}
                  >
                    {Sexe.MASCULIN}
                  </span>
                    <SwitchPersonalise
                        label=""
                        checked={sexeChoisi}
                        onChange={(valeur) => handleSexeChange(valeur)}
                    />
                    <span className="block text-sm font-medium text-gray-700 mb-1 cursor-pointer"
                          onClick={() => handleSexeChange(true)}
                    >
                    {Sexe.FEMININ}
                  </span>
                  </div>

                </div>
              </div>
            </div>

            <div className="relative flex py-1 items-center">
              <div className="flex-grow border-t border-gray-400"></div>
              <span className="flex-shrink mx-4 text-gray-400">MENTIONS (éventuellement)</span>
              <div className="flex-grow border-t border-gray-400"></div>
            </div>

            <div className="p-6 py-1 rounded-lg shadow-md mb-2 border border-gray-200">
              <div className="flex items-center mb-2">
                <input
                    type="checkbox"
                    checked={id
                        ? modifierCommande?.personne?.mentionsEventuelle?.mariage! ?? false
                        : commande?.personne?.mentionsEventuelle?.mariage ?? false
                    }
                    onChange={(e) => {
                      const checked = e.target.checked;
                      setMariage(checked);
                      if (id) {
                        setModifierCommande((prev) => ({
                          ...prev,
                          personne: {
                            ...prev.personne,
                            mentionsEventuelle: {
                              ...(prev.personne?.mentionsEventuelle ?? {}),
                              mariage: checked
                            }
                          }
                        } as ModifierExtraitNaissanceCommande));
                      } else {
                        setCommande((prev) => ({
                          ...prev,
                          personne: {
                            ...prev.personne,
                            mentionsEventuelle: {
                              ...(prev.personne?.mentionsEventuelle ?? {}),
                              mariage: checked
                            }
                          }
                        } as CreerExtraitNaissanceCommande));
                      }
                    }}
                    className="h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label className="ml-2 text-lg font-medium text-gray-700">Mariage ?</label>
              </div>

              {mariage && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="mb-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                      <input
                          type="date"
                          value={id ? modifierCommande?.personne?.mentionsEventuelle?.dateMariage ?? "" : commande?.personne?.mentionsEventuelle?.dateMariage ?? ""}
                          placeholder="Ex: 01/01/2000"
                          onChange={(e) => {
                            const currentDateString = e.target.value;
                            if (id) {
                              setModifierCommande((prev) => ({
                                ...prev,
                                personne: {
                                  ...prev.personne,
                                  mentionsEventuelle: {
                                    ...(prev.personne?.mentionsEventuelle ?? {}),
                                    dateMariage: currentDateString
                                  }
                                }
                              } as ModifierExtraitNaissanceCommande));
                            } else {
                              setCommande((prev) => ({
                                ...prev,
                                personne: {
                                  ...prev.personne,
                                  mentionsEventuelle: {
                                    ...(prev.personne?.mentionsEventuelle ?? {}),
                                    dateMariage: currentDateString
                                  }
                                }
                              } as CreerExtraitNaissanceCommande));
                            }
                          }}
                          className="w-full border p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                    <div className="mb-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Lieu</label>
                      <input
                          type="text"
                          placeholder="Lieu de Mariage"
                          value={id ? modifierCommande?.personne?.mentionsEventuelle?.lieuMariage ?? "" : commande?.personne?.mentionsEventuelle?.lieuMariage ?? ""}
                          onChange={(e) => {
                            const value = e.target.value;
                            if (id) {
                              setModifierCommande((prev) => ({
                                ...prev,
                                personne: {
                                  ...prev.personne,
                                  mentionsEventuelle: {
                                    ...(prev.personne?.mentionsEventuelle ?? {}),
                                    lieuMariage: value
                                  }
                                }
                              } as ModifierExtraitNaissanceCommande));
                            } else {
                              setCommande((prev) => ({
                                ...prev,
                                personne: {
                                  ...prev.personne,
                                  mentionsEventuelle: {
                                    ...(prev.personne?.mentionsEventuelle ?? {}),
                                    lieuMariage: value
                                  }
                                }
                              } as CreerExtraitNaissanceCommande));
                            }
                          }}
                          className="w-full border p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                    <div className="mb-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Avec</label>
                      <input
                          type="text"
                          placeholder="Avec"
                          value={id ? modifierCommande?.personne?.mentionsEventuelle?.epouOuEpouse ?? "" : commande?.personne?.mentionsEventuelle?.epouOuEpouse ?? ""}
                          onChange={(e) => {
                            const value = e.target.value;
                            if (id) {
                              setModifierCommande((prev) => ({
                                ...prev,
                                personne: {
                                  ...prev.personne,
                                  mentionsEventuelle: {
                                    ...(prev.personne?.mentionsEventuelle ?? {}),
                                    epouOuEpouse: value
                                  }
                                }
                              } as ModifierExtraitNaissanceCommande));
                            } else {
                              setCommande((prev) => ({
                                ...prev,
                                personne: {
                                  ...prev.personne,
                                  mentionsEventuelle: {
                                    ...(prev.personne?.mentionsEventuelle ?? {}),
                                    epouOuEpouse: value
                                  }
                                }
                              } as CreerExtraitNaissanceCommande));
                            }
                          }}
                          className="w-full border p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                  </div>
              )}

              <div className="flex items-center mb-2">
                <input
                    type="checkbox"
                    checked={id
                        ? modifierCommande?.personne?.mentionsEventuelle?.divorce! ?? false
                        : commande?.personne?.mentionsEventuelle?.divorce ?? false
                    }
                    onChange={(e) => {
                      const checked = e.target.checked;
                      setDivorce(checked);
                      if (id) {
                        setModifierCommande((prev) => ({
                          ...prev,
                          personne: {
                            ...prev.personne,
                            mentionsEventuelle: {
                              ...(prev.personne?.mentionsEventuelle ?? {}),
                              divorce: checked
                            }
                          }
                        } as ModifierExtraitNaissanceCommande));
                      } else {
                        setCommande((prev) => ({
                          ...prev,
                          personne: {
                            ...prev.personne,
                            mentionsEventuelle: {
                              ...(prev.personne?.mentionsEventuelle ?? {}),
                              divorce: checked
                            }
                          }
                        } as CreerExtraitNaissanceCommande));
                      }
                    }}
                    className="h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label className="ml-2 text-lg font-medium text-gray-700">Divorce ?</label>
              </div>

              {divorce && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="mb-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                      <input
                          type="date"
                          value={id ? modifierCommande?.personne?.mentionsEventuelle?.dateDivorce ?? "" : commande?.personne?.mentionsEventuelle?.dateDivorce ?? ""}
                          placeholder="Ex: 01/01/2000"
                          onChange={(e) => {
                            const currentDateString = e.target.value;
                            if (id) {
                              setModifierCommande((prev) => ({
                                ...prev,
                                personne: {
                                  ...prev.personne,
                                  mentionsEventuelle: {
                                    ...(prev.personne?.mentionsEventuelle ?? {}),
                                    dateDivorce: currentDateString
                                  }
                                }
                              } as ModifierExtraitNaissanceCommande));
                            } else {
                              setCommande((prev) => ({
                                ...prev,
                                personne: {
                                  ...prev.personne,
                                  mentionsEventuelle: {
                                    ...(prev.personne?.mentionsEventuelle ?? {}),
                                    dateDivorce: currentDateString
                                  }
                                }
                              } as CreerExtraitNaissanceCommande));
                            }
                          }}
                          className="w-full border p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                  </div>
              )}

              <div className="flex items-center mb-2">
                <input
                    type="checkbox"
                    checked={id
                        ? modifierCommande?.personne?.mentionsEventuelle?.decede! ?? false
                        : commande?.personne?.mentionsEventuelle?.decede ?? false
                    }
                    onChange={(e) => {
                      const checked = e.target.checked;
                      setDecede(checked);
                      if (id) {
                        setModifierCommande((prev) => ({
                          ...prev,
                          personne: {
                            ...prev.personne,
                            mentionsEventuelle: {
                              ...(prev.personne?.mentionsEventuelle ?? {}),
                              decede: checked
                            }
                          }
                        } as ModifierExtraitNaissanceCommande));
                      } else {
                        setCommande((prev) => ({
                          ...prev,
                          personne: {
                            ...prev.personne,
                            mentionsEventuelle: {
                              ...(prev.personne?.mentionsEventuelle ?? {}),
                              decede: checked
                            }
                          }
                        } as CreerExtraitNaissanceCommande));
                      }
                    }}
                    className="h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label className="ml-2 text-lg font-medium text-gray-700">Décédé ?</label>
              </div>

              {decede && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="mb-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                      <input
                          type="date"
                          value={id ? modifierCommande?.personne?.mentionsEventuelle?.dateDeces ?? "" : commande?.personne?.mentionsEventuelle?.dateDeces ?? ""}
                          placeholder="Ex: 01/01/2000"
                          onChange={(e) => {
                            const currentDateString = e.target.value;
                            if (id) {
                              setModifierCommande((prev) => ({
                                ...prev,
                                personne: {
                                  ...prev.personne,
                                  mentionsEventuelle: {
                                    ...(prev.personne?.mentionsEventuelle ?? {}),
                                    dateDeces: currentDateString
                                  }
                                }
                              } as ModifierExtraitNaissanceCommande));
                            } else {
                              setCommande((prev) => ({
                                ...prev,
                                personne: {
                                  ...prev.personne,
                                  mentionsEventuelle: {
                                    ...(prev.personne?.mentionsEventuelle ?? {}),
                                    dateDeces: currentDateString
                                  }
                                }
                              } as CreerExtraitNaissanceCommande));
                            }
                          }}
                          className="w-full border p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                    <div className="mb-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Lieu</label>
                      <input
                          type="text"
                          placeholder="Lieu de Décès"
                          value={id ? modifierCommande?.personne?.mentionsEventuelle?.lieuDeces ?? "" : commande?.personne?.mentionsEventuelle?.lieuDeces ?? ""}
                          onChange={(e) => {
                            const value = e.target.value;
                            if (id) {
                              setModifierCommande((prev) => ({
                                ...prev,
                                personne: {
                                  ...prev.personne,
                                  mentionsEventuelle: {
                                    ...(prev.personne?.mentionsEventuelle ?? {}),
                                    lieuDeces: value
                                  }
                                }
                              } as ModifierExtraitNaissanceCommande));
                            } else {
                              setCommande((prev) => ({
                                ...prev,
                                personne: {
                                  ...prev.personne,
                                  mentionsEventuelle: {
                                    ...(prev.personne?.mentionsEventuelle ?? {}),
                                    lieuDeces: value
                                  }
                                }
                              } as CreerExtraitNaissanceCommande));
                            }
                          }}
                          className="w-full border p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                  </div>
              )}
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
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
              >
                Enregistrer
                {loading && (<Spinner/>)}
              </button>
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
