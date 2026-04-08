import { create } from 'zustand'
import { io } from 'socket.io-client'

const SOCKET_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000'

export const useCallStore = create((set, get) => ({
  socket: null,
  userId: null,
  onlineUsers: [],
  currentCall: null, // { callId, remoteUserId, direction, status: 'ringing'|'connected'|'idle' }
  incomingCall: null, // { from, signal, callId }
  localStream: null,
  remoteStream: null,
  peer: null,

  initSocket: (userId) => {
    if (get().socket) return
    const socket = io(SOCKET_URL, { withCredentials: true })
    set({ userId })
    
    socket.on('connect', () => {
      socket.emit('join', userId)
    })

    socket.on('online-users', (users) => {
      set({ onlineUsers: users })
    })

    socket.on('incoming-call', ({ from, signal, callId }) => {
      set({ incomingCall: { from, signal, callId } })
    })

    socket.on('call-accepted', (signal) => {
      const { peer } = get()
      if (peer) {
        peer.signal(signal)
        set({ currentCall: { ...get().currentCall, status: 'connected' } })
      }
    })

    socket.on('call-rejected', () => {
      get().endCallLocal()
    })

    set({ socket })
  },

  initiateCall: async (to, adminId) => {
    try {
      const { socket, userId } = get()
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true })
      set({ localStream: stream })

      const p = new Peer({ initiator: true, trickle: false, stream })
      
      p.on('signal', (signal) => {
        socket.emit('call-user', { to, from: userId, signal, adminId })
      })

      p.on('stream', (remote) => {
        set({ remoteStream: remote })
      })

      set({ peer: p, currentCall: { remoteUserId: to, status: 'ringing' } })
    } catch (err) {
      console.error('Failed to get media devices', err)
    }
  },

  setCurrentCall: (call) => set({ currentCall: call }),
  setLocalStream: (stream) => set({ localStream: stream }),
  setRemoteStream: (stream) => set({ remoteStream: stream }),
  setPeer: (peer) => set({ peer }),

  endCallLocal: () => {
    const { peer, localStream, currentCall, socket } = get()
    if (peer) peer.destroy()
    if (localStream) localStream.getTracks().forEach(track => track.stop())
    
    if (currentCall && socket) {
      socket.emit('end-call', { 
        callId: currentCall.callId, 
        status: currentCall.status === 'connected' ? 'completed' : 'missed' 
      })
    }

    set({ 
      currentCall: null, 
      incomingCall: null, 
      localStream: null, 
      remoteStream: null, 
      peer: null 
    })
  }
}))
