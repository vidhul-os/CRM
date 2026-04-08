import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

function cn(...inputs) {
  return twMerge(clsx(inputs))
}

const sizes = {
  sm: 'h-6 w-6 text-[10px]',
  md: 'h-8 w-8 text-xs',
  lg: 'h-10 w-10 text-sm font-semibold',
  xl: 'h-14 w-14 text-base font-bold',
}

export default function Avatar({ 
  name, 
  src, 
  size = 'md', 
  className 
}) {
  const getInitials = (n) => {
    if (!n) return '?'
    const parts = n.split(' ')
    if (parts.length > 1) return (parts[0][0] + parts[1][0]).toUpperCase()
    return n[0].toUpperCase()
  }

  return (
    <div 
      className={cn(
        'relative rounded-full flex items-center justify-center bg-primary/10 text-primary border border-primary/20 shrink-0 overflow-hidden',
        sizes[size],
        className
      )}
    >
      {src ? (
        <img src={src} alt={name} className="h-full w-full object-cover" />
      ) : (
        <span className="leading-none select-none">{getInitials(name)}</span>
      )}
    </div>
  )
}
