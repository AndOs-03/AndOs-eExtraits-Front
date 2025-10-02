import {useEffect, useState} from "react";
import {tableauBordExtraits as apiTableauBordExtraits} from "../services/tableau-bord.service.ts";
import {recupererCentreActif} from "../services/centre-actif.service.ts";
import {TableauBordExtraitsVM} from "../models/tableau-bord-extraits.model.ts";

export default function Accueil() {

  const [tableauBordExtrait, setTableauBordExtrait] = useState<TableauBordExtraitsVM>(
      new TableauBordExtraitsVM(0, 0, 0)
  );

  const tableauBordExtraits = async () => {
    try {
      const centre = recupererCentreActif();
      let centreId = null;
      if (centre !== null) {
        centreId = centre.id;
      }

      const reponse = await apiTableauBordExtraits(centreId);
      if (!("message" in reponse)) {
        setTableauBordExtrait(reponse);
      } else {
        console.error(reponse.message);
      }
    } catch (err: any) {
      console.error(err);
    }
  };

  useEffect(() => {
    const fetchData = () => {
      tableauBordExtraits().catch((err) => {
        console.error(err);
      });
    };

    fetchData();
  }, []);

  return (
      <>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4">
          <div
              className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
            <div
                className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800">
              <span className="fill-gray-800 dark:fill-white/90">📊</span>
            </div>
            <div className="mt-5 flex items-end justify-between">
              <div>
                <span
                    className="text-sm text-gray-500 dark:text-gray-400">Extraits de Naissances</span>
                <h4 className="mt-2 text-title-sm font-bold text-gray-800 dark:text-white/90">
                  {tableauBordExtrait.nombreExtraitsNaissance}
                </h4>
              </div>
            </div>
          </div>

          <div
              className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
            <div
                className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800">
              <span className="fill-gray-800 dark:fill-white/90">📊</span>
            </div>
            <div className="mt-5 flex items-end justify-between">
              <div>
                <span
                    className="text-sm text-gray-500 dark:text-gray-400">Extraits de Mariages</span>
                <h4 className="mt-2 text-title-sm font-bold text-gray-800 dark:text-white/90">
                  {tableauBordExtrait.nombreExtraitsMariages}
                </h4>
              </div>
            </div>
          </div>

          <div
              className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
            <div
                className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800">
              <span className="fill-gray-800 dark:fill-white/90">📊</span>
            </div>
            <div className="mt-5 flex items-end justify-between">
              <div>
                <span className="text-sm text-gray-500 dark:text-gray-400">Extraits de Décès</span>
                <h4 className="mt-2 text-title-sm font-bold text-gray-800 dark:text-white/90">
                  {tableauBordExtrait.nombreExtraitsDeces}
                </h4>
              </div>
            </div>
          </div>
        </div>
      </>
  )
}