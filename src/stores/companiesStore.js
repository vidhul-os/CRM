import { create } from 'zustand'
import { 
  getCompanies, 
  createCompany as apiCreateCompany, 
  updateCompany as apiUpdateCompany, 
  deleteCompany as apiDeleteCompany 
} from '@/api/companies.api'

export const useCompaniesStore = create((set, get) => ({
  companies: [],
  selectedCompany: null,
  loading: false,
  error: null,

  fetchCompanies: async (params) => {
    set({ loading: true, error: null })
    try {
      const { data: response } = await getCompanies(params)
      set({ companies: response.data, loading: false })
    } catch (err) {
      set({ error: err.message, loading: false })
    }
  },

  selectCompany: (company) => set({ selectedCompany: company }),

  createCompany: async (payload) => {
    set({ loading: true })
    try {
      const { data } = await apiCreateCompany(payload)
      set(state => ({ companies: [data, ...state.companies], loading: false }))
      return { success: true, data }
    } catch (err) {
      set({ error: err.message, loading: false })
      return { success: false, error: err.message }
    }
  },

  updateCompany: async (id, payload) => {
    set({ loading: true })
    try {
      const { data } = await apiUpdateCompany(id, payload)
      set(state => ({
        companies: state.companies.map(c => (c._id || c.id) === id ? data : c),
        selectedCompany: (state.selectedCompany?._id || state.selectedCompany?.id) === id ? data : state.selectedCompany,
        loading: false
      }))
      return { success: true, data }
    } catch (err) {
      set({ error: err.message, loading: false })
      return { success: false, error: err.message }
    }
  },

  deleteCompany: async (id) => {
    set({ loading: true })
    try {
      await apiDeleteCompany(id)
      set(state => ({
        companies: state.companies.filter(c => (c._id || c.id) !== id),
        selectedCompany: (state.selectedCompany?._id || state.selectedCompany?.id) === id ? null : state.selectedCompany,
        loading: false
      }))
      return { success: true }
    } catch (err) {
      set({ error: err.message, loading: false })
      return { success: false, error: err.message }
    }
  }
}))
