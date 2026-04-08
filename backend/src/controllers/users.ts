import { Response } from 'express'
import { User } from '../models/User'
import { AuthRequest } from '../middlewares/auth'
import bcrypt from 'bcryptjs'

export const getProfile = async (req: AuthRequest, res: Response) => {
  res.json(req.user)
}

export const updateProfile = async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findByIdAndUpdate(req.user?._id, req.body, { new: true })
    if (!user) return res.status(404).json({ message: 'User not found' })
    res.json(user)
  } catch (err) {
    res.status(500).json({ message: (err as Error).message })
  }
}

export const changePassword = async (req: AuthRequest, res: Response) => {
  try {
    const { oldPassword, newPassword } = req.body
    const user = await User.findById(req.user?._id)

    if (!user || !(await user.comparePassword(oldPassword))) {
      return res.status(401).json({ message: 'Invalid current password' })
    }

    user.password = newPassword
    await user.save()

    res.json({ message: 'Password changed successfully' })
  } catch (err) {
    res.status(500).json({ message: (err as Error).message })
  }
}

export const updateAvatar = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' })
    // Cloudinary returns the URL as file.path via multer-storage-cloudinary
    const avatar = (req.file as any).path
    req.user!.avatar = avatar
    await req.user!.save()
    res.json({ message: 'Avatar updated', avatar })
  } catch (err) {
    res.status(500).json({ message: (err as Error).message })
  }
}

export const getTeamMembers = async (req: AuthRequest, res: Response) => {
  try {
    const orgId = req.user?.adminId || req.user?._id
    
    // Find organization admin + all users under that admin
    const users = await User.find({
      $or: [
        { _id: orgId },
        { adminId: orgId }
      ]
    })
    .select('name role email avatar status')
    .sort('name')

    res.json({ data: users })
  } catch (err) {
    res.status(500).json({ message: (err as Error).message })
  }
}
