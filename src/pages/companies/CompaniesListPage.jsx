import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { 
  Plus, 
  LayoutList, 
  LayoutGrid, 
  Search,
  Building2,
  Globe,
  Phone,
  MapPin,
  Users,
  BarChart3,
  MoreHorizontal,
  ChevronRight,
  IndianRupee
} from 'lucide-react'
import { getCompanies } from '@/api/companies.api'
import { useUiStore } from '@/stores/uiStore'
import { useCompaniesStore } from '@/stores/companiesStore'
import DataTable from '@/components/crm/DataTable'
import Button from '@/components/ui/Button'
import Avatar from '@/components/ui/Avatar'
import { useToastStore } from '@/stores/toastStore'
import CreateCompanyModal from '@/components/crm/CreateCompanyModal'
import clsx from 'clsx'

export default function CompaniesListPage() {
  const navigate = useNavigate()
  const { activeView, setView } = useUiStore()
  const { addToast } = useToastStore()
  const queryClient = useQueryClient()
  
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [sort, setSort] = useState('-createdAt')

  const { data: response, isLoading } = useQuery({
    queryKey: ['companies', { search, page, sort }],
    queryFn:  async () => {
      const res = await getCompanies({ search, page, limit: 12, sort })
      return res.data
    }
  })
  
  const companies = response?.data ?? []
  const pagination = response?.pagination ?? {}

  const columns = [
    { 
      key: 'name', 
      label: 'Company Name',
      render: (val, row) => (
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-surface border border-border flex items-center justify-center text-primary">
            <Building2 size={16} />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold text-sidebar group-hover:text-primary transition-colors">{val}</span>
            <span className="text-[10px] text-muted font-semibold uppercase tracking-widest leading-none mt-1 opacity-60">
              {row.domain || 'no-domain.com'}
            </span>
          </div>
        </div>
      )
    },
    { 
      key: 'industry', 
      label: 'Industry',
      render: (val) => (
        <span className="text-[10px] font-black uppercase tracking-widest bg-surface px-2.5 py-1 rounded-full border border-border text-muted">
          {val || 'General'}
        </span>
      )
    },
    { 
      key: 'size', 
      label: 'Team Size',
      render: (val) => (
        <div className="flex items-center gap-1.5 text-xs text-sidebar font-bold">
           <Users size={12} className="text-muted" />
           <span>{val || '—'}</span>
        </div>
      )
    },
    { 
      key: 'city', 
      label: 'Location',
      render: (val, row) => (
        <div className="flex flex-col">
          <span className="text-xs font-bold text-sidebar">{val || 'Remote'}</span>
          <span className="text-[10px] text-muted font-bold uppercase tracking-widest">{row.country}</span>
        </div>
      )
    },
    { 
      key: 'owner', 
      label: 'Account Manager',
      render: (owner) => (
        <div className="flex items-center gap-2">
          <Avatar 
             name={owner?.name || 'Unassigned'} 
             src={owner?.avatar} 
             size="sm" 
             className="h-5 w-5" 
          />
          <span className="text-[11px] font-bold text-muted uppercase tracking-widest leading-none">
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
             navigate(`/crm/companies/${row._id || row.id}`)
          }}
          className="p-1.5 text-muted hover:text-sidebar hover:bg-surface rounded-lg transition-colors border border-transparent hover:border-border"
        >
          <ChevronRight size={14} />
        </button>
      )
    }
  ]

  return (
    <div className="flex flex-col h-full bg-surface/50">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-8 py-5 border-b border-border bg-card shadow-sm ring-1 ring-sidebar/5 z-10 shrink-0">
        <div className="flex items-center gap-4">
          <div className="p-2.5 bg-primary/10 rounded-xl border border-primary/20">
            <Building2 size={20} className="text-primary" />
          </div>
          <div className="flex flex-col shrink-0">
             <h1 className="text-2xl font-black text-sidebar tracking-tight leading-none whitespace-nowrap">Companies</h1>
             <p className="text-[10px] font-black text-muted uppercase tracking-[0.2em] mt-1.5 opacity-60 whitespace-nowrap uppercase tracking-widest">
               {pagination.total || companies.length} ENTERPRISE ENTITIES
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
            placeholder="Search organizations or domains..." 
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
              <span className="hidden lg:inline-block">Table</span>
            </button>
            <button 
              onClick={() => setView('grid')}
              className={clsx(
                'flex items-center gap-2 px-4 py-2 text-xs font-black uppercase tracking-widest rounded-lg transition duration-200 outline-none whitespace-nowrap',
                activeView === 'grid' 
                  ? 'bg-card text-primary shadow-sm ring-1 ring-sidebar/5' 
                  : 'text-muted hover:text-sidebar'
              )}
            >
              <LayoutGrid size={14} />
              <span className="hidden lg:inline-block">Cards</span>
            </button>
          </div>

          <Button 
            className="h-10 px-6 font-black uppercase tracking-[0.1em] text-[11px] rounded-xl shadow-lg shadow-primary/20 whitespace-nowrap"
            icon={Plus}
            onClick={() => setIsModalOpen(true)}
          >
            New Company
          </Button>
        </div>
      </div>

      <CreateCompanyModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />

      {/* Content */}
      <div className="flex-1 overflow-auto p-8 custom-scrollbar">
        {isLoading ? (
           <div className="h-full flex flex-col items-center justify-center p-20">
             <div className="relative h-12 w-12 mb-4">
               <div className="absolute inset-0 border-4 border-primary/20 rounded-full" />
               <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin" />
             </div>
             <p className="text-[10px] font-black text-muted uppercase tracking-widest animate-pulse mt-4">Compiling Entities...</p>
           </div>
        ) : (
          <div className="h-full animate-in fade-in slide-in-from-bottom-4 duration-500">
            {activeView === 'list' ? (
              <div className="max-w-7xl mx-auto group">
                <DataTable 
                  columns={columns} 
                  data={companies} 
                  onRowClick={(row) => navigate(`/crm/companies/${row._id || row.id}`)}
                />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 max-w-7xl mx-auto">
                {companies.map((company) => (
                  <div 
                    key={company._id || company.id}
                    onClick={() => navigate(`/crm/companies/${company._id || company.id}`)}
                    className="group bg-card p-6 rounded-2xl border border-border shadow-sm hover:border-primary hover:shadow-xl transition-all duration-300 cursor-pointer relative overflow-hidden"
                  >
                     <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                        <ChevronRight size={16} className="text-primary" />
                     </div>
                     <div className="flex items-start gap-4 mb-6">
                        <div className="h-12 w-12 rounded-xl bg-surface border border-border flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                           <Building2 size={24} />
                        </div>
                        <div className="flex flex-col">
                           <h3 className="font-black text-sidebar group-hover:text-primary transition-colors">{company.name}</h3>
                           <a 
                             href={`https://${company.domain}`} 
                             target="_blank" 
                             rel="noopener noreferrer"
                             className="text-[10px] font-bold text-muted uppercase tracking-widest hover:text-primary transition-colors flex items-center gap-1 mt-1"
                             onClick={(e) => e.stopPropagation()}
                           >
                              <Globe size={10} />
                              {company.domain || 'no-domain.com'}
                           </a>
                        </div>
                     </div>

                     <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="bg-surface/50 p-2.5 rounded-xl border border-border/50">
                           <p className="text-[10px] font-black text-muted uppercase tracking-tighter mb-1 opacity-50">Industry</p>
                           <p className="text-[11px] font-bold text-sidebar line-clamp-1">{company.industry || 'General'}</p>
                        </div>
                        <div className="bg-surface/50 p-2.5 rounded-xl border border-border/50">
                           <p className="text-[10px] font-black text-muted uppercase tracking-tighter mb-1 opacity-50">Staffing</p>
                           <p className="text-[11px] font-bold text-sidebar">{company.size || '11-50'} members</p>
                        </div>
                     </div>

                     <div className="flex items-center justify-between pt-4 border-t border-border/50">
                        <div className="flex items-center gap-2">
                           <MapPin size={12} className="text-muted" />
                           <span className="text-[11px] font-bold text-muted uppercase tracking-widest">{company.city || 'Remote'}</span>
                        </div>
                        <div className="flex -space-x-2">
                           <Avatar name={company.owner?.name} src={company.owner?.avatar} size="xs" />
                        </div>
                     </div>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination Controls */}
            {pagination.pages > 1 && (
              <div className="mt-8 flex items-center justify-center gap-2">
                <button 
                  disabled={page === 1}
                  onClick={() => setPage(p => p - 1)}
                  className="px-6 py-2.5 bg-card border border-border rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-surface disabled:opacity-30 disabled:hover:bg-card transition-all shadow-sm"
                >
                  Previous
                </button>
                <button 
                  disabled={page === pagination.pages}
                  onClick={() => setPage(p => p + 1)}
                  className="px-6 py-2.5 bg-card border border-border rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-surface disabled:opacity-30 disabled:hover:bg-card transition-all shadow-sm"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
