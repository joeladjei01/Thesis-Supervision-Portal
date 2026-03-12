import {create} from 'zustand';

type ChapterState = {
 
  selectedChapter: any | null;
  setSelectedChapter: (chapter: any) => void;
  reset: () => void;
};

const useChapterStore = create<ChapterState>((set) => ({
  selectedChapter: null,
  setSelectedChapter: (chapter) => set({selectedChapter: chapter}),
  reset: () => set({selectedChapter: null}),
}));

export default useChapterStore;