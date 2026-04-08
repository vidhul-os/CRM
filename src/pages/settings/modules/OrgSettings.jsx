import { useState, useRef } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getSettings, updateOrganization, uploadOrgLogo } from '@/api/settings.api'
import { useToastStore } from '@/stores/toastStore'
import Input   from '@/components/ui/Input'
import Select  from '@/components/ui/Select'
import Button  from '@/components/ui/Button'
import { Building2, Globe, DollarSign, Clock, Calendar, Upload, Phone, MapPin, Loader } from 'lucide-react'
import { TIMEZONES, CURRENCIES, DATE_FORMATS } from '@/utils/constants'

export default function OrgSettings() {
  const { addToast } = useToastStore()
  const queryClient  = useQueryClient()
  const fileRef      = useRef(null)
  const [uploading, setUploading] = useState(false)

  const { data: settings, isLoading } = useQuery({
    queryKey: ['settings'],
    queryFn: async () => {
      const { data } = await getSettings()
      return data
    }
  })

  const org = settings?.organization ?? {}
  const [form, setForm] = useState(null)
  const current = form ?? org

  const update = (k, v) => setForm(f => ({ ...(f ?? org), [k]: v }))

  const saveMutation = useMutation({
    mutationFn: (data) => updateOrganization(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['settings'])
      addToast('Organization settings saved!', 'success')
      setForm(null)
    },
    onError: (err) => addToast(err?.response?.data?.message || 'Save failed', 'error')
  })

  const handleLogoUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    setUploading(true)
    const fd = new FormData()
    fd.append('logo', file)
    try {
      const { data } = await uploadOrgLogo(fd)
      queryClient.invalidateQueries(['settings'])
      addToast('Logo uploaded!', 'success')
    } catch {
      addToast('Logo upload failed. Check Cloudinary credentials.', 'error')
    } finally {
      setUploading(false)
    }
  }

  if (isLoading) return (
    <div className="h-40 flex items-center justify-center text-primary">
      <Loader className="animate-spin" size={24} />
    </div>
  )

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-black text-sidebar tracking-tight">Organization</h2>
        <p className="text-xs text-muted uppercase tracking-widest mt-1 font-bold">Company identity & regional preferences</p>
      </div>

      {/* Logo Upload */}
      <div className="p-6 bg-card rounded-2xl border border-border shadow-sm space-y-4">
        <h3 className="text-sm font-extrabold text-sidebar uppercase tracking-wider">Brand Logo</h3>
        <div className="flex items-center gap-6">
          <div className="h-20 w-20 rounded-2xl bg-primary/10 border-2 border-dashed border-primary/30 flex items-center justify-center overflow-hidden">
            {org.logo 
              ? <img src={org.logo} alt="Logo" className="w-full h-full object-cover rounded-2xl" />
              : <span className="text-3xl font-black text-primary">{current.companyName?.[0] ?? 'C'}</span>
            }
          </div>
          <div className="space-y-2">
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
            <Button 
              variant="secondary" 
              className="rounded-xl gap-2"
              onClick={() => fileRef.current?.click()}
              loading={uploading}
            >
              <Upload size={14} /> {uploading ? 'Uploading...' : 'Upload Logo'}
            </Button>
            <p className="text-[10px] text-muted font-bold uppercase tracking-wider">PNG, JPG, WEBP — max 2MB · Uploads to Cloudinary</p>
          </div>
        </div>
      </div>

      {/* Company Details */}
      <div className="p-6 bg-card rounded-2xl border border-border shadow-sm space-y-5">
        <h3 className="text-sm font-extrabold text-sidebar uppercase tracking-wider">Company Details</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <Input label="Company Name"  value={current.companyName || ''} onChange={e => update('companyName', e.target.value)} icon={Building2} placeholder="Acme Corp" />
          <Input label="Phone"         value={current.phone || ''} onChange={e => update('phone', e.target.value)} icon={Phone} placeholder="+91 98765 00000" />
          <Input label="Website"       value={current.website || ''} onChange={e => update('website', e.target.value)} icon={Globe} placeholder="https://acme.com" />
          <Input label="Industry"      value={current.industry || ''} onChange={e => update('industry', e.target.value)} icon={Building2} placeholder="Technology" />
        </div>
        <Input label="Address" value={current.address || ''} onChange={e => update('address', e.target.value)} icon={MapPin} placeholder="123 Business Street, City, State, Country" />
      </div>

      {/* Regional */}
      <div className="p-6 bg-card rounded-2xl border border-border shadow-sm space-y-5">
        <h3 className="text-sm font-extrabold text-sidebar uppercase tracking-wider">Regional Preferences</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <Select label="Timezone"    value={current.timezone || 'Asia/Kolkata'} onChange={e => update('timezone', e.target.value)} options={TIMEZONES.map(t => ({ value: t, label: t }))} />
          <Select label="Currency"    value={current.currency || 'INR'} onChange={e => update('currency', e.target.value)} options={CURRENCIES.map(c => ({ value: c, label: c }))} />
          <Select label="Date Format" value={current.dateFormat || 'DD/MM/YYYY'} onChange={e => update('dateFormat', e.target.value)} options={DATE_FORMATS.map(d => ({ value: d, label: d }))} />
        </div>
      </div>

      <div className="flex justify-end">
        <Button 
          onClick={() => saveMutation.mutate(current)} 
          loading={saveMutation.isPending}
          className="rounded-xl px-8 font-black uppercase tracking-wider text-xs shadow-lg shadow-primary/20"
        >
          Save Changes
        </Button>
      </div>
    </div>
  )
}
