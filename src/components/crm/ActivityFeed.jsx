import { formatDistanceToNow, parseISO } from 'date-fns'
import { MessageSquare, Mail, Phone, RefreshCw, User, MoreHorizontal } from 'lucide-react'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

function cn(...inputs) {
  return twMerge(clsx(inputs))
}

const icons = {
  note:   <MessageSquare size={14} className="text-blue-500" />,
  email:  <Mail size={14}          className="text-purple-500" />,
  call:   <Phone size={14}         className="text-green-500" />,
  status: <RefreshCw size={14}     className="text-orange-500" />,
}

export default function ActivityFeed({ 
  activities = [], 
  className 
}) {
  return (
    <div className={cn('space-y-6 relative ml-4', className)}>
      {/* Vertical Line */}
      <div className="absolute left-[-17px] top-2 bottom-6 w-0.5 bg-border/40" />
      
      {activities.length === 0 ? (
        <div className="p-8 text-center bg-surface border border-dashed border-border rounded-xl text-muted text-sm italic">
          No activity recorded yet.
        </div>
      ) : (
        activities.map((activity, idx) => (
          <div key={activity.id || idx} className="relative transition duration-200 group">
            {/* Timeline Dot */}
            <div className={cn(
              'absolute left-[-23px] top-1.5 h-3.5 w-3.5 rounded-full border-2 border-white ring-2 ring-border/20 group-hover:ring-primary/20 transition duration-300 z-10',
              activity.type === 'status' ? 'bg-orange-500' : 'bg-primary'
            )} />
            
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-surface border border-border rounded-md shadow-sm">
                    {icons[activity.type] || <User size={14} className="text-muted" />}
                  </div>
                  <p className="text-sm font-bold text-sidebar line-clamp-1">{activity.text}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-bold text-muted uppercase tracking-widest whitespace-nowrap">
                    {formatDistanceToNow(parseISO(activity.time), { addSuffix: true })}
                  </span>
                  <button className="p-1 text-muted hover:text-sidebar transition-colors">
                    <MoreHorizontal size={14} />
                  </button>
                </div>
              </div>
              
              <div className="pl-9 flex items-center gap-2">
                <div className="h-4 w-4 rounded-full bg-primary/10 flex items-center justify-center text-[8px] font-bold text-primary">
                  {activity.author?.[0] || 'S'}
                </div>
                <p className="text-[11px] font-semibold text-muted tracking-tight">{activity.author}</p>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  )
}
