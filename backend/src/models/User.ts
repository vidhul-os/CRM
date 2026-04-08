import mongoose, { Document, Schema } from 'mongoose'
import bcrypt from 'bcryptjs'

export interface IUser extends Document {
  name: string
  email: string
  password?: string // Optional if created during checkout without password, though better to have it
  role: string
  avatar?: string
  phone?: string // Existing
  mobile?: string // New as per request
  businessName?: string
  businessType?: string
  address?: string
  city?: string
  pincode?: string
  status: 'Active' | 'Inactive'
  refreshToken?: string
  passwordResetOtp?: string
  passwordResetExpires?: Date
  otpCode?: string
  otpExpires?: Date
  loginAttempts: number
  lockUntil?: Date
  adminId?: mongoose.Types.ObjectId | string
  createdAt: Date
  updatedAt: Date
  comparePassword(candidate: string): Promise<boolean>
}

const UserSchema = new Schema<IUser>(
  {
    name:                 { type: String, required: true, trim: true },
    email:                { type: String, required: true, unique: true, lowercase: true, trim: true },
    password:             { type: String, required: false, minlength: 6 }, // Set to false to allow initial creation without pass
    role:                 { type: String, default: 'user' }, // Changed from 'Sales' to 'user' as per request
    avatar:               { type: String, default: null },
    phone:                { type: String, default: null },
    mobile:               { type: String, default: null },
    businessName:         { type: String, default: null },
    businessType:         { type: String, default: null },
    address:              { type: String, default: null },
    city:                 { type: String, default: null },
    pincode:              { type: String, default: null },
    status:               { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
    refreshToken:         { type: String, default: null },
    passwordResetOtp:     { type: String, default: null },
    passwordResetExpires: { type: Date,   default: null },
    otpCode:              { type: String, default: null },
    otpExpires:           { type: Date,   default: null },
    loginAttempts:        { type: Number, default: 0 },
    lockUntil:            { type: Date,   default: null },
    adminId:              { type: Schema.Types.ObjectId, ref: 'User', default: null }, // Self-reference for admins, or ref to admin for users
  },
  { timestamps: true }
)

// Hash password before save
UserSchema.pre('save', async function () {
  if (!this.isModified('password') || !this.password) return
  const salt = await bcrypt.genSalt(12)
  this.password = await bcrypt.hash(this.password, salt)
})


UserSchema.methods.comparePassword = async function (candidate: string): Promise<boolean> {
  return await bcrypt.compare(candidate, this.password)
}

// Remove sensitive fields from JSON output
UserSchema.set('toJSON', {
  transform: (_doc, ret: any) => {
    delete ret.password
    delete ret.refreshToken
    delete ret.passwordResetOtp
    delete ret.otpCode
    return ret
  },
})

UserSchema.index({ email: 1, adminId: 1 })

export const User = mongoose.model<IUser>('User', UserSchema)
