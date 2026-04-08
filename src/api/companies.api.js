import api from './axios'

export const getCompanies     = (params) => api.get('/companies', { params })
export const getCompanyById   = (id)     => api.get(`/companies/${id}`)
export const createCompany    = (data)   => api.post('/companies', data)
export const updateCompany    = (id, data)=> api.patch(`/companies/${id}`, data)
export const deleteCompany    = (id)     => api.delete(`/companies/${id}`)

const companiesApi = {
  getCompanies,
  getCompanyById,
  createCompany,
  updateCompany,
  deleteCompany,
}

export default companiesApi
