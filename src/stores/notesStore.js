import { create } from 'zustand'
import { 
  getNotes, 
  createNote as apiCreateNote, 
  updateNote as apiUpdateNote, 
  deleteNote as apiDeleteNote 
} from '@/api/notes.api'

export const useNotesStore = create((set, get) => ({
  notes: [],
  loading: false,
  error: null,

  fetchNotes: async (params) => {
    set({ loading: true, error: null })
    try {
      const { data: response } = await getNotes(params)
      set({ notes: response.data, loading: false })
    } catch (err) {
      set({ error: err.message, loading: false })
    }
  },

  createNote: async (payload) => {
    set({ loading: true })
    try {
      const { data } = await apiCreateNote(payload)
      set(state => ({ notes: [data, ...state.notes], loading: false }))
      return { success: true, data }
    } catch (err) {
      set({ error: err.message, loading: false })
      return { success: false, error: err.message }
    }
  },

  updateNote: async (id, payload) => {
    set({ loading: true })
    try {
      const { data } = await apiUpdateNote(id, payload)
      set(state => ({
        notes: state.notes.map(n => (n._id || n.id) === id ? data : n),
        loading: false
      }))
      return { success: true, data }
    } catch (err) {
      set({ error: err.message, loading: false })
      return { success: false, error: err.message }
    }
  },

  deleteNote: async (id) => {
    set({ loading: true })
    try {
      await apiDeleteNote(id)
      set(state => ({
        notes: state.notes.filter(n => (n._id || n.id) !== id),
        loading: false
      }))
      return { success: true }
    } catch (err) {
      set({ error: err.message, loading: false })
      return { success: false, error: err.message }
    }
  }
}))
