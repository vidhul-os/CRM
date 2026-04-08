import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { 
  ChevronLeft, 
  ChevronRight,
  MoreVertical, 
  Mail, 
  Phone, 
  Globe, 
  MapPin, 
  Calendar,
  MessageSquare,
  FileText,
  Clock,
  History,
  Activity,
  Edit2,
  Share2,
  Trash2,
  User,
  Briefcase,
  Copy,
  Zap
} from 'lucide-react'
import { useState } from 'react'
// import { getActivities } from '@/api/mockApi'
import { getLeadById } from '@/api/leads.api'
import StatusBadge from '@/components/crm/StatusBadge'
import SLABar from '@/components/crm/SLABar'
import ActivityFeed from '@/components/crm/ActivityFeed'
import Tabs from '@/components/ui/Tabs'
import Avatar from '@/components/ui/Avatar'
import Button from '@/components/ui/Button'
import { useToastStore } from '@/stores/toastStore'
import { useLeadsStore } from '@/stores/leadsStore'
import clsx from 'clsx'

export default function LeadDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addToast } = useToastStore()
  const { deleteLead } = useLeadsStore()
  const [activeTab, setActiveTab] = useState('activity')

  const { data: response, isLoading: isLeadLoading } = useQuery({
    queryKey: ['lead', id],
    queryFn:  async () => {
      const { data } = await getLeadById(id)
      return data
    }
  })

  const { data: activitiesData } = useQuery({
    queryKey: ['activities', id],
    queryFn:  () => getActivities(id)
  })

  const lead = response
  const activities = activitiesData?.data || []

  const tabs = [
    { id: 'activity', label: 'Activity', icon: Activity },
    { id: 'emails',   label: 'Emails',   icon: Mail },
    { id: 'notes',    label: 'Notes',    icon: MessageSquare },
    { id: 'tasks',    label: 'Tasks',    icon: FileText },
    { id: 'calls',    label: 'Call Logs', icon: Phone },
  ]

  if (isLeadLoading) return (
    <div className="h-full flex flex-col items-center justify-center p-20">
      <div className="relative h-16 w-16 mb-6">
        <div className="absolute inset-0 border-4 border-primary/20 rounded-full" />
        <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
      <p className="text-[11px] font-black text-muted uppercase tracking-[0.4em] animate-pulse">Retriving records...</p>
    </div>
  )

  if (!lead) return (
    <div className="h-full flex flex-col items-center justify-center p-20 gap-6">
       <div className="p-8 bg-red-50 rounded-3xl border-4 border-white shadow-2xl ring-1 ring-red-100">
         <Zap size={48} className="text-red-500 fill-red-100" />
       </div>
       <div className="text-center">
         <h1 className="text-3xl font-black text-sidebar tracking-tight mb-2">Record Not Found</h1>
         <p className="text-sm font-semibold text-muted max-w-xs uppercase tracking-widest leading-loose">Internal database error or record deleted by administrator.</p>
       </div>
       <Button variant="secondary" onClick={() => navigate('/crm/leads')} className="rounded-2xl h-14 px-10 font-black tracking-tight" icon={ChevronLeft}>
         Back to Leads
       </Button>
    </div>
  )

  const handleCopy = () => {
    navigator.clipboard.writeText(lead.email)
    addToast('Contact email copied to clipboard', 'info')
  }

  return (
    <div className="flex flex-col h-full bg-surface/50">
      {/* Detail Header */}
      <div className="px-8 py-6 bg-card border-b border-border shadow-sm ring-1 ring-sidebar/5 z-10 shrink-0">
        <div className="max-w-7xl mx-auto flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <button 
                onClick={() => navigate('/crm/leads')}
                className="p-3 bg-surface hover:bg-card text-muted hover:text-sidebar rounded-2xl border border-transparent hover:border-border transition duration-200 outline-none hover:shadow-inner"
              >
                <ChevronLeft size={20} />
              </button>
              
              <div className="flex items-center gap-5">
                <Avatar name={lead.name} size="xl" className="shadow-2xl border-4 border-white ring-1 ring-sidebar/5 scale-110" />
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center gap-4">
                    <h1 className="text-3xl font-black text-sidebar tracking-tight">{lead.name}</h1>
                    <div className="h-5 w-px bg-border/50 mx-1" />
                    <StatusBadge status={lead.status} />
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5 px-2.5 py-1 bg-surface rounded-lg border border-border/50 hover:border-primary/30 transition shadow-sm cursor-default">
                      <Briefcase size={12} className="text-primary" />
                      <span className="text-[11px] font-black text-muted uppercase tracking-widest leading-none pt-0.5">{lead.company}</span>
                    </div>
                    <div className="flex items-center gap-1.5 px-2.5 py-1 bg-surface rounded-lg border border-border/50 hover:border-primary/30 transition shadow-sm cursor-default">
                      <MapPin size={12} className="text-orange-500" />
                      <span className="text-[11px] font-black text-muted uppercase tracking-widest leading-none pt-0.5">{lead.source || 'Direct Entry'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex bg-surface p-1.5 rounded-2xl border border-border items-center gap-1.5 shadow-inner">
                <button 
                  onClick={() => addToast('Editing not implemented yet. Work in progress.', 'info')}
                  className="p-2.5 bg-card text-muted hover:text-sidebar rounded-xl border border-border/50 hover:border-border shadow-sm transition outline-none"
                >
                  <Edit2 size={16} />
                </button>
                <button 
                  onClick={handleCopy}
                  className="p-2.5 bg-card text-muted hover:text-sidebar rounded-xl border border-border/50 hover:border-border shadow-sm transition outline-none"
                >
                  <Copy size={16} />
                </button>
                <div className="h-6 w-px bg-border/50 mx-1" />
                <button 
                  onClick={async () => {
                    if (window.confirm('Are you sure you want to delete this lead?')) {
                      const res = await deleteLead(id)
                      if (res.success) {
                        addToast('Lead deleted successfully', 'success')
                        navigate('/crm/leads')
                      } else {
                        addToast(res.error || 'Failed to delete lead', 'error')
                      }
                    }
                  }}
                  className="p-2.5 bg-card text-red-500 hover:bg-red-500 hover:text-white rounded-xl border border-red-100 hover:border-red-500 shadow-sm transition outline-none group"
                >
                  <Trash2 size={16} className="group-hover:scale-110 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Detail Layout */}
      <div className="flex-1 overflow-hidden">
        <div className="max-w-7xl mx-auto h-full flex divide-x divide-border overflow-hidden">
          {/* Main Area (70%) */}
          <div className="flex-[7] flex flex-col overflow-hidden bg-white/40 ring-1 ring-inset ring-sidebar/5">
            <div className="bg-card px-8 pt-4 pb-0 z-10 sticky top-0 border-b border-border shadow-sm">
              <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
            </div>
            
            <div className="flex-1 overflow-y-auto p-10 custom-scrollbar animate-in fade-in duration-500">
              {activeTab === 'activity' ? (
                <div className="max-w-2xl">
                   <div className="mb-12 flex items-center justify-between">
                     <div className="flex flex-col">
                       <h3 className="text-xl font-black text-sidebar tracking-tight leading-none mb-2">Lead Timeline</h3>
                       <p className="text-[11px] font-black text-muted uppercase tracking-[0.2em]">Comprehensive activity log & history</p>
                     </div>
                     <Button variant="secondary" className="rounded-xl font-black uppercase tracking-widest text-[10px]" icon={History}>
                       View History
                     </Button>
                   </div>
                   <ActivityFeed activities={activities} />
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full gap-8 opacity-40">
                  <div className="p-10 bg-surface rounded-[40px] border-4 border-white shadow-2xl ring-1 ring-sidebar/5 rotate-3">
                    <Zap size={64} className="text-primary animate-pulse" />
                  </div>
                  <div className="text-center">
                    <p className="text-[11px] font-black text-muted uppercase tracking-[0.4em] leading-loose">Module offline</p>
                    <p className="text-[10px] font-bold text-muted uppercase tracking-[0.2em] mt-2 underline cursor-pointer decoration-2 underline-offset-4 decoration-primary/30">Connect Integration Hub</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Info Sidebar (30%) */}
          <aside className="hidden lg:flex flex-[3] flex-col overflow-y-auto p-8 bg-white/60 custom-scrollbar ring-1 ring-inset ring-sidebar/5">
            <div className="space-y-10 animate-in slide-in-from-right-10 duration-500">
              
              {/* Status Section */}
              <div className="space-y-6">
                <div className="flex flex-col">
                  <h4 className="text-[11px] font-black text-muted uppercase tracking-[0.3em] mb-4">SLA Compliance</h4>
                  <div className="p-6 bg-card rounded-3xl border border-border/80 shadow-2xl shadow-sidebar/5 ring-1 ring-sidebar/5">
                    <SLABar deadline="2024-12-30" createdAt={lead.created} />
                  </div>
                </div>

                <div className="flex flex-col">
                  <h4 className="text-[11px] font-black text-muted uppercase tracking-[0.3em] mb-4">Account Owner</h4>
                  <div className="flex items-center gap-4 p-4 bg-card rounded-2xl border border-border shadow-sm group hover:border-primary transition duration-300">
                    <Avatar name={lead.owner?.name} src={lead.owner?.avatar} size="md" className="group-hover:scale-105 transition-transform" />
                    <div className="flex flex-col">
                      <p className="text-sm font-black text-sidebar leading-none">{lead.owner?.name || 'Unassigned'}</p>
                      <p className="text-[10px] font-bold text-muted uppercase tracking-widest mt-1.5">Account Owner</p>
                    </div>
                    <button className="ml-auto p-2 bg-surface text-muted hover:text-sidebar rounded-lg transition-colors border border-transparent hover:border-border">
                      <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Data Grid */}
              <div className="space-y-6">
                <h4 className="text-[11px] font-black text-muted uppercase tracking-[0.3em] border-b border-border pb-4">Principal Information</h4>
                
                <div className="grid grid-cols-1 gap-6">
                  <div className="group">
                    <label className="text-[10px] font-black text-muted uppercase tracking-widest block mb-2 opacity-60">Full Name</label>
                    <p className="text-sm font-extrabold text-sidebar group-hover:text-primary transition-colors">{lead.name}</p>
                  </div>
                  <div className="group">
                    <label className="text-[10px] font-black text-muted uppercase tracking-widest block mb-2 opacity-60">Email Contact</label>
                    <div className="flex items-center gap-2">
                       <Mail size={12} className="text-sidebar" />
                       <p className="text-sm font-extrabold text-sidebar group-hover:text-primary transition-colors underline decoration-2 underline-offset-4 decoration-primary/20">{lead.email}</p>
                    </div>
                  </div>
                  <div className="group">
                    <label className="text-[10px] font-black text-muted uppercase tracking-widest block mb-2 opacity-60">Business Unit</label>
                    <p className="text-sm font-extrabold text-sidebar group-hover:text-primary transition-colors">{lead.company}</p>
                  </div>
                  <div className="group">
                    <label className="text-[10px] font-black text-muted uppercase tracking-widest block mb-2 opacity-60">Lead Potential</label>
                    <div className="flex items-center gap-3">
                      <div className="h-2 flex-1 max-w-[120px] bg-surface rounded-full overflow-hidden border border-border">
                        <div className="h-full bg-green-500" style={{ width: `${lead.score}%` }} />
                      </div>
                      <span className="text-sm font-black text-green-600">{lead.score}%</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Utilities */}
              <div className="p-8 bg-sidebar-bg rounded-[32px] shadow-2xl shadow-border/30 text-sidebar-text relative overflow-hidden group">
                <div className="absolute top-[-20%] right-[-10%] w-32 h-32 bg-primary/20 rounded-full blur-3xl transition-transform duration-700 group-hover:scale-150" />
                <h4 className="text-[10px] font-black tracking-[0.3em] uppercase mb-6 opacity-40">System Diagnostics</h4>
                <div className="space-y-4 relative z-10">
                   <div className="flex items-center justify-between">
                     <span className="text-[11px] font-bold opacity-60">Data Integrity</span>
                     <span className="text-[11px] font-black text-green-400">OPTIMAL</span>
                   </div>
                   <div className="flex items-center justify-between">
                     <span className="text-[11px] font-bold opacity-60">Last API Sync</span>
                     <span className="text-[11px] font-black text-white/40 uppercase tracking-widest">Now</span>
                   </div>
                   <div className="flex items-center justify-between">
                     <span className="text-[11px] font-bold opacity-60">Record ID</span>
                     <span className="text-[11px] font-black text-primary font-mono select-all">#LDE-9082</span>
                   </div>
                </div>
              </div>

            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
