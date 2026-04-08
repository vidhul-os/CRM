import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, Users, Briefcase, Contact2, Building2, StickyNote,
  Phone, Settings, ChevronLeft, ChevronRight, Pin, LogOut, CheckSquare
} from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'
import { useUiStore }   from '@/stores/uiStore'
import clsx from 'clsx'

const NAV = [
  { group:'OVERVIEW', items:[
    { label:'Dashboard', path:'/crm/dashboard', icon:LayoutDashboard },
  ]},
  { group:'PIPELINE', items:[
    { label:'Leads',     path:'/crm/leads',     icon:Users },
    { label:'Deals',     path:'/crm/deals',     icon:Briefcase },
    { label:'Tasks',     path:'/crm/tasks',     icon:CheckSquare },
  ]},
  { group:'RECORDS', items:[
    { label:'Contacts',  path:'/crm/contacts',  icon:Contact2 },
    { label:'Companies', path:'/crm/companies', icon:Building2 },
  ]},
  { group:'ACTIVITY', items:[
    { label:'Notes',     path:'/crm/notes',     icon:StickyNote },
    { label:'Call logs',  path:'/crm/call-logs',  icon:Phone },
    { label:'Community',  path:'/crm/community',  icon:Users },
  ]},
]

import { useSettingsStore } from '@/stores/settingsStore'

export default function Sidebar() {
  const { collapsed, toggleSidebar } = useUiStore()
  const { user, logout }             = useAuthStore()
  const { branding }                 = useSettingsStore()
  const navigate = useNavigate()
  const [pinnedOpen, setPinnedOpen]  = useState(true)

  return (
    <aside className={clsx(
      'flex flex-col bg-sidebar-bg text-sidebar-text transition-all duration-200 h-screen shrink-0',
      collapsed ? 'w-[60px]' : 'w-[240px]'
    )}>
      {/* Logo row */}
      <div className="flex items-center justify-between px-3 py-4 border-b border-border">
        {!collapsed ? (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold text-xs overflow-hidden shadow-lg shadow-primary/20">
              {branding?.logo ? <img src={branding.logo} className="w-full h-full object-cover" /> : 'C'}
            </div>
            <span className="font-bold text-sm tracking-tight truncate max-w-[120px]">{branding?.companyName || 'CRM'}</span>
          </div>
        ) : (
          <div className="w-8 h-8 mx-auto bg-primary rounded-lg flex items-center justify-center text-white font-bold text-[10px] overflow-hidden">
             {branding?.logo ? <img src={branding.logo} className="w-full h-full object-cover" /> : 'C'}
          </div>
        )}
        <button onClick={toggleSidebar} className="p-1 rounded hover:bg-sidebar-text/10 transition-colors ml-auto">
          {collapsed ? <ChevronRight size={16}/> : <ChevronLeft size={16}/>}
        </button>
      </div>

      {/* Nav items */}
      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-4">
        {NAV.map(({ group, items }) => (
          <div key={group}>
            {!collapsed && (
              <p className="text-[10px] font-semibold text-sidebar-text/40 px-2 mb-1 tracking-widest uppercase">{group}</p>
            )}
            {items.map(({ label, path, icon: Icon }) => (
              <NavLink key={path} to={path}
                className={({ isActive }) => clsx(
                  'flex items-center gap-3 px-2 py-2 rounded-lg text-sm mb-0.5 transition-colors duration-150',
                  isActive
                    ? 'bg-primary text-white font-medium shadow-sm active:scale-95'
                    : 'text-sidebar-text/70 hover:bg-sidebar-text/5 hover:text-sidebar-text'
                )}>
                <Icon size={16} className="shrink-0" />
                {!collapsed && <span>{label}</span>}
              </NavLink>
            ))}
          </div>
        ))}

        {/* Pinned views */}
        {!collapsed && (
          <div>
            <button onClick={() => setPinnedOpen(o => !o)}
              className="flex items-center gap-2 text-[10px] font-semibold text-sidebar-text/40 px-2 mb-1 w-full tracking-widest hover:text-sidebar-text/70 transition-colors">
              <Pin size={10}/> PINNED VIEWS
            </button>
            {pinnedOpen && ['My Leads','Hot Deals','This Week'].map(v => (
              <button key={v} className="w-full text-left px-2 py-1.5 text-xs text-sidebar-text/60 hover:text-sidebar-text hover:bg-sidebar-text/5 rounded-lg transition-colors">
                {v}
              </button>
            ))}
          </div>
        )}
      </nav>

      {/* Footer */}
      <div className="border-t border-border p-3">
        <div className={clsx('flex items-center', collapsed ? 'justify-center' : 'justify-between')}>
          {!collapsed && user && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-[10px] font-black text-white">
                {user.name?.[0] ?? 'A'}
              </div>
              <div>
                <p className="text-xs font-bold leading-tight truncate max-w-[100px]">{user.name}</p>
                <p className="text-[10px] text-sidebar-text/40 uppercase font-black">{user.role}</p>
              </div>
            </div>
          )}
          <div className="flex gap-1">
            <button onClick={() => navigate('/crm/settings')}
              className="p-1.5 rounded hover:bg-sidebar-text/5 text-sidebar-text/60 hover:text-sidebar-text transition-colors">
              <Settings size={14}/>
            </button>
            <button onClick={logout}
              className="p-1.5 rounded hover:bg-sidebar-text/5 text-sidebar-text/60 hover:text-sidebar-text transition-colors">
              <LogOut size={14}/>
            </button>
          </div>
        </div>
      </div>
    </aside>
  )
}
