import {useState} from "react";
import {updateCentre} from "../../../services/centre.service.ts"; // 👉 à créer si pas encore
import {Centre} from "../types.ts";
import {Modal} from "../../../components/ui/modal";
import {Spinner} from "../../../icons";
import ModalRetourAppelApi from "../../../components/ui/modal/modal-retour-appel-api.tsx";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  setElementAdded: (centre: Centre) => void; // permet de recharger la liste
  centre: Centre;
}

export default function ModifierCentreModal(
    {
      isOpen,
      onClose,
      setElementAdded,
      centre
    }: Props) {

  const [nom, setNom] = useState<string>(centre.nom);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [isReponseApiOpen, setIsReponseApiOpen] = useState<boolean>(false)
  const [messageReponseApi, setMessageReponseApi] = useState<string>("")
  const [typeReponseApi, setTypeReponseApi] = useState<"success" | "error" | "">("")

  const handleSubmit = async () => {
    if (!nom.trim()) {
      setError("Le nom est obligatoire");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const reponse = await updateCentre({id: centre.id, nom: nom});
      if ("message" in reponse) {
        setIsReponseApiOpen(true);
        setMessageReponseApi(reponse.message);
        setTypeReponseApi("error");
      } else {
        setIsReponseApiOpen(true);
        setMessageReponseApi("Modifié avec succès ✅");
        setTypeReponseApi("success");

        const updatedCentre: Centre = {...centre, ...{id: centre.id, nom: nom}};
        setElementAdded(updatedCentre);
      }
      setLoading(false);
    } catch (err: any) {
      setLoading(false);
      setIsReponseApiOpen(true);
      setMessageReponseApi(err);
      setTypeReponseApi("error");
    }
  };

  const handleModalReponseApiClose = () => {
    setIsReponseApiOpen(false);
    setMessageReponseApi("");
    setTypeReponseApi("");
    onClose();
  }

  if (!isOpen) return null;

  return (
      <Modal isOpen={isOpen} onClose={onClose} className="max-w-[700px] m-4">
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50">
          <div className="flex items-center justify-center min-h-screen px-4 py-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md text-left">
              <h2 className="text-lg font-bold mb-4">Modifier le centre</h2>
              {error && <p className="text-red-500 mb-2">{error}</p>}

              <input
                  type="text"
                  placeholder="Nom"
                  value={nom}
                  onChange={(e) => setNom(e.target.value.trim())}
                  className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 mb-4"
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