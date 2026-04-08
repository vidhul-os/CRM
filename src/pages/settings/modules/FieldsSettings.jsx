import { useState } from 'react'
import { useSettingsStore } from '@/stores/settingsStore'
import { useToastStore }    from '@/stores/toastStore'
import { MODULES_LIST } from '@/utils/constants'
import Button from '@/components/ui/Button'
import Input  from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import Modal  from '@/components/ui/Modal'
import { Plus, Trash2, ToggleLeft, ToggleRight } from 'lucide-react'

const FIELD_TYPES = ['Text','Number','Dropdown','Date','Checkbox','Email','URL']
const EMPTY = { label:'', type:'Text', module:'Leads', required:false }

export default function FieldsSettings() {
  const { fields, addField, deleteField, toggleRequired } = useSettingsStore()
  const { addToast } = useToastStore()
  const [modal, setModal] = useState(false)
  const [form, setForm]   = useState(EMPTY)
  const [moduleFilter, setFilter] = useState('All')

  const filtered = moduleFilter === 'All' ? fields : fields.filter(f => f.module === moduleFilter)

  const save = () => {
    if (!form.label.trim()) { addToast('Field label is required','error'); return }
    addField(form); addToast('Custom field added!','success'); setModal(false); setForm(EMPTY)
  }

  const MODULE_OPTS = ['All', ...MODULES_LIST].map(m => ({ value:m, label:m }))

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-sidebar">Fields & Layout</h2>
          <p className="text-xs text-muted uppercase tracking-widest mt-1 font-bold">Extend CRM modules with custom fields</p>
        </div>
        <Button onClick={() => setModal(true)} className="rounded-xl font-black uppercase tracking-wider text-xs gap-2 shadow-lg shadow-primary/20">
          <Plus size={15}/> Add Field
        </Button>
      </div>

      {/* Filter */}
      <div className="flex items-center gap-3 flex-wrap">
        {['All', ...MODULES_LIST].map(m => (
          <button key={m}
            onClick={() => setFilter(m)}
            className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider border transition ${
              moduleFilter === m ? 'bg-primary text-white border-primary' : 'bg-card border-border text-muted hover:border-primary'
            }`}
          >{m}</button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-surface/50 border-b border-border">
              {['Label','Type','Module','Required','Actions'].map(h => (
                <th key={h} className="text-left px-5 py-3.5 text-[10px] font-black text-muted uppercase tracking-widest">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border/40">
            {filtered.map(f => (
              <tr key={f.id} className="hover:bg-blue-50/20 transition-colors">
                <td className="px-5 py-4 font-bold text-sidebar">{f.label}</td>
                <td className="px-5 py-4">
                  <span className="text-[10px] font-black bg-blue-50 text-primary px-2.5 py-1 rounded-lg border border-blue-100">{f.type}</span>
                </td>
                <td className="px-5 py-4 text-sm text-muted font-bold">{f.module}</td>
                <td className="px-5 py-4">
                  <button onClick={() => toggleRequired(f.id)} className={`text-xl transition-colors ${f.required ? 'text-primary' : 'text-muted/40'}`}>
                    {f.required ? <ToggleRight size={28}/> : <ToggleLeft size={28}/>}
                  </button>
                </td>
                <td className="px-5 py-4">
                  <button onClick={() => { deleteField(f.id); addToast('Field deleted','info') }} className="p-1.5 text-muted hover:text-red-500 hover:bg-red-50 rounded-lg transition">
                    <Trash2 size={14}/>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <p className="text-center text-sm text-muted py-12 font-bold">No custom fields for this module yet.</p>
        )}
      </div>

      {/* Modal */}
      <Modal isOpen={modal} onClose={() => setModal(false)} title="Add Custom Field" size="sm">
        <div className="space-y-4">
          <Input label="Field Label" placeholder="e.g. Lead Score" value={form.label} onChange={e => setForm(f=>({...f, label:e.target.value}))} />
          <Select label="Field Type" value={form.type} onChange={e => setForm(f=>({...f, type:e.target.value}))} options={FIELD_TYPES.map(t=>({ value:t, label:t }))} />
          <Select label="Module" value={form.module} onChange={e => setForm(f=>({...f, module:e.target.value}))} options={MODULES_LIST.map(m=>({ value:m, label:m }))} />
          <div className="flex items-center gap-3 pt-1">
            <button onClick={() => setForm(f=>({...f, required:!f.required}))} className={`text-2xl ${form.required ? 'text-primary' : 'text-muted/40'}`}>
              {form.required ? <ToggleRight size={30}/> : <ToggleLeft size={30}/>}
            </button>
            <span className="text-sm font-bold text-sidebar">Required field</span>
          </div>
          <div className="flex gap-3 justify-end pt-2">
            <Button variant="ghost" onClick={() => setModal(false)} className="rounded-xl">Cancel</Button>
            <Button onClick={save} className="rounded-xl font-black uppercase tracking-wider text-xs px-6">Add Field</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
