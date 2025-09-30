import {Table, TableBody, TableCell, TableHeader, TableRow,} from "../../../components/ui/table";
import LigneActionInstitutionTable from "./LigneActionInstitutionTable.tsx";
import {useEffect, useState} from "react";
import {InstitutionVM} from "../../../models/institution.model.ts";
import {recupererInstitutionActif} from "../../../services/institution-actif.service.ts";
import {InstitutionActif} from "../types.ts";

interface Props {
  institutions: InstitutionVM[];
  setInstitutions: (institutions: any) => void;
  setLoaderStatus: (status: "idle" | "loading" | "success" | "error", message?: string) => void;
}

export default function ListeInstitutionsTable(
    {
      institutions,
      setInstitutions,
      setLoaderStatus,
    }: Props) {

  const [institutionActif, setInstitutionActif] = useState<InstitutionActif | null>(null);

  useEffect(() => {
    const institutionActif = recupererInstitutionActif();
    setInstitutionActif(institutionActif);
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
                  Département
                </TableCell>
                <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Centre d'État Civil
                </TableCell>
                <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  État Civil
                </TableCell>
                <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Tribunal
                </TableCell>
                <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Ville
                </TableCell>
                <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Officier
                </TableCell>
                <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Titre Officier
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
              {institutions?.map((institution: InstitutionVM) => (
                  <TableRow key={institution.id}>
                    <TableCell
                        className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      {institution.departement}
                    </TableCell>
                    <TableCell
                        className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      {institution.centreEtatCivil}
                    </TableCell>
                    <TableCell
                        className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      {institution.etatCivil}
                    </TableCell>
                    <TableCell
                        className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      {institution.tribunal}
                    </TableCell>
                    <TableCell
                        className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      {institution.ville}
                    </TableCell>
                    <TableCell
                        className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      {institution.officier}
                    </TableCell>
                    <TableCell
                        className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      {institution.titreOfficier}
                    </TableCell>

                    <TableCell
                        className="px-5 py-3 font-bold text-gray-500 text-center text-theme-sm dark:text-gray-400 w-25">
                      <p className={institutionActif?.id === institution.id ? "bg-[#12B76A] text-white" : "bg-gray-200"}>
                        {institutionActif?.id == institution.id ? "OUI" : "NON"}
                      </p>
                    </TableCell>

                    <LigneActionInstitutionTable
                        institution={institution}
                        setInstitutions={setInstitutions}
                        setLoaderStatus={setLoaderStatus}
                        setInstitutionActif={setInstitutionActif}
                    />
                  </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
  );
}
