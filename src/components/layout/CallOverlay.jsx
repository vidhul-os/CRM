import { Phone, PhoneOff, Mic, MicOff, Camera, CameraOff, X } from 'lucide-react'
import { useCallStore } from '@/stores/callStore'
import { useRef, useEffect } from 'react'
import Peer from 'simple-peer'

export default function CallOverlay() {
  const { 
    currentCall, 
    incomingCall, 
    localStream, 
    remoteStream, 
    peer,
    socket,
    onlineUsers,
    endCallLocal,
    setLocalStream,
    setRemoteStream,
    setPeer,
    setCurrentCall
  } = useCallStore()

  const localVideoRef = useRef()
  const remoteVideoRef = useRef()

  useEffect(() => {
    if (localStream && localVideoRef.current) {
      localVideoRef.current.srcObject = localStream
    }
  }, [localStream])

  useEffect(() => {
    if (remoteStream && remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = remoteStream
    }
  }, [remoteStream])

  const answerCall = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true })
    setLocalStream(stream)

    const p = new Peer({ initiator: false, trickle: false, stream })
    
    p.on('signal', (signal) => {
      socket.emit('answer-call', { to: incomingCall.from, signal })
    })

    p.on('stream', (remote) => {
      setRemoteStream(remote)
    })

    p.signal(incomingCall.signal)
    
    setPeer(p)
    setCurrentCall({ callId: incomingCall.callId, remoteUserId: incomingCall.from, status: 'connected' })
  }

  const rejectCall = () => {
    socket.emit('reject-call', { callId: incomingCall.callId, to: incomingCall.from })
    endCallLocal()
  }

  if (!currentCall && !incomingCall) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      {incomingCall && !currentCall && (
        <div className="bg-white rounded-2xl p-8 max-w-sm w-full text-center shadow-2xl scale-110">
          <div className="w-20 h-20 bg-blue-500 rounded-full mx-auto flex items-center justify-center mb-4 animate-pulse">
            <Phone className="text-white fill-white" size={32} />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-1">Incoming Call</h2>
          <p className="text-blue-500 font-medium mb-8">Internal CRM Call</p>
          <div className="flex justify-center gap-6">
            <button onClick={rejectCall} className="p-4 bg-red-500 hover:bg-red-600 rounded-full text-white transition-all transform hover:scale-105 shadow-lg shadow-red-200">
              <PhoneOff size={24} />
            </button>
            <button onClick={answerCall} className="p-4 bg-green-500 hover:bg-green-600 rounded-full text-white transition-all transform hover:scale-105 shadow-lg shadow-green-200">
              <Phone size={24} className="animate-bounce" />
            </button>
          </div>
        </div>
      )}

      {currentCall && (
        <div className="relative w-full max-w-4xl bg-gray-900 rounded-3xl overflow-hidden shadow-2xl flex flex-col aspect-video">
          <div className="flex-1 relative bg-black">
            {remoteStream ? (
              <video ref={remoteVideoRef} autoPlay playsInline className="w-full h-full object-cover" />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-24 h-24 bg-gray-800 rounded-full mx-auto flex items-center justify-center mb-4 border border-white/10 animate-pulse">
                    <Phone className="text-gray-400" size={32} />
                  </div>
                  <p className="text-white font-medium text-lg capitalize">{currentCall.status}...</p>
                </div>
              </div>
            )}

            {/* Local Mini Video */}
            <div className="absolute bottom-6 right-6 w-48 aspect-video bg-gray-800 rounded-xl overflow-hidden border-2 border-white/20 shadow-xl z-20">
              <video ref={localVideoRef} autoPlay playsInline muted className="w-full h-full object-cover mirror" />
            </div>
          </div>

          {/* Controls */}
          <div className="bg-gray-800/90 backdrop-blur p-6 flex justify-center items-center gap-8">
            <button className="p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors">
              <Mic size={22} />
            </button>
            <button className="p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors">
              <Camera size={22} />
            </button>
            <button onClick={endCallLocal} className="p-4 bg-red-500 hover:bg-red-600 rounded-full text-white shadow-xl shadow-red-500/20 transition-all transform hover:scale-105">
              <PhoneOff size={26} />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
