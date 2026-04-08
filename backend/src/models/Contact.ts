import mongoose, { Document, Schema } from 'mongoose'

export interface IContact extends Document {
  name: string
  email: string
  phone?: string
  company: string
  role?: string
  status: 'Active' | 'Inactive'
  owner: mongoose.Types.ObjectId | string
  adminId: mongoose.Types.ObjectId | string
  avatar?: string
  notes?: string
  createdAt: Date
  updatedAt: Date
}

const ContactSchema = new Schema<IContact>(
  {
    name:    { type: String, required: true, trim: true },
    email:   { type: String, required: true, trim: true, lowercase: true },
    phone:   { type: String, default: null },
    company: { type: String, required: true },
    role:    { type: String, default: null },
    status:  { type: String, enum: ['Active','Inactive'], default: 'Active' },
    owner:   { type: Schema.Types.ObjectId, ref: 'User', required: true },
    adminId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    avatar:  { type: String, default: null },
    notes:   { type: String, default: null },
  },
  { timestamps: true }
)

ContactSchema.index({ name: 'text', email: 'text', company: 'text' })
ContactSchema.index({ owner: 1, adminId: 1 })
ContactSchema.index({ adminId: 1 })

export const Contact = mongoose.model<IContact>('Contact', ContactSchema)
