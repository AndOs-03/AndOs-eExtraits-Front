import {useEffect, useState} from "react";
import {
  creerExtraitsMariages,
  modifierExtraitsMariages,
  recupererExtraitMariages
} from "../../../services/extrait-mariage.service.ts";
import {CreerExtraitMariageCommande} from "../creer-extrait-mariage.commande.ts";
import {ModifierExtraitMariageCommande} from "../modifier-extrait-mariage.commande.ts";
import {ParentExtrait} from "../../../models/parents-extrait.model.ts";
import {
  ExtraitMariageDetailsVM
} from "../../../models/ExtraitsMariages/extrait-mariage-details.model.ts";
import {estDateValide} from "../../../services/common.service.ts";
import ModalRetourAppelApi from "../../../components/ui/modal/modal-retour-appel-api.tsx";
import {Spinner} from "../../../icons";

interface Props {
  id: number | undefined
  isOpen: boolean;
  onClose: () => void;
  setElementAdded: (extrait: ExtraitMariageDetailsVM | null) => void;
}

export default function EditerExtraitMariageModal(
    {
      id,
      isOpen,
      onClose,
      setElementAdded
    }: Props) {

  const [loading, setLoading] = useState(false);

  const [extrait, setExtrait] = useState<ExtraitMariageDetailsVM | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [errorAnnee, setErrorAnnee] = useState<string | null>(null);
  const [errorNumeroRegistre, setErrorNumeroRegistre] = useState<string | null>(null);
  const [errorDateRegistre, setErrorDateRegistre] = useState<string | null>(null);
  const [errorDateMariage, setErrorDateMariage] = useState<string | null>(null);
  const [errorEtatCivil, setErrorEtatCivil] = useState<string | null>(null);
  const [errorCentreEtatCivil, setErrorCentreEtatCivil] = useState<string | null>(null);

  const [errorNomEpoux, setErrorNomEpoux] = useState<string | null>(null);
  const [errorDateNaissanceEpoux, setErrorDateNaissanceEpoux] = useState<string | null>(null);
  const [errorLieuNaissanceEpoux, setErrorLieuNaissanceEpoux] = useState<string | null>(null);

  const [errorNomEpouse, setErrorNomEpouse] = useState<string | null>(null);
  const [errorDateNaissanceEpouse, setErrorDateNaissanceEpouse] = useState<string | null>(null);
  const [errorLieuNaissanceEpouse, setErrorLieuNaissanceEpouse] = useState<string | null>(null);

  const [isReponseApiOpen, setIsReponseApiOpen] = useState<boolean>(false)
  const [messageReponseApi, setMessageReponseApi] = useState<string>("")
  const [typeReponseApi, setTypeReponseApi] = useState<"success" | "error" | "">("")

  const [commande, setCommande] = useState<CreerExtraitMariageCommande>({
    annee: new Date().getFullYear(),
    numeroRegistre: null,
    dateRegistre: null,
    dateMariage: null,
    etatCivil: null,
    centreEtatCivil: null,
  });

  const [modifierCommande, setModifierCommande] = useState<ModifierExtraitMariageCommande>({
    id: null,
    annee: new Date().getFullYear(),
    numeroRegistre: null,
    dateRegistre: null,
    dateMariage: null,
    etatCivil: null,
    centreEtatCivil: null,
  });

  const loadExtrait = async () => {
    try {
      if (id) {
        const reponse = await recupererExtraitMariages(id);
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
            dateMariage: reponse.dateMariage,
            etatCivil: reponse.etatCivil,
            centreEtatCivil: reponse.centreEtatCivil,
            registreN: reponse.registreN,
            epoux: reponse.epoux,
            epouse: reponse.epouse
          } as ModifierExtraitMariageCommande));
          setExtrait(reponse);
        }
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
    setErrorDateMariage(null);
    setErrorEtatCivil(null);
    setErrorCentreEtatCivil(null);

    setErrorNomEpoux(null);
    setErrorDateNaissanceEpoux(null);
    setErrorLieuNaissanceEpoux(null);
    setErrorNomEpouse(null);
    setErrorDateNaissanceEpouse(null);
    setErrorLieuNaissanceEpouse(null);

    try {
      let reponse;
      if (id) {
        reponse = await modifierExtraitsMariages(modifierCommande)
      } else {
        reponse = await creerExtraitsMariages(commande)
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
          const extraitUpdated = await recupererExtraitMariages(id);
          if (!("message" in extraitUpdated)) {
            setElementAdded(extraitUpdated as ExtraitMariageDetailsVM);
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
    setErrorDateMariage(null);
    setErrorEtatCivil(null);
    setErrorCentreEtatCivil(null);

    setErrorNomEpoux(null);
    setErrorDateNaissanceEpoux(null);
    setErrorLieuNaissanceEpoux(null);
    setErrorNomEpouse(null);
    setErrorDateNaissanceEpouse(null);
    setErrorLieuNaissanceEpouse(null);

    setCommande(null);
    setModifierCommande(null);

    const annee = new Date().getFullYear();
    setModifierCommande((prev) => ({
      ...prev,
      annee: annee
    } as ModifierExtraitMariageCommande));
    setCommande((prev) => ({
      ...prev,
      annee: annee
    } as CreerExtraitMariageCommande));

    if (id) {
      onClose();
    }
  }

  const validationDuFormulaire = (commande: CreerExtraitMariageCommande | ModifierExtraitMariageCommande): boolean => {
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
    if (!estDateValide(commande.dateMariage!)) {
      setErrorDateMariage("La date de mariage est obligatoire !");
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

    if (!commande.epoux?.nomPrenoms?.trim()) {
      setErrorNomEpoux("Le nom est obligatoire !");
      isValid = false;
    }
    if (!estDateValide(commande.epoux?.dateNaissance!)) {
      setErrorDateNaissanceEpoux("La date du registre est obligatoire !");
      isValid = false;
    }
    if (!commande.epoux?.lieuNaissance.trim()) {
      setErrorLieuNaissanceEpoux("Le lieu de naissance est obligatoire !");
      isValid = false;
    }

    if (!commande.epouse?.nomPrenoms?.trim()) {
      setErrorNomEpouse("Le nom est obligatoire !");
      isValid = false;
    }
    if (!estDateValide(commande.epouse?.dateNaissance!)) {
      setErrorDateNaissanceEpouse("La date du registre est obligatoire !");
      isValid = false;
    }
    if (!commande.epouse?.lieuNaissance.trim()) {
      setErrorLieuNaissanceEpouse("Le lieu de naissance est obligatoire !");
      isValid = false;
    }

    return isValid;
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
                          } as ModifierExtraitMariageCommande));
                        } else {
                          setCommande((prev) => ({
                            ...prev,
                            registreN: value
                          } as CreerExtraitMariageCommande));
                        }
                      }}
                      className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
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
                          } as ModifierExtraitMariageCommande));
                        } else {
                          setCommande((prev) => ({
                            ...prev,
                            annee: value
                          } as CreerExtraitMariageCommande));
                        }
                        if (value.trim()) setErrorAnnee(null);
                      }}
                      className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
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
                          } as ModifierExtraitMariageCommande));
                        } else {
                          setCommande((prev) => ({
                            ...prev,
                            numeroRegistre: value
                          } as CreerExtraitMariageCommande));
                        }
                        if (value.trim()) setErrorNumeroRegistre(null);
                      }}
                      className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                  {errorNumeroRegistre && (
                      <p className="text-red-500 italic text-sm mt-1">{errorNumeroRegistre}</p>
                  )}
                </div>

                <div className="mb-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Du</label>
                  <input
                      type="date"
                      id="dateRegistre"
                      value={id ? modifierCommande?.dateRegistre ?? "" : commande?.dateRegistre ?? ""}
                      placeholder="Ex: 01/01/2000"
                      onChange={(e) => {
                        const currentDateString = e.target.value;
                        if (id) {
                          setModifierCommande((prev) => ({
                            ...prev,
                            dateRegistre: currentDateString
                          } as ModifierExtraitMariageCommande));
                        } else {
                          setCommande((prev) => ({
                            ...prev,
                            dateRegistre: currentDateString
                          } as CreerExtraitMariageCommande));
                        }

                        if (estDateValide(currentDateString)) {
                          setErrorDateRegistre(null);
                        }
                      }}
                      className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
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
                          } as ModifierExtraitMariageCommande));
                        } else {
                          setCommande((prev) => ({
                            ...prev,
                            etatCivil: value
                          } as CreerExtraitMariageCommande));
                        }
                        if (value.trim()) setErrorEtatCivil(null);
                      }}
                      className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
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
                          } as ModifierExtraitMariageCommande));
                        } else {
                          setCommande((prev) => ({
                            ...prev,
                            centreEtatCivil: value
                          } as CreerExtraitMariageCommande));
                        }
                        if (value.trim()) setErrorCentreEtatCivil(null);
                      }}
                      className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                  {errorCentreEtatCivil && (
                      <p className="text-red-500 italic text-sm mt-1">{errorCentreEtatCivil}</p>
                  )}
                </div>

                <div className="mb-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date
                    Mariage</label>
                  <input
                      type="date"
                      id="dateMariage"
                      value={id ? modifierCommande?.dateMariage ?? "" : commande?.dateMariage ?? ""}
                      placeholder="Ex: 01/01/2000"
                      onChange={(e) => {
                        const currentDateString = e.target.value;
                        if (id) {
                          setModifierCommande((prev) => ({
                            ...prev,
                            dateMariage: currentDateString
                          } as ModifierExtraitMariageCommande));
                        } else {
                          setCommande((prev) => ({
                            ...prev,
                            dateMariage: currentDateString
                          } as CreerExtraitMariageCommande));
                        }

                        if (estDateValide(currentDateString)) {
                          setErrorDateMariage(null);
                        }
                      }}
                      className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                  {errorDateMariage && (
                      <p className="text-red-500 italic text-sm mt-1">{errorDateMariage}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-2">
              <div className="p-6 py-1 rounded-lg shadow-md mb-2 border border-gray-200">
                <div className="relative flex py-3 items-center">
                  <div className="flex-grow border-t border-gray-400"></div>
                  <span className="flex-shrink mx-4 text-gray-400">INFOS DU MARIÉ</span>
                  <div className="flex-grow border-t border-gray-400"></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-2">
                  <div className="mb-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
                    <input
                        type="text"
                        placeholder="Nom et prénoms"
                        value={id ? modifierCommande?.epoux?.nomPrenoms ?? "" : commande?.epoux?.nomPrenoms ?? ""}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (id) {
                            setModifierCommande((prev) => ({
                              ...prev,
                              epoux: {
                                ...prev.epoux!,
                                nomPrenoms: value
                              }
                            } as ModifierExtraitMariageCommande));
                          } else {
                            setCommande((prev) => ({
                              ...prev,
                              epoux: {
                                ...prev.epoux!,
                                nomPrenoms: value
                              }
                            } as CreerExtraitMariageCommande));
                          }
                          if (value.trim()) setErrorNomEpoux(null);
                        }}
                        className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                    {errorNomEpoux && (
                        <p className="text-red-500 italic text-sm mt-1">{errorNomEpoux}</p>
                    )}
                  </div>

                  <div className="mb-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Né le</label>
                    <input
                        type="date"
                        id="dateNaissanceEpoux"
                        value={id ? modifierCommande?.epoux?.dateNaissance ?? "" : commande?.epoux?.dateNaissance ?? ""}
                        placeholder="Ex: 01/01/2000"
                        onChange={(e) => {
                          const currentDateString = e.target.value;
                          if (id) {
                            setModifierCommande((prev) => ({
                              ...prev,
                              epoux: {
                                ...prev.epoux!,
                                dateNaissance: currentDateString
                              }
                            } as ModifierExtraitMariageCommande));
                          } else {
                            setCommande((prev) => ({
                              ...prev,
                              epoux: {
                                ...prev.epoux!,
                                dateNaissance: currentDateString
                              }
                            } as CreerExtraitMariageCommande));
                          }

                          if (estDateValide(currentDateString)) {
                            setErrorDateNaissanceEpoux(null);
                          }
                        }}
                        className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                    {errorDateNaissanceEpoux && (
                        <p className="text-red-500 italic text-sm mt-1">{errorDateNaissanceEpoux}</p>
                    )}
                  </div>

                  <div className="mb-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">à</label>
                    <input
                        type="text"
                        placeholder="Lieu de naissance"
                        value={id ? modifierCommande?.epoux?.lieuNaissance ?? "" : commande?.epoux?.lieuNaissance ?? ""}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (id) {
                            setModifierCommande((prev) => ({
                              ...prev,
                              epoux: {
                                ...prev.epoux!,
                                lieuNaissance: value
                              }
                            } as ModifierExtraitMariageCommande));
                          } else {
                            setCommande((prev) => ({
                              ...prev,
                              epoux: {
                                ...prev.epoux!,
                                lieuNaissance: value
                              }
                            } as CreerExtraitMariageCommande));
                          }
                          if (value.trim()) setErrorLieuNaissanceEpoux(null);
                        }}
                        className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                    {errorLieuNaissanceEpoux && (
                        <p className="text-red-500 italic text-sm mt-1">{errorLieuNaissanceEpoux}</p>
                    )}
                  </div>

                  <div className="mb-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Domicilé
                      à</label>
                    <input
                        type="text"
                        placeholder="Domicile"
                        value={id ? modifierCommande?.epoux?.domicile ?? "" : commande?.epoux?.domicile ?? ""}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (id) {
                            setModifierCommande((prev) => ({
                              ...prev,
                              epoux: {
                                ...prev.epoux!,
                                domicile: value
                              }
                            } as ModifierExtraitMariageCommande));
                          } else {
                            setCommande((prev) => ({
                              ...prev,
                              epoux: {
                                ...prev.epoux!,
                                domicile: value
                              }
                            } as CreerExtraitMariageCommande));
                          }
                        }}
                        className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>

                  <div className="mb-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Père</label>
                    <input
                        type="text"
                        placeholder="Père"
                        value={id ? modifierCommande?.epoux?.pere?.nomPrenoms ?? "" : commande?.epoux?.pere?.nomPrenoms ?? ""}
                        onChange={(e) => {
                          const value = e.target.value;
                          const pere = new ParentExtrait(value)
                          if (id) {
                            setModifierCommande((prev) => ({
                              ...prev,
                              epoux: {
                                ...prev.epoux!,
                                pere: pere
                              }
                            } as ModifierExtraitMariageCommande));
                          } else {
                            setCommande((prev) => ({
                              ...prev,
                              epoux: {
                                ...prev.epoux!,
                                pere: pere
                              }
                            } as CreerExtraitMariageCommande));
                          }
                        }}
                        className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>

                  <div className="mb-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Mère</label>
                    <input
                        type="text"
                        placeholder="Mère"
                        value={id ? modifierCommande?.epoux?.mere?.nomPrenoms ?? "" : commande?.epoux?.mere?.nomPrenoms ?? ""}
                        onChange={(e) => {
                          const value = e.target.value;
                          const mere = new ParentExtrait(value)
                          if (id) {
                            setModifierCommande((prev) => ({
                              ...prev,
                              epoux: {
                                ...prev.epoux!,
                                mere: mere
                              }
                            } as ModifierExtraitMariageCommande));
                          } else {
                            setCommande((prev) => ({
                              ...prev,
                              epoux: {
                                ...prev.epoux!,
                                mere: mere
                              }
                            } as CreerExtraitMariageCommande));
                          }
                        }}
                        className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                </div>
              </div>

              <div className="p-6 py-1 rounded-lg shadow-md mb-2 border border-gray-200">
                <div className="relative flex py-3 items-center">
                  <div className="flex-grow border-t border-gray-400"></div>
                  <span className="flex-shrink mx-4 text-gray-400">INFOS DE LA MARIÉE</span>
                  <div className="flex-grow border-t border-gray-400"></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-2">
                  <div className="mb-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
                    <input
                        type="text"
                        placeholder="Nom et prénoms"
                        value={id ? modifierCommande?.epouse?.nomPrenoms ?? "" : commande?.epouse?.nomPrenoms ?? ""}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (id) {
                            setModifierCommande((prev) => ({
                              ...prev,
                              epouse: {
                                ...prev.epouse!,
                                nomPrenoms: value
                              }
                            } as ModifierExtraitMariageCommande));
                          } else {
                            setCommande((prev) => ({
                              ...prev,
                              epouse: {
                                ...prev.epouse!,
                                nomPrenoms: value
                              }
                            } as CreerExtraitMariageCommande));
                          }
                          if (value.trim()) setErrorNomEpouse(null);
                        }}
                        className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                    {errorNomEpouse && (
                        <p className="text-red-500 italic text-sm mt-1">{errorNomEpouse}</p>
                    )}
                  </div>

                  <div className="mb-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Né le</label>
                    <input
                        type="date"
                        id="dateNaissanceEpoux"
                        value={id ? modifierCommande?.epouse?.dateNaissance ?? "" : commande?.epouse?.dateNaissance ?? ""}
                        placeholder="Ex: 01/01/2000"
                        onChange={(e) => {
                          const currentDateString = e.target.value;
                          if (id) {
                            setModifierCommande((prev) => ({
                              ...prev,
                              epouse: {
                                ...prev.epouse!,
                                dateNaissance: currentDateString
                              }
                            } as ModifierExtraitMariageCommande));
                          } else {
                            setCommande((prev) => ({
                              ...prev,
                              epouse: {
                                ...prev.epouse!,
                                dateNaissance: currentDateString
                              }
                            } as CreerExtraitMariageCommande));
                          }

                          if (estDateValide(currentDateString)) {
                            setErrorDateNaissanceEpouse(null);
                          }
                        }}
                        className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                    {errorDateNaissanceEpouse && (
                        <p className="text-red-500 italic text-sm mt-1">{errorDateNaissanceEpouse}</p>
                    )}
                  </div>

                  <div className="mb-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">à</label>
                    <input
                        type="text"
                        placeholder="Lieu de naissance"
                        value={id ? modifierCommande?.epouse?.lieuNaissance ?? "" : commande?.epouse?.lieuNaissance ?? ""}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (id) {
                            setModifierCommande((prev) => ({
                              ...prev,
                              epouse: {
                                ...prev.epouse!,
                                lieuNaissance: value
                              }
                            } as ModifierExtraitMariageCommande));
                          } else {
                            setCommande((prev) => ({
                              ...prev,
                              epouse: {
                                ...prev.epouse!,
                                lieuNaissance: value
                              }
                            } as CreerExtraitMariageCommande));
                          }
                          if (value.trim()) setErrorLieuNaissanceEpouse(null);
                        }}
                        className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                    {errorLieuNaissanceEpouse && (
                        <p className="text-red-500 italic text-sm mt-1">{errorLieuNaissanceEpouse}</p>
                    )}
                  </div>

                  <div className="mb-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Domicilé
                      à</label>
                    <input
                        type="text"
                        placeholder="Domicile"
                        value={id ? modifierCommande?.epouse?.domicile ?? "" : commande?.epouse?.domicile ?? ""}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (id) {
                            setModifierCommande((prev) => ({
                              ...prev,
                              epouse: {
                                ...prev.epouse!,
                                domicile: value
                              }
                            } as ModifierExtraitMariageCommande));
                          } else {
                            setCommande((prev) => ({
                              ...prev,
                              epouse: {
                                ...prev.epouse!,
                                domicile: value
                              }
                            } as CreerExtraitMariageCommande));
                          }
                        }}
                        className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>

                  <div className="mb-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Père</label>
                    <input
                        type="text"
                        placeholder="Père"
                        value={id ? modifierCommande?.epouse?.pere?.nomPrenoms ?? "" : commande?.epouse?.pere?.nomPrenoms ?? ""}
                        onChange={(e) => {
                          const value = e.target.value;
                          const pere = new ParentExtrait(value)
                          if (id) {
                            setModifierCommande((prev) => ({
                              ...prev,
                              epouse: {
                                ...prev.epouse!,
                                pere: pere
                              }
                            } as ModifierExtraitMariageCommande));
                          } else {
                            setCommande((prev) => ({
                              ...prev,
                              epouse: {
                                ...prev.epouse!,
                                pere: pere
                              }
                            } as CreerExtraitMariageCommande));
                          }
                        }}
                        className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>

                  <div className="mb-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Mère</label>
                    <input
                        type="text"
                        placeholder="Mère"
                        value={id ? modifierCommande?.epouse?.mere?.nomPrenoms ?? "" : commande?.epouse?.mere?.nomPrenoms ?? ""}
                        onChange={(e) => {
                          const value = e.target.value;
                          const mere = new ParentExtrait(value)
                          if (id) {
                            setModifierCommande((prev) => ({
                              ...prev,
                              epouse: {
                                ...prev.epouse!,
                                mere: mere
                              }
                            } as ModifierExtraitMariageCommande));
                          } else {
                            setCommande((prev) => ({
                              ...prev,
                              epouse: {
                                ...prev.epouse!,
                                mere: mere
                              }
                            } as CreerExtraitMariageCommande));
                          }
                        }}
                        className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                </div>
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
