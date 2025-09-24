import {useEffect, useState} from "react";
import {listerExtraitsNaissances} from "../../services/extrait-naissance.service.ts";
import PageBreadcrumb from "../../components/common/PageBreadCrumb.tsx";
import ComponentCard from "../../components/common/ComponentCard.tsx";
import LoaderBanner from "../../components/common/LoaderBanner.tsx";
import {recupererCentreActif} from "../../services/centre-actif.service.ts";
import {
  ExtraitNaissanceEssentielVM
} from "../../models/ExtraitsNaissances/extrait-naissance-essentiel.model.ts";
import ListeExtraitsNaissancesTable from "./components/ListeExtraitsNaissancesTable.tsx";
import EditerExtraitNaissanceModal from "./components/EditerExtraitNaissanceModal.tsx";
import PdfPreviewer from "../PdfPreviewer.tsx";
import {TypeExtrait} from "../../models/type-extrait.ts";

export default function ExtraitsNaissances() {

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [extraits, setExtraits] = useState<ExtraitNaissanceEssentielVM[]>([]);
  const [extraitToPrint, setExtraitToPrint] = useState<ExtraitNaissanceEssentielVM | null>(null);
  const [elementAdded, setElementAdded] = useState<boolean>(false);

  const [loaderStatus, setLoaderStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [loaderMessage, setLoaderMessage] = useState<string | undefined>(undefined);

  const loadExtraits = async () => {
    try {
      setLoaderStatus("loading");
      setLoaderMessage("Chargement...");

      const centre = recupererCentreActif();
      const reponse = await listerExtraitsNaissances(centre?.id!);
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

  const handleExtraitToPrint = (extrait: ExtraitNaissanceEssentielVM | null) => {
    setExtraitToPrint(extrait);
  };

  return (
      <>
        <PageBreadcrumb pageTitle="Gestion des extraits de naissance"/>
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

            <EditerExtraitNaissanceModal
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

            <ListeExtraitsNaissancesTable
                extraits={extraits}
                setExtraits={setExtraits}
                setExtraitToPrint={handleExtraitToPrint}
                setLoaderStatus={handleLoaderStatus}
            />

            {extraitToPrint && (
                <div className="mt-6">
                  <PdfPreviewer
                      extrait={extraitToPrint}
                      typeExtrait={TypeExtrait.NAISSANCE}
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