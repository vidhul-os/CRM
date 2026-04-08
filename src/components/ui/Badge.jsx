import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

function cn(...inputs) {
  return twMerge(clsx(inputs))
}

const variants = {
  blue:   'bg-blue-100 text-blue-700',
  green:  'bg-green-100 text-green-700',
  red:    'bg-red-100 text-red-700',
  yellow: 'bg-yellow-100 text-yellow-700',
  purple: 'bg-purple-100 text-purple-700',
  gray:   'bg-gray-100 text-gray-700',
  cyan:   'bg-cyan-100 text-cyan-700',
  indigo: 'bg-indigo-100 text-indigo-700',
  orange: 'bg-orange-100 text-orange-700',
}

const sizes = {
  sm: 'px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider leading-none',
  md: 'px-2.5 py-1 text-xs font-medium leading-none',
}

export default function Badge({ 
  children, 
  variant = 'blue', 
  size = 'md', 
  className,
  ...props 
}) {
  return (
    <span 
      className={cn(
        'inline-flex items-center justify-center rounded-full leading-none transition duration-150',
        variants[variant] || variants.gray,
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  )
}
