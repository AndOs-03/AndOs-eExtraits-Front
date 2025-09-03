import { useEffect, useRef, useState } from "react";
import { TableCell } from "../../ui/table";

export default function BoutonActionList({order}) {

    const [open, setOpen] = useState(false)
  const menuRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                  <button
                    onClick={() => setOpen((prev) => !prev)}
                    className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    ...
                  </button>

                  {open && (
                    <div
                      ref={menuRef}
                      className="absolute right-0 mt-2 w-40 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black/5 z-10"
                    >
                      <ul className="py-1">
                        <li>
                          <button
                            onClick={() => console.log("Modifier", order.id)}
                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                          >
                            Modifier
                          </button>
                        </li>
                        <li>
                          <button
                            onClick={() => console.log("Supprimer", order.id)}
                            className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-700"
                          >
                            Supprimer
                          </button>
                        </li>
                      </ul>
                    </div>
                  )}
                </TableCell>
  )
}