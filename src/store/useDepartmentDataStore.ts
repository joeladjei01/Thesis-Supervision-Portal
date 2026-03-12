import type { Supervisor } from "@/utils/types";
import { create } from "zustand";

interface DepartmentDataState {
  supervisors: Supervisor[];
  quotas: any[];
  students: any[];
  programTitles: any[];
  researchAreas: any[];
  programmeLevels: any[];
  requests: any[];
}

const initialDepartmentData: DepartmentDataState = {
  supervisors: [],
  students: [],
  quotas: [],
  programTitles: [],
  researchAreas: [],
  programmeLevels: [],
  requests: [],
};

interface Actions {
  setSupervisors: (supervisors: Supervisor[]) => void;
  setStudents: (students: any[]) => void;
  setQuotas: (quotas: any[]) => void;
  setProgramTitles: (programTitles: string[]) => void;
  setResearchAreas: (researchAreas: string[]) => void;
  setRequests: (requests: any[]) => void;
  setProgrammeLevels: (programmeLevels: any[]) => void;
  reset: () => void;
}

export const useDepartmentDataStore = create<DepartmentDataState & Actions>(
  (set) => ({
    ...initialDepartmentData,
    setSupervisors: (supervisors: Supervisor[]) => set(() => ({ supervisors })),
    setQuotas: (quotas: any[]) => set(() => ({ quotas })),
    setProgramTitles: (programTitles: string[]) =>
      set(() => ({ programTitles })),
    setStudents: (students: any[]) => set(() => ({ students })),
    setResearchAreas: (researchAreas: string[]) =>
      set(() => ({ researchAreas })),
    setProgrammeLevels: (programmeLevels: any[]) =>
      set(() => ({ programmeLevels })),
    setRequests: (requests: any[]) => set(() => ({ requests })),
    reset: () =>
      set(() => ({
        supervisors: [],
        quotas: [],
        students: [],
        programTitles: [],
        researchAreas: [],
        programmeLevels: [],
      })),
  })
);
