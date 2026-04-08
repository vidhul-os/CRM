import { forwardRef } from 'react'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

function cn(...inputs) {
  return twMerge(clsx(inputs))
}

const Input = forwardRef(({ 
  label, 
  error, 
  icon: Icon, 
  className, 
  ...props 
}, ref) => {
  return (
    <div className="w-full space-y-1.5">
      {label && <label className="block text-xs font-semibold text-sidebar tracking-wider uppercase">{label}</label>}
      <div className="relative">
        {Icon && <Icon className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={16} />}
        <input
          ref={ref}
          className={cn(
            'w-full bg-card border border-border rounded-lg text-sm py-2 px-3 outline-none transition duration-200 focus:ring-2 focus:ring-primary/20 focus:border-primary placeholder:text-muted/60',
            Icon && 'pl-10',
            error && 'border-red-500 focus:ring-red-100 focus:border-red-500',
            className
          )}
          {...props}
        />
      </div>
      {error && <p className="text-[11px] font-medium text-red-500 mt-1">{error}</p>}
    </div>
  )
})

Input.displayName = 'Input'

export default Input
