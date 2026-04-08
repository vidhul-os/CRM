import mongoose, { Document, Schema } from 'mongoose'

export interface IRole extends Document {
  name: string
  permissions: Record<string, {
    create: boolean
    read: boolean
    update: boolean
    delete: boolean
    export: boolean
  }>
  isSystem: boolean
  createdAt: Date
  updatedAt: Date
}

const MODULE_KEYS = ['leads', 'deals', 'contacts', 'companies', 'tasks', 'notes', 'users', 'settings', 'reports']

const RoleSchema = new Schema<IRole>(
  {
    name: { type: String, required: true, unique: true, trim: true },
    permissions: {
      type: Schema.Types.Mixed,
      default: () =>
        Object.fromEntries(
          MODULE_KEYS.map(m => [m, { create: false, read: false, update: false, delete: false, export: false }])
        ),
    },
    isSystem: { type: Boolean, default: false },
  },
  { timestamps: true }
)

export const Role = mongoose.model<IRole>('Role', RoleSchema)
