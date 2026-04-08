import api from './axios'

const dashboardApi = {
  getStats:       () => api.get('/dashboard/stats'),
  getFunnel:      () => api.get('/dashboard/leads-funnel'),
  getActivities:  () => api.get('/dashboard/activities'),
}

export default dashboardApi
