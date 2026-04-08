import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export default function Tabs({ 
  tabs = [], 
  activeTab, 
  onChange, 
  className 
}) {
  return (
    <div className={cn('flex items-center gap-1 border-b border-border', className)}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id
        const Icon = tab.icon
        
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={cn(
              'relative flex items-center gap-2 px-6 py-3 text-sm font-medium transition duration-200 outline-none',
              isActive 
                ? 'text-primary' 
                : 'text-muted hover:text-sidebar hover:bg-surface/50'
            )}
          >
            {Icon && <Icon size={16} />}
            {tab.label}
            {isActive && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary animate-in fade-in slide-in-from-bottom-[2px] duration-200" />
            )}
          </button>
        )
      })}
    </div>
  )
}
