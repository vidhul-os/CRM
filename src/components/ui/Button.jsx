import { Loader2 } from 'lucide-react'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export default function Button({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  loading = false, 
  disabled = false, 
  className, 
  ...props 
}) {
  const variants = {
    primary:   'bg-primary text-white hover:bg-primary-hover border-transparent shadow-sm',
    secondary: 'bg-card text-sidebar border-border hover:border-primary/50 shadow-sm',
    ghost:     'bg-transparent text-muted hover:bg-surface hover:text-sidebar border-transparent',
    danger:    'bg-red-500 text-white hover:bg-red-600 border-transparent shadow-sm',
  }

  const sizes = {
    sm: 'px-2.5 py-1.5 text-xs rounded-md gap-1.5',
    md: 'px-4 py-2 text-sm rounded-lg gap-2',
    lg: 'px-6 py-3 text-base rounded-xl gap-2.5',
  }

  return (
    <button
      disabled={disabled || loading}
      className={cn(
        'inline-flex items-center justify-center font-medium border transition duration-200 outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-50 disabled:cursor-not-allowed',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {loading && <Loader2 className="animate-spin" size={16} />}
      {!loading && children}
    </button>
  )
}
