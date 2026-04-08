import { useQuery } from '@tanstack/react-query'
import { getLeads, getDeals, getContacts } from '@/api/mockApi'
import { useTasksStore } from '@/stores/crmStore'
import StatusBadge from '@/components/crm/StatusBadge'
import Avatar from '@/components/ui/Avatar'
import { TrendingUp, Users, Briefcase, CheckSquare, ArrowUpRight, IndianRupee } from 'lucide-react'
import { fmtCurrency } from '@/utils/formatters'
import clsx from 'clsx'

const STAT_COLORS = [
  'bg-primary/soft border-primary/20 text-primary',
  'bg-primary/soft border-primary/20 text-primary',
  'bg-primary/soft border-primary/20 text-primary',
  'bg-primary/soft border-primary/20 text-primary',
]

export default function DashboardPage() {
  const { data: leadsData }    = useQuery({ queryKey:['leads'],    queryFn: getLeads })
  const { data: dealsData }    = useQuery({ queryKey:['deals'],    queryFn: getDeals })
  const { data: contactsData } = useQuery({ queryKey:['contacts'], queryFn: getContacts })
  const { tasks }              = useTasksStore()

  const leads    = leadsData?.data    ?? []
  const deals    = dealsData?.data    ?? []
  const contacts = contactsData?.data ?? []

  const wonDeals      = deals.filter(d => d.stage === 'Closed Won')
  const totalPipeline = deals.reduce((s, d) => s + (d.value ?? 0), 0)
  const openTasks     = tasks.filter(t => t.status !== 'Completed').length

  const stats = [
    { label:'Total Leads',     value: leads.length,     icon:Users,      trend:'+12%', color:STAT_COLORS[0] },
    { label:'Active Deals',    value: deals.length,     icon:Briefcase,  trend:'+8%',  color:STAT_COLORS[1] },
    { label:'Deals Won',       value: wonDeals.length,  icon:TrendingUp, trend:'+3',   color:STAT_COLORS[2] },
    { label:'Open Tasks',      value: openTasks,        icon:CheckSquare,trend:'-4',   color:STAT_COLORS[3] },
  ]

  return (
    <div className="flex flex-col h-full bg-surface/50">
      {/* Header */}
      <div className="px-8 py-5 border-b border-border bg-card shadow-sm ring-1 ring-sidebar/5 shrink-0">
        <h1 className="text-2xl font-black text-sidebar tracking-tight">Command Center</h1>
        <p className="text-[10px] font-black text-muted uppercase tracking-[0.2em] mt-1.5 opacity-60">Live pipeline intelligence — refreshed daily</p>
      </div>

      <div className="flex-1 overflow-auto p-8 space-y-8">

        {/* KPI Cards */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-5">
          {stats.map((s, i) => {
            const Icon = s.icon
            return (
              <div key={i} className="bg-card rounded-2xl border border-border shadow-sm p-6 group hover:border-primary/30 hover:shadow-md transition duration-300">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-2.5 rounded-xl border ${s.color}`}>
                    <Icon size={18} />
                  </div>
                  <span className="text-[10px] font-black text-green-500 bg-green-50 px-2 py-0.5 rounded-full border border-green-200 uppercase tracking-widest">{s.trend}</span>
                </div>
                <p className="text-3xl font-black text-sidebar tracking-tight group-hover:text-primary transition">{s.value}</p>
                <p className="text-[10px] font-black text-muted uppercase tracking-widest mt-2">{s.label}</p>
              </div>
            )
          })}
        </div>

        {/* Pipeline Value Banner */}
        <div className="p-7 bg-sidebar-bg rounded-3xl shadow-2xl shadow-border/30 text-sidebar-text relative overflow-hidden">
          <div className="absolute top-[-30%] right-[-5%] w-56 h-56 bg-primary/20 rounded-full blur-3xl pointer-events-none"/>
          <div className="relative z-10 flex items-center justify-between flex-wrap gap-6">
            <div>
              <p className="text-[10px] font-black opacity-40 uppercase tracking-[0.4em]">Total Pipeline Value</p>
              <div className="flex items-end gap-2 mt-2">
                <IndianRupee size={28} className="text-primary mb-1 opacity-80"/>
                <p className="text-5xl font-black tracking-tight">{totalPipeline.toLocaleString('en-IN')}</p>
              </div>
              <p className="text-[10px] font-bold opacity-40 uppercase tracking-widest mt-3">Across {deals.length} open opportunities</p>
            </div>
            <div className="flex flex-col gap-4 text-right">
              {['Qualification','Proposal','Negotiation'].map(st => (
                <div key={st}>
                  <p className="text-[10px] font-black opacity-40 uppercase tracking-widest">{st}</p>
                  <p className="text-lg font-black text-primary">
                    {fmtCurrency(deals.filter(d => d.stage === st).reduce((s,d) => s+d.value,0))}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Recent Leads */}
          <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-border flex items-center justify-between">
              <p className="text-sm font-extrabold text-sidebar uppercase tracking-wider">Recent Leads</p>
              <ArrowUpRight size={16} className="text-muted"/>
            </div>
            <div className="divide-y divide-border/40">
              {leads.slice(0, 5).map(l => (
                <div key={l.id} className="px-6 py-4 flex items-center gap-4 hover:bg-blue-50/20 transition">
                  <Avatar name={l.name} size="md"/>
                  <div className="flex-1 min-w-0">
                    <p className="font-extrabold text-sidebar text-sm truncate">{l.name}</p>
                    <p className="text-[10px] text-muted font-bold uppercase tracking-wider mt-0.5">{l.company}</p>
                  </div>
                  <StatusBadge status={l.status}/>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Deals */}
          <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-border flex items-center justify-between">
              <p className="text-sm font-extrabold text-sidebar uppercase tracking-wider">Hot Deals</p>
              <ArrowUpRight size={16} className="text-muted"/>
            </div>
            <div className="divide-y divide-border/40">
              {deals.slice(0, 5).map(d => (
                <div key={d.id} className="px-6 py-4 flex items-center gap-4 hover:bg-blue-50/20 transition">
                  <div className="p-2 bg-primary/10 rounded-xl border border-primary/20 shrink-0">
                    <Briefcase size={14} className="text-primary"/>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-extrabold text-sidebar text-sm truncate">{d.name}</p>
                    <p className="text-[10px] text-muted font-bold uppercase tracking-wider mt-0.5">{d.stage}</p>
                  </div>
                  <p className="text-sm font-black text-primary">{fmtCurrency(d.value)}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
