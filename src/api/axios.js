import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true
})

// Request Interceptor: Attach JWT Access Token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
}, (error) => Promise.reject(error))

// Response Interceptor: Handle Token Refresh & Retries
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config
    
    // If 401 Unauthorized (Expired Access Token) and NOT a login request
    const isLogin = originalRequest.url.includes('/auth/login')
    if (error.response?.status === 401 && !originalRequest._retry && !isLogin) {
      originalRequest._retry = true
      
      try {
        const refreshToken = localStorage.getItem('refresh_token')
        const { data } = await axios.post(`${api.defaults.baseURL}/auth/refresh-token`, { refreshToken })
        
        localStorage.setItem('access_token', data.accessToken)
        localStorage.setItem('refresh_token', data.refreshToken)
        
        // Retry original request
        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`
        return api(originalRequest)
      } catch (err) {
        // Refresh token failed -> Logout user
        localStorage.clear()
        window.location.href = '/login'
        return Promise.reject(err)
      }
    }
    
    return Promise.reject(error)
  }
)

export default api
