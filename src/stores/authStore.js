import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import authApi  from '../api/auth.api'

export const useAuthStore = create(persist(
  (set) => ({
    user: null,
    token: null,
    isAuthenticated: false,

    login: async (email, password) => {
      try {
        const { data } = await authApi.login(email, password)
        const { user, accessToken, refreshToken } = data
        
        localStorage.setItem('access_token',  accessToken)
        localStorage.setItem('refresh_token', refreshToken)
        
        set({ user, token: accessToken, isAuthenticated: true })
        return { success: true }
      } catch (err) {
        return { success: false, error: err.response?.data?.message || 'Login failed' }
      }
    },

    logout: () => {
      localStorage.removeItem('access_token')
      localStorage.removeItem('refresh_token')
      set({ user: null, token: null, isAuthenticated: false })
      window.location.href = '/login'
    },

    syncProfile: async () => {
      try {
        const { data } = await authApi.getMe()
        set({ user: data })
      } catch (err) {
        console.error('Failed to sync profile:', err)
      }
    }
  }),
  { 
    name: 'crm-auth',
    partialize: s => ({ user: s.user, token: s.token, isAuthenticated: s.isAuthenticated }) 
  }
))
