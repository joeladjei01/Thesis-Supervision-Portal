import OutlineButton from "../components/shared/buttons/OutlineButton";
import SolidButton from "../components/shared/buttons/SolidButton";
import { X } from "lucide-react";
import { useEffect } from "react";

interface ModalProps {
  headTitle: string;
  subHeadTitle: string;
  children?: React.ReactNode;
  handleCancel: () => void;
  handleConfirm: () => void;
  buttonDisabled: boolean;
  w?: string;
}

const Modal = ({
  headTitle,
  subHeadTitle,
  children,
  handleCancel,
  handleConfirm,
  buttonDisabled,
  w = "max-w-md",
}: ModalProps) => {
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      handleCancel();
    }
    if (e.key === "Enter" && !buttonDisabled) {
      handleConfirm();
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [buttonDisabled]);

  return (
    <div className="fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-[2px] flex items-center justify-center py-4 z-50 transition-all duration-300">
      <div
        className={`relative bg-white dark:bg-card rounded-xl shadow-2xl ${w} w-full mx-4 overflow-hidden border dark:border-border/50`}
      >
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-5 border-b pb-4 border-gray-100 dark:border-border/80">
            <div>
              <h2 className="text-xl font-bold text-gray-800 dark:text-white tracking-tight">
                {headTitle}
              </h2>
              <p className="text-gray-500 dark:text-gray-400 mt-0.5 text-sm font-medium">
                {subHeadTitle}
              </p>
            </div>
            <button
              onClick={handleCancel}
              className="p-2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-secondary/10 rounded-full transition-all duration-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="max-h-[74vh] overflow-y-auto custom-scrollbar px-2">
            {children}
          </div>

          {/* Action Buttons */}
          {/* <div className="flex gap-3 justify-end">
            <OutlineButton
              title="Cancel"
              onClick={handleCancel}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors
              hover:cursor-pointer
              "
            />

            <SolidButton
              title={"Confirm"}
              onClick={handleConfirm}
              type="submit"
              disabled={buttonDisabled}
              className={`px-6 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors
                hover:cursor-pointer
                disabled:cursor-not-allowed
                 ${
                   !buttonDisabled
                     ? "ug-blue-background text-white hover:bg-blue-700"
                     : "bg-gray-300 text-gray-500 cursor-not-allowed"
                 }`}
            />
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default Modal;
