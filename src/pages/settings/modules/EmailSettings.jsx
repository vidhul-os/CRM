import { useState } from 'react'
import { useSettingsStore } from '@/stores/settingsStore'
import { useToastStore }    from '@/stores/toastStore'
import Input   from '@/components/ui/Input'
import Select  from '@/components/ui/Select'
import Button  from '@/components/ui/Button'
import { Server, Lock, Mail, Send } from 'lucide-react'

const ENC_OPTS = [{ value:'TLS', label:'TLS' }, { value:'SSL', label:'SSL' }, { value:'STARTTLS', label:'STARTTLS' }]

export default function EmailSettings() {
  const { email, setEmail } = useSettingsStore()
  const { addToast }        = useToastStore()
  const [form, setForm]     = useState(email)
  const [testing, setTesting] = useState(false)

  const upd  = (k, v) => setForm(f => ({ ...f, [k]: v }))
  const save = () => { setEmail(form); addToast('Email settings saved!', 'success') }
  const test = async () => {
    setTesting(true)
    await new Promise(r => setTimeout(r, 1500))
    setTesting(false)
    addToast('Test email sent to ' + form.email, 'success')
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-black text-sidebar">Email Settings</h2>
        <p className="text-xs text-muted uppercase tracking-widest mt-1 font-bold">Configure outbound SMTP for system notifications</p>
      </div>

      <div className="p-6 bg-card rounded-2xl border border-border shadow-sm space-y-5">
        <h3 className="text-sm font-extrabold text-sidebar uppercase tracking-wider">SMTP Configuration</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <Input label="SMTP Host" value={form.smtpHost} onChange={e => upd('smtpHost', e.target.value)} icon={Server} placeholder="smtp.gmail.com" />
          <Input label="Port" type="number" value={form.port} onChange={e => upd('port', e.target.value)} icon={Server} placeholder="587" />
          <Input label="Sender Email" type="email" value={form.email} onChange={e => upd('email', e.target.value)} icon={Mail} />
          <Input label="Password" type="password" value={form.password} onChange={e => upd('password', e.target.value)} icon={Lock} placeholder="••••••••" />
          <Select label="Encryption" value={form.encryption} onChange={e => upd('encryption', e.target.value)} options={ENC_OPTS} />
        </div>
      </div>

      {/* Status Banner */}
      <div className="p-4 rounded-2xl bg-green-50 border border-green-200 flex items-center gap-3">
        <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
        <p className="text-xs font-black text-green-700 uppercase tracking-widest">SMTP server reachable — last verified 12 minutes ago</p>
      </div>

      <div className="flex items-center gap-4 flex-wrap">
        <Button onClick={test} loading={testing} variant="secondary" className="rounded-xl gap-2 font-black uppercase tracking-wider text-[11px]">
          <Send size={14}/> Send Test Email
        </Button>
        <Button onClick={save} className="rounded-xl px-8 font-black uppercase tracking-wider text-xs shadow-lg shadow-primary/20">Save Configuration</Button>
      </div>
    </div>
  )
}
