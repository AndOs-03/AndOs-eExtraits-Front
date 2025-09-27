import {useEffect, useRef, useState} from "react"
import {TableCell} from "../../../components/ui/table";
import {
  ExtraitNaissanceEssentielVM
} from "../../../models/ExtraitsNaissances/extrait-naissance-essentiel.model.ts";
import {supprimerExtraitsNaissances} from "../../../services/extrait-naissance.service.ts";
import EditerExtraitNaissanceModal from "./EditerExtraitNaissanceModal.tsx";
import {DeleteIcon, PencilIcon, PrinterIcon} from "../../../icons";

interface Props {
  extrait: ExtraitNaissanceEssentielVM;
  setExtraits: (extraits: any) => void;
  setExtraitToPrint: (extrait: ExtraitNaissanceEssentielVM | null) => void;
  setLoaderStatus: (status: "idle" | "loading" | "success" | "error", message?: string) => void;
}

export default function LigneActionExtraitNaissanceTable(
    {
      extrait,
      setExtraits,
      setExtraitToPrint,
      setLoaderStatus
    }: Props) {

  const [open, setOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

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

      const reponse = await supprimerExtraitsNaissances(extrait.id)
      if ("message" in reponse) {
        setLoaderStatus("error", reponse.message || "Erreur lors de la suppression");
      } else {
        setExtraits(prev => prev.filter(c => c.id !== extrait.id));
        setLoaderStatus("success", "Suppression terminée");
      }
    } catch (err: any) {
      setLoaderStatus("error", err.message || "Erreur lors de la suppression");
    }
  };

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
                        setExtraitToPrint(extrait)
                        setOpen(false);
                      }}
                      className="block w-full text-left text-sm text-gray-700 dark:text-gray-200"
                  >
                    Imprimer
                  </button>
                  <PrinterIcon/>
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
                  <PencilIcon/>
                </li>

                <li className="flex items-center px-4 py-2 justify-between hover:bg-gray-100 dark:hover:bg-gray-700">
                  <button
                      onClick={handleDelete}
                      className="block w-full text-left text-sm text-red-600"
                  >
                    Supprimer
                  </button>
                  <DeleteIcon/>
                </li>
              </ul>
            </div>
        ) : null}

        {/* 👉 Modal */}
        {showModal && (
            <EditerExtraitNaissanceModal
                id={extrait.id}
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                setElementAdded={(updated) => {
                  setExtraits(prev =>
                      prev.map(i => (i.id === updated?.id ? updated : i))
                  );
                }}
            />
        )}
      </TableCell>
  )
}
