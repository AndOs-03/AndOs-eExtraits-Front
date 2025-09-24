import {useEffect, useState} from "react";
import {listerExtraitsMariages} from "../../services/extrait-mariage.service.ts";
import PageBreadcrumb from "../../components/common/PageBreadCrumb.tsx";
import ComponentCard from "../../components/common/ComponentCard.tsx";
import LoaderBanner from "../../components/common/LoaderBanner.tsx";
import ListeExtraitsMariagesTable from "./components/ListeExtraitsMariagesTable.tsx";
import EditerExtraitMariageModal from "./components/EditerExtraitMariageModal.tsx";
import {
  ExtraitMariageEssentielVM
} from "../../models/ExtraitsMariages/extrait-mariage-essentiel.model.ts";
import PdfPreviewer from "../PdfPreviewer.tsx";
import {TypeExtrait} from "../../models/type-extrait.ts";

export default function ExtraitsMariages() {

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [extraits, setExtraits] = useState<ExtraitMariageEssentielVM[]>([]);
  const [extraitToPrint, setExtraitToPrint] = useState<ExtraitMariageEssentielVM | null>(null);
  const [elementAdded, setElementAdded] = useState<boolean>(false);

  const [loaderStatus, setLoaderStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [loaderMessage, setLoaderMessage] = useState<string | undefined>(undefined);

  const loadExtraits = async () => {
    try {
      setLoaderStatus("loading");
      setLoaderMessage("Chargement...");

      const reponse = await listerExtraitsMariages();
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

  const handleExtraitToPrint = (extrait: ExtraitMariageEssentielVM | null) => {
    setExtraitToPrint(extrait);
  };

  return (
      <>
        <PageBreadcrumb pageTitle="Gestion des extraits de mariage"/>
        <div className="space-y-6">
          <LoaderBanner status={loaderStatus} message={loaderMessage}/>

          <ComponentCard title="Liste des extraits">
            <div className="flex justify-end mb-4">
              <button
                  onClick={() => setIsAddModalOpen(true)}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Ajouter
              </button>
            </div>

            <EditerExtraitMariageModal
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

            <ListeExtraitsMariagesTable
                extraits={extraits}
                setExtraits={setExtraits}
                setExtraitToPrint={handleExtraitToPrint}
                setLoaderStatus={handleLoaderStatus}
            />

            {extraitToPrint && (
                <div className="mt-6">
                  <PdfPreviewer
                      extrait={extraitToPrint}
                      typeExtrait={TypeExtrait.MARIAGE}
                      setLoaderStatus={setLoaderStatus}
                      onClose={() => setExtraitToPrint(null)}
                  />
                </div>
            )}
          </ComponentCard>
        </div>
      </>
  )
}