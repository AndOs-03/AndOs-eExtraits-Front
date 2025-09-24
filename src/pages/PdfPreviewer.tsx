import {useEffect, useState} from "react";
import {TypeExtrait} from "../models/type-extrait.ts";
import {genererFichierExtrait as genererExtraitDeces} from "../services/extrait-deces.service.ts";
import {
  genererFichierExtrait as genererExtraitMariage
} from "../services/extrait-mariage.service.ts";
import {
  genererFichierExtrait as genererExtraitNaissance
} from "../services/extrait-naissance.service.ts";
import {recupererCentreActif} from "../services/centre-actif.service.ts";
import {recupererInstitutionActif} from "../services/institution-actif.service.ts";
import {ApiError} from "../api/types.ts";
import {ExtraitDecesEssentielVM} from "../models/ExtraitsDeces/extrait-deces-essentiel.model.ts";
import {
  ExtraitMariageEssentielVM
} from "../models/ExtraitsMariages/extrait-mariage-essentiel.model.ts";
import {
  ExtraitNaissanceEssentielVM
} from "../models/ExtraitsNaissances/extrait-naissance-essentiel.model.ts";

interface Props {
  extrait: ExtraitDecesEssentielVM | ExtraitMariageEssentielVM | ExtraitNaissanceEssentielVM;
  typeExtrait: TypeExtrait;
  setLoaderStatus: (status: "idle" | "loading" | "success" | "error", message?: string) => void;
  onClose: () => void;
}

export default function PdfPreviewer({extrait, typeExtrait, setLoaderStatus, onClose}: Props) {

  const [pdfUrl, setPdfUrl] = useState<string | null>(null)

  const chargerFichierExtrait = async () => {
    try {
      const centre = recupererCentreActif();
      const institution = recupererInstitutionActif();

      setLoaderStatus("loading", "Chargement...");

      let reponse: ApiError | Blob | undefined = undefined;
      switch (typeExtrait) {
        case TypeExtrait.DECES: {
          if (institution?.id && centre?.id) {
            reponse = await genererExtraitDeces(extrait.id, institution?.id, centre?.id);
          }
          break
        }
        case TypeExtrait.MARIAGE: {
          if (institution?.id && centre?.id) {
            reponse = await genererExtraitMariage(extrait.id, institution?.id, centre?.id);
          }
          break
        }
        case TypeExtrait.NAISSANCE: {
          if (institution?.id) {
            reponse = await genererExtraitNaissance(extrait.id, institution?.id);
          }
          break
        }
      }

      if (reponse !== undefined && "message" in reponse) {
        setLoaderStatus("error", reponse!.message || "Erreur de génération du PDF ");
      } else {
        const blob = reponse as Blob;
        const url = URL.createObjectURL(blob);
        setPdfUrl(url);
      }
    } catch (err: any) {
      setLoaderStatus("error", err.message || "Erreur de génération du PDF " + err);
    }
  }

  useEffect(() => {
    chargerFichierExtrait().catch((err) => console.error(err));

    return () => {
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl)
      }
    }
  }, [extrait]);

  const genererNomPdf = (): string => {
    switch (typeExtrait) {
      case TypeExtrait.DECES: {
        const extraitDeces = extrait as ExtraitDecesEssentielVM;
        const nom: string = extraitDeces.nom;
        const prenoms: string = extraitDeces.prenoms;
        return "extrait - décès - " + nom + " " + prenoms + ".pdf";
      }
      case TypeExtrait.MARIAGE: {
        const extraitMariage = extrait as ExtraitMariageEssentielVM;
        const nom: string = extraitMariage.epoux.nomPrenoms;
        return "extrait - mariage - " + nom + ".pdf";
      }
      case TypeExtrait.NAISSANCE: {
        const extraitNaissance = extrait as ExtraitNaissanceEssentielVM;
        const nom: string = extraitNaissance.nom;
        const prenoms: string = extraitNaissance.prenoms;
        return "extrait - naissance - " + nom + " " + prenoms + ".pdf";
      }
    }
  }

  return (
      <div className="mt-6 border rounded-lg shadow p-4 bg-white">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-semibold">Prévisualisation PDF</h3>
          <button
              onClick={onClose}
              className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600">
            X
          </button>
        </div>

        {pdfUrl ? (
            <>
              <iframe
                  src={pdfUrl}
                  className="w-full h-[600px] border"
                  title="PDF Preview"
              />
              <div className="flex justify-end gap-2 mt-2">
                <a
                    href={pdfUrl}
                    download={genererNomPdf()}
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  Télécharger
                </a>
                <button
                    onClick={() => {
                      const win = window.open(pdfUrl!);
                      win?.print();
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Imprimer
                </button>
              </div>
            </>
        ) : (
            <p>Génération du PDF en cours...</p>
        )}
      </div>
  );
}