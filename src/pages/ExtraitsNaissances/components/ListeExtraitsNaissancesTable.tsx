import {Table, TableBody, TableCell, TableHeader, TableRow,} from "../../../components/ui/Table";
import {
  ExtraitNaissanceEssentielVM
} from "../../../models/ExtraitsNaissances/extrait-naissance-essentiel.model.ts";
import LigneActionExtraitNaissanceTable from "./LigneActionExtraitNaissanceTable.tsx";

interface Props {
  extraits: ExtraitNaissanceEssentielVM[];
  setExtraits: (extraits: any) => void;
  setLoaderStatus: (status: "idle" | "loading" | "success" | "error", message?: string) => void;
}

export default function ListeExtraitsNaissancesTable(
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
                  Numéro Registre
                </TableCell>
                <TableCell
                    isHeader
                    className="px-4 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Nº J.S
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
                  Date de Naissance
                </TableCell>
                <TableCell
                    isHeader
                    className="px-4 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Lieu de Naissance
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
              {extraits?.map((extrait) => (
                  <TableRow key={extrait.id}>
                    <TableCell
                        className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      {extrait.registre}
                    </TableCell>
                    <TableCell
                        className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      {extrait.numeroJugementSupletif}
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
                      {extrait.dateNaissance
                          ? new Date(extrait.dateNaissance).toLocaleDateString("fr-FR")
                          : ""}
                    </TableCell>
                    <TableCell
                        className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      {extrait.lieuNaissance}
                    </TableCell>
                    <TableCell
                        className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      {extrait.registreN}
                    </TableCell>

                    <LigneActionExtraitNaissanceTable
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
