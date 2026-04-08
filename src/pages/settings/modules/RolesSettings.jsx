import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getRoles, createRole, updateRole, deleteRole } from '@/api/settings.api'
import { useToastStore } from '@/stores/toastStore'
import Button from '@/components/ui/Button'
import Modal  from '@/components/ui/Modal'
import Input  from '@/components/ui/Input'
import { Plus, Trash2, ShieldCheck, Loader } from 'lucide-react'

const MODULES   = ['leads','deals','contacts','companies','tasks','notes','users','settings','reports']
const PERMS     = ['create','read','update','delete','export']
const PERM_LABELS = { create:'Create', read:'Read', update:'Update', delete:'Delete', export:'Export' }

export default function RolesSettings() {
  const { addToast } = useToastStore()
  const queryClient  = useQueryClient()
  const [selected,   setSelected]   = useState(null)
  const [modal,      setModal]       = useState(false)
  const [newName,    setNewName]     = useState('')

  const { data: roles = [], isLoading } = useQuery({
    queryKey: ['roles'],
    queryFn: async () => {
      const { data } = await getRoles()
      return data
    },
    onSuccess: (data) => {
      if (!selected && data.length > 0) setSelected(data[0]._id)
    }
  })

  const current = roles.find(r => r._id === selected) ?? roles[0]
  const perms   = current?.permissions ?? {}

  // Compute effective selected id once roles are loaded
  const selectedId = selected ?? roles[0]?._id

  const toggleMutation = useMutation({
    mutationFn: ({ id, permissions }) => updateRole(id, { permissions }),
    onSuccess: () => queryClient.invalidateQueries(['roles']),
    onError: () => addToast('Failed to update permission', 'error')
  })

  const createMutation = useMutation({
    mutationFn: (data) => createRole(data),
    onSuccess: (res) => {
      queryClient.invalidateQueries(['roles'])
      addToast('Role created!', 'success')
      setModal(false); setNewName('')
      setSelected(res.data._id)
    },
    onError: (err) => addToast(err?.response?.data?.message || 'Failed', 'error')
  })

  const deleteMutation = useMutation({
    mutationFn: (id) => deleteRole(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['roles'])
      addToast('Role deleted', 'info')
      setSelected(null)
    },
    onError: (err) => addToast(err?.response?.data?.message || 'Cannot delete system role', 'error')
  })

  const toggle = (mod, perm) => {
    const cur  = current
    if (!cur) return
    const next = { 
      ...cur.permissions,
      [mod]: { ...(cur.permissions[mod] ?? {}), [perm]: !cur.permissions[mod]?.[perm] }
    }
    toggleMutation.mutate({ id: cur._id, permissions: next })
  }

  const isRowAll = (mod) => PERMS.every(p => perms[mod]?.[p])
  const isColAll = (perm) => MODULES.every(m => perms[m]?.[perm])

  const toggleRow = (mod) => {
    const all = isRowAll(mod)
    const next = { ...perms, [mod]: Object.fromEntries(PERMS.map(p => [p, !all])) }
    toggleMutation.mutate({ id: current._id, permissions: next })
  }

  const toggleCol = (perm) => {
    const all = isColAll(perm)
    const next = { ...perms }
    MODULES.forEach(m => { next[m] = { ...(next[m] ?? {}), [perm]: !all } })
    toggleMutation.mutate({ id: current._id, permissions: next })
  }

  if (isLoading) return <div className="h-40 flex items-center justify-center text-primary"><Loader className="animate-spin" size={24} /></div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-sidebar">Roles & Permissions</h2>
          <p className="text-xs text-muted uppercase tracking-widest mt-1 font-bold">Fine-grained access control per module — enforced by backend middleware</p>
        </div>
        <Button onClick={() => setModal(true)} className="rounded-xl font-black uppercase tracking-wider text-xs gap-2 shadow-lg shadow-primary/20">
          <Plus size={15}/> New Role
        </Button>
      </div>

      {/* Role selector */}
      <div className="flex flex-wrap gap-2">
        {roles.map(r => (
          <button key={r._id}
            onClick={() => setSelected(r._id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition border ${
              (selected ?? roles[0]?._id) === r._id
                ? 'bg-primary text-white border-primary shadow-md shadow-primary/30'
                : 'bg-card border-border text-muted hover:border-primary hover:text-sidebar'
            }`}
          >
            <ShieldCheck size={14} /> {r.name}
            {r.isSystem && <span className="text-[8px] opacity-60 ml-1">SYSTEM</span>}
          </button>
        ))}
      </div>

      {/* Permission matrix */}
      {current && (
        <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
          <div className="px-5 py-3.5 border-b border-border bg-surface/50 flex items-center justify-between">
            <p className="text-xs font-black text-muted uppercase tracking-widest">Permission Matrix — <span className="text-primary">{current.name}</span></p>
            {toggleMutation.isPending && <Loader size={14} className="animate-spin text-primary" />}
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left px-5 py-3 text-[10px] font-black text-muted uppercase tracking-widest w-36">Module</th>
                  {PERMS.map(p => (
                    <th key={p} className="px-4 py-3 text-center">
                      <div className="flex flex-col items-center gap-1.5">
                        <span className="text-[10px] font-black text-muted uppercase tracking-widest">{PERM_LABELS[p]}</span>
                        <button
                          onClick={() => toggleCol(p)}
                          className={`w-4 h-4 rounded border-2 flex items-center justify-center transition ${isColAll(p) ? 'bg-primary border-primary' : 'border-border hover:border-primary'}`}
                        >
                          {isColAll(p) && <svg className="w-2.5 h-2.5 text-white" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                        </button>
                      </div>
                    </th>
                  ))}
                  <th className="px-4 py-3 text-center text-[10px] font-black text-muted uppercase tracking-widest">All</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {MODULES.map(mod => (
                  <tr key={mod} className="hover:bg-blue-50/20 transition-colors">
                    <td className="px-5 py-4 font-extrabold text-sidebar text-sm capitalize">{mod}</td>
                    {PERMS.map(p => (
                      <td key={p} className="px-4 py-4 text-center">
                        <button
                          onClick={() => toggle(mod, p)}
                          className={`w-5 h-5 rounded border-2 flex items-center justify-center mx-auto transition ${perms[mod]?.[p] ? 'bg-primary border-primary' : 'border-border hover:border-primary'}`}
                        >
                          {perms[mod]?.[p] && <svg className="w-3 h-3 text-white" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                        </button>
                      </td>
                    ))}
                    <td className="px-4 py-4 text-center">
                      <button
                        onClick={() => toggleRow(mod)}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border transition ${isRowAll(mod) ? 'bg-green-500 text-white border-green-500' : 'border-border text-muted hover:border-primary'}`}
                      >
                        {isRowAll(mod) ? 'All ✓' : 'All'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Delete role */}
      {current && !current.isSystem && (
        <div className="flex justify-end">
          <Button 
            variant="danger" 
            className="rounded-xl font-black uppercase tracking-wider text-xs gap-2" 
            onClick={() => { if (confirm(`Delete role "${current.name}"?`)) deleteMutation.mutate(current._id) }}
            loading={deleteMutation.isPending}
          >
            <Trash2 size={14}/> Delete This Role
          </Button>
        </div>
      )}

      {/* New Role Modal */}
      <Modal isOpen={modal} onClose={() => setModal(false)} title="Create New Role" size="sm">
        <div className="space-y-4">
          <Input label="Role Name" placeholder="e.g. Field Tech, BDM" value={newName} onChange={e => setNewName(e.target.value)} />
          <p className="text-[11px] text-muted leading-relaxed">This role will start with no permissions. Configure the matrix after creation.</p>
          <div className="flex gap-3 justify-end pt-2">
            <Button variant="ghost" onClick={() => setModal(false)} className="rounded-xl">Cancel</Button>
            <Button 
              onClick={() => createMutation.mutate({ name: newName })} 
              loading={createMutation.isPending}
              className="rounded-xl font-black uppercase tracking-wider text-xs px-6"
            >
              Create Role
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
