import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { 
  Plus, 
  LayoutList, 
  LayoutGrid, 
  Filter, 
  ArrowUpDown, 
  Download, 
  Search, 
  MoreHorizontal,
  ChevronRight,
  User,
  ExternalLink,
  Table as TableIcon
} from 'lucide-react'
import { getLeads, getMyLeads, getHotLeads } from '@/api/leads.api'
import { useLeadsStore } from '@/stores/leadsStore'
import { useUiStore } from '@/stores/uiStore'
import StatusBadge from '@/components/crm/StatusBadge'
import DataTable from '@/components/crm/DataTable'
import KanbanBoard from '@/components/crm/KanbanBoard'
import Button from '@/components/ui/Button'
import Avatar from '@/components/ui/Avatar'
import { useToastStore } from '@/stores/toastStore'
import CreateLeadModal from '@/components/crm/CreateLeadModal'
import clsx from 'clsx'

export default function LeadsListPage() {
  const navigate = useNavigate()
  const { activeView, setView } = useUiStore()
  const { addToast } = useToastStore()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [createInitialStatus, setCreateInitialStatus] = useState('New')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [sort, setSort] = useState('-createdAt')
  const [viewMode, setViewMode] = useState('all') // 'all' | 'mine' | 'hot'

  const { data: response, isLoading } = useQuery({
    queryKey: ['leads', { search, page, sort, viewMode }],
    queryFn:  async () => {
      const params = { search, page, limit: 10, sort }
      let res;
      if (viewMode === 'mine') res = await getMyLeads(params)
      else if (viewMode === 'hot') res = await getHotLeads(params)
      else res = await getLeads(params)
      return res.data // Unwrap axios response here
    }
  })

  const queryClient = useQueryClient()
  const { updateLead } = useLeadsStore()
  
  const leads = response?.data ?? []
  const pagination = response?.pagination ?? {}

  const handleStatusChange = async (leadId, newStatus) => {
    // Basic optimistic update could be added here, but for now simple refetch
    const result = await updateLead(leadId, { status: newStatus })
    if (result.success) {
      queryClient.invalidateQueries(['leads'])
      addToast(`Status updated to ${newStatus}`, 'success')
    } else {
      addToast(result.error || 'Failed to update status', 'error')
    }
  }

  const columns = [
    { 
      key: 'name', 
      label: 'Name',
      render: (val, row) => (
        <div className="flex items-center gap-3">
          <Avatar name={val} size="sm" />
          <div className="flex flex-col">
            <span className="text-sm font-bold text-sidebar group-hover:text-primary transition-colors">{val}</span>
            <span className="text-[10px] text-muted font-semibold uppercase tracking-widest leading-none">{row._id || row.id}</span>
          </div>
        </div>
      )
    },
    { key: 'email', label: 'Email' },
    { key: 'phone', label: 'Phone' },
    { 
      key: 'status', 
      label: 'Status',
      render: (val) => <StatusBadge status={val} />
    },
    { key: 'source', label: 'Source' },
    { 
      key: 'owner', 
      label: 'Owner',
      render: (owner) => (
        <div className="flex items-center gap-2">
          <Avatar 
            name={owner?.name || 'Unassigned'} 
            src={owner?.avatar} 
            size="sm" 
            className="h-5 w-5" 
          />
          <span className="text-[11px] font-bold text-muted uppercase tracking-widest">
            {owner?.name || 'Unassigned'}
          </span>
        </div>
      )
    },
    { 
      key: 'created', 
      label: 'Created',
      render: (val) => (
        <span className="text-[11px] font-semibold text-muted font-mono">{val}</span>
      )
    },
    {
      key: 'actions',
      label: '',
      render: () => (
        <button className="p-1.5 text-muted hover:text-sidebar hover:bg-surface rounded-lg transition-colors">
          <MoreHorizontal size={14} />
        </button>
      )
    }
  ]

  const handleExport = () => {
    addToast('Export started...', 'info')
    setTimeout(() => addToast('Export completed successfully', 'success'), 1500)
  }

  return (
    <div className="flex flex-col h-full bg-surface/50">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-8 py-5 border-b border-border bg-card shadow-sm ring-1 ring-sidebar/5 z-10 shrink-0">
        <div className="flex items-center gap-4">
          <div className="p-2.5 bg-primary/10 rounded-xl border border-primary/20">
            <User size={20} className="text-primary" />
          </div>
          <div className="flex flex-col shrink-0">
             <h1 className="text-2xl font-black text-sidebar tracking-tight leading-none whitespace-nowrap">Leads</h1>
             <p className="text-[10px] font-black text-muted uppercase tracking-[0.2em] mt-1.5 opacity-60 whitespace-nowrap">
               {pagination?.total || leads.length} TOTAL RECORDS
             </p>
          </div>
          
          <div className="h-10 w-px bg-border mx-2" />

          {/* New Tab View Filters */}
          <div className="flex items-center bg-surface/80 p-1 rounded-xl border border-border shadow-inner shrink-0">
             {['all', 'mine', 'hot'].map((m) => (
                <button
                  key={m}
                  onClick={() => {
                    setViewMode(m)
                    setPage(1)
                  }}
                  className={clsx(
                    'px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all whitespace-nowrap',
                    viewMode === m ? 'bg-card text-primary shadow-sm' : 'text-muted hover:text-sidebar'
                  )}
                >
                  {m === 'all' ? 'All' : m === 'mine' ? 'My Leads' : 'Hot Leads'}
                </button>
             ))}
          </div>
        </div>


        <div className="flex items-center gap-3 mx-1">
          {/* View Toggle */}
          <div className="bg-surface p-1 rounded-xl border border-border flex items-center gap-1">
            <button 
              onClick={() => setView('list')}
              className={clsx(
                'flex items-center gap-2 px-4 py-2 text-xs font-black uppercase tracking-widest rounded-lg transition duration-200 outline-none whitespace-nowrap',
                activeView === 'list' 
                  ? 'bg-card text-primary shadow-sm ring-1 ring-sidebar/5' 
                  : 'text-muted hover:text-sidebar'
              )}
            >
              <LayoutList size={14} />
              <span className="hidden lg:inline-block">List View</span>
            </button>
            <button 
              onClick={() => setView('kanban')}
              className={clsx(
                'flex items-center gap-2 px-4 py-2 text-xs font-black uppercase tracking-widest rounded-lg transition duration-200 outline-none whitespace-nowrap',
                activeView === 'kanban' 
                  ? 'bg-card text-primary shadow-sm ring-1 ring-sidebar/5' 
                  : 'text-muted hover:text-sidebar'
              )}
            >
              <LayoutGrid size={14} />
              <span className="hidden lg:inline-block">Kanban board</span>
            </button>
          </div>

          <div className="h-8 w-px bg-border mx-1" />

          <button className="flex items-center gap-2 px-4 py-2.5 text-[11px] font-black uppercase tracking-widest border border-border bg-card text-muted hover:text-sidebar hover:border-sidebar rounded-xl transition duration-200 shadow-sm outline-none whitespace-nowrap">
            <Filter size={14} />
            <span className="hidden xl:inline-block">Filters</span>
          </button>

          <button 
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2.5 text-[11px] font-black uppercase tracking-widest border border-border bg-card text-muted hover:text-sidebar hover:border-sidebar rounded-xl transition duration-200 shadow-sm outline-none whitespace-nowrap"
          >
            <Download size={14} />
            <span className="hidden xl:inline-block">Export CSV</span>
          </button>

          <Button 
            className="h-10 px-6 font-black uppercase tracking-[0.1em] text-[11px] rounded-xl shadow-lg shadow-primary/20 whitespace-nowrap"
            icon={Plus}
            onClick={() => {
              setCreateInitialStatus('New')
              setIsModalOpen(true)
            }}
          >
            Create Lead
          </Button>
        </div>
      </div>

      <CreateLeadModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        initialStatus={createInitialStatus} 
      />

      {/* Content */}
      <div className="flex-1 overflow-auto p-8 custom-scrollbar">
        {isLoading ? (
          <div className="h-full flex flex-col items-center justify-center p-20 animate-in fade-in duration-500">
            <div className="relative h-12 w-12 mb-4">
              <div className="absolute inset-0 border-4 border-primary/20 rounded-full" />
              <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
            <p className="text-[11px] font-black text-muted uppercase tracking-[0.3em] animate-pulse">Syncing Database...</p>
          </div>
        ) : (
          <div className="h-full animate-in fade-in slide-in-from-bottom-4 duration-500">
            {activeView === 'list' ? (
              <div className="max-w-7xl mx-auto group">
                <DataTable 
                  columns={columns} 
                  data={leads} 
                  onRowClick={(row) => navigate(`/crm/leads/${row._id || row.id}`)}
                />
              </div>
            ) : (
              <KanbanBoard 
                columns={['New','Contacted','Qualified','Proposal','Won','Lost']}
                cards={leads}
                onCardClick={(card) => navigate(`/crm/leads/${card._id || card.id}`)}
                onDragEnd={handleStatusChange}
                onAddClick={(status) => {
                  setCreateInitialStatus(status)
                  setIsModalOpen(true)
                }}
              />
            )}
          </div>
        )}
      </div>

      {/* Pagination Bar */}
      {!isLoading && pagination?.pages > 1 && (
        <div className="px-8 py-4 border-t border-border bg-card flex items-center justify-between shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-20">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-black text-muted uppercase tracking-widest leading-none">
              Page {page} of {pagination?.pages}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button 
              disabled={page === 1}
              onClick={() => {
                setPage(p => Math.max(1, p - 1))
                window.scrollTo({ top: 0, behavior: 'smooth' })
              }}
              className="px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] border border-border rounded-lg hover:border-sidebar disabled:opacity-40 disabled:hover:border-border transition"
            >
              Previous
            </button>
            <button 
              disabled={page >= (pagination?.pages || 1)}
              onClick={() => {
                setPage(p => p + 1)
                window.scrollTo({ top: 0, behavior: 'smooth' })
              }}
              className="px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] border border-border rounded-lg hover:border-sidebar disabled:opacity-40 disabled:hover:border-border transition"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
