import { useState, useEffect, useRef } from 'react'
import { Phone, PhoneCall, Send, Search, MoreVertical, MessageSquare, ShieldCheck, User } from 'lucide-react'
import { format } from 'date-fns'
import api from '@/api/axios'
import { useCallStore }      from '@/stores/callStore'
import { useAuthStore }      from '@/stores/authStore'
import { useCommunityStore } from '@/stores/communityStore'
import clsx from 'clsx'

export default function CommunityPage() {
  const [members, setMembers]   = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [messageInput, setMessageInput] = useState('')
  const [chatLoading, setChatLoading] = useState(false)
  
  const { onlineUsers, initiateCall, socket } = useCallStore()
  const { user } = useAuthStore()
  const { 
    activeChat, 
    messages, 
    fetchMessages, 
    setActiveChat, 
    addMessage 
  } = useCommunityStore()

  const messagesEndRef = useRef(null)

  // Initial fetch of team members
  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const res = await api.get('/users/team-members')
        setMembers(res.data.data.filter(u => u._id !== user?._id))
      } catch (err) {
        console.error('Failed to fetch team members', err)
      }
    }
    fetchMembers()
  }, [user?._id])

  // Fetch messages when active chat changes
  useEffect(() => {
    if (activeChat) {
      fetchMessages(activeChat)
    }
  }, [activeChat, fetchMessages])

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Listen for real-time messages
  useEffect(() => {
    if (!socket) return
    socket.on('receive-message', (msg) => {
      addMessage(msg)
    })
    return () => socket.off('receive-message')
  }, [socket, addMessage])

  const handleSendMessage = (e) => {
    if (e) e.preventDefault()
    if (!messageInput.trim() || !activeChat) return

    const msgData = {
      to: activeChat,
      from: user._id,
      content: messageInput,
      adminId: user.adminId || user._id
    }

    socket.emit('send-message', msgData)
    // Manually add to our store for instant feedback
    addMessage({ 
      ...msgData, 
      senderId: user._id, 
      receiverId: activeChat, 
      timestamp: new Date() 
    })
    setMessageInput('')
  }

  const handleCall = (memberId) => {
    initiateCall(memberId, user.adminId || user._id)
  }

  const filteredMembers = members.filter(m => 
    m.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const selectedMember = members.find(m => m._id === activeChat)

  return (
    <div className="flex h-full bg-white overflow-hidden rounded-2xl shadow-sm border border-border">
      {/* Sidebar - User List */}
      <div className="w-[340px] border-r border-border flex flex-col bg-gray-50/30">
        <div className="p-4 border-b border-border bg-white">
          <h2 className="text-xl font-black mb-4 tracking-tight">Community</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={16} />
            <input 
              type="text" 
              placeholder="Search team members..." 
              className="w-full pl-10 pr-4 py-2 bg-gray-100 border-none rounded-xl text-sm focus:ring-2 focus:ring-primary/20 transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {filteredMembers.map(member => {
            const isOnline = onlineUsers.includes(member._id)
            const isActive = activeChat === member._id
            
            return (
              <button 
                key={member._id}
                onClick={() => setActiveChat(member._id)}
                className={clsx(
                  "w-full p-4 flex items-center gap-3 transition-all border-b border-border/50",
                  isActive ? "bg-white shadow-sm ring-1 ring-inset ring-primary/10" : "hover:bg-white"
                )}
              >
                <div className="relative shrink-0">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center font-bold text-primary text-xl shadow-inner">
                    {member.name[0]}
                  </div>
                  {isOnline && (
                    <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full" />
                  )}
                </div>
                
                <div className="flex-1 text-left min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-sm text-gray-900 truncate">{member.name}</h3>
                  </div>
                  <p className="text-[10px] text-muted font-bold uppercase tracking-widest truncate">{member.role}</p>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-white">
        {selectedMember ? (
          <>
            {/* Chat Header */}
            <header className="p-4 border-b border-border flex items-center justify-between bg-white/80 backdrop-blur-md sticky top-0 z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center font-bold text-gray-400">
                  {selectedMember.name[0]}
                </div>
                <div>
                  <h3 className="font-bold text-sm text-gray-900">{selectedMember.name}</h3>
                  <div className="flex items-center gap-1.5">
                    <div className={clsx("w-1.5 h-1.5 rounded-full", onlineUsers.includes(selectedMember._id) ? "bg-green-500" : "bg-gray-300")} />
                    <span className="text-[10px] text-muted font-bold uppercase tracking-wider">
                      {onlineUsers.includes(selectedMember._id) ? 'Online Now' : 'Offline'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button 
                  onClick={() => handleCall(selectedMember._id)}
                  className="p-2.5 bg-primary/10 text-primary rounded-xl hover:bg-primary/20 transition-all"
                  title="Voice Call"
                >
                  <PhoneCall size={18} />
                </button>
                <button className="p-2.5 text-muted hover:bg-gray-100 rounded-xl transition-all">
                  <MoreVertical size={18} />
                </button>
              </div>
            </header>

            {/* Messages Container */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-fixed opacity-90">
              {messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center opacity-40">
                  <MessageSquare size={48} className="mb-4 text-primary/20" />
                  <p className="text-sm font-medium">No messages yet. Start a conversation!</p>
                </div>
              ) : (
                messages.map((msg, i) => {
                  const isMine = msg.senderId === user._id
                  return (
                    <div key={i} className={clsx("flex", isMine ? "justify-end" : "justify-start")}>
                      <div className={clsx(
                        "max-w-[70%] px-4 py-2.5 rounded-2xl text-sm shadow-sm",
                        isMine ? "bg-primary text-white rounded-br-none" : "bg-gray-100 text-gray-800 rounded-bl-none"
                      )}>
                        <p>{msg.content}</p>
                        <span className={clsx(
                          "text-[9px] block mt-1.5 font-medium opacity-60",
                          isMine ? "text-white/80" : "text-gray-500"
                        )}>
                          {format(new Date(msg.timestamp || Date.now()), 'h:mm a')}
                        </span>
                      </div>
                    </div>
                  )
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input Area */}
            <form onSubmit={handleSendMessage} className="p-4 border-t border-border flex items-center gap-3 bg-white">
              <input 
                type="text" 
                placeholder="Type your message here..."
                className="flex-1 px-4 py-3 bg-gray-100 border-none rounded-2xl text-sm focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
              />
              <button 
                type="submit"
                className="p-3.5 bg-primary text-white rounded-2xl hover:bg-primary-hover shadow-lg shadow-primary/20 transition-all active:scale-95"
              >
                <Send size={20} />
              </button>
            </form>
          </>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center p-12">
            <div className="w-24 h-24 bg-primary/10 rounded-[2.5rem] flex items-center justify-center mb-8 rotate-12 shadow-inner">
               <MessageSquare size={48} className="text-primary -rotate-12" />
            </div>
            <h2 className="text-3xl font-black text-gray-900 mb-4 tracking-tight">Your Team Space</h2>
            <p className="text-muted text-lg max-w-sm font-medium">
              Select a team member to start chatting or initiate a secure internal call.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
