import mongoose, { Document, Schema } from 'mongoose'

export interface IDeal extends Document {
  name: string
  contact: string
  company: string
  value: number
  currency: string
  stage: 'Qualification' | 'Demo' | 'Proposal' | 'Negotiation' | 'Closed Won' | 'Closed Lost'
  closeDate?: string
  owner: mongoose.Types.ObjectId | string
  adminId: mongoose.Types.ObjectId | string
  probability?: number
  description?: string
  createdAt: Date
  updatedAt: Date
}

const DealSchema = new Schema<IDeal>(
  {
    name:        { type: String, required: true, trim: true },
    contact:     { type: String, required: true },
    company:     { type: String, required: true },
    value:       { type: Number, required: true, default: 0, min: 0 },
    currency:    { type: String, default: 'INR' },
    stage:       { type: String, enum: ['Qualification','Demo','Proposal','Negotiation','Closed Won','Closed Lost'], default: 'Qualification' },
    closeDate:   { type: String, default: null },
    owner:       { type: Schema.Types.ObjectId, ref: 'User', required: true },
    probability: { type: Number, default: 0, min: 0, max: 100 },
    description: { type: String, default: null },
    adminId:     { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
)

DealSchema.index({ name: 'text', company: 'text' })
DealSchema.index({ stage: 1, owner: 1, adminId: 1 })
DealSchema.index({ adminId: 1 })

export const Deal = mongoose.model<IDeal>('Deal', DealSchema)
