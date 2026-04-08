import { differenceInHours, parseISO, intervalToDuration } from 'date-fns'
import { Timer, AlertCircle } from 'lucide-react'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export default function SLABar({ 
  deadline, 
  createdAt, 
  className 
}) {
  const total = differenceInHours(parseISO(deadline), parseISO(createdAt))
  const remaining = differenceInHours(parseISO(deadline), new Date())
  const percent = Math.min(Math.max((remaining / total) * 100, 0), 100)
  
  const isCritical = percent < 20
  const isOverdue = percent === 0

  return (
    <div className={cn('space-y-2 relative', className)}>
      <div className="flex items-center justify-between text-[11px] font-bold tracking-widest uppercase">
        <div className="flex items-center gap-1.5 text-sidebar">
          <Timer size={14} className={isOverdue ? 'text-red-500 animate-pulse' : 'text-primary'} />
          <span>SLA Progress</span>
        </div>
        <span className={cn(
          isOverdue ? 'text-red-600' : isCritical ? 'text-orange-500' : 'text-primary'
        )}>
          {isOverdue ? 'Overdue!' : `${Math.round(percent)}% left`}
        </span>
      </div>
      
      <div className="h-2 w-full bg-surface border border-border rounded-full overflow-hidden shadow-inner">
        <div 
          className={cn(
            'h-full transition-all duration-700 ease-out border-r border-white/20 shadow-md',
            isOverdue ? 'bg-red-500' : isCritical ? 'bg-orange-500' : 'bg-primary'
          )}
          style={{ width: `${percent}%` }}
        />
      </div>

      <div className="flex items-center gap-1.5 pt-1">
        <AlertCircle size={12} className={isOverdue ? 'text-red-500' : 'text-muted'} />
        <p className="text-[10px] text-muted font-medium truncate uppercase tracking-widest leading-none">
          {isOverdue ? 'BREACHED ON ' + deadline : 'REMAINING TIME FROM ' + total + ' HOURS'}
        </p>
      </div>
    </div>
  )
}
