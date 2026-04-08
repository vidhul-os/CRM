import dotenv from 'dotenv'
import path from 'path'
import fs from 'fs'
import http from 'http'
import { Server } from 'socket.io'
import app from './app'
import { connectDB } from './config/database'
import { CallLog } from './models/CallLogModel'
import { Message } from './models/Message'

// Load env vars
dotenv.config()

const PORT = process.env.PORT || 5000

// Initialize app wrapper
const start = async () => {
  try {
    // Initialize database
    await connectDB()

    // Ensure upload dirs exist
    const uploadDirs = ['uploads', 'uploads/avatars', 'uploads/documents']
    uploadDirs.forEach(dir => {
      const p = path.join(__dirname, '..', dir)
      if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true })
    })

    // Create HTTP Server
    const httpServer = http.createServer(app)

    // Initialize Socket.io
    const io = new Server(httpServer, {
      cors: {
        origin: ['http://localhost:5173', 'http://localhost:5174'],
        methods: ['GET', 'POST'],
        credentials: true
      }
    })

    const onlineUsers = new Map<string, string>() // userId -> socketId

    io.on('connection', (socket) => {
      console.log(`🔌 New connection: ${socket.id}`)

      socket.on('join', (userId: string) => {
        onlineUsers.set(userId, socket.id)
        socket.join(userId)
        io.emit('online-users', Array.from(onlineUsers.keys()))
        console.log(`👤 User ${userId} joined with socket ${socket.id}`)
      })

      // Signaling for WebRTC
      socket.on('call-user', async ({ to, from, signal, adminId }) => {
        const receiverSocketId = onlineUsers.get(to)

        // Create initial call log (status missed by default until completed/rejected)
        const log = await CallLog.create({
          callerId: from,
          receiverId: to,
          startTime: new Date(),
          status: 'missed',
          adminId
        })

        if (receiverSocketId) {
          io.to(receiverSocketId).emit('incoming-call', { from, signal, callId: log._id })
        }
      })

      socket.on('answer-call', ({ to, signal }) => {
        const callerSocketId = onlineUsers.get(to)
        if (callerSocketId) {
          io.to(callerSocketId).emit('call-accepted', signal)
        }
      })

      socket.on('ice-candidate', ({ to, candidate }) => {
        const targetSocketId = onlineUsers.get(to)
        if (targetSocketId) {
          io.to(targetSocketId).emit('ice-candidate', candidate)
        }
      })

      socket.on('end-call', async ({ callId, status, duration }) => {
        if (callId) {
          await CallLog.findByIdAndUpdate(callId, {
            endTime: new Date(),
            duration: duration || 0,
            status: status || 'completed'
          })
        }
      })

      socket.on('reject-call', async ({ callId, to }) => {
        if (callId) {
          await CallLog.findByIdAndUpdate(callId, {
            status: 'rejected',
            endTime: new Date()
          })
        }
        const callerSocketId = onlineUsers.get(to)
        if (callerSocketId) {
          io.to(callerSocketId).emit('call-rejected')
        }
      })

      socket.on('send-message', async ({ to, from, content, adminId }) => {
        const message = await Message.create({
          senderId: from,
          receiverId: to,
          content,
          adminId
        })
        const receiverSocketId = onlineUsers.get(to)
        const senderSocketId   = onlineUsers.get(from)

        if (receiverSocketId) {
          io.to(receiverSocketId).emit('receive-message', message)
        }
        if (senderSocketId) {
          io.to(senderSocketId).emit('receive-message', message)
        }
      })

      socket.on('disconnect', () => {
        let disconnectedUserId = ''
        for (const [userId, socketId] of onlineUsers.entries()) {
          if (socketId === socket.id) {
            disconnectedUserId = userId
            onlineUsers.delete(userId)
            break
          }
        }
        io.emit('online-users', Array.from(onlineUsers.keys()))
        console.log(`🔌 Disconnected: ${socket.id} (User: ${disconnectedUserId})`)
      })
    })

    // Start server
    httpServer.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`)
    })

    // Handle unhandled promise rejections
    process.on('unhandledRejection', (err: any) => {
      console.log(`Error: ${err.message}`)
      httpServer.close(() => process.exit(1))
    })
  } catch (error) {
    console.error('❌ Failed to start server:', error)
    process.exit(1)
  }
}

start()
