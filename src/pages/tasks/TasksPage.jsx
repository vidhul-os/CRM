import { useState, useEffect } from 'react'
import { useTasksStore } from '@/stores/crmStore'
import { useToastStore } from '@/stores/toastStore'
import { TASK_STATUSES, TASK_PRIORITIES } from '@/utils/constants'
import DataTable   from '@/components/crm/DataTable'
import Button      from '@/components/ui/Button'
import Input       from '@/components/ui/Input'
import Select      from '@/components/ui/Select'
import Modal       from '@/components/ui/Modal'
import StatusBadge from '@/components/crm/StatusBadge'
import { CheckSquare, Plus, Pencil, Trash2, Search, AlignLeft, User, Calendar, Flag } from 'lucide-react'
import clsx from 'clsx'

const STATUS_MAP = {
  'Open':         'bg-blue-100 text-blue-700',
  'In Progress':  'bg-purple-100 text-purple-700',
  'Completed':    'bg-green-100 text-green-700',
  'Overdue':      'bg-red-100 text-red-700',
}
const PRIORITY_MAP = {
  'Low':      'bg-gray-100 text-gray-600',
  'Medium':   'bg-yellow-100 text-yellow-700',
  'High':     'bg-orange-100 text-orange-700',
  'Critical': 'bg-red-100 text-red-700',
}

const EMPTY = { title:'', description:'', status:'Open', priority:'Medium', dueDate:'' }
const STATUS_OPTS    = TASK_STATUSES.map(s => ({ value:s, label:s }))
const PRIORITY_OPTS  = TASK_PRIORITIES.map(p => ({ value:p, label:p }))

