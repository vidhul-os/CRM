import mongoose, { Document, Schema } from 'mongoose'

export interface ILead extends Document {
  name: string
  email: string
  phone?: string
  company: string
  status: 'New' | 'Contacted' | 'Qualified' | 'Proposal' | 'Won' | 'Lost'
  source?: string
  owner: mongoose.Types.ObjectId | string
  score: number
  notes?: string
  tags?: string[]
  adminId: mongoose.Types.ObjectId | string // Required for tenant isolation
  createdAt: Date
  updatedAt: Date
}

const LeadSchema = new Schema<ILead>(
  {
    name:    { type: String, required: true, trim: true },
    email:   { type: String, required: true, trim: true, lowercase: true },
    phone:   { type: String, default: null },
    company: { type: String, required: true, trim: true },
    status:  { type: String, enum: ['New','Contacted','Qualified','Proposal','Won','Lost'], default: 'New' },
    source:  { type: String, enum: ['Website','LinkedIn','Referral','Cold Call','Conference','Email','Inbound','Trade Show', null], default: null },
    owner:   { type: Schema.Types.ObjectId, ref: 'User', required: true },
    score:   { type: Number, default: 50, min: 0, max: 100 },
    notes:   { type: String, default: null },
    tags:    [{ type: String }],
    adminId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
)

LeadSchema.index({ name: 'text', email: 'text', company: 'text' })
LeadSchema.index({ status: 1, owner: 1, adminId: 1, createdAt: -1 })
LeadSchema.index({ adminId: 1 })

export const Lead = mongoose.model<ILead>('Lead', LeadSchema)
