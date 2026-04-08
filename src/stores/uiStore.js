import { create } from 'zustand'

export const useUiStore = create((set) => ({
  collapsed:  false,
  activeView: 'list',     // 'list' | 'kanban'
  filters:    {},
  sortConfig: { field: 'created', direction: 'desc' },

  toggleSidebar: ()  => set(s => ({ collapsed: !s.collapsed })),
  setView:       (v) => set({ activeView: v }),
  setFilters:    (f) => set({ filters: f }),
  setSort:       (s) => set({ sortConfig: s }),
  clearFilters:  ()  => set({ filters: {} }),
}))
