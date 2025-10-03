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
import ModalRetourAppelApi from "../../components/ui/modal/modal-retour-appel-api.tsx";

export default function ExtraitsNaissances() {

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [extraits, setExtraits] = useState<ExtraitNaissanceEssentielVM[]>([]);
  const [extraitToPrint, setExtraitToPrint] = useState<ExtraitNaissanceEssentielVM | null>(null);
  const [elementAdded, setElementAdded] = useState<boolean>(false);

  const [loaderStatus, setLoaderStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [loaderMessage, setLoaderMessage] = useState<string | undefined>(undefined);

  const [isReponseApiOpen, setIsReponseApiOpen] = useState<boolean>(false)
  const [messageReponseApi, setMessageReponseApi] = useState<string>("")
  const [typeReponseApi, setTypeReponseApi] = useState<"success" | "error" | "info" | "">("")

  const [isCherche, setIscherche] = useState(false);
  const [extraitsFilter, setExtraitsFilter] = useState<ExtraitNaissanceEssentielVM[]>([]);

  const loadExtraits = async () => {
    try {
      setLoaderStatus("loading");
      setLoaderMessage("Chargement...");

      const centre = recupererCentreActif();
      if (centre === null) {
        setIsReponseApiOpen(true);
        setMessageReponseApi("Veillez activer un centre pour continuer !");
        setTypeReponseApi("info");
        handleLoaderStatus(loaderStatus, loaderMessage)
        return;
      }

      const reponse = await listerExtraitsNaissances(centre?.id!);
      if ("message" in reponse) {
        setIsReponseApiOpen(true);
        setMessageReponseApi(reponse.message || "Impossible de lister les données !");
        setTypeReponseApi("error");
      } else {
        setExtraits(reponse);
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

  const handleModalReponseApiClose = () => {
    setIsReponseApiOpen(false)
    setMessageReponseApi("")
    setTypeReponseApi("")
  }

  const handleOnCherche = (recherche: string) => {
    if (recherche === "") {
      setIscherche(false);
    } else {
      setIscherche(true);
      const filteredExtraits = extraits.filter((extrait) =>
          (extrait.nom + " " + extrait.prenoms).toLowerCase().includes(recherche.toLowerCase())
          || extrait.registre?.includes(recherche)
          || extrait.registreN === recherche
          || new Date(extrait.dateNaissance ?? "").toLocaleDateString("fr-FR").includes(recherche)
          || (extrait.numeroJugementSupletif ?? "") === recherche
      );

      setExtraitsFilter(filteredExtraits);
    }
  }

  return (
      <>
        <PageBreadcrumb pageTitle="Gestion des extraits de naissance"/>
        <div className="space-y-6">
          <LoaderBanner status={loaderStatus} message={loaderMessage}/>

          <ComponentCard title="Liste des extraits">
            <div className="flex items-center justify-between mb-4">
              <div className="relative w-full sm:w-2/3 md:w-1/2 lg:w-1/3 mr-2">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <svg
                      className="w-5 h-5 text-gray-400"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                  >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z"
                    />
                  </svg>
                </span>

                <input
                    type="search"
                    name="iRecherche"
                    id="iRecherche"
                    placeholder="Rechercher..."
                    onChange={(e) => {
                      const value = e.target.value;
                      handleOnCherche(value);
                    }}
                    className="w-full pl-10 pr-4 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600"
                />
              </div>

              {/* Bouton ajouter */}
              <div>
                <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="px-4 py-2 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  Ajouter
                </button>
              </div>
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
                setElementAdded={handleElementAdd}
            />

            <ListeExtraitsNaissancesTable
                extraits={isCherche ? extraitsFilter : extraits}
                setExtraits={setExtraits}
                setExtraitToPrint={handleExtraitToPrint}
                setLoaderStatus={handleLoaderStatus}
            />

            {extraitToPrint && (
                <div className="mt-6">
                  <PdfPreviewer
                      extrait={extraitToPrint}
                      typeExtrait={TypeExtrait.NAISSANCE}
                      onClose={() => setExtraitToPrint(null)}
                  />
                </div>
            )}

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