import {useEffect, useRef, useState} from "react"
import {TableCell} from "../../../components/ui/table";
import {InstitutionVM} from "../../../models/institution.model.ts";
import {InstitutionActif} from "../types.ts";
import {supprimerInstitution} from "../../../services/institution.service.ts";
import EditerInstitutionModal from "./EditerInstitutionModal.tsx";
import {CheckCircleIcon, DeleteIcon, PencilIcon, PrinterIcon} from "../../../icons";

interface Props {
  institution: InstitutionVM;
  setInstitutions: (institutions: any) => void;
  setLoaderStatus: (status: "idle" | "loading" | "success" | "error", message?: string) => void;
  setInstitutionActif: (institution: InstitutionActif) => void
}

export default function LigneActionInstitutionTable(
    {
      institution,
      setInstitutions,
      setLoaderStatus,
      setInstitutionActif
    }: Props) {

  const [open, setOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  // fermer le menu quand on clique ailleurs
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target;
      if (menuRef.current && target instanceof Node && !menuRef.current?.contains(target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleDelete = async () => {
    try {
      setLoaderStatus("loading", "Suppression en cours...");
      const reponse = await supprimerInstitution(institution.id)

      if ("message" in reponse) {
        setLoaderStatus("error", reponse.message || "Erreur lors de la suppression");
      } else {
        setInstitutions(prev => prev.filter(c => c.id !== institution.id));
        setLoaderStatus("success", "Suppression terminée");
      }
    } catch (err: any) {
      setLoaderStatus("error", err.message || "Erreur lors de la suppression");
    }
  };

  function handleActiverInstitution() {
    try {
      setLoaderStatus("loading", "Activation...");

      const institutionActif = {
        id: institution.id,
        nom: institution.departement
      } as InstitutionActif;

      localStorage.setItem("eExtraitInstitutionActif", JSON.stringify(institutionActif));
      setLoaderStatus("success", "Institution activé");
      setInstitutionActif(institutionActif);
    } catch (err: any) {
      console.log(err)
      setLoaderStatus("error", err.message || "Erreur");
    }
  }

  return (
      <TableCell
          className="px-4 py-3 text-gray-500 text-right text-theme-sm dark:text-gray-400 w-auto">
        {/* bouton ... */}
        <button
            onClick={() => setOpen((prev) => !prev)}
            className="px-2 py-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          ...
        </button>

        {/* menu dropdown */}
        {open ? (
            <div
                ref={menuRef}
                className="absolute right-0 mt-2 w-40 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black/5 z-10"
            >
              <ul className="py-1">
                <li className="flex items-center px-4 py-2 justify-between hover:bg-gray-100 dark:hover:bg-gray-700">
                  <button
                      onClick={() => {
                        handleActiverInstitution()
                        setOpen(false);
                      }}
                      className="block w-full text-left text-sm text-gray-700 dark:text-gray-200"
                  >
                    Activer
                  </button>
                  <CheckCircleIcon />
                </li>

                <li className="flex items-center px-4 py-2 justify-between hover:bg-gray-100 dark:hover:bg-gray-700">
                  <button
                      onClick={() => {
                        setShowModal(true);
                        setOpen(false);
                      }}
                      className="block w-full text-left text-sm text-gray-700 dark:text-gray-200"
                  >
                    Modifier
                  </button>
                  <PencilIcon />
                </li>

                <li className="flex items-center px-4 py-2 justify-between hover:bg-gray-100 dark:hover:bg-gray-700">
                  <button
                      onClick={handleDelete}
                      className="block w-full text-left text-sm text-red-600"
                  >
                    Supprimer
                  </button>
                  <DeleteIcon />
                </li>
              </ul>
            </div>
        ) : null}

        {/* 👉 Modal */}
        {showModal && (
            <EditerInstitutionModal
                id={institution.id}
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                setLoaderStatus={setLoaderStatus}
                setElementAdded={(updatedInstitution) => {
                  setInstitutions(prev =>
                      prev.map(i => (i.id === updatedInstitution?.id ? updatedInstitution : i))
                  );
                }}
            />
        )}
      </TableCell>
  )
}
