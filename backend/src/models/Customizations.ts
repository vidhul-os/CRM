import mongoose, { Document, Schema } from 'mongoose'

export interface IWorkflow extends Document {
  name: string
  trigger: string
  condition: string
  action: string
  enabled: boolean
}

const WorkflowSchema = new Schema<IWorkflow>(
  {
    name: { type: String, required: true },
    trigger: { type: String, required: true },
    condition: { type: String, required: true },
    action: { type: String, required: true },
    enabled: { type: Boolean, default: true },
  },
  { timestamps: true }
)

export const Workflow = mongoose.model<IWorkflow>('Workflow', WorkflowSchema)

export interface ICustomField extends Document {
  label: string
  type: 'Text' | 'Number' | 'Dropdown' | 'Date' | 'Email' | 'URL'
  module: 'Leads' | 'Contacts' | 'Deals' | 'Companies'
  required: boolean
}

const CustomFieldSchema = new Schema<ICustomField>(
  {
    label: { type: String, required: true },
    type: { type: String, enum: ['Text', 'Number', 'Dropdown', 'Date', 'Email', 'URL'], required: true },
    module: { type: String, enum: ['Leads', 'Contacts', 'Deals', 'Companies'], required: true },
    required: { type: Boolean, default: false },
  },
  { timestamps: true }
)

export const CustomField = mongoose.model<ICustomField>('CustomField', CustomFieldSchema)
