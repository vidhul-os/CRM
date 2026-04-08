import { Search, Bell, HelpCircle } from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'
import Avatar from '@/components/ui/Avatar'

export default function Header() {
  const { user } = useAuthStore()

  return (
    <header className="h-14 border-b border-border bg-card flex items-center justify-between px-6 shrink-0">
      {/* Search area */}
      <div className="flex-1 max-w-md relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
        <input 
          type="text" 
          placeholder="Search records, notes, tasks..." 
          className="w-full pl-10 pr-4 py-1.5 bg-surface border-none rounded-lg text-sm focus:ring-1 focus:ring-primary outline-none"
        />
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4">
        <button className="p-2 text-muted hover:text-sidebar transition-colors">
          <HelpCircle size={20} />
        </button>
        <button className="p-2 text-muted hover:text-sidebar transition-colors relative">
          <Bell size={20} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>
        
        <div className="h-8 w-px bg-border mx-1"></div>
        
        <div className="flex items-center gap-3 pl-2">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium leading-none">{user?.name}</p>
            <p className="text-[10px] text-muted uppercase tracking-wider mt-1">{user?.role}</p>
          </div>
          <Avatar name={user?.name} size="md" />
        </div>
      </div>
    </header>
  )
}
