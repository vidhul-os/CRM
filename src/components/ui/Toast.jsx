import { X, CheckCircle2, AlertCircle, Info, AlertTriangle } from 'lucide-react'
import { useToastStore } from '@/stores/toastStore'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

function cn(...inputs) {
  return twMerge(clsx(inputs))
}

const icons = {
  success: <CheckCircle2 size={16} className="text-green-500" />,
  error:   <AlertCircle size={16}   className="text-red-500" />,
  warning: <AlertTriangle size={16} className="text-yellow-500" />,
  info:    <Info size={16}          className="text-blue-500" />,
}

const backgrounds = {
  success: 'bg-green-50/90 border-green-100',
  error:   'bg-red-50/90 border-red-100',
  warning: 'bg-yellow-50/90 border-yellow-100',
  info:    'bg-blue-50/90 border-blue-100',
}

export default function Toast() {
  const { toasts, removeToast } = useToastStore()

  if (toasts.length === 0) return null

  return (
    <div className="fixed top-6 right-6 z-[300] flex flex-col gap-3 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={cn(
            'flex items-center gap-3 p-4 rounded-xl border-2 backdrop-blur-md shadow-2xl pointer-events-auto transition duration-300 animate-in slide-in-from-right-10 fade-in',
            backgrounds[toast.type]
          )}
        >
          {icons[toast.type]}
          <p className="flex-1 text-sm font-semibold text-sidebar leading-tight">
            {toast.message}
          </p>
          <button
            onClick={() => removeToast(toast.id)}
            className="p-1 hover:bg-white/50 rounded-lg transition-colors"
          >
            <X size={14} className="text-muted" />
          </button>
        </div>
      ))}
    </div>
  )
}
