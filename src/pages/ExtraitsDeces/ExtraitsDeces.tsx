import {useEffect, useState} from "react";
import {listerExtraitsDeces} from "../../services/extrait-deces.service.ts";
import PageBreadcrumb from "../../components/common/PageBreadCrumb.tsx";
import ComponentCard from "../../components/common/ComponentCard.tsx";
import LoaderBanner from "../../components/common/LoaderBanner.tsx";
import {ExtraitDecesEssentielVM} from "../../models/ExtraitsDeces/extrait-deces-essentiel.model.ts";
import ListeExtraitsDecesTable from "./components/ListeExtraitsDecesTable.tsx";
import EditerExtraitDecesModal from "./components/EditerExtraitDecesModal.tsx";

export default function Institutions() {

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [extraits, setExtraits] = useState<ExtraitDecesEssentielVM[]>([]);
  const [elementAdded, setElementAdded] = useState<boolean>(false);

  const [loaderStatus, setLoaderStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [loaderMessage, setLoaderMessage] = useState<string | undefined>(undefined);

  const loadExtraits = async () => {
    try {
      setLoaderStatus("loading");
      setLoaderMessage("Chargement...");

      const reponse = await listerExtraitsDeces();
      if ("message" in reponse) {
        setLoaderStatus("error");
        setLoaderMessage(reponse.message || "Erreur lors du chargement");
      } else {
        setExtraits(reponse);
        setLoaderStatus("success");
      }
    } catch (err: any) {
      setLoaderStatus("error");
      setLoaderMessage(err.message || "Erreur lors du chargement");
    }

    handleLoaderStatus(loaderStatus, loaderMessage)
  };

  useEffect(() => {
    const fetchData = () => {
      loadExtraits().catch((err) => {
        console.error(err);
      });
    };

    fetchData();
  }, []);

  let reloadData = async () => {
    await loadExtraits();
  };

  const handleLoaderStatus = (status: "idle" | "loading" | "success" | "error", message?: string) => {
    setLoaderStatus(status);
    setLoaderMessage(message);
    if (status === "success" || status === "error") {
      setTimeout(() => setLoaderStatus("idle"), 3000);
    }
  };

  const handleElementAdd = () => {
    setElementAdded(true)
    setLoaderStatus("success");
    setLoaderMessage("Extrait ajouté avec succès ✅");
  };

  return (
      <>
        <PageBreadcrumb pageTitle="Gestion des extraits de décès"/>
        <div className="space-y-6">
          <LoaderBanner status={loaderStatus} message={loaderMessage}/>

          <ComponentCard title="Liste des centres">
            <div className="flex justify-end mb-4">
              <button
                  onClick={() => setIsAddModalOpen(true)}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Ajouter
              </button>
            </div>

            <EditerExtraitDecesModal
                id={undefined}
                isOpen={isAddModalOpen}
                onClose={async () => {
                  setIsAddModalOpen(false);
                  if (elementAdded) {
                    try {
                      await reloadData();
                      setElementAdded(false)
                    } catch (err) {
                      console.error(err);
                    }
                  }
                }}
                setLoaderStatus={handleLoaderStatus}
                setElementAdded={handleElementAdd}
            />

            <ListeExtraitsDecesTable
                extraits={extraits}
                setExtraits={setExtraits}
                setLoaderStatus={handleLoaderStatus}
            />
          </ComponentCard>
        </div>
      </>
  )
}