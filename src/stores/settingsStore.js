import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import settingsApi from '@/api/settings.api'
import { MODULES_LIST } from '@/utils/constants'

export const useSettingsStore = create(persist(
  (set, get) => ({
    org: { companyName: 'Frappe CRM Inc.', address: '', timezone: 'IST', currency: 'INR', dateFormat: 'DD/MM/YYYY' },
    users: [],
    rolePermissions: [],
    email: { smtpHost: '', port: '', email: '', password: '', encryption: 'TLS' },
    modules: MODULES_LIST.map((m, i) => ({ id: String(i), name: m, enabled: true, displayName: m })),
    fields: [],
    workflows: [],
    security: { minPasswordLength: 8, twoFactorEnabled: false, sessionTimeout: '30 minutes' },
    branding: { primaryColor: '#3b82f6', theme: 'light', logo: null },

    fetchSettings: async () => {
      try {
        const { data } = await settingsApi.getSettings()
        set({ 
          branding: data.branding, 
          modules: data.modules,
          email: data.email,
          org: data.organization 
        })
      } catch (err) {
        console.error('Fetch settings failed', err)
      }
    },

    setBranding: async (data) => {
      try {
        const res = await settingsApi.updateBranding(data)
        set({ branding: res.data })
        return { success: true }
      } catch (err) {
        console.error('Update branding failed', err)
        return { success: false, error: err.message }
      }
    },

    updateBrandingLocal: (data) => {
      set(s => ({ branding: { ...s.branding, ...data } }))
    },

    toggleModule: async (id) => {
      const updated = get().modules.map(m => m.id === id ? { ...m, enabled: !m.enabled } : m)
      try {
        await settingsApi.updateModules(updated)
        set({ modules: updated })
      } catch (err) {
        console.error('Update modules failed', err)
      }
    },

    fetchFields: async (module) => {
      try {
        const { data } = await settingsApi.getFields(module)
        set({ fields: data })
      } catch (err) {
        console.error('Fetch fields failed', err)
      }
    },

    addField: async (f) => {
      try {
        const { data } = await settingsApi.addField(f)
        set(s => ({ fields: [...s.fields, data] }))
      } catch (err) {
        console.error('Add field failed', err)
      }
    },

    deleteField: async (id) => {
      try {
        await settingsApi.deleteField(id)
        set(s => ({ fields: s.fields.filter(f => f._id !== id && f.id !== id) }))
      } catch (err) {
        console.error('Delete field failed', err)
      }
    },

    fetchWorkflows: async () => {
      try {
        const { data } = await settingsApi.getWorkflows()
        set({ workflows: data })
      } catch (err) {
        console.error('Fetch workflows failed', err)
      }
    },

    addWorkflow: async (w) => {
      try {
        const { data } = await settingsApi.createWorkflow(w)
        set(s => ({ workflows: [...s.workflows, data] }))
      } catch (err) {
        console.error('Add workflow failed', err)
      }
    }
  }),
  { name: 'crm-settings' }
))
