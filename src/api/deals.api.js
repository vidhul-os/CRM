import api from './axios'

export const getDeals     = (params) => api.get('/deals', { params })
export const getDealById  = (id)     => api.get(`/deals/${id}`)
export const createDeal   = (data)   => api.post('/deals', data)
export const updateDeal   = (id, data)=> api.patch(`/deals/${id}`, data)
export const deleteDeal   = (id)     => api.delete(`/deals/${id}`)

const dealsApi = {
  getDeals,
  getDealById,
  createDeal,
  updateDeal,
  deleteDeal,
}

export default dealsApi
