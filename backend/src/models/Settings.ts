import mongoose, { Document, Schema } from 'mongoose'

export interface ISettings extends Document {
  organization: {
    companyName: string
    logo: string | null
    address: string | null
    phone: string | null
    website: string | null
    timezone: string
    currency: string
    dateFormat: string
    industry: string | null
  }
  email: {
    smtpHost: string
    port: number
    email: string
    password?: string
    encryption: 'TLS' | 'SSL' | 'STARTTLS'
  }
  modules: Array<{
    id: string
    name: string
    displayName: string
    enabled: boolean
  }>
  security: {
    minPasswordLength: number
    twoFactorEnabled: boolean
    sessionTimeout: string
    maxLoginAttempts: number
  }
  branding: {
    companyName: string
    logo: string | null
    theme: 'light' | 'dark'
    primaryColor: string
  }
  integrations: Array<{
    id: string
    name: string
    desc: string
    icon: string
    connected: boolean
  }>
  adminId: mongoose.Types.ObjectId | string
  lastUpdated: Date
}

const SettingsSchema = new Schema<ISettings>(
  {
    organization: {
      companyName: { type: String, default: 'My Company' },
      logo: { type: String, default: null },
      address: { type: String, default: null },
      phone: { type: String, default: null },
      website: { type: String, default: null },
      timezone: { type: String, default: 'Asia/Kolkata' },
      currency: { type: String, default: 'INR' },
      dateFormat: { type: String, default: 'DD/MM/YYYY' },
      industry: { type: String, default: null },
    },
    email: {
      smtpHost: { type: String, default: 'smtp.gmail.com' },
      port: { type: Number, default: 587 },
      email: { type: String, default: 'no-reply@crm.com' },
      password: { type: String, default: null },
      encryption: { type: String, enum: ['TLS', 'SSL', 'STARTTLS'], default: 'TLS' },
    },
    modules: [{
      id: { type: String, required: true },
      name: { type: String, required: true },
      displayName: { type: String, required: true },
      enabled: { type: Boolean, default: true },
    }],
    security: {
      minPasswordLength: { type: Number, default: 8 },
      twoFactorEnabled: { type: Boolean, default: false },
      sessionTimeout: { type: String, default: '30 minutes' },
      maxLoginAttempts: { type: Number, default: 5 },
    },
    branding: {
      companyName: { type: String, default: 'CRM Platform' },
      logo: { type: String, default: null },
      theme: { type: String, enum: ['light', 'dark'], default: 'light' },
      primaryColor: { type: String, default: '#3b82f6' },
    },
    integrations: [{
      id: { type: String, required: true },
      name: { type: String, required: true },
      desc: { type: String },
      icon: { type: String },
      connected: { type: Boolean, default: false },
    }],
    adminId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    lastUpdated: { type: Date, default: Date.now },
  },
  { timestamps: true }
)

export const Settings = mongoose.model<ISettings>('Settings', SettingsSchema)

