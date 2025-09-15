import {Table, TableBody, TableCell, TableHeader, TableRow,} from "../../../components/ui/Table";
import LigneActionExtraitDecesTable from "./LigneActionExtraitDecesTable.tsx";
import {
  ExtraitDecesEssentielVM
} from "../../../models/ExtraitsDeces/extrait-deces-essentiel.model.ts";

interface Props {
  extraits: ExtraitDecesEssentielVM[];
  setExtraits: (extraits: any) => void;
  setLoaderStatus: (status: "idle" | "loading" | "success" | "error", message?: string) => void;
}

export default function ListeExtraitsDecesTable(
    {
      extraits,
      setExtraits,
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
                  Régistre
                </TableCell>
                <TableCell
                    isHeader
                    className="px-4 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Date Décès
                </TableCell>
                <TableCell
                    isHeader
                    className="px-4 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Lieu Décès
                </TableCell>
                <TableCell
                    isHeader
                    className="px-4 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Nom
                </TableCell>
                <TableCell
                    isHeader
                    className="px-4 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Prénoms
                </TableCell>
                <TableCell
                    isHeader
                    className="px-4 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Nationalité
                </TableCell>
                <TableCell
                    isHeader
                    className="px-4 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Profession
                </TableCell>

                <TableCell
                    isHeader
                    className="px-4 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Domicile
                </TableCell>
                <TableCell
                    isHeader
                    className="px-4 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Registre N
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
              {extraits?.map((extrait) => (
                  <TableRow key={extrait.id}>
                    <TableCell
                        className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      {extrait.registre}
                    </TableCell>
                    <TableCell
                        className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      {extrait.dateDeces
                          ? new Date(extrait.dateDeces).toLocaleDateString("fr-FR")
                          : ""}
                    </TableCell>
                    <TableCell
                        className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      {extrait.lieuDeces}
                    </TableCell>
                    <TableCell
                        className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      {extrait.nom}
                    </TableCell>
                    <TableCell
                        className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      {extrait.prenoms}
                    </TableCell>
                    <TableCell
                        className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      {extrait.nationalite}
                    </TableCell>
                    <TableCell
                        className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      {extrait.profession}
                    </TableCell>
                    <TableCell
                        className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      {extrait.domicile}
                    </TableCell>
                    <TableCell
                        className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      {extrait.registreN}
                    </TableCell>

                    <LigneActionExtraitDecesTable
                        extrait={extrait}
                        setExtraits={setExtraits}
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
