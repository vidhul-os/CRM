import leadsApi    from './leads.api'
import dealsApi    from './deals.api'
import contactsApi, { companiesApi } from './contacts.api'
import tasksApi     from './tasks.api'
import dashboardApi from './dashboard.api'

// Helper to normalize response to match existing UI expectations
const unwrap = (promise) => promise.then(res => res.data)

// Leads
export const getLeads     = (params) => unwrap(leadsApi.getLeads(params))
export const getLead      = (id)     => unwrap(leadsApi.getLeadById(id))
export const createLead   = (data)   => unwrap(leadsApi.createLead(data))
export const updateLead   = (id, data)=> unwrap(leadsApi.updateLead(id, data))
export const deleteLead   = (id)     => unwrap(leadsApi.deleteLead(id))

// Deals
export const getDeals     = (params) => unwrap(dealsApi.getDeals(params))
export const getDeal      = (id)     => unwrap(dealsApi.getDealById(id))
export const createDeal   = (data)   => unwrap(dealsApi.createDeal(data))
export const updateDeal   = (id, data)=> unwrap(dealsApi.updateDeal(id, data))
export const deleteDeal   = (id)     => unwrap(dealsApi.deleteDeal(id))

// Contacts
export const getContacts  = (params) => unwrap(contactsApi.getContacts(params))
export const getContact   = (id)     => unwrap(contactsApi.getContactById(id))
export const createContact = (data)   => unwrap(contactsApi.createContact(data))

// Companies
export const getCompanies = (params) => unwrap(companiesApi.getCompanies(params))

// Tasks (Syncing with crmStore.js needs)
export const getTasks     = (params) => unwrap(tasksApi.getTasks(params))

// Dashboard
export const getStats     = () => unwrap(dashboardApi.getStats())
export const getActivities= () => unwrap(dashboardApi.getActivities())

// Dummy/Placeholders for missing logic if needed
export const getNotes = async (lid) => ({ data: [] })
export const createNote = async (d) => ({ data: d })
export const getCallLogs = async () => ({ data: [] })
