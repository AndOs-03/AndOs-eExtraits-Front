import {useEffect, useState} from "react";
import {fetchInstitutions} from "../../services/institution.service.ts";
import PageBreadcrumb from "../../components/common/PageBreadCrumb.tsx";
import ComponentCard from "../../components/common/ComponentCard.tsx";
import LoaderBanner from "../../components/common/LoaderBanner.tsx";
import {InstitutionVM} from "../../models/institution.model.ts";
import ListeInstitutionsTable from "./components/ListeInstitutionsTable.tsx";
import EditerInstitutionModal from "./components/EditerInstitutionModal.tsx";
import ModalRetourAppelApi from "../../components/ui/modal/modal-retour-appel-api.tsx";
import {useModal} from "../../hooks/useModal.ts";

export default function Institutions() {

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [institutions, setInstitutions] = useState<InstitutionVM[]>([]);
  const [elementAdded, setElementAdded] = useState<boolean>(false);

  const [loaderStatus, setLoaderStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [loaderMessage, setLoaderMessage] = useState<string | undefined>(undefined);

  const [isReponseApiOpen, setIsReponseApiOpen] = useState<boolean>(false)
  const [messageReponseApi, setMessageReponseApi] = useState<string>("")
  const [typeReponseApi, setTypeReponseApi] = useState<"success" | "error" | "">("")

  const { isOpen, openModal, closeModal } = useModal();

  const loadInstitutions = async () => {
    try {
      setLoaderStatus("loading");
      setLoaderMessage("Chargement des institutions...");
      const reponse = await fetchInstitutions();

      if ("message" in reponse) {
        setIsReponseApiOpen(true);
        setMessageReponseApi(reponse.message || "Impossible de lister les données !");
        setTypeReponseApi("error");
      } else {
        setInstitutions(reponse);
        setLoaderStatus("success");
      }
    } catch (err: any) {
      setIsReponseApiOpen(true);
      setMessageReponseApi(err);
      setTypeReponseApi("error");
    }

    handleLoaderStatus(loaderStatus, loaderMessage)
  };

  useEffect(() => {
    const fetchData = () => {
      loadInstitutions().catch((err) => {
        console.error(err);
      });
    };

    fetchData();
  }, []);

  let reloadData = async () => {
    await loadInstitutions();
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
    setLoaderMessage("Institution ajouté avec succès ✅");
  };

  const handleModalReponseApiClose = () => {
    setIsReponseApiOpen(false)
    setMessageReponseApi("")
    setTypeReponseApi("")
  }

  return (
      <>
        <PageBreadcrumb pageTitle="Gestion des institutions"/>
        <div className="space-y-6">
          <LoaderBanner status={loaderStatus} message={loaderMessage}/>

          <ComponentCard title="Liste des institutions">
            <div className="flex justify-end mb-4">
              <button
                  onClick={() => setIsAddModalOpen(true)}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Ajouter
              </button>
            </div>

            <EditerInstitutionModal
                id={null}
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
                setElementAdded={handleElementAdd}
            />

            <ListeInstitutionsTable
                institutions={institutions}
                setInstitutions={setInstitutions}
                setLoaderStatus={handleLoaderStatus}
            />

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
          </ComponentCard>
        </div>
      </>
  )
}