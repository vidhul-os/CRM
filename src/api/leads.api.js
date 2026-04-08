import api from './axios'

export const getLeads     = (params) => api.get('/leads', { params })
export const getLeadById  = (id)     => api.get(`/leads/${id}`)
export const createLead   = (data)   => api.post('/leads', data)
export const updateLead   = (id, data)=> api.patch(`/leads/${id}`, data)
export const deleteLead   = (id)     => api.delete(`/leads/${id}`)

export const getMyLeads   = (params) => api.get('/leads/my-leads', { params })
export const getHotLeads  = (params) => api.get('/leads/hot-leads', { params })

const leadsApi = {
  getLeads,
  getLeadById,
  createLead,
  updateLead,
  deleteLead,
  getMyLeads,
  getHotLeads,
}

export default leadsApi
