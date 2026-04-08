import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Header  from './Header'
import Toast   from '@/components/ui/Toast'
import CallOverlay from './CallOverlay'

export default function Layout() {
  return (
    <div className="flex h-screen overflow-hidden bg-surface relative">
      <Toast />
      <CallOverlay />
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header />
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
