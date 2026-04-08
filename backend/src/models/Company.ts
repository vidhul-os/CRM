import mongoose, { Document, Schema } from 'mongoose'

export interface ICompany extends Document {
  name: string
  domain?: string
  industry?: string
  size?: string
  country?: string
  city?: string
  phone?: string
  website?: string
  logo?: string
  owner: mongoose.Types.ObjectId | string
  revenue?: number
  notes?: string
  createdAt: Date
  updatedAt: Date
}

const INDUSTRIES = ['Technology','Finance','Healthcare','Education','Retail','Manufacturing','Real Estate','Media','Consulting','Other']
const SIZES = ['1-10','11-50','51-200','201-500','501-1000','1000+']

const CompanySchema = new Schema<ICompany>(
  {
    name:     { type: String, required: true, unique: true, trim: true },
    domain:   { type: String, default: null },
    industry: { type: String, enum: [...INDUSTRIES, null], default: null },
    size:     { type: String, enum: [...SIZES, null], default: null },
    country:  { type: String, default: null },
    city:     { type: String, default: null },
    phone:    { type: String, default: null },
    website:  { type: String, default: null },
    logo:     { type: String, default: null },
    owner:    { type: Schema.Types.ObjectId, ref: 'User', required: true },
    revenue:  { type: Number, default: null },
    notes:    { type: String, default: null },
  },
  { timestamps: true }
)

CompanySchema.index({ name: 'text', domain: 'text' })

export const Company = mongoose.model<ICompany>('Company', CompanySchema)
