

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const NavigationStore = create(
        persist(
            (set, get) => ({
  history: [],
  currentIndex: -1,
  AddPageToHistory: (page) => set((state) => {
    const newHistory = [...state.history.slice(0, state.currentIndex + 1), page];
    return {
      history: newHistory,
      currentIndex: newHistory.length - 1,
    };
  }),
  GoBack: () => set((state) => {
    if (state.currentIndex > 0) {
      return { currentIndex: state.currentIndex - 1 };
    }
    return state;
  }),
  GoForward: () => set((state) => {
    if (state.currentIndex < state.history.length - 1) {
      return { currentIndex: state.currentIndex + 1 };
    }
    return state;
  }),
  GetCurrentPage: () => (state) => state.history[state.currentIndex] || null,
}), {
    name: 'navigation-store', // Storage key in localStorage
    getStorage: () => localStorage, // You can replace with sessionStorage
}));
