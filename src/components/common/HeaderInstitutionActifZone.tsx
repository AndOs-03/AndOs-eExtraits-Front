import {useEffect, useState} from "react";
import {Centre} from "../../pages/Centres/types.ts";
import {fetchCentres} from "../../services/centre.service.ts";
import {recupererInstitutionActif} from "../../services/institution-actif.service.ts";
import {InstitutionActif} from "../../pages/Institutions/types.ts";

export default function HeaderInstitutionActifZone() {

  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState<Centre>({
    id: 0,
    nom: "-- Sélectionnez --"
  });
  const [institutions, setInstitutions] = useState<InstitutionActif[]>([]);

  const listerInstitutions = async () => {
    try {
      const institution = recupererInstitutionActif();
      if (institution !== null) {
        setSelected({id: institution.id, nom: institution.nom});
      }

      const reponse = await fetchCentres();
      if (!("message" in reponse)) {
        setInstitutions(reponse);
        if (reponse.length < 1) {
          setSelected({id: 0, nom: "-- Sélectionnez --"});
          setInstitutions([{id: 0, nom: "-- Sélectionnez --"}]);
        }
      } else {
        console.error(reponse.message);
      }
    } catch (err: any) {
      console.error(err);
    }
  };

  useEffect(() => {
    const fetchData = () => {
      listerInstitutions().catch((err) => {
        console.error(err);
      });
    };

    fetchData();
  }, []);


  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleSelect = (institution: InstitutionActif) => {
    setSelected(institution);
    if (institution.id !== 0) {
      localStorage.setItem("eExtraitInstitutionActif", JSON.stringify(institution));
      window.location.reload();
    }
    setIsOpen(false);
  };

  return (
      <div className="relative font-sans text-gray-800">
        <span className="font-bold text-gray-800 dark:text-white/90 mr-2">Institution actif :</span>
        <div className="inline-block relative">
          <button
              onClick={toggleDropdown}
              className="bg-white dark:bg-white/[0.03] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 ease-in-out hover:bg-gray-100"
          >
            <span className="text-gray-500 dark:text-gray-400 font-semibold">{selected.nom}</span>
            <svg
                className={`w-4 h-4 ml-2 inline-block transition-transform duration-200 ${isOpen ? 'transform rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                    d="M19 9l-7 7-7-7"></path>
            </svg>
          </button>

          {isOpen && (
              <div
                  className="absolute top-full left-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10 overflow-hidden">
                <ul className="py-1">
                  {institutions.map((institution) => (
                      <li
                          key={institution.id}
                          onClick={() => handleSelect(institution)}
                          className="px-4 py-2 text-sm text-gray-700 hover:bg-blue-100 hover:text-blue-700 cursor-pointer transition-colors duration-150"
                      >
                        {institution.nom}
                      </li>
                  ))}
                </ul>
              </div>
          )}
        </div>
      </div>
  );
}