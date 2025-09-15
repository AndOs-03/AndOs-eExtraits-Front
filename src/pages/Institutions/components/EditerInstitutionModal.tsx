import {useEffect, useState} from "react";
import {editeInstitutions, recupererInstitution} from "../../../services/institution.service.ts";
import {EditerInstitutionCommande} from "../editer-institution.commande.ts";
import {InstitutionVM} from "../../../models/institution.model.ts";

interface Props {
  id: number | null
  isOpen: boolean;
  onClose: () => void;
  setLoaderStatus: (status: "idle" | "loading" | "success" | "error", message?: string) => void;
  setElementAdded: (institution: InstitutionVM | null) => void;
}

export default function EditerInstitutionModal(
    {
      id,
      isOpen,
      onClose,
      setLoaderStatus,
      setElementAdded
    }: Props) {

  const [institution, setInstitution] = useState<InstitutionVM | null>(null);
  const [loading, setLoading] = useState(false);
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

  const loadInstitution = async () => {
    try {
      if (id) {
        setLoading(true);
        setLoaderStatus("loading", "Chargement...");
        const reponse = await recupererInstitution(id);

        if ("message" in reponse) {
          setLoaderStatus("error", reponse.message || "Erreur de récupération de l'institution");
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
      setLoaderStatus("loading", "Enregistrement...");
      const reponse = await editeInstitutions(commande!)

      if ("message" in reponse) {
        setLoaderStatus("error", reponse.message || "Erreur lors de l'enregistrement");
      } else {
        setLoaderStatus("success", "Enregistré avec succès ✅");
        handleOnClose();
        setElementAdded(institution);
      }
    } catch (err: any) {
      setError(err.message || "Erreur lors de l'ajout");
    } finally {
      setLoading(false);
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

  if (!isOpen) return null;

  return (
      <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50">
        <div className="flex items-center justify-center min-h-screen px-4 py-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <h2 className="text-lg font-bold mb-4">{id ? "Modifier l'institution" : "Crée une" +
                " institution"}</h2>
            {error && <p className="text-red-500 mb-2 italic">{error}</p>}
            {errorDepart && <p className="text-red-500 mb-2 italic">{errorDepart}</p>}
            <input
                type="text"
                placeholder="Département"
                value={commande?.departement!}
                onChange={(e) => {
                  const value = e.target.value;
                  setCommande((prev) => ({...prev, departement: value}));
                  if (value.trim()) setErrorDepart(null);
                }}
                className="w-full border p-2 rounded mb-4"
            />

            {errorCentreEtat && <p className="text-red-500 mb-2 italic">{errorCentreEtat}</p>}
            <input
                type="text"
                placeholder="Centre d'État Civil"
                value={commande?.centreEtatCivil!}
                onChange={(e) => {
                  const value = e.target.value;
                  setCommande((prev) => ({...prev, centreEtatCivil: value}));
                  if (value.trim()) setErrorCentreEtat(null);
                }}
                className="w-full border p-2 rounded mb-4"
            />

            {errorEtatCivil && <p className="text-red-500 mb-2 italic">{errorEtatCivil}</p>}
            <input
                type="text"
                placeholder="État Civil"
                value={commande?.etatCivil!}
                onChange={(e) => {
                  const value = e.target.value;
                  setCommande((prev) => ({...prev, etatCivil: value}));
                  if (value.trim()) setErrorEtatCivil(null);
                }}
                className="w-full border p-2 rounded mb-4"
            />

            {errorTribunal && <p className="text-red-500 mb-2 italic">{errorTribunal}</p>}
            <input
                type="text"
                placeholder="Tribunal"
                value={commande?.tribunal!}
                onChange={(e) => {
                  const value = e.target.value;
                  setCommande((prev) => ({...prev, tribunal: value}));
                  if (value.trim()) setErrorTribunal(null);
                }}
                className="w-full border p-2 rounded mb-4"
            />

            {errorVille && <p className="text-red-500 mb-2 italic">{errorVille}</p>}
            <input
                type="text"
                placeholder="Ville"
                value={commande?.ville!}
                onChange={(e) => {
                  const value = e.target.value;
                  setCommande((prev) => ({...prev, ville: value}));
                  if (value.trim()) setErrorVille(null);
                }}
                className="w-full border p-2 rounded mb-4"
            />

            <input
                type="text"
                placeholder="Officier"
                value={commande?.officier!}
                onChange={(e) => {
                  const value = e.target.value;
                  setCommande((prev) => ({...prev, officier: value}));
                }}
                className="w-full border p-2 rounded mb-4"
            />
            <input
                type="text"
                placeholder="Titre Officier"
                value={commande?.titreOfficier!}
                onChange={(e) => {
                  const value = e.target.value;
                  setCommande((prev) => ({...prev, titreOfficier: value}));
                }}
                className="w-full border p-2 rounded mb-4"
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
