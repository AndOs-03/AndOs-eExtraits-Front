import {Table, TableBody, TableCell, TableHeader, TableRow,} from "../../../components/ui/Table";
import LigneActionCentreTable from "./LigneActionCentreTable.tsx";
import {Centre} from "../types.ts";
import {useEffect, useState} from "react";
import {recupererCentreActif} from "../../../services/centre-actif.service.ts";

interface Props {
  centres: Centre[];
  setCentres: (centres: any) => void;
  setLoaderStatus: (status: "idle" | "loading" | "success" | "error", message?: string) => void;
}

export default function ListeCentresTable({centres, setCentres, setLoaderStatus,}: Props) {

  const [centreActif, setCentreActif] = useState<Centre | null>(null);

  useEffect(() => {
    const centreActif = recupererCentreActif();
    setCentreActif(centreActif);
  }, []);

  return (
      <div
          className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="max-w-full overflow-x-auto">
          <Table>
            {/* Table Header */}
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Nom
                </TableCell>
                <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Actif
                </TableCell>
                <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-right text-theme-xs dark:text-gray-400 w-auto"
                >
                  Action
                </TableCell>
              </TableRow>
            </TableHeader>

            {/* Table Body */}
            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {centres?.map((centre) => (
                  <TableRow key={centre.id}>
                    <TableCell
                        className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      {centre.nom}
                    </TableCell>
                    <TableCell
                        className="px-5 py-3 font-bold text-gray-500 text-center text-theme-sm dark:text-gray-400 w-25">
                      <p className={centreActif?.id === centre.id ? "bg-[#12B76A] text-white" : "bg-gray-200"}>
                        {centreActif?.id == centre.id ? "OUI" : "NON"}
                      </p>
                    </TableCell>

                    <LigneActionCentreTable
                        centre={centre}
                        setCentres={setCentres}
                        setLoaderStatus={setLoaderStatus}
                        setCentreActif={setCentreActif}
                    />
                  </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
  );
}
