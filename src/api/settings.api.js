import api from './axios'

// Settings
export const getSettings          = ()         => api.get('/settings')
export const updateOrganization   = (data)     => api.patch('/settings/organization', data)
export const uploadOrgLogo        = (formData) => api.post('/settings/organization/logo', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
export const updateBranding       = (data)     => api.patch('/settings/branding', data)
export const uploadBrandingLogo   = (formData) => api.post('/settings/branding/logo', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
export const updateEmailSettings  = (data)     => api.patch('/settings/email', data)
export const updateModules        = (data)     => api.patch('/settings/modules', data)

// Admin - Users
export const getAdminUsers        = ()         => api.get('/admin/users')
export const createAdminUser      = (data)     => api.post('/admin/users', data)
export const updateAdminUser      = (id, data) => api.patch(`/admin/users/${id}`, data)
export const deleteAdminUser      = (id)       => api.delete(`/admin/users/${id}`)
export const resetUserPassword    = (id, data) => api.patch(`/admin/users/${id}/reset-password`, data)
export const uploadUserAvatar     = (id, formData) => api.post(`/admin/users/${id}/avatar`, formData, { headers: { 'Content-Type': 'multipart/form-data' } })

// Admin - Roles
export const getRoles             = ()         => api.get('/admin/roles')
export const createRole           = (data)     => api.post('/admin/roles', data)
export const updateRole           = (id, data) => api.patch(`/admin/roles/${id}`, data)
export const deleteRole           = (id)       => api.delete(`/admin/roles/${id}`)

const settingsApi = {
  getSettings, updateOrganization, uploadOrgLogo, updateBranding, updateEmailSettings, updateModules,
  getAdminUsers, createAdminUser, updateAdminUser, deleteAdminUser, resetUserPassword, uploadUserAvatar,
  getRoles, createRole, updateRole, deleteRole,
}

export default settingsApi
