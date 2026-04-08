import { Construction, ChevronLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import Button from '@/components/ui/Button'

export default function GenericPage({ title = 'Module' }) {
  const navigate = useNavigate()

  return (
    <div className="h-full flex flex-col items-center justify-center p-20 bg-surface/50">
       <div className="mb-10 p-12 bg-card rounded-[48px] shadow-2xl border-4 border-white ring-1 ring-sidebar/5 rotate-3 group hover:rotate-0 transition-transform duration-500">
         <Construction size={64} className="text-primary group-hover:scale-110 transition-transform duration-500" />
       </div>
       
       <div className="text-center mb-12">
         <h1 className="text-4xl font-black text-sidebar tracking-tight mb-4">{title}</h1>
         <p className="text-sm font-semibold text-muted uppercase tracking-[0.3em] max-w-md mx-auto leading-loose opacity-60">
           This system module is currently under strategic maintenance and will be available in the next release.
         </p>
       </div>

       <div className="flex items-center gap-4">
         <Button variant="secondary" className="rounded-2xl h-14 px-10 font-black tracking-tight" onClick={() => navigate(-1)} icon={ChevronLeft}>
           Execution Reverted
         </Button>
         <Button className="rounded-2xl h-14 px-10 font-black tracking-tight" onClick={() => navigate('/crm/leads')}>
           Return to Base Hub
         </Button>
       </div>
    </div>
  )
}
