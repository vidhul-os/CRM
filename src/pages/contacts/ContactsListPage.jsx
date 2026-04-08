import { useState, useEffect } from 'react'
import { useContactsStore } from '@/stores/crmStore'
import { useToastStore }    from '@/stores/toastStore'
import { ROLES } from '@/utils/constants'
import DataTable   from '@/components/crm/DataTable'
import Avatar      from '@/components/ui/Avatar'
import Button      from '@/components/ui/Button'
import Input       from '@/components/ui/Input'
import Select      from '@/components/ui/Select'
import Modal       from '@/components/ui/Modal'
import StatusBadge from '@/components/crm/StatusBadge'
import { Plus, Pencil, Trash2, Contact2, Search, Mail, Phone, Building2, User } from 'lucide-react'

const EMPTY = { name:'', email:'', phone:'', company:'', role:'', status:'Active' }
const STATUS_OPTS = [{ value:'Active', label:'Active'}, { value:'Inactive', label:'Inactive'}]

export default function ContactsListPage() {
  const { contacts, fetchContacts, addContact, updateContact, deleteContact, loading } = useContactsStore()
  
  useEffect(() => {
    fetchContacts()
  }, [])
  const { addToast } = useToastStore()
  const [search, setSearch] = useState('')
  const [modal,  setModal]  = useState(null) // null | 'add' | 'edit'
  const [editing,setEditing]= useState(null)
  const [form,   setForm]   = useState(EMPTY)

  const filtered = contacts.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase()) ||
    c.company.toLowerCase().includes(search.toLowerCase())
  )

  const openAdd   = () => { setForm(EMPTY); setEditing(null); setModal('add') }
  const openEdit  = (c) => { setForm(c); setEditing(c.id); setModal('edit') }
  const close     = () => setModal(null)
  const upd       = (k,v) => setForm(f => ({...f,[k]:v}))

  const save = () => {
    if (!form.name || !form.email) { addToast('Name and email are required','error'); return }
    if (modal === 'add') { addContact(form); addToast('Contact added!','success') }
    else { updateContact(editing, form); addToast('Contact updated!','success') }
    close()
  }

  const del = (id) => { deleteContact(id); addToast('Contact deleted','info') }

  const columns = [
    { key:'name', label:'Contact', render:(val, row) => (
      <div className="flex items-center gap-3">
        <Avatar name={val} size="md"/>
        <div>
          <p className="font-bold text-sidebar text-sm">{val}</p>
          <p className="text-xs text-muted font-mono">{row.email}</p>
        </div>
      </div>
    )},
    { key:'phone',   label:'Phone',   render:(v) => <span className="text-xs font-mono text-muted">{v}</span> },
    { key:'company', label:'Company'  },
    { key:'role',    label:'Title'    },
    { key:'status',  label:'Status',  render:(v) => <StatusBadge status={v === 'Active' ? 'Won' : 'Lost'}/> },
    { key:'actions', label:'',        render:(_,row) => (
      <div className="flex gap-2">
        <button onClick={e => { e.stopPropagation(); openEdit(row) }} className="p-1.5 text-muted hover:text-primary hover:bg-blue-50 rounded-lg transition"><Pencil size={14}/></button>
        <button onClick={e => { e.stopPropagation(); del(row.id) }}   className="p-1.5 text-muted hover:text-red-500 hover:bg-red-50 rounded-lg transition"><Trash2 size={14}/></button>
      </div>
    )},
  ]

  return (
    <div className="flex flex-col h-full bg-surface/50">
      {/* Header */}
      <div className="flex items-center justify-between px-8 py-5 border-b border-border bg-card shadow-sm ring-1 ring-sidebar/5 shrink-0">
        <div className="flex items-center gap-4">
          <div className="p-2.5 bg-primary/10 rounded-xl border border-primary/20">
            <Contact2 size={20} className="text-primary"/>
          </div>
          <div>
            <h1 className="text-2xl font-black text-sidebar tracking-tight leading-none">Contacts</h1>
            <p className="text-[10px] font-black text-muted uppercase tracking-[0.2em] mt-1.5 opacity-60">{contacts.length} people in your directory</p>
          </div>
        </div>
        <Button onClick={openAdd} className="rounded-xl font-black uppercase tracking-wider text-xs gap-2 shadow-lg shadow-primary/20">
          <Plus size={15}/> New Contact
        </Button>
      </div>

      {/* Search */}
      <div className="px-8 py-4 bg-card border-b border-border">
        <div className="max-w-md">
          <Input placeholder="Search name, email, or company..." value={search} onChange={e => setSearch(e.target.value)} icon={Search}/>
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto p-8">
        <DataTable columns={columns} data={filtered}/>
      </div>

      {/* Modal */}
      <Modal isOpen={!!modal} onClose={close} title={modal === 'add' ? 'Add New Contact' : 'Edit Contact'} size="md">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input label="Full Name" value={form.name} onChange={e => upd('name',e.target.value)} icon={User}/>
            <Input label="Phone"     value={form.phone} onChange={e => upd('phone',e.target.value)} icon={Phone}/>
          </div>
          <Input label="Email"   type="email" value={form.email}   onChange={e => upd('email',e.target.value)}   icon={Mail}/>
          <Input label="Company" value={form.company} onChange={e => upd('company',e.target.value)} icon={Building2}/>
          <div className="grid grid-cols-2 gap-4">
            <Input  label="Title / Role" value={form.role} onChange={e => upd('role',e.target.value)} placeholder="CTO, CEO …"/>
            <Select label="Status" value={form.status} onChange={e => upd('status',e.target.value)} options={STATUS_OPTS}/>
          </div>
          <div className="flex gap-3 justify-end pt-2">
            <Button variant="ghost" onClick={close} className="rounded-xl">Cancel</Button>
            <Button onClick={save} className="rounded-xl font-black uppercase tracking-wider text-xs px-6">
              {modal === 'add' ? 'Add Contact' : 'Save Changes'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
