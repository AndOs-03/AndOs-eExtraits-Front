import {useEffect, useState} from "react";
import {fetchCentres} from "../../services/centre.service.ts";
import {Centre} from "./types.ts";
import PageBreadcrumb from "../../components/common/PageBreadCrumb.tsx";
import ComponentCard from "../../components/common/ComponentCard.tsx";
import ListeCentresTable from "./components/ListeCentresTable.tsx";
import AjouterCentreModal from "./components/AjouterCentreModal.tsx";
import LoaderBanner from "../../components/common/LoaderBanner.tsx";

export default function Centres() {

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [centres, setCentres] = useState<Centre[]>([]);
  const [elementAdded, setElementAdded] = useState<boolean>(false);

  const [loaderStatus, setLoaderStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [loaderMessage, setLoaderMessage] = useState<string | undefined>(undefined);

  const loadCentres = async () => {
    try {
      setLoaderStatus("loading");
      setLoaderMessage("Chargement des centres...");
      const reponse = await fetchCentres();

      if ("message" in reponse) {
        setLoaderStatus("error");
        setLoaderMessage(reponse.message || "Erreur lors du chargement");
      } else {
        setCentres(reponse);
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
      loadCentres().catch((err) => {
        console.error(err);
      });
    };

    fetchData();
  }, []);

  let reloadData = async () => {
    await loadCentres();
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
    setLoaderMessage("Centre ajouté avec succès ✅");
  };

  return (
      <>
        <PageBreadcrumb pageTitle="Gestion des centres"/>
        <div className="space-y-6">
          <LoaderBanner status={loaderStatus} message={loaderMessage}/>

          <ComponentCard title="Liste des centres">
            <div className="flex justify-end mb-4">
              <button
                  onClick={() => setIsAddModalOpen(true)}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Ajouter un centre
              </button>
            </div>

            <AjouterCentreModal
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

            <ListeCentresTable
                centres={centres}
                setCentres={setCentres}
                setLoaderStatus={handleLoaderStatus}
            />
          </ComponentCard>
        </div>
      </>
  )
}