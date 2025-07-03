import { create } from 'zustand'

interface UIState {
  viewMode: 'table' | 'kanban'
  setViewMode: (mode: 'table' | 'kanban') => void
}

export const useUIStore = create<UIState>((set) => ({
  viewMode: 'table',
  setViewMode: (mode) => set({ viewMode: mode }),
}))
