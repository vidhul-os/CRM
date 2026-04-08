import { useToastStore } from '@/stores/toastStore'
import Button from '@/components/ui/Button'
import { Upload, Download, AlertTriangle, RefreshCw, Database, ToggleLeft, ToggleRight } from 'lucide-react'
import { useState } from 'react'

export default function DataManagementSettings() {
  const { addToast } = useToastStore()
  const [deDup, setDeDup]   = useState(true)
  const [loading, setLoading] = useState('')

  const simulateAction = async (label, key) => {
    setLoading(key)
    await new Promise(r => setTimeout(r, 1400))
    setLoading('')
    addToast(`${label} completed successfully!`, 'success')
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-black text-sidebar">Data Management</h2>
        <p className="text-xs text-muted uppercase tracking-widest mt-1 font-bold">Import, export, and maintain your CRM data</p>
      </div>

      {/* Import / Export */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {/* Import */}
        <div className="p-6 bg-card rounded-2xl border border-border shadow-sm space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-50 rounded-xl border border-blue-100"><Upload size={18} className="text-primary"/></div>
            <h3 className="font-extrabold text-sidebar uppercase tracking-wider text-sm">Import Data</h3>
          </div>
          <p className="text-xs text-muted font-bold leading-relaxed">Upload CSV / XLSX files to import Leads, Contacts, or Deal records in bulk.</p>
          <div className="border-2 border-dashed border-border rounded-2xl p-8 text-center hover:border-primary/40 transition cursor-pointer group">
            <Upload size={24} className="text-muted group-hover:text-primary mx-auto mb-3 transition"/>
            <p className="text-xs font-bold text-muted">Drop file here or <span className="text-primary underline underline-offset-4">browse</span></p>
            <p className="text-[10px] text-muted/60 mt-1 uppercase tracking-wider">CSV, XLSX — max 10MB</p>
          </div>
          <Button loading={loading==='import'} onClick={() => simulateAction('Import','import')} className="rounded-xl w-full font-black uppercase tracking-wider text-xs">
            <Upload size={14}/> Run Import
          </Button>
        </div>

        {/* Export */}
        <div className="p-6 bg-card rounded-2xl border border-border shadow-sm space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-green-50 rounded-xl border border-green-100"><Download size={18} className="text-green-500"/></div>
            <h3 className="font-extrabold text-sidebar uppercase tracking-wider text-sm">Export Data</h3>
          </div>
          <p className="text-xs text-muted font-bold leading-relaxed">Download a full backup of all CRM records as a CSV archive.</p>
          <div className="space-y-2.5 pt-2">
            {['Leads', 'Contacts', 'Deals', 'All Modules'].map(m => (
              <Button key={m} variant="secondary" loading={loading===m} onClick={() => simulateAction(`${m} export`, m)} className="rounded-xl w-full font-black uppercase tracking-wider text-xs gap-2">
                <Download size={13}/> Export {m}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Deduplication */}
      <div className="p-6 bg-card rounded-2xl border border-border shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-orange-50 rounded-xl border border-orange-100"><RefreshCw size={18} className="text-orange-500"/></div>
            <div>
              <p className="font-extrabold text-sidebar text-sm">Duplicate Handling</p>
              <p className="text-[11px] text-muted font-bold mt-1">Automatically merge duplicate contacts & leads on import</p>
            </div>
          </div>
          <button onClick={() => setDeDup(d => !d)} className={`text-2xl transition-colors ${deDup ? 'text-primary' : 'text-muted/40'}`}>
            {deDup ? <ToggleRight size={36}/> : <ToggleLeft size={36}/>}
          </button>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="p-6 bg-card rounded-2xl border-2 border-red-200 shadow-sm space-y-4">
        <div className="flex items-center gap-3">
          <AlertTriangle size={20} className="text-red-500"/>
          <h3 className="font-extrabold text-red-600 uppercase tracking-wider text-sm">Danger Zone</h3>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <p className="font-bold text-sidebar text-sm">Purge All Records</p>
            <p className="text-xs text-muted font-semibold mt-1">Permanently delete all leads, deals, and contacts. Cannot be undone.</p>
          </div>
          <Button variant="danger" className="rounded-xl font-black uppercase tracking-wider text-xs gap-2" onClick={() => addToast('Purge disabled in demo mode','error')}>
            <Database size={13}/> Purge
          </Button>
        </div>
      </div>
    </div>
  )
}
