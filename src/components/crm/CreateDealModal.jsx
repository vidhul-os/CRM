import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQueryClient } from '@tanstack/react-query'
import { dealSchema } from '@/utils/validators'
import { useDealsStore } from '@/stores/dealsStore'
import { useToastStore } from '@/stores/toastStore'
import Modal from '@/components/ui/Modal'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import Button from '@/components/ui/Button'
import { Briefcase, User, Building2, IndianRupee, Calendar, TrendingUp } from 'lucide-react'

export default function CreateDealModal({ isOpen, onClose, initialStage = 'Qualification' }) {
  const { createDeal, loading } = useDealsStore()
  const { addToast } = useToastStore()
  const queryClient = useQueryClient()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(dealSchema),
    defaultValues: {
      stage: 'Qualification',
      owner: 'Admin',
      value: 0
    }
  })

  // Sync initialStage when modal opens
  useEffect(() => {
    if (isOpen) {
      reset({
        name: '',
        contact: '',
        company: '',
        value: 0,
        closeDate: '',
        stage: initialStage,
        owner: 'Admin'
      })
    }
  }, [isOpen, initialStage, reset])

  const onSubmit = async (data) => {
    const result = await createDeal({
      ...data,
      currency: 'INR'
    })

    if (result.success) {
      queryClient.invalidateQueries(['deals'])
      addToast('Deal created successfully!', 'success')
      reset()
      onClose()
    } else {
      addToast(result.error || 'Failed to create deal', 'error')
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Opportunity Entry Terminal" size="md">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Input 
          label="Deal Name" 
          placeholder="ERP Implementation Bundle Phase 1" 
          icon={Briefcase}
          error={errors.name?.message}
          {...register('name')}
        />

        <div className="grid grid-cols-2 gap-4">
          <Input 
            label="Primary Contact" 
            placeholder="John Carter" 
            icon={User}
            error={errors.contact?.message}
            {...register('contact')}
          />
          <Input 
            label="Company" 
            placeholder="Arkham Global Inc" 
            icon={Building2}
            error={errors.company?.message}
            {...register('company')}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input 
            label="Deal Value" 
            type="number" 
            placeholder="0" 
            icon={IndianRupee}
            error={errors.value?.message}
            {...register('value')}
          />
          <Input 
            label="Expected Close Date" 
            type="date" 
            icon={Calendar}
            error={errors.closeDate?.message}
            {...register('closeDate')}
          />
        </div>

        <Select 
          label="Sale Stage" 
          options={[
            { value: 'Qualification', label: 'Qualification' },
            { value: 'Demo',          label: 'Demo' },
            { value: 'Proposal',      label: 'Proposal' },
            { value: 'Negotiation',   label: 'Negotiation' },
            { value: 'Closed Won',    label: 'Closed Won' },
            { value: 'Closed Lost',   label: 'Closed Lost' }
          ]}
          error={errors.stage?.message}
          {...register('stage')}
        />

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
          <Button type="button" variant="ghost" className="rounded-xl h-12" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" loading={loading} variant="primary" className="rounded-xl h-12 px-8 font-extrabold uppercase tracking-widest text-[11px] shadow-lg shadow-primary/20">
            Authorize Opportunity
          </Button>
        </div>
      </form>
    </Modal>
  )
}
