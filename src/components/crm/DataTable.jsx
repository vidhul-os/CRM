import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export default function DataTable({ 
  columns = [], 
  data = [], 
  onRowClick, 
  className 
}) {
  return (
    <div className={cn('bg-card rounded-xl border border-border shadow-sm overflow-hidden', className)}>
      <table className="w-full text-left text-sm border-collapse">
        <thead>
          <tr className="bg-surface/50 border-b border-border">
            {columns.map((col) => (
              <th 
                key={col.key} 
                className="px-6 py-4 text-xs font-semibold text-muted uppercase tracking-wider"
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border/50">
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-6 py-20 text-center text-muted italic">
                No records found.
              </td>
            </tr>
          ) : (
            data.map((row, idx) => (
              <tr 
                key={row.id || idx} 
                onClick={() => onRowClick?.(row)}
                className={cn(
                  'transition duration-150',
                  onRowClick ? 'hover:bg-blue-50/50 cursor-pointer' : 'hover:bg-surface/30'
                )}
              >
                {columns.map((col) => (
                  <td key={col.key} className="px-6 py-4 whitespace-nowrap text-sidebar font-medium">
                    {col.render ? col.render(row[col.key], row) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}
