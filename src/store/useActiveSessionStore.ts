import { create } from "zustand";

interface ActiveSessionState {
  sessionExpiry: boolean;
  setSessionExpiry: (expiry: boolean) => void;
}

const useActiveSessionStore = create<ActiveSessionState>((set) => ({
  sessionExpiry: false,
  setSessionExpiry: (expiry: boolean) => set(() => ({ sessionExpiry: expiry })),
}));

export default useActiveSessionStore;
