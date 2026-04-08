import { Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { User } from '../models/User'
import crypto from 'crypto'

const generateTokens = (id: string, role: string, adminId: string) => {
  const secret = process.env.JWT_SECRET || 'crm_jwt_secret';
  const refreshSecret = process.env.JWT_REFRESH_SECRET || 'crm_refresh_secret';
  
  const accessToken = jwt.sign(
    { id, role, adminId }, 
    secret, 
    { expiresIn: (process.env.JWT_ACCESS_EXPIRES as any) || '15m' }
  )
  const refreshToken = jwt.sign(
    { id, role, adminId }, 
    refreshSecret, 
    { expiresIn: (process.env.JWT_REFRESH_EXPIRES as any) || '7d' }
  )
  return { accessToken, refreshToken }
}

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password, role } = req.body
    
    if (await User.findOne({ email })) {
      return res.status(400).json({ message: 'User already exists' })
    }

    const user = await User.create({ name, email, password, role })
    res.status(201).json({ message: 'User created successfully', user })
  } catch (err) {
    res.status(500).json({ message: (err as Error).message })
  }
}

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body
    console.log(`[Login] Attempt for: ${email}`)

    const user = await User.findOne({ email })
    if (!user) {
      console.log(`[Login] User not found: ${email}`)
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    const isMatch = await user.comparePassword(password)
    console.log(`[Login] Password match: ${isMatch}`)

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    if (user.status === 'Inactive') {
      return res.status(403).json({ message: 'Account is inactive' })
    }

    const idStr = (user._id as any).toString();
    const adminIdStr = user.adminId ? (user.adminId as any).toString() : idStr; // Fallback to self if adminId missing for some reason

    const { accessToken, refreshToken } = generateTokens(idStr, user.role, adminIdStr);
    user.refreshToken = refreshToken;
    await user.save();

    // If it's a regular user, include their Admin's company info as per multi-tenant rules
    let adminDetails = null;
    if (user.role === 'user' && user.adminId) {
      adminDetails = await User.findById(user.adminId)
        .select('businessName businessType address city pincode name email');
    }

    res.json({ user, accessToken, refreshToken, adminDetails });
  } catch (err) {
    console.error(`[Login] Error:`, err)
    res.status(500).json({ message: (err as Error).message })
  }
}

export const sendOtp = async (req: Request, res: Response) => {
  try {
    const { email } = req.body
    if (!email) return res.status(400).json({ message: 'Email is required' })

    const user = await User.findOne({ email })
    if (!user) {
      // For security, don't reveal if user exists or not, but usually in CRM it's fine.
      // Let's just say a message regardless.
      return res.status(404).json({ message: 'User not found' })
    }

    const otpCode = crypto.randomInt(100000, 999999).toString()
    user.otpCode = otpCode
    user.otpExpires = new Date(Date.now() + 10 * 60 * 1000) // 10 mins
    await user.save()
    
    console.log(`[OTP] Sending ${otpCode} to ${email}`)
    // Nodemailer integration would go here
    
    res.json({ message: 'A 6-digit code has been sent to your email' })
  } catch (err) {
    res.status(500).json({ message: (err as Error).message })
  }
}

export const verifyOtp = async (req: Request, res: Response) => {
  try {
    const { email, otp } = req.body
    if (!email || !otp) return res.status(400).json({ message: 'Email and OTP are required' })

    const user = await User.findOne({ email })
    if (!user) return res.status(404).json({ message: 'User not found' })

    if (user.otpCode !== otp) {
      return res.status(400).json({ message: 'Invalid OTP code' })
    }

    if (user.otpExpires && user.otpExpires < new Date()) {
      return res.status(400).json({ message: 'OTP has expired' })
    }

    res.json({ success: true, message: 'OTP verified successfully' })
  } catch (err) {
    res.status(500).json({ message: (err as Error).message })
  }
}

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { email, otp, password } = req.body
    if (!email || !otp || !password) {
      return res.status(400).json({ message: 'Email, OTP, and new password are required' })
    }

    const user = await User.findOne({ email })
    if (!user) return res.status(404).json({ message: 'User not found' })

    // Verify OTP again to be safe
    if (user.otpCode !== otp || (user.otpExpires && user.otpExpires < new Date())) {
      return res.status(400).json({ message: 'Identity verification failed (Invalid or expired OTP)' })
    }

    // Update password
    user.password = password
    user.otpCode = undefined
    user.otpExpires = undefined
    await user.save()

    res.json({ success: true, message: 'Password has been reset successfully' })
  } catch (err) {
    res.status(500).json({ message: (err as Error).message })
  }
}

export const refreshToken = async (req: Request, res: Response) => {
  const { refreshToken } = req.body
  if (!refreshToken) return res.status(400).json({ message: 'Refresh token required' })

  try {
    const secret = process.env.JWT_REFRESH_SECRET || 'crm_refresh_secret'
    const decoded = jwt.verify(refreshToken, secret) as { id: string, role: string, adminId: string }
    const user = await User.findOne({ _id: decoded.id, refreshToken })

    if (!user) return res.status(401).json({ message: 'Invalid refresh token' })

    const idStr = (user._id as any).toString();
    const adminIdStr = user.adminId ? (user.adminId as any).toString() : idStr;

    const tokens = generateTokens(idStr, user.role, adminIdStr);
    user.refreshToken = tokens.refreshToken
    await user.save()

    res.json(tokens)
  } catch (err) {
    res.status(401).json({ message: 'Refresh token invalid' })
  }
}
