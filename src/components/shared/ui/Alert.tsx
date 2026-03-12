import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";
import SolidButton from "../buttons/SolidButton";

interface AlertContextType {
  confirm: (message: string) => Promise<boolean>;
}

interface AlertState {
  message: string;
  resolve: (result: boolean) => void;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export const AlertProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [alertState, setAlertState] = useState<AlertState | null>(null);

  // Show confirm dialog, return a promise
  const confirm = useCallback((message: string): Promise<boolean> => {
    return new Promise((resolve) => {
      setAlertState({ message, resolve });
    });
  }, []);

  const handleConfirm = (result: boolean) => {
    if (alertState?.resolve) alertState.resolve(result);
    setAlertState(null);
  };

  return (
    <AlertContext.Provider value={{ confirm }}>
      {children}

      {alertState && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-[90%] max-w-sm p-4 text-center">
            <p className="text-gray-700 text-left leading-5.5 text-lg mb-6 font-nunito-sans">{alertState.message}</p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => handleConfirm(false)}
                className="px-4 py-2 cursor-pointer bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition"
              >
                Cancel
              </button>
              <SolidButton
                title="OK"
                onClick={() => handleConfirm(true)}
              />
            </div>
          </div>
        </div>
      )}
    </AlertContext.Provider>
  );
};

export const useAlertContext = (): AlertContextType => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error("useAlertContext must be used within an AlertProvider");
  }
  return context;
};