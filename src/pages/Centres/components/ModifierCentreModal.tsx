import {useState} from "react";
import {updateCentre} from "../../../services/centre.service.ts"; // 👉 à créer si pas encore
import {Centre} from "../types.ts";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  setLoaderStatus: (status: "idle" | "loading" | "success" | "error", message?: string) => void;
  setElementAdded: (centre: Centre) => void; // permet de recharger la liste
  centre: Centre;
}

export default function ModifierCentreModal(
    {
      isOpen,
      onClose,
      setLoaderStatus,
      setElementAdded,
      centre
    }: Props) {

  const [nom, setNom] = useState<string>(centre.nom);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!nom.trim()) {
      setError("Le nom est obligatoire");
      return;
    }
    setLoading(true);
    setError(null);

    try {
      setLoaderStatus("loading", "Modification du centre...");
      const reponse = await updateCentre({id: centre.id, nom: nom});

      if ("message" in reponse) {
        setLoaderStatus("error", reponse.message || "Erreur lors de la modification");
      } else {
        setLoaderStatus("success", "Modifié avec succès ✅");
        const updatedCentre: Centre = {...centre, ...{id: centre.id, nom: nom}};
        onClose();
        setElementAdded(updatedCentre);
      }
    } catch (err: any) {
      setError(err.message || "Erreur lors de la modification");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
      <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50">
        <div className="flex items-center justify-center min-h-screen px-4 py-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <h2 className="text-lg font-bold mb-4">Modifier le centre</h2>
            {error && <p className="text-red-500 mb-2">{error}</p>}

            <input
                type="text"
                placeholder="Nom"
                value={nom}
                onChange={(e) => setNom(e.target.value)}
                className="w-full border p-2 rounded mb-4 dark:bg-gray-700 dark:text-white"
            />

            <div className="flex justify-end gap-2">
              <button
                  onClick={onClose}
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