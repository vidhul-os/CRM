import { create } from 'zustand'
import api from '@/api/axios'

export const useCommunityStore = create((set, get) => ({
  messages: [],
  activeChat: null, // userId
  recentChats: [],
  loading: false,

  setActiveChat: (userId) => set({ activeChat: userId }),

  fetchMessages: async (contactId) => {
    set({ loading: true })
    try {
      const res = await api.get(`/messages/${contactId}`)
      set({ messages: res.data.data })
    } catch (err) {
      console.error('Failed to fetch messages', err)
    } finally {
      set({ loading: false })
    }
  },

  fetchRecentChats: async () => {
    try {
      const res = await api.get('/messages/recent')
      set({ recentChats: res.data.data })
    } catch (err) {
      console.error('Failed to fetch recent chats', err)
    }
  },

  addMessage: (msg) => {
    const { activeChat, messages } = get()
    // Standardize to matching sender/receiver
    if (msg.senderId === activeChat || msg.receiverId === activeChat) {
      // Avoid duplicates
      const exists = messages.some(m => 
        (m._id && m._id === msg._id) || 
        (m.content === msg.content && Math.abs(new Date(m.timestamp) - new Date(msg.timestamp)) < 1000)
      )
      if (!exists) {
        set({ messages: [...messages, msg] })
      }
    }
  }
}))
