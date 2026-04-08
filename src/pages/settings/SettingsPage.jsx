import { useState } from 'react'
import { 
  Building2, Users, ShieldCheck, Mail, Blocks, 
  FormInput, Zap, Lock, Link2, Database, Palette 
} from 'lucide-react'
import clsx from 'clsx'

import OrgSettings          from './modules/OrgSettings'
import UsersSettings        from './modules/UsersSettings'
import RolesSettings        from './modules/RolesSettings'
import EmailSettings        from './modules/EmailSettings'
import ModulesSettings      from './modules/ModulesSettings'
import FieldsSettings       from './modules/FieldsSettings'
import WorkflowSettings     from './modules/WorkflowSettings'
import SecuritySettings     from './modules/SecuritySettings'
import IntegrationSettings  from './modules/IntegrationsSettings'
import DataSettings         from './modules/DataSettings'
import BrandingSettings     from './modules/BrandingSettings'

const TABS = [
  { id:'org',          label:'Organization',        icon:Building2,   component:OrgSettings },
  { id:'users',        label:'Users',               icon:Users,        component:UsersSettings },
  { id:'roles',        label:'Roles & Permissions', icon:ShieldCheck,  component:RolesSettings },
  { id:'email',        label:'Email Settings',      icon:Mail,         component:EmailSettings },
  { id:'modules',      label:'Modules',             icon:Blocks,       component:ModulesSettings },
  { id:'fields',       label:'Fields & Layout',     icon:FormInput,    component:FieldsSettings },
  { id:'workflow',     label:'Workflow',            icon:Zap,          component:WorkflowSettings },
  { id:'security',     label:'Security',            icon:Lock,         component:SecuritySettings },
  { id:'integrations', label:'Integrations',        icon:Link2,        component:IntegrationSettings },
  { id:'data',         label:'Data Management',     icon:Database,     component:DataSettings },
  { id:'branding',     label:'Branding',            icon:Palette,      component:BrandingSettings },
]

const GROUP_LABELS = {
  org:'Workspace', users:'Workspace', roles:'Workspace',
  email:'Communications',
  modules:'Customization', fields:'Customization', workflow:'Customization',
  security:'Security & Privacy',
  integrations:'Integrations',
  data:'Data',
  branding:'Appearance',
}

const GROUPS_ORDER = ['Workspace','Communications','Customization','Security & Privacy','Integrations','Data','Appearance']

export default function SettingsPage() {
  const [active, setActive] = useState('org')
  const ActiveComp = TABS.find(t => t.id === active)?.component ?? OrgSettings

  // group tabs by category
  const grouped = GROUPS_ORDER.map(group => ({
    group,
    items: TABS.filter(t => GROUP_LABELS[t.id] === group)
  })).filter(g => g.items.length > 0)

  return (
    <div className="flex h-full bg-surface/50">

      {/* ── Settings Sidebar ── */}
      <aside className="hidden md:flex w-64 shrink-0 flex-col bg-card border-r border-border h-full shadow-sm overflow-y-auto">
        <div className="px-5 py-5 border-b border-border shrink-0">
          <h2 className="text-[11px] font-black text-muted uppercase tracking-[0.3em]">Settings Terminal</h2>
        </div>

        <nav className="flex-1 py-4 px-3 space-y-6 overflow-y-auto">
          {grouped.map(({ group, items }) => (
            <div key={group}>
              <p className="text-[9px] font-black text-muted/50 uppercase tracking-[0.4em] px-2 mb-2">{group}</p>
              {items.map(tab => {
                const Icon = tab.icon
                const isActive = active === tab.id
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActive(tab.id)}
                    className={clsx(
                      'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold transition mb-0.5 text-left',
                      isActive
                        ? 'bg-primary/10 text-primary border border-primary/20 shadow-sm'
                        : 'text-muted hover:bg-surface hover:text-sidebar'
                    )}
                  >
                    <Icon size={16} className="shrink-0" />
                    <span className="truncate">{tab.label}</span>
                  </button>
                )
              })}
            </div>
          ))}
        </nav>
      </aside>

      {/* ── Mobile Tab Strip ── */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border flex overflow-x-auto scrollbar-hide">
        {TABS.map(tab => {
          const Icon = tab.icon
          return (
            <button key={tab.id} onClick={() => setActive(tab.id)}
              className={clsx('flex flex-col items-center gap-1 px-4 py-2.5 text-[9px] font-black uppercase tracking-widest shrink-0 transition',
                active === tab.id ? 'text-primary border-t-2 border-primary -mt-px' : 'text-muted'
              )}>
              <Icon size={18}/>
              <span>{tab.label.split(' ')[0]}</span>
            </button>
          )
        })}
      </div>

      {/* ── Main Content ── */}
      <div className="flex-1 overflow-y-auto">
        {/* Breadcrumb Header */}
        <div className="sticky top-0 z-10 bg-white/90 backdrop-blur-sm border-b border-border px-8 py-4 flex items-center gap-3 shrink-0 shadow-sm">
          <span className="text-[10px] font-black text-muted/50 uppercase tracking-widest">Settings</span>
          <span className="text-muted/30 font-bold">/</span>
          <span className="text-[10px] font-black text-sidebar uppercase tracking-widest">
            {TABS.find(t => t.id === active)?.label}
          </span>
        </div>

        <div className="p-8 max-w-4xl animate-in fade-in slide-in-from-right-4 duration-300" key={active}>
          <ActiveComp />
        </div>
      </div>
    </div>
  )
}
