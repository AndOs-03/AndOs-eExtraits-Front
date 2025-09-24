import {CheckCircleIcon, XCircle} from "../../../icons";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  type: "success" | "error" | "";
  message: string;
}

export default function ModalRetourAppelApi ({isOpen, onClose, type, message}: Props) {

  if (!isOpen) return null;
  if (type === "") return null;
  const isSuccess = type === "success";

  return (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50">
        <div className="relative w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
          {/* Bouton X en haut à droite */}
          <button
              onClick={onClose}
              className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 text-gray-500 hover:bg-gray-300 hover:text-gray-700 transition"
          >
            X
          </button>

          {/* Icône */}
          <div className="flex justify-center mb-5">
            {isSuccess ? (
                <CheckCircleIcon className="h-18 w-18 text-green-600" />
            ) : (
                <XCircle className="h-18 w-18 text-red-600" />
            )}
          </div>

          {/* Titre */}
          <h2 className="text-center text-3xl font-semibold text-black mb-2">
            {isSuccess ? "Succès !" : "Erreur !"}
          </h2>

          {/* Message */}
          <p className="text-center text-gray-600 mb-6">{message}</p>

          {/* Bouton OK */}
          <div className="flex justify-center">
            <button
                onClick={onClose}
                className={`rounded-lg px-6 py-2 font-medium text-white shadow-md ${
                    isSuccess
                        ? "bg-green-600 hover:bg-green-700"
                        : "bg-red-600 hover:bg-red-700"
                }`}
            >
              OK
            </button>
          </div>
        </div>
      </div>
  );
}