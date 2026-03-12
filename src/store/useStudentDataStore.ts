import type { ChapterSubmission, ChapterSubmissionFeedback } from "@/utils/types";
import { create } from "zustand";

interface StudentDataState {
  topics: any[];
  chapters: any[];
  feedbacks: ChapterSubmissionFeedback[];
  submissions: ChapterSubmission[];
  supervisors: any[];
}

interface Actions {
  setFeedbacks: (feedbacks: any[]) => void;
  setChapters: (chapters: any[]) => void;
  setTopics: (topics: any[]) => void;
  setSubmissions: (submissions: any[]) => void;
  reset: () => void;
  setSupervisors: (Supervisors: any) => void;
}

export const useStudentDataStore = create<StudentDataState & Actions>(
  (set) => ({
    topics: [],
    chapters: [],
    feedbacks: [],
    submissions: [],
    supervisors: [],

    setFeedbacks: (feedbacks) => set(() => ({ feedbacks })),
    setChapters: (chapters) => set(() => ({ chapters })),
    setTopics: (topics) => set(() => ({ topics })),
    setSubmissions: (submissions) => set(() => ({ submissions })),
    setSupervisors: (supervisors) => set(() => ({ supervisors })),
    reset: () =>
      set(() => ({
        topics: [],
        chapters: [],
        feedbacks: [],
        submissions: [],
        supervisors: [],
      })),
  }),
);
