import { create } from 'zustand'
import { 
  getDeals, 
  createDeal as apiCreateDeal, 
  updateDeal as apiUpdateDeal, 
  deleteDeal as apiDeleteDeal 
} from '@/api/deals.api'

export const useDealsStore = create((set, get) => ({
  deals: [],
  selectedDeal: null,
  loading: false,
  error: null,

  fetchDeals: async (params) => {
    set({ loading: true, error: null })
    try {
      const { data: response } = await getDeals(params)
      set({ deals: response.data, loading: false })
    } catch (err) {
      set({ error: err.message, loading: false })
    }
  },

  selectDeal: (deal) => set({ selectedDeal: deal }),

  createDeal: async (payload) => {
    set({ loading: true })
    try {
      const { data } = await apiCreateDeal(payload)
      set(state => ({ deals: [data, ...state.deals], loading: false }))
      return { success: true, data }
    } catch (err) {
      set({ error: err.message, loading: false })
      return { success: false, error: err.message }
    }
  },

  updateDeal: async (id, payload) => {
    set({ loading: true })
    try {
      const { data } = await apiUpdateDeal(id, payload)
      set(state => ({
        deals: state.deals.map(d => (d._id || d.id) === id ? data : d),
        selectedDeal: (state.selectedDeal?._id || state.selectedDeal?.id) === id ? data : state.selectedDeal,
        loading: false
      }))
      return { success: true, data }
    } catch (err) {
      set({ error: err.message, loading: false })
      return { success: false, error: err.message }
    }
  },

  deleteDeal: async (id) => {
    set({ loading: true })
    try {
      await apiDeleteDeal(id)
      set(state => ({
        deals: state.deals.filter(d => (d._id || d.id) !== id),
        selectedDeal: (state.selectedDeal?._id || state.selectedDeal?.id) === id ? null : state.selectedDeal,
        loading: false
      }))
      return { success: true }
    } catch (err) {
      set({ error: err.message, loading: false })
      return { success: false, error: err.message }
    }
  }
}))
