import {
  createBrowserRouter, RouterProvider, Navigate
} from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'
import Layout         from '@/components/layout/Layout'
import LoginPage      from '@/pages/auth/LoginPage'

import LandingPage from '@/pages/LandingPage'

// Dashboard
import DashboardPage  from '@/pages/dashboard/DashboardPage'

// Leads
import LeadsListPage  from '@/pages/leads/LeadsListPage'
import LeadDetailPage from '@/pages/leads/LeadDetailPage'

// Deals
import DealsListPage  from '@/pages/deals/DealsListPage'
import DealDetailPage from '@/pages/deals/DealDetailPage'

// Contacts
import ContactsListPage  from '@/pages/contacts/ContactsListPage'
import ContactDetailPage from '@/pages/contacts/ContactDetailPage'

// Companies
import CompaniesListPage from '@/pages/companies/CompaniesListPage'
import CompanyDetailPage from '@/pages/companies/CompanyDetailPage'

// Tasks
import TasksPage from '@/pages/tasks/TasksPage'

// Activity
import NotesPage    from '@/pages/notes/NotesPage'
import CallLogsPage from '@/pages/call-logs/CallLogsPage'
import CommunityPage from '@/pages/community/CommunityPage'

// Settings
import SettingsPage from '@/pages/settings/SettingsPage'

function ProtectedRoute({ children }) {
  const isAuthenticated = useAuthStore(s => s.isAuthenticated)
  if (!isAuthenticated) return <Navigate to="/login" replace />
  return children
}

import PricingPage  from '@/pages/PricingPage'
import CheckoutPage from '@/pages/CheckoutPage'
import SuccessPage  from '@/pages/SuccessPage'


const router = createBrowserRouter([
  { path: '/',         element: <LandingPage /> },
  { path: '/pricing',  element: <PricingPage /> },
  { path: '/checkout', element: <CheckoutPage /> },
  { path: '/success',  element: <SuccessPage /> },
  { path: '/login',    element: <LoginPage /> },
  {
    path: '/crm',
    element: <ProtectedRoute><Layout /></ProtectedRoute>,
    children: [
      { index: true, element: <Navigate to="/crm/dashboard" replace /> },
      { path: 'dashboard',      element: <DashboardPage /> },
      { path: 'leads',          element: <LeadsListPage /> },
      { path: 'leads/:id',      element: <LeadDetailPage /> },
      { path: 'deals',          element: <DealsListPage /> },
      { path: 'deals/:id',      element: <DealDetailPage /> },
      { path: 'contacts',       element: <ContactsListPage /> },
      { path: 'contacts/:id',   element: <ContactDetailPage /> },
      { path: 'companies',      element: <CompaniesListPage /> },
      { path: 'companies/:id',  element: <CompanyDetailPage /> },
      { path: 'tasks',          element: <TasksPage /> },
      { path: 'notes',          element: <NotesPage /> },
      { path: 'call-logs',      element: <CallLogsPage /> },
      { path: 'community',      element: <CommunityPage /> },
      { path: 'settings',       element: <SettingsPage /> },
    ]
  }
])

import { useEffect } from 'react'
import ThemeManager from '@/components/ThemeManager'
import { useSettingsStore } from '@/stores/settingsStore'
import { useCallStore } from '@/stores/callStore'

export default function App() {
  const syncProfile = useAuthStore(s => s.syncProfile)
  const fetchSettings = useSettingsStore(s => s.fetchSettings)
  const { user, isAuthenticated } = useAuthStore()
  const initSocket = useCallStore(s => s.initSocket)

  useEffect(() => {
    if (isAuthenticated) {
      syncProfile()
      fetchSettings()
      if (user?._id) initSocket(user._id)
    }
  }, [isAuthenticated, syncProfile, fetchSettings, user?._id, initSocket])

  return (
    <>
      <ThemeManager />
      <RouterProvider router={router} />
    </>
  )
}
