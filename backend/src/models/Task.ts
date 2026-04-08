import mongoose, { Document, Schema } from 'mongoose'

export interface ITask extends Document {
  title: string
  description?: string
  status: 'Open' | 'In Progress' | 'Completed' | 'Overdue'
  priority: 'Low' | 'Medium' | 'High' | 'Critical'
  dueDate?: string
  assignedTo: mongoose.Types.ObjectId | string
  relatedTo?: string
  type?: 'Lead' | 'Deal' | 'Contact' | 'General'
  owner: mongoose.Types.ObjectId | string
  adminId: mongoose.Types.ObjectId | string
  completedAt?: Date
  createdAt: Date
  updatedAt: Date
}

const TaskSchema = new Schema<ITask>(
  {
    title:       { type: String, required: true, trim: true },
    description: { type: String, default: null },
    status:      { type: String, enum: ['Open','In Progress','Completed','Overdue'], default: 'Open' },
    priority:    { type: String, enum: ['Low','Medium','High','Critical'], default: 'Medium' },
    dueDate:     { type: String, default: null },
    assignedTo:  { type: Schema.Types.ObjectId, ref: 'User', required: true },
    relatedTo:   { type: String, default: null },
    type:        { type: String, enum: ['Lead','Deal','Contact','General'], default: 'General' },
    owner:       { type: Schema.Types.ObjectId, ref: 'User', required: true },
    adminId:     { type: Schema.Types.ObjectId, ref: 'User', required: true },
    completedAt: { type: Date, default: null },
  },
  { timestamps: true }
)

TaskSchema.index({ status: 1, assignedTo: 1, dueDate: 1, adminId: 1 })
TaskSchema.index({ adminId: 1 })

export const Task = mongoose.model<ITask>('Task', TaskSchema)
