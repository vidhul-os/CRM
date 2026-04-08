import api from './axios'

export const getNotes     = (params) => api.get('/notes', { params })
export const createNote    = (data)   => api.post('/notes', data)
export const updateNote    = (id, data)=> api.patch(`/notes/${id}`, data)
export const deleteNote    = (id)     => api.delete(`/notes/${id}`)

const notesApi = {
  getNotes,
  createNote,
  updateNote,
  deleteNote,
}

export default notesApi
