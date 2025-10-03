import {CheckCircleIcon, InfoOrangeIcon, XCircle} from "../../../icons";
import {ElementType} from "react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  type: "success" | "error" | "info" | "";
  message: string;
}

export default function ModalRetourAppelApi({isOpen, onClose, type, message}: Props) {

  if (!isOpen) return null;
  if (type === "") return null;

  let IconComponent: ElementType;
  let titleText: string;
  let iconColorClass: string;
  let buttonBgClasses: string;

  if (type === "success") {
    IconComponent = CheckCircleIcon;
    titleText = "Succès !";
    iconColorClass = "text-green-600";
    buttonBgClasses = "bg-green-600 hover:bg-green-700";
  } else if (type === "error") {
    IconComponent = XCircle;
    titleText = "Erreur !";
    iconColorClass = "text-red-600";
    buttonBgClasses = "bg-red-600 hover:bg-red-700";
  } else if (type === "info") {
    IconComponent = InfoOrangeIcon;
    titleText = "Information";
    iconColorClass = "text-blue-600";
    buttonBgClasses = "bg-orange-600 hover:bg-orange-700";
  } else {
    return null;
  }

  const iconSizeClasses = "h-18 w-18";

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
            <IconComponent className={`${iconSizeClasses} ${iconColorClass}`} />
          </div>

          {/* Titre */}
          <h2 className="text-center text-3xl font-semibold text-black mb-2">
            {titleText}
          </h2>

          {/* Message */}
          <p className="text-center text-gray-600 mb-6">{message}</p>

          {/* Bouton OK */}
          <div className="flex justify-center">
            <button
                onClick={onClose}
                className={`rounded-lg px-6 py-2 font-medium text-white shadow-md ${buttonBgClasses}`}
            >
              OK
            </button>
          </div>
        </div>
      </div>
  );
}