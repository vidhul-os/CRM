import { Loader2 } from 'lucide-react'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export default function Spinner({ 
  size = 'md', 
  overlay = false, 
  className 
}) {
  const sizes = {
    sm: 'h-4 w-4 stroke-[2.5px]',
    md: 'h-8 w-8 stroke-[2px]',
    lg: 'h-12 w-12 stroke-[2px]',
  }

  const spinner = (
    <Loader2 
      className={cn(
        'animate-spin text-primary',
        sizes[size],
        className
      )} 
    />
  )

  if (overlay) {
    return (
      <div className="fixed inset-0 z-[200] flex items-center justify-center bg-white/50 backdrop-blur-[1px] animate-in fade-in duration-300">
        {spinner}
      </div>
    )
  }

  return spinner
}
