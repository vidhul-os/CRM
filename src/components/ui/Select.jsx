import { forwardRef } from 'react'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { ChevronDown } from 'lucide-react'

function cn(...inputs) {
  return twMerge(clsx(inputs))
}

const Select = forwardRef(({ 
  label, 
  error, 
  options = [], 
  placeholder = 'Select option', 
  className, 
  ...props 
}, ref) => {
  return (
    <div className="w-full space-y-1.5 shrink-0">
      {label && <label className="block text-xs font-semibold text-sidebar tracking-wider uppercase">{label}</label>}
      <div className="relative group">
        <select
          ref={ref}
          className={cn(
            'w-full bg-card border border-border rounded-lg text-sm py-2 pl-3 pr-10 outline-none transition duration-200 focus:ring-2 focus:ring-primary/20 focus:border-primary appearance-none cursor-pointer placeholder:text-muted/60',
            error && 'border-red-500 focus:ring-red-100 focus:border-red-500',
            className
          )}
          {...props}
        >
          {placeholder && <option value="" disabled hidden>{placeholder}</option>}
          {options.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        <ChevronDown 
          size={16} 
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted group-hover:text-sidebar transition-colors pointer-events-none" 
        />
      </div>
      {error && <p className="text-[11px] font-medium text-red-500 mt-1">{error}</p>}
    </div>
  )
})

Select.displayName = 'Select'

export default Select
