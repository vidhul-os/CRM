import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import contactsApi from '@/api/contacts.api'
import tasksApi    from '@/api/tasks.api'

export const useContactsStore = create(persist(
  (set, get) => ({
    contacts: [],
    loading: false,

    fetchContacts: async (params) => {
      set({ loading: true })
      try {
        const { data } = await contactsApi.getContacts(params)
        set({ contacts: data.data, loading: false })
      } catch (err) {
        set({ loading: false })
        console.error('Fetch contacts failed', err)
      }
    },

    addContact: async (contact) => {
      try {
        const { data } = await contactsApi.createContact(contact)
        set(s => ({ contacts: [data, ...s.contacts] }))
      } catch (err) {
        console.error('Add contact failed', err)
      }
    },

    updateContact: async (id, payload) => {
      try {
        const { data } = await contactsApi.updateContact(id, payload)
        set(s => ({ contacts: s.contacts.map(c => c._id === id || c.id === id ? data : c) }))
      } catch (err) {
        console.error('Update contact failed', err)
      }
    },

    deleteContact: async (id) => {
      try {
        await contactsApi.deleteContact(id)
        set(s => ({ contacts: s.contacts.filter(c => c._id !== id && c.id !== id) }))
      } catch (err) {
        console.error('Delete contact failed', err)
      }
    },
  }),
  { name: 'crm-contacts' }
))

export const useTasksStore = create(persist(
  (set, get) => ({
    tasks: [],
    loading: false,

    fetchTasks: async (params) => {
      set({ loading: true })
      try {
        const { data } = await tasksApi.getTasks(params)
        set({ tasks: data.data, loading: false })
      } catch (err) {
        set({ loading: false })
        console.error('Fetch tasks failed', err)
      }
    },

    addTask: async (task) => {
      try {
        const { data } = await tasksApi.createTask(task)
        set(s => ({ tasks: [data, ...s.tasks] }))
      } catch (err) {
        console.error('Add task failed', err)
      }
    },

    updateTask: async (id, payload) => {
      try {
        const { data } = await tasksApi.updateTask(id, payload)
        set(s => ({ tasks: s.tasks.map(t => t._id === id || t.id === id ? data : t) }))
      } catch (err) {
        console.error('Update task failed', err)
      }
    },

    deleteTask: async (id) => {
      try {
        await tasksApi.deleteTask(id)
        set(s => ({ tasks: s.tasks.filter(t => t._id !== id && t.id !== id) }))
      } catch (err) {
        console.error('Delete task failed', err)
      }
    },
  }),
  { name: 'crm-tasks' }
))
