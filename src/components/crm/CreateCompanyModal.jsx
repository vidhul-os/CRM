import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQueryClient } from '@tanstack/react-query'
import { companySchema } from '@/utils/validators'
import { useCompaniesStore } from '@/stores/companiesStore'
import { useToastStore } from '@/stores/toastStore'
import Modal from '@/components/ui/Modal'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import Button from '@/components/ui/Button'
import { Building2, Globe, Phone, MapPin, BarChart3, Users } from 'lucide-react'

export default function CreateCompanyModal({ isOpen, onClose }) {
  const { createCompany, loading } = useCompaniesStore()
  const { addToast } = useToastStore()
  const queryClient = useQueryClient()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(companySchema),
    defaultValues: {
      industry: 'Technology',
      size: '11-50'
    }
  })

  useEffect(() => {
    if (isOpen) {
      reset({
        name: '',
        domain: '',
        industry: 'Technology',
        size: '11-50',
        country: '',
        city: '',
        phone: '',
        website: '',
        revenue: 0
      })
    }
  }, [isOpen, reset])

  const onSubmit = async (data) => {
    const result = await createCompany(data)

    if (result.success) {
      queryClient.invalidateQueries(['companies'])
      addToast('Company registered successfully!', 'success')
      reset()
      onClose()
    } else {
      addToast(result.error || 'Failed to create company', 'error')
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Register Corporate Entity" size="md">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Input 
          label="Company Name" 
          placeholder="Acme Global Industries" 
          icon={Building2}
          error={errors.name?.message}
          {...register('name')}
        />

        <div className="grid grid-cols-2 gap-4">
          <Input 
            label="Phone Number" 
            placeholder="+1 (555) 000-0000" 
            icon={Phone}
            error={errors.phone?.message}
            {...register('phone')}
          />
          <Input 
            label="Website / Domain" 
            placeholder="acme.com" 
            icon={Globe}
            error={errors.domain?.message}
            {...register('domain')}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Select 
            label="Industry" 
            options={[
              { value: 'Technology',    label: 'Technology' },
              { value: 'Finance',       label: 'Finance' },
              { value: 'Healthcare',    label: 'Healthcare' },
              { value: 'Retail',        label: 'Retail' },
              { value: 'Consulting',    label: 'Consulting' },
              { value: 'Manufacturing', label: 'Manufacturing' },
              { value: 'Other',         label: 'Other' }
            ]}
            icon={BarChart3}
            error={errors.industry?.message}
            {...register('industry')}
          />
          <Select 
            label="Company Size" 
            options={[
              { value: '1-10',      label: '1-10 members' },
              { value: '11-50',     label: '11-50 members' },
              { value: '51-200',    label: '51-200 members' },
              { value: '201-500',   label: '201-500 members' },
              { value: '501-1000',  label: '501-1000 members' },
              { value: '1000+',     label: '1000+ members' }
            ]}
            icon={Users}
            error={errors.size?.message}
            {...register('size')}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input 
            label="City" 
            placeholder="San Francisco" 
            icon={MapPin}
            error={errors.city?.message}
            {...register('city')}
          />
          <Input 
            label="Country" 
            placeholder="United States" 
            icon={MapPin}
            error={errors.country?.message}
            {...register('country')}
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
          <Button type="button" variant="ghost" className="rounded-xl h-12" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" loading={loading} className="rounded-xl h-12 px-8 font-black uppercase tracking-widest text-xs">
            Create Entity
          </Button>
        </div>
      </form>
    </Modal>
  )
}
