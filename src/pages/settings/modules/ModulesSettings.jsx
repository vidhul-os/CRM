import { useState } from 'react'
import { useSettingsStore } from '@/stores/settingsStore'
import { useToastStore }    from '@/stores/toastStore'
import Input   from '@/components/ui/Input'
import Button  from '@/components/ui/Button'
import { ToggleLeft, ToggleRight, Pencil, Check, X } from 'lucide-react'

export default function ModulesSettings() {
  const { modules, toggleModule, renameModule } = useSettingsStore()
  const { addToast } = useToastStore()
  const [editing, setEditing] = useState(null)
  const [editVal, setEditVal] = useState('')

  const startEdit = (m) => { setEditing(m.id); setEditVal(m.displayName) }
  const saveEdit  = (id) => { renameModule(id, editVal); setEditing(null); addToast('Module renamed', 'success') }
  const cancelEdit = () => setEditing(null)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-black text-sidebar">Modules</h2>
        <p className="text-xs text-muted uppercase tracking-widest mt-1 font-bold">Enable or disable CRM modules for your team</p>
      </div>

      <div className="space-y-3">
        {modules.map(m => (
          <div key={m.id} className="p-5 bg-card rounded-2xl border border-border shadow-sm flex items-center gap-4">
            {/* Toggle */}
            <button
              onClick={() => { toggleModule(m.id); addToast(`${m.displayName} ${m.enabled ? 'disabled' : 'enabled'}`, 'info') }}
              className={`shrink-0 text-2xl transition-transform hover:scale-110 ${m.enabled ? 'text-primary' : 'text-muted/40'}`}
            >
              {m.enabled ? <ToggleRight size={32} /> : <ToggleLeft size={32} />}
            </button>

            {/* Name / Edit */}
            {editing === m.id ? (
              <div className="flex items-center gap-3 flex-1">
                <input
                  className="flex-1 text-sm font-bold border border-primary rounded-lg px-3 py-1.5 outline-none ring-2 ring-primary/20"
                  value={editVal}
                  onChange={e => setEditVal(e.target.value)}
                  autoFocus
                />
                <button onClick={() => saveEdit(m.id)} className="p-1.5 text-green-500 hover:bg-green-50 rounded-lg transition"><Check size={16}/></button>
                <button onClick={cancelEdit} className="p-1.5 text-red-400 hover:bg-red-50 rounded-lg transition"><X size={16}/></button>
              </div>
            ) : (
              <div className="flex items-center gap-3 flex-1">
                <div>
                  <p className="font-extrabold text-sidebar text-sm leading-none">{m.displayName}</p>
                  {m.displayName !== m.name && <p className="text-[10px] text-muted uppercase tracking-widest mt-1 font-bold">Original: {m.name}</p>}
                </div>
                <span className={`ml-2 text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border ${m.enabled ? 'bg-green-50 text-green-600 border-green-200' : 'bg-red-50 text-red-500 border-red-200'}`}>
                  {m.enabled ? 'Active' : 'Disabled'}
                </span>
              </div>
            )}

            {editing !== m.id && (
              <button onClick={() => startEdit(m)} className="p-2 text-muted hover:text-primary hover:bg-blue-50 rounded-xl border border-transparent hover:border-border transition">
                <Pencil size={15} />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
