import { useState, useRef } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getAdminUsers, createAdminUser, updateAdminUser, deleteAdminUser, resetUserPassword, uploadUserAvatar, getRoles } from '@/api/settings.api'
import { useToastStore } from '@/stores/toastStore'
import Button from '@/components/ui/Button'
import Input  from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import Modal  from '@/components/ui/Modal'
import Avatar from '@/components/ui/Avatar'
import { Plus, Pencil, Trash2, Mail, User, Key, Upload, Loader } from 'lucide-react'

const EMPTY = { name:'', email:'', password:'', role:'Sales', phone:'', status:'Active' }
const STATUS_OPTS = [{ value:'Active', label:'Active' }, { value:'Inactive', label:'Inactive' }]

function StatusPill({ status }) {
  return (
    <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border ${
      status === 'Active' ? 'bg-green-50 text-green-600 border-green-200' : 'bg-red-50 text-red-500 border-red-200'
    }`}>
      {status}
    </span>
  )
}

export default function UsersSettings() {
  const { addToast } = useToastStore()
  const queryClient  = useQueryClient()
  const avatarRef    = useRef(null)

  const [modal,       setModal]    = useState(null)
  const [editing,     setEditing]  = useState(null)
  const [form,        setForm]     = useState(EMPTY)
  const [search,      setSearch]   = useState('')
  const [resetModal,  setResetModal] = useState(null) // userId
  const [newPassword, setNewPassword] = useState('')

  const { data: response, isLoading } = useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => {
      const { data } = await getAdminUsers()
      return data
    }
  })

  const { data: rolesData = [] } = useQuery({
    queryKey: ['roles'],
    queryFn: async () => {
      const { data } = await getRoles()
      return data
    }
  })

  const users    = response?.data ?? []
  const filtered = users.filter(u => 
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  )

  const roleOptions = rolesData.length > 0
    ? rolesData.map(r => ({ value: r.name, label: r.name }))
    : [{ value: 'Admin', label: 'Admin' }, { value: 'Manager', label: 'Manager' }, { value: 'Sales', label: 'Sales' }]

  const saveMutation = useMutation({
    mutationFn: ({ id, data }) => id ? updateAdminUser(id, data) : createAdminUser(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-users'])
      addToast(editing ? 'User updated!' : 'User created! They can now login.', 'success')
      setModal(null); setEditing(null); setForm(EMPTY)
    },
    onError: (err) => addToast(err?.response?.data?.message || 'Operation failed', 'error')
  })

  const deleteMutation = useMutation({
    mutationFn: (id) => deleteAdminUser(id),
    onSuccess: () => { queryClient.invalidateQueries(['admin-users']); addToast('User removed', 'info') },
    onError: (err) => addToast(err?.response?.data?.message || 'Delete failed', 'error')
  })

  const resetMutation = useMutation({
    mutationFn: ({ id, password }) => resetUserPassword(id, { newPassword: password }),
    onSuccess: () => { addToast('Password reset!', 'success'); setResetModal(null); setNewPassword('') },
    onError: (err) => addToast(err?.response?.data?.message || 'Reset failed', 'error')
  })

  const openAdd  = () => { setForm(EMPTY); setEditing(null); setModal('form') }
  const openEdit = (u) => { setForm({ name: u.name, email: u.email, role: u.role, phone: u.phone || '', status: u.status, password: '' }); setEditing(u._id || u.id); setModal('form') }
  const close    = () => { setModal(null); setEditing(null) }

  const save = () => {
    if (!form.name || !form.email) return addToast('Name and email required', 'error')
    if (!editing && !form.password) return addToast('Password required for new users', 'error')
    saveMutation.mutate({ id: editing, data: form })
  }

  const handleAvatarUpload = async (e, userId) => {
    const file = e.target.files[0]; if (!file) return
    const fd = new FormData(); fd.append('avatar', file)
    try {
      await uploadUserAvatar(userId, fd)
      queryClient.invalidateQueries(['admin-users'])
      addToast('Avatar updated!', 'success')
    } catch { addToast('Upload failed', 'error') }
  }

  if (isLoading) return <div className="h-40 flex items-center justify-center text-primary"><Loader className="animate-spin" size={24} /></div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-sidebar">User Management</h2>
          <p className="text-xs text-muted uppercase tracking-widest mt-1 font-bold">{users.length} members · All created users can login via the CRM</p>
        </div>
        <Button onClick={openAdd} className="rounded-xl font-black uppercase tracking-wider text-xs gap-2 shadow-lg shadow-primary/20">
          <Plus size={15} /> Add User
        </Button>
      </div>

      <Input placeholder="Search by name or email..." value={search} onChange={e => setSearch(e.target.value)} icon={User} />

      <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-surface/50 border-b border-border">
              {['Member','Role','Status','Joined','Actions'].map(h => (
                <th key={h} className="text-left px-5 py-3.5 text-[10px] font-black text-muted uppercase tracking-widest">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border/40">
            {filtered.map(u => (
              <tr key={u._id} className="hover:bg-blue-50/30 transition-colors">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="relative group">
                      <Avatar name={u.name} src={u.avatar} size="md" />
                      <label 
                        htmlFor={`avatar-${u._id}`} 
                        className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity"
                      >
                        <Upload size={12} className="text-white" />
                      </label>
                      <input id={`avatar-${u._id}`} type="file" accept="image/*" className="hidden" onChange={(e) => handleAvatarUpload(e, u._id)} />
                    </div>
                    <div>
                      <p className="font-bold text-sidebar text-sm leading-none">{u.name}</p>
                      <p className="text-[11px] text-muted mt-1 font-mono">{u.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4">
                  <span className="text-xs font-black text-sidebar bg-surface px-2.5 py-1 rounded-lg border border-border">{u.role}</span>
                </td>
                <td className="px-5 py-4"><StatusPill status={u.status} /></td>
                <td className="px-5 py-4 text-[11px] text-muted font-mono">{new Date(u.createdAt).toLocaleDateString()}</td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-1">
                    <button onClick={() => openEdit(u)} className="p-1.5 text-muted hover:text-primary hover:bg-blue-50 rounded-lg transition" title="Edit">
                      <Pencil size={13} />
                    </button>
                    <button onClick={() => { setResetModal(u._id); setNewPassword('') }} className="p-1.5 text-muted hover:text-orange-500 hover:bg-orange-50 rounded-lg transition" title="Reset Password">
                      <Key size={13} />
                    </button>
                    <button onClick={() => { if (confirm(`Delete ${u.name}?`)) deleteMutation.mutate(u._id) }} className="p-1.5 text-muted hover:text-red-500 hover:bg-red-50 rounded-lg transition" title="Delete">
                      <Trash2 size={13} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={5} className="text-center py-12 text-muted text-[11px] font-black uppercase tracking-widest opacity-40">No users found</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add/Edit User Modal */}
      <Modal isOpen={modal === 'form'} onClose={close} title={editing ? 'Edit User' : 'Create New User'} size="sm">
        <div className="space-y-4">
          <Input label="Full Name"       value={form.name}     onChange={e => setForm(f => ({...f, name: e.target.value}))}  icon={User} placeholder="Jane Doe" />
          <Input label="Email Address"   type="email" value={form.email} onChange={e => setForm(f => ({...f, email: e.target.value}))} icon={Mail} placeholder="jane@company.com" />
          {!editing && (
            <Input label="Password"      type="password" value={form.password} onChange={e => setForm(f => ({...f, password: e.target.value}))} icon={Key} placeholder="Min 6 chars" />
          )}
          <Input label="Phone (opt.)"   value={form.phone || ''} onChange={e => setForm(f => ({...f, phone: e.target.value}))} icon={User} placeholder="+91 98765 00000" />
          <Select label="Role"    value={form.role}   onChange={e => setForm(f => ({...f, role: e.target.value}))}   options={roleOptions} />
          <Select label="Status"  value={form.status} onChange={e => setForm(f => ({...f, status: e.target.value}))} options={STATUS_OPTS} />
          <div className="flex gap-3 pt-2 justify-end">
            <Button variant="ghost" onClick={close} className="rounded-xl">Cancel</Button>
            <Button onClick={save} loading={saveMutation.isPending} className="rounded-xl font-black uppercase tracking-wider text-xs px-6">
              {editing ? 'Save Changes' : 'Create User'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Reset Password Modal */}
      <Modal isOpen={!!resetModal} onClose={() => setResetModal(null)} title="Reset User Password" size="sm">
        <div className="space-y-4">
          <Input label="New Password" type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} icon={Key} placeholder="Min 6 characters" />
          <div className="flex gap-3 justify-end">
            <Button variant="ghost" onClick={() => setResetModal(null)} className="rounded-xl">Cancel</Button>
            <Button 
              onClick={() => resetMutation.mutate({ id: resetModal, password: newPassword })} 
              loading={resetMutation.isPending}
              className="rounded-xl font-black uppercase tracking-wider text-xs px-6"
            >
              Reset Password
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
