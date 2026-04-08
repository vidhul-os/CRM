import mongoose, { Document, Schema } from 'mongoose'

export interface ICallLog extends Document {
  callerId: mongoose.Types.ObjectId | string
  receiverId: mongoose.Types.ObjectId | string
  startTime: Date
  endTime?: Date
  duration: number // in seconds
  status: 'completed' | 'missed' | 'rejected' | 'failed'
  leadId?: mongoose.Types.ObjectId
  contactId?: mongoose.Types.ObjectId
  recordingUrl?: string
  notes?: string
  adminId: mongoose.Types.ObjectId | string // Scoped by organization
}

const CallLogSchema = new Schema<ICallLog>(
  {
    callerId:     { type: Schema.Types.ObjectId, ref: 'User', required: true },
    receiverId:   { type: Schema.Types.ObjectId, ref: 'User', required: true },
    startTime:    { type: Date, default: Date.now },
    endTime:      { type: Date },
    duration:     { type: Number, default: 0 },
    status:       { type: String, enum: ['completed','missed','rejected','failed'], default: 'missed' },
    leadId:       { type: Schema.Types.ObjectId, ref: 'Lead',    default: null },
    contactId:    { type: Schema.Types.ObjectId, ref: 'Contact', default: null },
    recordingUrl: { type: String, default: null },
    notes:        { type: String, default: null },
    adminId:      { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
)

CallLogSchema.index({ adminId: 1, startTime: -1 })
CallLogSchema.index({ callerId: 1, receiverId: 1 })

export const CallLog = mongoose.model<ICallLog>('CallLog', CallLogSchema)
