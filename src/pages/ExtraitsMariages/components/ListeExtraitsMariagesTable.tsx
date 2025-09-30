import {Table, TableBody, TableCell, TableHeader, TableRow,} from "../../../components/ui/table";
import LigneActionExtraitDecesTable from "./LigneActionExtraitMariageTable.tsx";
import {
  ExtraitMariageEssentielVM
} from "../../../models/ExtraitsMariages/extrait-mariage-essentiel.model.ts";

interface Props {
  extraits: ExtraitMariageEssentielVM[];
  setExtraits: (extraits: any) => void;
  setExtraitToPrint: (extrait: ExtraitMariageEssentielVM | null) => void;
  setLoaderStatus: (status: "idle" | "loading" | "success" | "error", message?: string) => void;
}

export default function ListeExtraitsMariagesTable(
    {
      extraits,
      setExtraits,
      setExtraitToPrint,
      setLoaderStatus,
    }: Props) {

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
                    className="px-4 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Numéro Registre
                </TableCell>
                <TableCell
                    isHeader
                    className="px-4 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Date Mariage
                </TableCell>
                <TableCell
                    isHeader
                    className="px-4 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Époux
                </TableCell>
                <TableCell
                    isHeader
                    className="px-4 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Épouse
                </TableCell>
                <TableCell
                    isHeader
                    className="px-4 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Registre
                </TableCell>
                <TableCell
                    isHeader
                    className="px-4 py-3 font-medium text-gray-500 text-right text-theme-xs dark:text-gray-400 w-auto"
                >
                  Action
                </TableCell>
              </TableRow>
            </TableHeader>

            {/* Table Body */}
            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {extraits?.map((extrait: ExtraitMariageEssentielVM) => (
                  <TableRow key={extrait.id}>
                    <TableCell
                        className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      {extrait.registre}
                    </TableCell>
                    <TableCell
                        className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      {extrait.dateMariage
                          ? new Date(extrait.dateMariage).toLocaleDateString("fr-FR")
                          : ""}
                    </TableCell>
                    <TableCell
                        className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      {extrait.epoux?.nomPrenoms}
                    </TableCell>
                    <TableCell
                        className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      {extrait.epouse?.nomPrenoms}
                    </TableCell>
                    <TableCell
                        className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      {extrait.registreN}
                    </TableCell>

                    <LigneActionExtraitDecesTable
                        extrait={extrait}
                        setExtraits={setExtraits}
                        setExtraitToPrint={setExtraitToPrint}
                        setLoaderStatus={setLoaderStatus}
                    />
                  </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
  );
}