export default function TasksPage() {
  const { tasks, fetchTasks, addTask, updateTask, deleteTask } = useTasksStore()
  
  useEffect(() => {
    fetchTasks()
  }, [])

  const { addToast } = useToastStore()
  const [search,  setSearch]  = useState('')
  const [filter,  setFilter]  = useState('All')
  const [modal,   setModal]   = useState(null)
  const [editing, setEditing] = useState(null)
  const [form,    setForm]    = useState(EMPTY)

  const filtered = tasks.filter(t => {
    const matchSearch = t.title.toLowerCase().includes(search.toLowerCase())
    const matchFilter = filter === 'All' || t.status === filter
    return matchSearch && matchFilter
  })

  const openAdd   = () => { setForm(EMPTY); setEditing(null); setModal('add') }
  const openEdit  = (t) => { setForm(t); setEditing(t._id || t.id); setModal('edit') }
  const close     = () => setModal(null)
  const upd       = (k,v) => setForm(f => ({...f,[k]:v}))

  const save = () => {
    if (!form.title.trim()) { addToast('Task title is required','error'); return }
    
    // Prepare payload, removing 'Admin' or non-ObjectId values that might fail backend validation
    const payload = { ...form }
    if (!payload.assignedTo || payload.assignedTo === 'Admin') {
      delete payload.assignedTo // Let backend handle default assignment to current user
    }

    if (modal === 'add') { 
      addTask(payload)
      addToast('Task created!','success') 
    }
    else { 
      updateTask(editing, payload)
      addToast('Task updated!','success') 
    }
    close()
  }

  const del = (id) => { deleteTask(id); addToast('Task deleted','info') }

  const columns = [
    { key:'title', label:'Task', render:(val, row) => (
      <div className="flex items-start gap-3">
        <button
          onClick={e => { e.stopPropagation(); updateTask(row._id || row.id, { status: row.status === 'Completed' ? 'Open' : 'Completed' }) }}
          className={`mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition ${row.status === 'Completed' ? 'border-green-500 bg-green-500' : 'border-border hover:border-primary'}`}
        >
          {row.status === 'Completed' && <svg className="w-3 h-3 text-white" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>}
        </button>
        <div className={row.status === 'Completed' ? 'line-through opacity-50' : ''}>
          <p className="font-bold text-sidebar text-sm">{val}</p>
          {row.description && <p className="text-[10px] text-muted font-semibold mt-0.5 line-clamp-1">{row.description}</p>}
        </div>
      </div>
    )},
    { key:'status',   label:'Status',   render:(v) => (
      <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full border ${STATUS_MAP[v] ?? 'bg-gray-100 text-gray-600'} border-current/20`}>{v}</span>
    )},
    { key:'priority', label:'Priority', render:(v) => (
      <span className={`flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full ${PRIORITY_MAP[v] ?? ''}`}>
        <Flag size={10}/>{v}
      </span>
    )},
    { key:'dueDate',    label:'Due',       render:(v) => <span className="text-xs font-mono text-muted">{v || '—'}</span> },
    { key:'assignedTo', label:'Assigned',  render:(v) => <span className="text-xs font-bold text-sidebar">{v?.name || v || 'Unassigned'}</span> },
    { key:'actions',    label:'',          render:(_,row) => (
      <div className="flex gap-2">
        <button onClick={e => { e.stopPropagation(); openEdit(row) }} className="p-1.5 text-muted hover:text-primary hover:bg-blue-50 rounded-lg transition"><Pencil size={14}/></button>
        <button onClick={e => { e.stopPropagation(); del(row._id || row.id) }}   className="p-1.5 text-muted hover:text-red-500 hover:bg-red-50 rounded-lg transition"><Trash2 size={14}/></button>
      </div>
    )},
  ]

  const completedCount = tasks.filter(t => t.status === 'Completed').length
  const pct = tasks.length ? Math.round((completedCount / tasks.length) * 100) : 0

  return (
    <div className="flex flex-col h-full bg-surface/50">
      {/* Header */}
      <div className="flex items-center justify-between px-8 py-5 border-b border-border bg-card shadow-sm ring-1 ring-sidebar/5 shrink-0">
        <div className="flex items-center gap-4">
          <div className="p-2.5 bg-primary/10 rounded-xl border border-primary/20">
            <CheckSquare size={20} className="text-primary"/>
          </div>
          <div>
            <h1 className="text-2xl font-black text-sidebar tracking-tight leading-none">Tasks</h1>
            <p className="text-[10px] font-black text-muted uppercase tracking-[0.2em] mt-1.5 opacity-60">{completedCount}/{tasks.length} completed — {pct}% progress</p>
          </div>
        </div>
        <Button onClick={openAdd} className="rounded-xl font-black uppercase tracking-wider text-xs gap-2 shadow-lg shadow-primary/20">
          <Plus size={15}/> New Task
        </Button>
      </div>

      {/* Progress bar */}
      <div className="h-1.5 bg-surface">
        <div className="h-full bg-green-500 transition-all duration-700" style={{ width: `${pct}%` }}/>
      </div>

      {/* Filters */}
      <div className="px-8 py-4 bg-card border-b border-border flex items-center gap-4 flex-wrap">
        <div className="flex-1 max-w-xs">
          <Input placeholder="Search tasks..." value={search} onChange={e => setSearch(e.target.value)} icon={Search}/>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {['All', ...TASK_STATUSES].map(s => (
            <button key={s} onClick={() => setFilter(s)}
              className={clsx('px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border transition',
                filter === s ? 'bg-primary text-white border-primary' : 'bg-card border-border text-muted hover:border-primary'
              )}>{s}</button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto p-8">
        <DataTable columns={columns} data={filtered}/>
      </div>

      {/* Modal */}
      <Modal isOpen={!!modal} onClose={close} title={modal === 'add' ? 'Create New Task' : 'Edit Task'} size="md">
        <div className="space-y-4">
          <Input label="Task Title" placeholder="e.g. Follow up with client" value={form.title} onChange={e => upd('title',e.target.value)} icon={AlignLeft}/>
          <Input label="Description" placeholder="Additional notes..." value={form.description} onChange={e => upd('description',e.target.value)}/>
          <div className="grid grid-cols-2 gap-4">
            <Select label="Status"   value={form.status}   onChange={e => upd('status',e.target.value)}   options={STATUS_OPTS}/>
            <Select label="Priority" value={form.priority} onChange={e => upd('priority',e.target.value)} options={PRIORITY_OPTS}/>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Due Date"  type="date" value={form.dueDate}    onChange={e => upd('dueDate',e.target.value)}    icon={Calendar}/>
            <Input label="Assigned To" value={form.assignedTo?.name || form.assignedTo || ''} placeholder="Leave empty for self" onChange={e => upd('assignedTo',e.target.value)} icon={User}/>
          </div>
          <div className="flex gap-3 justify-end pt-2">
            <Button variant="ghost" onClick={close} className="rounded-xl">Cancel</Button>
            <Button onClick={save} className="rounded-xl font-black uppercase tracking-wider text-xs px-6">
              {modal === 'add' ? 'Create Task' : 'Update Task'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
