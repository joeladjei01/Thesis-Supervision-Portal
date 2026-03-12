import type { MeetingSchedule } from "../utils/types";
import { create } from "zustand";

export interface Student {
  id: string;
  student: {
    id: string;
    name: string;
    student_id: string;
    programme: string;
    level: string;
    user: {
      email: string;
    };
    programme_level: {
      id?: string;
      name: string;
    };
  };
}

interface DataState {
  assignedStudents: Student[];
  topicProposals: any[];
  submissions: any[];
  programmeLevels: any[];
  meetingSchedules: MeetingSchedule[];
}

interface DataActions {
  setAssignedStudents: (students: any[]) => void;
  setTopicProposals: (proposals: any[]) => void;
  setSubmissions: (submissions: any[]) => void;
  setProgrammeLevels: (levels: any[]) => void;
  setMeetingSchedules: (schedules: any[]) => void;
  reset: () => void;
}

export const useSupervisorDataStore = create<DataState & DataActions>(
  (set) => ({
    assignedStudents: [],
    topicProposals: [],
    submissions: [],
    programmeLevels: [],
    meetingSchedules: [],
    setAssignedStudents: (students) => set({ assignedStudents: students }),
    setTopicProposals: (proposals) => set({ topicProposals: proposals }),
    setSubmissions: (submissions) => set({ submissions: submissions }),
    setProgrammeLevels: (levels) => set({ programmeLevels: levels }),
    setMeetingSchedules: (schedules) => set({ meetingSchedules: schedules }),
    reset: () =>
      set({
        assignedStudents: [],
        topicProposals: [],
        submissions: [],
        programmeLevels: [],
      }),
  }),
);
