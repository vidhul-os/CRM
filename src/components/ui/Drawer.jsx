import { useEffect } from 'react'
import { X } from 'lucide-react'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export default function Drawer({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  side = 'right' 
}) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'auto'
    }
  }, [isOpen])

  if (!isOpen) return null

  const positions = {
    left:  'left-0 border-r animate-in slide-in-from-left duration-300',
    right: 'right-0 border-l animate-in slide-in-from-right duration-300',
  }

  return (
    <div className="fixed inset-0 z-[100] flex overflow-hidden">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-sidebar/50 backdrop-blur-[2px] transition-opacity duration-300"
        onClick={onClose}
      />
      
      {/* Content */}
      <div className={cn(
        'relative w-full max-w-md h-full bg-card shadow-2xl border-border flex flex-col',
        positions[side]
      )}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-surface/50">
          <h3 className="text-lg font-bold text-sidebar">{title}</h3>
          <button 
            onClick={onClose}
            className="p-2 text-muted hover:text-sidebar hover:bg-card rounded-lg transition-colors border border-transparent hover:border-border"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
          {children}
        </div>
      </div>
    </div>
  )
}
