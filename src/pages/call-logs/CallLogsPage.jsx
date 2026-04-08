import { useState, useEffect } from 'react'
import { Phone, PhoneIncoming, PhoneOutgoing, Clock, User, Circle, ShieldCheck } from 'lucide-react'
import { format } from 'date-fns'
import api from '@/api/axios'
import { useCallStore } from '@/stores/callStore'
import { useAuthStore } from '@/stores/authStore'
import clsx from 'clsx'

export default function CallLogsPage() {
  const [logs, setLogs] = useState([])
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(true)
  const { onlineUsers, initiateCall } = useCallStore()
  const { user } = useAuthStore()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [logsRes, membersRes] = await Promise.all([
          api.get('/call-logs'),
          api.get('/admin/users')
        ])
        setLogs(logsRes.data.data)
        setMembers(membersRes.data.data.filter(u => u._id !== user?._id))
      } catch (err) {
        console.error('Failed to fetch call data', err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [user?._id])

  const handleCall = (memberId) => {
    initiateCall(memberId, user.adminId || user._id)
  }

  if (loading) return <div className="p-8 text-center text-muted">Loading Communications...</div>

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8">
      {/* Active Members Section */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <ShieldCheck className="text-primary" size={24} />
            Team Members
          </h2>
          <span className="text-xs bg-primary/10 text-primary px-3 py-1 rounded-full font-bold">
            {onlineUsers.length} Online
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {members.map(member => {
            const isOnline = onlineUsers.includes(member._id)
            return (
              <div key={member._id} className="bg-white rounded-2xl p-4 shadow-sm border border-border flex items-center justify-between group hover:border-primary/30 transition-all">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center font-bold text-primary">
                      {member.name[0]}
                    </div>
                    {isOnline && (
                      <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-gray-900">{member.name}</h3>
                    <p className="text-[10px] text-muted uppercase tracking-wider font-bold">{member.role}</p>
                  </div>
                </div>
                
                <button 
                  onClick={() => handleCall(member._id)}
                  disabled={!isOnline}
                  className={clsx(
                    "p-2.5 rounded-xl transition-all shadow-lg",
                    isOnline 
                      ? "bg-green-500 text-white hover:bg-green-600 shadow-green-200" 
                      : "bg-gray-100 text-gray-400 cursor-not-allowed"
                  )}
                >
                  <Phone size={18} />
                </button>
              </div>
            )
          })}
        </div>
      </section>

      {/* Recent History Section */}
      <section>
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Clock className="text-primary" size={24} />
          Recent Calls
        </h2>

        <div className="bg-white rounded-2xl shadow-sm border border-border overflow-hidden">
          {logs.length === 0 ? (
            <div className="p-12 text-center text-muted italic">
              No recent communication activity found.
            </div>
          ) : (
            <div className="divide-y divide-border">
              {logs.map(log => {
                const isOutgoing = log.callerId?._id === user?._id
                const otherParty = isOutgoing ? log.receiverId : log.callerId
                
                return (
                  <div key={log._id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className={clsx(
                        "p-2 rounded-full",
                        log.status === 'missed' ? "bg-red-50 text-red-500" : "bg-green-50 text-green-500"
                      )}>
                        {isOutgoing ? <PhoneOutgoing size={18} /> : <PhoneIncoming size={18} />}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-gray-900">{otherParty?.name || 'Unknown'}</span>
                          <span className={clsx(
                            "text-[10px] px-2 py-0.5 rounded-full font-bold uppercase",
                            log.status === 'completed' ? "bg-green-100 text-green-700" :
                            log.status === 'missed' ? "bg-red-100 text-red-700" : "bg-gray-100 text-gray-700"
                          )}>
                            {log.status}
                          </span>
                        </div>
                        <p className="text-xs text-muted">
                          {format(new Date(log.startTime), 'MMM d, h:mm a')} • {log.duration}s
                        </p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
