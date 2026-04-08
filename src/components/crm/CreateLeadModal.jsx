import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQueryClient } from '@tanstack/react-query'
import { leadSchema } from '@/utils/validators'
import { useLeadsStore } from '@/stores/leadsStore'
import { useToastStore } from '@/stores/toastStore'
import Modal from '@/components/ui/Modal'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import Button from '@/components/ui/Button'
import { User, Mail, Phone, Building2, Globe } from 'lucide-react'

export default function CreateLeadModal({ isOpen, onClose, initialStatus = 'New' }) {
  const { createLead, loading } = useLeadsStore()
  const { addToast } = useToastStore()
  const queryClient = useQueryClient()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(leadSchema),
    defaultValues: {
      status: 'New',
      owner: 'Admin',
      source: 'Website'
    }
  })

  // Sync initialStatus when modal opens
  useEffect(() => {
    if (isOpen) {
      reset({
        name: '',
        email: '',
        phone: '',
        company: '',
        status: initialStatus,
        owner: 'Admin',
        source: 'Website'
      })
    }
  }, [isOpen, initialStatus, reset])

  const onSubmit = async (data) => {
    const result = await createLead({
      ...data,
      created: new Date().toISOString().split('T')[0],
      score: 75
    })

    if (result.success) {
      queryClient.invalidateQueries(['leads'])
      addToast('Lead created successfully!', 'success')
      reset()
      onClose()
    } else {
      addToast(result.error || 'Failed to create lead', 'error')
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create New Lead" size="md">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <Input 
            label="Full Name" 
            placeholder="John Doe" 
            icon={User}
            error={errors.name?.message}
            {...register('name')}
          />
          <Input 
            label="Phone Number" 
            placeholder="+91 98765 00000" 
            icon={Phone}
            error={errors.phone?.message}
            {...register('phone')}
          />
        </div>

        <Input 
          label="Email Address" 
          placeholder="john@company.com" 
          icon={Mail}
          error={errors.email?.message}
          {...register('email')}
        />

        <Input 
          label="Company Name" 
          placeholder="Tech Corp Pvt Ltd" 
          icon={Building2}
          error={errors.company?.message}
          {...register('company')}
        />

        <div className="grid grid-cols-2 gap-4">
          <Select 
            label="Status" 
            options={[
              { value: 'New', label: 'New' },
              { value: 'Contacted', label: 'Contacted' },
              { value: 'Qualified', label: 'Qualified' },
              { value: 'Proposal', label: 'Proposal' }
            ]}
            error={errors.status?.message}
            {...register('status')}
          />
          <Select 
            label="Lead Source" 
            options={[
              { value: 'Website', label: 'Website' },
              { value: 'LinkedIn', label: 'LinkedIn' },
              { value: 'Referral', label: 'Referral' },
              { value: 'Cold Call', label: 'Cold Call' }
            ]}
            error={errors.source?.message}
            {...register('source')}
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
          <Button type="button" variant="ghost" className="rounded-xl h-12" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" loading={loading} className="rounded-xl h-12 px-8 font-black uppercase tracking-widest text-xs">
            Generate Lead
          </Button>
        </div>
      </form>
    </Modal>
  )
}
