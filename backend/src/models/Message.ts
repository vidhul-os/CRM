import mongoose, { Document, Schema } from 'mongoose'

export interface IMessage extends Document {
  senderId: mongoose.Types.ObjectId | string
  receiverId: mongoose.Types.ObjectId | string
  content: string
  timestamp: Date
  read: boolean
  adminId: mongoose.Types.ObjectId | string // Scoped by organization
}

const MessageSchema = new Schema<IMessage>(
  {
    senderId:   { type: Schema.Types.ObjectId, ref: 'User', required: true },
    receiverId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    content:    { type: String, required: true },
    timestamp:  { type: Date,   default: Date.now },
    read:       { type: Boolean, default: false },
    adminId:    { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
)

MessageSchema.index({ senderId: 1, receiverId: 1 })
MessageSchema.index({ adminId: 1, timestamp: -1 })

export const Message = mongoose.model<IMessage>('Message', MessageSchema)
