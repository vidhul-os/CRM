import api from './axios'

const contactsApi = {
  getContacts:    (params) => api.get('/contacts', { params }),
  getContactById: (id) => api.get(`/contacts/${id}`),
  createContact:  (data) => api.post('/contacts', data),
  updateContact:  (id, data) => api.patch(`/contacts/${id}`, data),
  deleteContact:  (id) => api.delete(`/contacts/${id}`),
}

export default contactsApi

export const companiesApi = {
  getCompanies: (params) => api.get('/companies', { params }),
  createCompany: (data) => api.post('/companies', data),
  updateCompany: (id, data) => api.patch(`/companies/${id}`, data),
  deleteCompany: (id) => api.delete(`/companies/${id}`),
}
