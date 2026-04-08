import mongoose, { Document, Schema } from 'mongoose'

export interface INote extends Document {
  content: string
  leadId?: mongoose.Types.ObjectId
  dealId?: mongoose.Types.ObjectId
  contactId?: mongoose.Types.ObjectId
  type: 'Note' | 'Email' | 'Call' | 'Meeting'
  owner: mongoose.Types.ObjectId | string
  pinned: boolean
  createdAt: Date
  updatedAt: Date
}

const NoteSchema = new Schema<INote>(
  {
    content:   { type: String, required: true },
    leadId:    { type: Schema.Types.ObjectId, ref: 'Lead',    default: null },
    dealId:    { type: Schema.Types.ObjectId, ref: 'Deal',    default: null },
    contactId: { type: Schema.Types.ObjectId, ref: 'Contact', default: null },
    type:      { type: String, enum: ['Note','Email','Call','Meeting'], default: 'Note' },
    owner:     { type: Schema.Types.ObjectId, ref: 'User', required: true },
    pinned:    { type: Boolean, default: false },
  },
  { timestamps: true }
)

NoteSchema.index({ leadId: 1, dealId: 1, contactId: 1, createdAt: -1 })

export const Note = mongoose.model<INote>('Note', NoteSchema)
