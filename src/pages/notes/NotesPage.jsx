import { useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { 
  Plus, 
  Search,
  FileText,
  Pin,
  MessageSquare,
  Calendar,
  MoreHorizontal,
  Trash2,
  Filter,
  Users,
  Mic,
  Mail,
  Video
} from 'lucide-react'
import { getNotes } from '@/api/notes.api'
import { useNotesStore } from '@/stores/notesStore'
import { useToastStore } from '@/stores/toastStore'
import Button from '@/components/ui/Button'
import Avatar from '@/components/ui/Avatar'
import CreateNoteModal from '@/components/crm/CreateNoteModal'
import { clsx } from 'clsx'
import { format } from 'date-fns'

const TYPE_ICONS = {
  'Note':    <FileText size={14} />,
  'Meeting': <Video size={14} />,
  'Call':    <Mic size={14} />,
  'Email':   <Mail size={14} />
}

const TYPE_COLORS = {
  'Note':    'text-blue-500 bg-blue-50 border-blue-100',
  'Meeting': 'text-purple-500 bg-purple-50 border-purple-100',
  'Call':    'text-orange-500 bg-orange-50 border-orange-100',
  'Email':   'text-green-500 bg-green-50 border-green-100'
}

export default function NotesPage() {
  const { deleteNote, updateNote } = useNotesStore()
  const { addToast } = useToastStore()
  const queryClient = useQueryClient()
  
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [filterType, setFilterType] = useState('All')
  const [page, setPage] = useState(1)

  const { data: response, isLoading } = useQuery({
    queryKey: ['notes', { search, page, filterType }],
    queryFn: async () => {
      const params = { page, limit: 12 }
      if (filterType !== 'All') params.type = filterType
      const res = await getNotes(params)
      return res.data
    }
  })

  const notes = response?.data ?? []
  const pagination = response?.pagination ?? {}

  const handleTogglePin = async (id, currentPinned) => {
    const res = await updateNote(id, { pinned: !currentPinned })
    if (res.success) {
      queryClient.invalidateQueries(['notes'])
      addToast(currentPinned ? 'Unpinned' : 'Pinned to top', 'info')
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this note?')) return
    const res = await deleteNote(id)
    if (res.success) {
      queryClient.invalidateQueries(['notes'])
      addToast('Note removed', 'info')
    }
  }

  return (
    <div className="flex flex-col h-full bg-surface/50">
      {/* Header */}
      <div className="flex items-center justify-between px-8 py-5 border-b border-border bg-card shadow-sm ring-1 ring-sidebar/5 z-10 shrink-0">
        <div className="flex items-center gap-4">
          <div className="p-2.5 bg-primary/10 rounded-xl border border-primary/20">
            <MessageSquare size={20} className="text-primary" />
          </div>
          <div className="flex flex-col shrink-0">
             <h1 className="text-2xl font-black text-sidebar tracking-tight leading-none whitespace-nowrap">Communication Log</h1>
             <p className="text-[10px] font-black text-muted uppercase tracking-[0.2em] mt-1.5 opacity-60 whitespace-nowrap">
               {pagination.total || notes.length} INTERACTIONS CAPTURED
             </p>
          </div>
        </div>

        {/* Filter bar */}
        <div className="flex items-center gap-2 bg-surface p-1 rounded-xl border border-border">
          {['All', 'Note', 'Meeting', 'Call', 'Email'].map(type => (
            <button 
              key={type}
              onClick={() => setFilterType(type)}
              className={clsx(
                'px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition duration-200',
                filterType === type 
                  ? 'bg-card text-primary shadow-sm ring-1 ring-sidebar/5' 
                  : 'text-muted hover:text-sidebar'
              )}
            >
              {type}
            </button>
          ))}
        </div>

        <Button 
          className="h-10 px-6 font-black uppercase tracking-[0.1em] text-[11px] rounded-xl shadow-lg shadow-primary/20 whitespace-nowrap"
          icon={Plus}
          onClick={() => setIsModalOpen(true)}
        >
          Capture Interaction
        </Button>
      </div>

      <CreateNoteModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />

      {/* Content */}
      <div className="flex-1 overflow-auto p-8 custom-scrollbar">
        {isLoading ? (
           <div className="h-full flex flex-col items-center justify-center p-20">
             <div className="relative h-12 w-12">
               <div className="absolute inset-0 border-4 border-primary/20 rounded-full" />
               <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin" />
             </div>
           </div>
        ) : (
          <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
            {notes.length === 0 ? (
               <div className="flex flex-col items-center justify-center p-20 border-2 border-dashed border-border rounded-3xl opacity-40">
                  <MessageSquare size={48} className="mb-4" />
                  <p className="text-sm font-black uppercase tracking-widest text-muted">No interactions logged yet</p>
               </div>
            ) : (
              notes.map((note) => (
                <div 
                  key={note._id || note.id}
                  className={clsx(
                    "group bg-card rounded-2xl border transition-all duration-300 relative",
                    note.pinned ? "border-primary/30 shadow-md ring-1 ring-primary/5" : "border-border shadow-sm hover:border-sidebar/30"
                  )}
                >
                  {note.pinned && (
                    <div className="absolute -top-2 -left-2 bg-primary text-white p-1.5 rounded-lg shadow-lg">
                       <Pin size={10} className="fill-current" />
                    </div>
                  )}

                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                         <div className={clsx(
                           "p-2 rounded-xl border flex items-center justify-center",
                           TYPE_COLORS[note.type] || 'text-muted bg-surface'
                         )}>
                           {TYPE_ICONS[note.type] || <FileText size={14} />}
                         </div>
                         <div className="flex flex-col">
                           <span className="text-[10px] font-black uppercase tracking-widest text-muted">{note.type}</span>
                           <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-xs font-bold text-sidebar">{note.owner?.name || 'Authorized User'}</span>
                              <span className="h-1 w-1 rounded-full bg-border" />
                              <span className="text-[10px] font-semibold text-muted font-mono">{format(new Date(note.createdAt), 'MMM dd, h:mm a')}</span>
                           </div>
                         </div>
                      </div>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                         <button 
                           onClick={() => handleTogglePin(note._id || note.id, note.pinned)}
                           className={clsx("p-2 rounded-lg transition-colors", note.pinned ? "text-primary bg-primary/10" : "text-muted hover:text-sidebar hover:bg-surface")}
                         >
                           <Pin size={14} className={note.pinned ? "fill-current" : ""} />
                         </button>
                         <button 
                           onClick={() => handleDelete(note._id || note.id)}
                           className="p-2 text-muted hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                         >
                           <Trash2 size={14} />
                         </button>
                      </div>
                    </div>

                    <div className="text-sm text-sidebar font-medium leading-relaxed whitespace-pre-wrap pl-1">
                       {note.content}
                    </div>

                    <div className="mt-6 flex items-center gap-4 pt-4 border-t border-border/50">
                       <div className="flex items-center gap-2 text-[10px] font-black text-muted uppercase tracking-widest bg-surface/80 px-2 py-1 rounded-md border border-border/50">
                          <Users size={12} />
                          {note.leadId ? 'Related to Lead' : note.dealId ? 'Related to Deal' : 'General Entity'}
                       </div>
                    </div>
                  </div>
                </div>
              ))
            )}
            
            {pagination.pages > 1 && (
              <div className="pt-8 flex items-center justify-center gap-2">
                <button 
                  disabled={page === 1}
                  onClick={() => setPage(p => p - 1)}
                  className="px-6 py-2 border border-border rounded-xl text-[10px] font-black uppercase tracking-widest disabled:opacity-30"
                >
                  Earlier
                </button>
                <button 
                  disabled={page === pagination.pages}
                  onClick={() => setPage(p => p + 1)}
                  className="px-6 py-2 border border-border rounded-xl text-[10px] font-black uppercase tracking-widest disabled:opacity-30"
                >
                  Older
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
