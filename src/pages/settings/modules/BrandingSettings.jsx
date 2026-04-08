import { useState, useEffect, useRef } from 'react'
import { useSettingsStore } from '@/stores/settingsStore'
import { useToastStore }    from '@/stores/toastStore'
import settingsApi from '@/api/settings.api'
import Button from '@/components/ui/Button'
import { Palette, Sun, Moon, Upload, Check, Loader } from 'lucide-react'

const PRESET_COLORS = [
  '#3b82f6','#6366f1','#8b5cf6','#ec4899','#ef4444','#f97316','#22c55e','#14b8a6','#0ea5e9','#f59e0b'
]

export default function BrandingSettings() {
  const { branding, setBranding, updateBrandingLocal, fetchSettings } = useSettingsStore()
  const { addToast } = useToastStore()
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef(null)

  const upd  = (k,v) => {
    updateBrandingLocal({ [k]:v })
  }

  const save = async () => {
    setLoading(true)
    const res = await setBranding(branding)
    if (res.success) addToast('Branding settings applied!', 'success')
    else addToast(res.error || 'Failed to save', 'error')
    setLoading(false)
  }

  const handleLogoUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    setUploading(true)
    const fd = new FormData()
    fd.append('logo', file)
    try {
      await settingsApi.uploadBrandingLogo(fd)
      await fetchSettings()
      addToast('Brand logo updated!', 'success')
    } catch {
      addToast('Logo upload failed', 'error')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-black text-sidebar tracking-tight">Branding & Appearance</h2>
        <p className="text-xs text-muted uppercase tracking-widest mt-1 font-bold">Customize your CRM's look and feel</p>
      </div>

      {/* Theme Switcher */}
      <div className="p-6 bg-card rounded-2xl border border-border shadow-sm space-y-5">
        <h3 className="text-sm font-extrabold text-sidebar uppercase tracking-wider">Interface Theme</h3>
        <div className="flex gap-4">
          {['light', 'dark'].map(t => (
            <button
              key={t}
              onClick={() => upd('theme', t)}
              className={`flex-1 flex flex-col items-center gap-3 p-5 rounded-2xl border-2 transition ${
                branding.theme === t ? 'border-primary bg-primary/20 ring-4 ring-primary/10' : 'border-border hover:border-primary/40'
              }`}
            >
              {t === 'light' ? <Sun size={32} className={branding.theme==='light'?'text-primary':'text-muted'}/> : <Moon size={32} className={branding.theme==='dark'?'text-primary':'text-muted'}/>}
              <div className="text-center">
                <p className="font-extrabold text-sidebar capitalize">{t} Mode</p>
                <p className="text-[10px] text-muted font-bold mt-1 uppercase tracking-wider">{t === 'light' ? 'Default workspace' : 'Reduced eye strain'}</p>
              </div>
              {branding.theme === t && <Check size={16} className="text-primary animate-bounce"/>}
            </button>
          ))}
        </div>
      </div>

      {/* Color Picker */}
      <div className="p-6 bg-card rounded-2xl border border-border shadow-sm space-y-5">
        <h3 className="text-sm font-extrabold text-sidebar uppercase tracking-wider flex items-center gap-2">
          <Palette size={16}/> Brand Accent Color
        </h3>
        <div className="flex items-center gap-4 flex-wrap">
          {PRESET_COLORS.map(c => (
            <button
              key={c}
              onClick={() => upd('primaryColor', c)}
              style={{ backgroundColor: c }}
              className={`w-10 h-10 rounded-2xl border-4 transition hover:scale-110 flex items-center justify-center ${branding.primaryColor === c ? 'border-sidebar scale-110 shadow-lg' : 'border-white shadow-md'}`}
            >
              {branding.primaryColor === c && <Check size={16} className="text-white"/>}
            </button>
          ))}
          <div className="flex items-center gap-3 ml-2">
            <input
              type="color"
              value={branding.primaryColor}
              onChange={e => upd('primaryColor', e.target.value)}
              className="w-10 h-10 rounded-2xl cursor-pointer border-2 border-border overflow-hidden p-0.5"
            />
            <div>
              <p className="text-[10px] font-black text-muted uppercase tracking-widest">Custom</p>
              <p className="text-xs font-black text-sidebar font-mono">{branding.primaryColor}</p>
            </div>
          </div>
        </div>

        {/* Preview */}
        <div className="p-6 rounded-2xl border border-border bg-surface/50 flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg transition-colors duration-500 bg-primary">
            {branding.logo ? <img src={branding.logo} className="w-full h-full object-cover rounded-xl" /> : 'C'}
          </div>
          <div>
            <p className="font-extrabold text-sidebar text-base">Branding Preview</p>
            <p className="text-[11px] text-muted font-bold mt-0.5 uppercase tracking-widest">Logo + primary accent color will be applied everywhere</p>
          </div>
          <button className="ml-auto px-6 py-2.5 rounded-xl text-white text-xs font-black uppercase tracking-wider shadow-lg shadow-primary/20 transition-all duration-500 bg-primary hover:bg-primary-hover active:scale-95">
            Sample Button
          </button>
        </div>
      </div>

      {/* Logo */}
      <div className="p-6 bg-card rounded-2xl border border-border shadow-sm space-y-4">
        <h3 className="text-sm font-extrabold text-sidebar uppercase tracking-wider">Workspace Logo</h3>
        <div className="flex items-center gap-6">
          <div className="h-20 w-20 rounded-2xl border-2 border-dashed border-primary/30 bg-primary/5 flex items-center justify-center overflow-hidden">
             {branding.logo 
               ? <img src={branding.logo} alt="Logo" className="w-full h-full object-cover" />
               : <span className="text-3xl font-black text-primary">C</span>
             }
          </div>
          <div className="space-y-2">
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
            <Button 
               variant="secondary" 
               className="rounded-xl gap-2 font-black uppercase tracking-wider text-xs px-5 shadow-sm"
               onClick={() => fileRef.current?.click()}
               loading={uploading}
            >
              <Upload size={14}/> {uploading ? 'Uploading...' : 'Change Logo'}
            </Button>
            <p className="text-[10px] text-muted font-bold uppercase tracking-wider">SVG, PNG, JPG (Max 2MB) — Uploads to Cloudinary</p>
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <Button 
          onClick={save} 
          loading={loading}
          className="rounded-xl px-10 h-12 font-black uppercase tracking-widest text-xs shadow-xl shadow-primary/30"
        >
          {loading ? 'Applying...' : 'Apply Branding Changes'}
        </Button>
      </div>
    </div>
  )
}

