import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { 
  Plus, 
  LayoutList, 
  LayoutGrid, 
  Filter, 
  ArrowUpDown, 
  IndianRupee,
  MoreHorizontal,
  Briefcase,
  Search,
  Download,
  ChevronRight
} from 'lucide-react'
import { getDeals } from '@/api/deals.api'
import { useUiStore } from '@/stores/uiStore'
import { useDealsStore } from '@/stores/dealsStore'
import StatusBadge from '@/components/crm/StatusBadge'
import DataTable from '@/components/crm/DataTable'
import KanbanBoard from '@/components/crm/KanbanBoard'
import Button from '@/components/ui/Button'
import Avatar from '@/components/ui/Avatar'
import { useToastStore } from '@/stores/toastStore'
import CreateDealModal from '@/components/crm/CreateDealModal'
import clsx from 'clsx'

export default function DealsListPage() {
  const navigate = useNavigate()
  const { activeView, setView } = useUiStore()
  const { addToast } = useToastStore()
  const queryClient = useQueryClient()
  const { updateDeal } = useDealsStore()
  
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [initialStage, setInitialStage] = useState('Qualification')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [sort, setSort] = useState('-createdAt')

  const { data: response, isLoading } = useQuery({
    queryKey: ['deals', { search, page, sort }],
    queryFn:  async () => {
      const res = await getDeals({ search, page, limit: 10, sort })
      return res.data
    }
  })
  
  const deals = response?.data ?? []
  const pagination = response?.pagination ?? {}

  const handleStageChange = async (dealId, newStage) => {
    const result = await updateDeal(dealId, { stage: newStage })
    if (result.success) {
      queryClient.invalidateQueries(['deals'])
      addToast(`Deal moved to ${newStage}`, 'success')
    } else {
      addToast(result.error || 'Failed to update stage', 'error')
    }
  }

  const columns = [
    { 
      key: 'name', 
      label: 'Deal Name',
      render: (val, row) => (
        <div className="flex flex-col">
          <span className="text-sm font-bold text-sidebar group-hover:text-primary transition-colors">{val}</span>
          <span className="text-[10px] text-muted font-semibold uppercase tracking-widest leading-none mt-1 opacity-60">
            {row.company}
          </span>
        </div>
      )
    },
    { key: 'contact', label: 'Contact' },
    { 
      key: 'value', 
      label: 'Value',
      render: (val) => (
        <div className="flex items-center gap-1 text-primary font-black">
          <IndianRupee size={12} />
          <span>{val?.toLocaleString('en-IN') || 0}</span>
        </div>
      )
    },
    { 
      key: 'stage', 
      label: 'Stage',
      render: (val) => <StatusBadge status={val} />
    },
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
      key: 'actions',
      label: '',
      render: (val, row) => (
        <button 
          onClick={(e) => {
             e.stopPropagation()
             navigate(`/crm/deals/${row._id || row.id}`)
          }}
          className="p-1.5 text-muted hover:text-sidebar hover:bg-surface rounded-lg transition-colors"
        >
          <ChevronRight size={14} />
        </button>
      )
    }
  ]

  const kanbanStages = ['Qualification', 'Demo', 'Proposal', 'Negotiation', 'Closed Won', 'Closed Lost']

  return (
    <div className="flex flex-col h-full bg-surface/50">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-8 py-5 border-b border-border bg-card shadow-sm ring-1 ring-sidebar/5 z-10 shrink-0">
        <div className="flex items-center gap-4">
          <div className="p-2.5 bg-primary/10 rounded-xl border border-primary/20">
            <Briefcase size={20} className="text-primary" />
          </div>
          <div className="flex flex-col shrink-0">
             <h1 className="text-2xl font-black text-sidebar tracking-tight leading-none whitespace-nowrap">Deals</h1>
             <p className="text-[10px] font-black text-muted uppercase tracking-[0.2em] mt-1.5 opacity-60 whitespace-nowrap">
               {pagination.total || deals.length} OPPORTUNITIES IN PIPELINE
             </p>
          </div>
        </div>

        {/* Search */}
        <div className="flex-1 max-w-md mx-8 relative group">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-primary transition-colors">
            <Search size={16} />
          </div>
          <input 
            type="text" 
            placeholder="Search deals by name or company..." 
            className="w-full bg-surface/50 border border-border rounded-xl py-2.5 pl-11 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all placeholder:text-muted/50"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setPage(1)
            }}
          />
        </div>

        <div className="flex items-center gap-3">
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
              <span className="hidden lg:inline-block">List</span>
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
              <span className="hidden lg:inline-block">Kanban</span>
            </button>
          </div>

          <Button 
            className="h-10 px-6 font-black uppercase tracking-[0.1em] text-[11px] rounded-xl shadow-lg shadow-primary/20 whitespace-nowrap"
            icon={Plus}
            onClick={() => {
              setInitialStage('Qualification')
              setIsModalOpen(true)
            }}
          >
            Create Deal
          </Button>
        </div>
      </div>

      <CreateDealModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        initialStage={initialStage}
      />

      {/* Content */}
      <div className="flex-1 overflow-auto p-8 custom-scrollbar">
        {isLoading ? (
           <div className="h-full flex flex-col items-center justify-center p-20">
             <div className="relative h-12 w-12 mb-4">
               <div className="absolute inset-0 border-4 border-primary/20 rounded-full" />
               <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin" />
             </div>
             <p className="text-[10px] font-black text-muted uppercase tracking-widest animate-pulse mt-4">Loading Pipeline...</p>
           </div>
        ) : (
          <div className="h-full animate-in fade-in slide-in-from-bottom-4 duration-500">
            {activeView === 'list' ? (
              <div className="max-w-7xl mx-auto group">
                <DataTable 
                  columns={columns} 
                  data={deals} 
                  onRowClick={(row) => navigate(`/crm/deals/${row._id || row.id}`)}
                />
                
                {pagination.pages > 1 && (
                  <div className="mt-6 flex items-center justify-between bg-card p-4 rounded-xl border border-border">
                    <span className="text-[10px] font-black text-muted uppercase tracking-widest">
                      Page {page} of {pagination.pages}
                    </span>
                    <div className="flex gap-2">
                      <button 
                        disabled={page === 1}
                        onClick={() => setPage(p => p - 1)}
                        className="px-4 py-2 text-[10px] font-black uppercase border border-border rounded-lg disabled:opacity-30"
                      >
                        Prev
                      </button>
                      <button 
                        disabled={page === pagination.pages}
                        onClick={() => setPage(p => p + 1)}
                        className="px-4 py-2 text-[10px] font-black uppercase border border-border rounded-lg disabled:opacity-30"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <KanbanBoard 
                columns={kanbanStages}
                cards={deals.map(d => ({ ...d, status: d.stage }))}
                onCardClick={(card) => navigate(`/crm/deals/${card._id || card.id}`)}
                onDragEnd={handleStageChange}
                onAddClick={(stage) => {
                  setInitialStage(stage)
                  setIsModalOpen(true)
                }}
              />
            )}
          </div>
        )}
      </div>
    </div>
  )
}
