import { create } from 'zustand'
import { 
  getLeads, 
  createLead as apiCreateLead, 
  updateLead as apiUpdateLead, 
  deleteLead as apiDeleteLead 
} from '@/api/leads.api'

export const useLeadsStore = create((set, get) => ({
  leads: [],
  selectedLead: null,
  loading: false,
  error: null,

  fetchLeads: async (params) => {
    set({ loading: true, error: null })
    try {
      const { data: response } = await getLeads(params)
      set({ leads: response.data, loading: false }) // unwrapping backend { data: leads, ... }
    } catch (err) {
      set({ error: err.message, loading: false })
    }
  },

  selectLead: (lead) => set({ selectedLead: lead }),

  createLead: async (payload) => {
    set({ loading: true })
    try {
      const { data } = await apiCreateLead(payload)
      set(state => ({ leads: [data, ...state.leads], loading: false }))
      return { success: true, data }
    } catch (err) {
      set({ error: err.message, loading: false })
      return { success: false, error: err.message }
    }
  },

  updateLead: async (id, payload) => {
    set({ loading: true })
    try {
      const { data } = await apiUpdateLead(id, payload)
      set(state => ({
        leads: state.leads.map(l => (l._id || l.id) === id ? data : l),
        selectedLead: (state.selectedLead?._id || state.selectedLead?.id) === id ? data : state.selectedLead,
        loading: false
      }))
      return { success: true, data }
    } catch (err) {
      set({ error: err.message, loading: false })
      return { success: false, error: err.message }
    }
  },

  deleteLead: async (id) => {
    set({ loading: true })
    try {
      await apiDeleteLead(id)
      set(state => ({
        leads: state.leads.filter(l => (l._id || l.id) !== id),
        selectedLead: (state.selectedLead?._id || state.selectedLead?.id) === id ? null : state.selectedLead,
        loading: false
      }))
      return { success: true }
    } catch (err) {
      set({ error: err.message, loading: false })
      return { success: false, error: err.message }
    }
  }
}))
