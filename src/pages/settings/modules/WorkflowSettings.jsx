import { useState } from 'react'
import { useSettingsStore } from '@/stores/settingsStore'
import { useToastStore }    from '@/stores/toastStore'
import Button from '@/components/ui/Button'
import Input  from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import Modal  from '@/components/ui/Modal'
import { Plus, ToggleLeft, ToggleRight, Trash2, Zap } from 'lucide-react'

const TRIGGERS  = ['Lead Created','Deal Status Changed','Task Due Date','Contact Added','Note Added']
const CONDITIONS= ['status = New','stage = Closed Won','dueDate < today','source = Website','score > 80']
const ACTIONS   = ['Assign to Admin','Send Email Notification','Notify Owner','Create Task','Update Status']
const EMPTY = { name:'', trigger: TRIGGERS[0], condition: CONDITIONS[0], action: ACTIONS[0] }

export default function WorkflowSettings() {
  const { workflows, addWorkflow, toggleWorkflow, deleteWorkflow } = useSettingsStore()
  const { addToast } = useToastStore()
  const [modal, setModal] = useState(false)
  const [form, setForm]   = useState(EMPTY)
  const upd = (k,v) => setForm(f=>({...f,[k]:v}))

  const save = () => {
    if (!form.name.trim()) { addToast('Workflow name is required','error'); return }
    addWorkflow(form); addToast('Workflow created!','success'); setModal(false); setForm(EMPTY)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-sidebar">Workflow Automation</h2>
          <p className="text-xs text-muted uppercase tracking-widest mt-1 font-bold">Rule-based automation for your CRM events</p>
        </div>
        <Button onClick={() => setModal(true)} className="rounded-xl font-black uppercase tracking-wider text-xs gap-2 shadow-lg shadow-primary/20">
          <Plus size={15}/> New Rule
        </Button>
      </div>

      {/* Workflow cards */}
      <div className="space-y-4">
        {workflows.map(w => (
          <div key={w.id} className={`p-6 rounded-2xl border shadow-sm transition ${w.enabled ? 'bg-card border-border' : 'bg-surface border-dashed border-border/60 opacity-60'}`}>
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-primary/10 rounded-xl border border-primary/20">
                  <Zap size={16} className="text-primary" />
                </div>
                <div>
                  <p className="font-extrabold text-sidebar text-sm">{w.name}</p>
                  <div className="flex items-center gap-2 mt-2 flex-wrap">
                    <span className="text-[10px] font-black px-2.5 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded-lg uppercase tracking-wider">ON: {w.trigger}</span>
                    <span className="text-[10px] text-muted font-bold">→</span>
                    <span className="text-[10px] font-black px-2.5 py-1 bg-orange-50 text-orange-700 border border-orange-200 rounded-lg uppercase tracking-wider">IF: {w.condition}</span>
                    <span className="text-[10px] text-muted font-bold">→</span>
                    <span className="text-[10px] font-black px-2.5 py-1 bg-green-50 text-green-700 border border-green-200 rounded-lg uppercase tracking-wider">DO: {w.action}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button onClick={() => { toggleWorkflow(w.id); addToast(`Workflow ${w.enabled? 'disabled':'enabled'}`, 'info') }} className={`text-2xl transition-colors ${w.enabled ? 'text-primary' : 'text-muted/40'}`}>
                  {w.enabled ? <ToggleRight size={30}/> : <ToggleLeft size={30}/>}
                </button>
                <button onClick={() => { deleteWorkflow(w.id); addToast('Workflow deleted','info') }} className="p-1.5 text-muted hover:text-red-500 hover:bg-red-50 rounded-lg transition">
                  <Trash2 size={14}/>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      <Modal isOpen={modal} onClose={() => setModal(false)} title="Create Automation Rule" size="md">
        <div className="space-y-4">
          <Input label="Rule Name" placeholder="e.g. Auto-assign hot leads" value={form.name} onChange={e => upd('name', e.target.value)} />
          <Select label="Trigger (When)" value={form.trigger} onChange={e => upd('trigger', e.target.value)} options={TRIGGERS.map(t=>({ value:t, label:t }))} />
          <Select label="Condition (If)" value={form.condition} onChange={e => upd('condition', e.target.value)} options={CONDITIONS.map(c=>({ value:c, label:c }))} />
          <Select label="Action (Then Do)" value={form.action} onChange={e => upd('action', e.target.value)} options={ACTIONS.map(a=>({ value:a, label:a }))} />
          <div className="flex gap-3 justify-end pt-2">
            <Button variant="ghost" onClick={() => setModal(false)} className="rounded-xl">Cancel</Button>
            <Button onClick={save} className="rounded-xl font-black uppercase tracking-wider text-xs px-6">Create Rule</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
