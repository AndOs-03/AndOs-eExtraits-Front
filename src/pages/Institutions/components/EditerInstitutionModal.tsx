import {useEffect, useState} from "react";
import {editeInstitutions, recupererInstitution} from "../../../services/institution.service.ts";
import {EditerInstitutionCommande} from "../editer-institution.commande.ts";
import {InstitutionVM} from "../../../models/institution.model.ts";
import ModalRetourAppelApi from "../../../components/ui/modal/modal-retour-appel-api.tsx";
import {Spinner} from "../../../icons";
import {Modal} from "../../../components/ui/modal";
import {supprimerEspacesVides} from "../../../services/common.service";

interface Props {
  id: number | null
  isOpen: boolean;
  onClose: () => void;
  setElementAdded: (institution: InstitutionVM | null) => void;
}

export default function EditerInstitutionModal(
    {
      id,
      isOpen,
      onClose,
      setElementAdded
    }: Props) {

  const [loading, setLoading] = useState(false);
  const [institution, setInstitution] = useState<InstitutionVM | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [errorDepart, setErrorDepart] = useState<string | null>(null);
  const [errorCentreEtat, setErrorCentreEtat] = useState<string | null>(null);
  const [errorEtatCivil, setErrorEtatCivil] = useState<string | null>(null);
  const [errorTribunal, setErrorTribunal] = useState<string | null>(null);
  const [errorVille, setErrorVille] = useState<string | null>(null);

  const [commande, setCommande] = useState<EditerInstitutionCommande>({
    id: null,
    departement: "",
    centreEtatCivil: "",
    etatCivil: "",
    tribunal: "",
    ville: "",
    officier: "",
    titreOfficier: ""
  });

  const [isReponseApiOpen, setIsReponseApiOpen] = useState<boolean>(false)
  const [messageReponseApi, setMessageReponseApi] = useState<string>("")
  const [typeReponseApi, setTypeReponseApi] = useState<"success" | "error" | "">("")

  const loadInstitution = async () => {
    try {
      if (id) {
        const reponse = await recupererInstitution(id);
        if ("message" in reponse) {
          setIsReponseApiOpen(true);
          setMessageReponseApi(reponse.message || "Erreur de récupération de l'institution");
          setTypeReponseApi("error");
        } else {
          setCommande((prev) => ({...prev, id: id}));
          setCommande((prev) => ({...prev, departement: reponse.departement}));
          setCommande((prev) => ({...prev, centreEtatCivil: reponse.centreEtatCivil}));
          setCommande((prev) => ({...prev, etatCivil: reponse.etatCivil}));
          setCommande((prev) => ({...prev, tribunal: reponse.tribunal}));
          setCommande((prev) => ({...prev, ville: reponse.ville}));
          setCommande((prev) => ({...prev, officier: reponse.officier}));
          setCommande((prev) => ({...prev, titreOfficier: reponse.titreOfficier}));
          setInstitution(reponse);
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
      loadInstitution().catch((err) => {
        console.error(err);
      });
    };

    fetchData();
  }, []);

  const handleSubmit = async () => {
    if (!validationDuFormulaire()) return;

    setLoading(true);
    setError(null);
    setErrorDepart(null);
    setErrorCentreEtat(null);
    setErrorEtatCivil(null);
    setErrorTribunal(null);
    setErrorVille(null);

    try {
      supprimerEspacesVides(commande);
      const reponse = await editeInstitutions(commande!)
      if ("message" in reponse) {
        setIsReponseApiOpen(true);
        setMessageReponseApi(reponse.message);
        setTypeReponseApi("error");
      } else {
        setIsReponseApiOpen(true);
        setMessageReponseApi(`${id ? "Modifié" : "Enregistré"} avec succès`);
        setTypeReponseApi("success");

        if (id) {
          const reponse = await recupererInstitution(id);
          if (!("message" in reponse)) {
            setElementAdded(reponse as InstitutionVM);
          }
        } else {
          setElementAdded(institution);
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
    setCommande((prev) => ({...prev, id: null}));
    setCommande((prev) => ({...prev, departement: ""}));
    setCommande((prev) => ({...prev, centreEtatCivil: ""}));
    setCommande((prev) => ({...prev, etatCivil: ""}));
    setCommande((prev) => ({...prev, tribunal: ""}));
    setCommande((prev) => ({...prev, ville: ""}));
    setCommande((prev) => ({...prev, officier: ""}));
    setCommande((prev) => ({...prev, titreOfficier: ""}));

    if (id) {
      onClose();
    }
  }

  const validationDuFormulaire = (): boolean => {
    let isValid = true;

    if (!commande!.departement?.trim()) {
      setErrorDepart("Le département est obligatoire !");
      isValid = false;
    }
    if (!commande!.centreEtatCivil?.trim()) {
      setErrorCentreEtat("Le centre d'État civil est obligatoire !");
      isValid = false;
    }
    if (!commande!.etatCivil?.trim()) {
      setErrorEtatCivil("L'État civil est obligatoire !");
      isValid = false;
    }
    if (!commande!.tribunal?.trim()) {
      setErrorTribunal("Le tribunal est obligatoire !");
      isValid = false;
    }
    if (!commande!.ville?.trim()) {
      setErrorVille("La ville est obligatoire !");
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
      <Modal isOpen={isOpen} onClose={onClose} className="max-w-[700px] m-4">
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50">
          <div className="flex items-center justify-center min-h-screen px-4 py-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md text-left">
              <h2 className="text-lg font-bold mb-4">
                {id ? "Modifier l'institution" : "Crée une institution"}
              </h2>

              {error && <p className="text-red-500 mb-2 italic">{error}</p>}

              <label className="block text-sm font-medium text-gray-700">Département</label>
              {errorDepart && (
                  <p className="text-red-500 italic text-sm">{errorDepart}</p>
              )}
              <input
                  type="text"
                  placeholder="Département"
                  value={commande?.departement!}
                  onChange={(e) => {
                    const value = e.target.value;
                    setCommande((prev) => ({...prev, departement: value}));
                    if (value.trim()) setErrorDepart(null);
                  }}
                  className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 mb-2"
              />

              <label className="block text-sm font-medium text-gray-700">Centre d'État Civil</label>
              {errorCentreEtat && (
                  <p className="text-red-500 italic text-sm">{errorCentreEtat}</p>
              )}
              <input
                  type="text"
                  placeholder="Centre"
                  value={commande?.centreEtatCivil!}
                  onChange={(e) => {
                    const value = e.target.value;
                    setCommande((prev) => ({...prev, centreEtatCivil: value}));
                    if (value.trim()) setErrorCentreEtat(null);
                  }}
                  className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 mb-2"
              />

              <label className="block text-sm font-medium text-gray-700">État Civil</label>
              {errorEtatCivil && (
                  <p className="text-red-500 italic text-sm">{errorEtatCivil}</p>
              )}
              <input
                  type="text"
                  placeholder="État Civil"
                  value={commande?.etatCivil!}
                  onChange={(e) => {
                    const value = e.target.value;
                    setCommande((prev) => ({...prev, etatCivil: value}));
                    if (value.trim()) setErrorEtatCivil(null);
                  }}
                  className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 rounded mb-2"
              />

              <label className="block text-sm font-medium text-gray-700">Tribunal d'État
                Civil</label>
              {errorTribunal && (
                  <p className="text-red-500 italic text-sm">{errorTribunal}</p>
              )}
              <input
                  type="text"
                  placeholder="Tribunal"
                  value={commande?.tribunal!}
                  onChange={(e) => {
                    const value = e.target.value;
                    setCommande((prev) => ({...prev, tribunal: value}));
                    if (value.trim()) setErrorTribunal(null);
                  }}
                  className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 mb-2"
              />

              <label className="block text-sm font-medium text-gray-700">Ville</label>
              {errorVille && (
                  <p className="text-red-500 italic text-sm">{errorVille}</p>
              )}
              <input
                  type="text"
                  placeholder="Ville"
                  value={commande?.ville!}
                  onChange={(e) => {
                    const value = e.target.value;
                    setCommande((prev) => ({...prev, ville: value}));
                    if (value.trim()) setErrorVille(null);
                  }}
                  className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 rounded mb-2"
              />

              <label className="block text-sm font-medium text-gray-700">Officier</label>
              <input
                  type="text"
                  placeholder="Officier"
                  value={commande?.officier!}
                  onChange={(e) => {
                    const value = e.target.value;
                    setCommande((prev) => ({...prev, officier: value}));
                  }}
                  className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 mb-4"
              />

              <label className="block text-sm font-medium text-gray-700">Titre Officier</label>
              <input
                  type="text"
                  placeholder="Titre Officier"
                  value={commande?.titreOfficier!}
                  onChange={(e) => {
                    const value = e.target.value;
                    setCommande((prev) => ({...prev, titreOfficier: value}));
                  }}
                  className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 mb-2"
              />

              <div className="flex justify-end gap-2">
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
      </Modal>
  );
}
