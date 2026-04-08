import { useSettingsStore } from '@/stores/settingsStore'
import { useToastStore }    from '@/stores/toastStore'
import Button from '@/components/ui/Button'
import { Check, Link2, Unlink } from 'lucide-react'

export default function IntegrationSettings() {
  const { integrations, toggleIntegration } = useSettingsStore()
  const { addToast } = useToastStore()

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-black text-sidebar">Integrations</h2>
        <p className="text-xs text-muted uppercase tracking-widest mt-1 font-bold">Connect external services to extend your CRM</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {integrations.map(int => (
          <div key={int.id} className={`p-6 rounded-2xl border shadow-sm transition ${int.connected ? 'bg-card border-primary/30 ring-1 ring-primary/10' : 'bg-card border-border'}`}>
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{int.icon}</span>
                <div>
                  <p className="font-extrabold text-sidebar text-sm leading-none">{int.name}</p>
                  {int.connected && (
                    <div className="flex items-center gap-1.5 mt-1.5">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"/>
                      <span className="text-[10px] font-black text-green-600 uppercase tracking-widest">Connected</span>
                    </div>
                  )}
                </div>
              </div>
              {int.connected && <Check size={16} className="text-green-500 mt-1 shrink-0"/>}
            </div>

            <p className="text-xs text-muted font-semibold mb-5 leading-relaxed">{int.desc}</p>

            <Button
              variant={int.connected ? 'danger' : 'primary'}
              size="sm"
              onClick={() => { toggleIntegration(int.id); addToast(int.connected ? `${int.name} disconnected` : `${int.name} connected!`, int.connected ? 'info' : 'success') }}
              className="rounded-xl font-black uppercase tracking-wider text-[10px] w-full gap-2"
            >
              {int.connected ? <><Unlink size={13}/> Disconnect</> : <><Link2 size={13}/> Connect</>}
            </Button>
          </div>
        ))}
      </div>
    </div>
  )
}
