import { useState } from 'react'
import { useSettingsStore } from '@/stores/settingsStore'
import { useToastStore }    from '@/stores/toastStore'
import Button  from '@/components/ui/Button'
import Select  from '@/components/ui/Select'
import { Shield, Key, Clock, Smartphone } from 'lucide-react'
import { ToggleLeft, ToggleRight } from 'lucide-react'

const TIMEOUT_OPTS = ['15 minutes','30 minutes','1 hour','4 hours','8 hours','Never']
const MIN_PASS     = [6,8,10,12,16].map(n => ({ value: String(n), label: `${n} characters minimum` }))

export default function SecuritySettings() {
  const { security, setSecurity } = useSettingsStore()
  const { addToast } = useToastStore()
  const [form, setForm] = useState(security)

  const upd  = (k,v) => setForm(f => ({ ...f, [k]:v }))
  const save = () => { setSecurity(form); addToast('Security settings saved!', 'success') }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-black text-sidebar">Security Settings</h2>
        <p className="text-xs text-muted uppercase tracking-widest mt-1 font-bold">Protect your workspace with enterprise security controls</p>
      </div>

      {/* Password Policy */}
      <div className="p-6 bg-card rounded-2xl border border-border shadow-sm space-y-5">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-blue-50 rounded-xl border border-blue-100"><Key size={18} className="text-primary"/></div>
          <h3 className="text-sm font-extrabold text-sidebar uppercase tracking-wider">Password Policy</h3>
        </div>
        <Select
          label="Minimum Password Length"
          value={String(form.minPasswordLength)}
          onChange={e => upd('minPasswordLength', Number(e.target.value))}
          options={MIN_PASS}
        />
        <div className="flex items-center gap-3 p-4 bg-yellow-50 rounded-2xl border border-yellow-200">
          <Shield size={16} className="text-yellow-600 shrink-0"/>
          <p className="text-xs font-bold text-yellow-700">At least 10 characters with mixed case + numbers recommended for production.</p>
        </div>
      </div>

      {/* 2FA */}
      <div className="p-6 bg-card rounded-2xl border border-border shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-purple-50 rounded-xl border border-purple-100"><Smartphone size={18} className="text-purple-500"/></div>
            <div>
              <p className="font-extrabold text-sidebar text-sm">Two-Factor Authentication</p>
              <p className="text-[11px] text-muted font-bold mt-1">Require OTP for all logins across the workspace</p>
            </div>
          </div>
          <button onClick={() => upd('twoFactorEnabled', !form.twoFactorEnabled)} className={`text-2xl transition-colors ${form.twoFactorEnabled ? 'text-primary' : 'text-muted/40'}`}>
            {form.twoFactorEnabled ? <ToggleRight size={36}/> : <ToggleLeft size={36}/>}
          </button>
        </div>
        {form.twoFactorEnabled && (
          <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-xl">
            <p className="text-[11px] font-black text-green-700 uppercase tracking-widest">2FA is active — all users must verify via app or SMS</p>
          </div>
        )}
      </div>

      {/* Session Timeout */}
      <div className="p-6 bg-card rounded-2xl border border-border shadow-sm space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-orange-50 rounded-xl border border-orange-100"><Clock size={18} className="text-orange-500"/></div>
          <h3 className="text-sm font-extrabold text-sidebar uppercase tracking-wider">Session Timeout</h3>
        </div>
        <Select
          label="Auto-logout after inactivity"
          value={form.sessionTimeout}
          onChange={e => upd('sessionTimeout', e.target.value)}
          options={TIMEOUT_OPTS.map(t => ({ value:t, label:t }))}
        />
      </div>

      <div className="flex justify-end">
        <Button onClick={save} className="rounded-xl px-8 font-black uppercase tracking-wider text-xs shadow-lg shadow-primary/20">Save Security Config</Button>
      </div>
    </div>
  )
}
