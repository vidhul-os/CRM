import { Request, Response } from 'express'
import { Role } from '../models/Role'
import { User } from '../models/User'
import { AuthRequest } from '../middlewares/auth'
import bcrypt from 'bcryptjs'

const MODULES = ['leads', 'deals', 'contacts', 'companies', 'tasks', 'notes', 'users', 'settings', 'reports']
const PERMS = ['create', 'read', 'update', 'delete', 'export']

// ── ROLES ──────────────────────────────────────────────────────────────────────

export const getRoles = async (_req: Request, res: Response) => {
  try {
    res.json(await Role.find().sort('name'))
  } catch (err) {
    res.status(500).json({ message: (err as Error).message })
  }
}

export const createRole = async (req: Request, res: Response) => {
  try {
    const { name, permissions } = req.body
    const defaultPerms = Object.fromEntries(
      MODULES.map(m => [m, Object.fromEntries(PERMS.map(p => [p, false]))])
    )
    const role = await Role.create({ name, permissions: { ...defaultPerms, ...(permissions || {}) } })
    res.status(201).json(role)
  } catch (err) {
    res.status(500).json({ message: (err as Error).message })
  }
}

export const updateRole = async (req: Request, res: Response) => {
  try {
    const role = await Role.findByIdAndUpdate(req.params.id, req.body, { new: true })
    if (!role) return res.status(404).json({ message: 'Role not found' })
    res.json(role)
  } catch (err) {
    res.status(500).json({ message: (err as Error).message })
  }
}

export const deleteRole = async (req: Request, res: Response) => {
  try {
    const role = await Role.findById(req.params.id)
    if (!role) return res.status(404).json({ message: 'Role not found' })
    if (role.isSystem) return res.status(400).json({ message: 'Cannot delete a system role' })
    await role.deleteOne()
    res.json({ message: 'Role deleted' })
  } catch (err) {
    res.status(500).json({ message: (err as Error).message })
  }
}

// ── ADMIN USERS ────────────────────────────────────────────────────────────────

export const getUsers = async (req: AuthRequest, res: Response) => {
  try {
    const users = await User.find({ adminId: req.user?.adminId })
      .select('-password -refreshToken -passwordResetOtp -otpCode')
      .sort('-createdAt')
    res.json({ data: users })
  } catch (err) {
    res.status(500).json({ message: (err as Error).message })
  }
}

export const createUser = async (req: AuthRequest, res: Response) => {
  try {
    const { name, email, password, role, phone, status } = req.body
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email and password are required' })
    }
    const existing = await User.findOne({ email })
    if (existing) return res.status(400).json({ message: 'Email already registered' })

    const user = await User.create({
      name, email, password, phone,
      role: role || 'user',
      status: status || 'Active',
      adminId: req.user?.adminId || req.user?._id // Correctly propagate organization ID
    })
    res.status(201).json(user)
  } catch (err) {
    res.status(500).json({ message: (err as Error).message })
  }
}

export const updateUser = async (req: AuthRequest, res: Response) => {
  try {
    const { password, ...fields } = req.body
    // Only allow editing users within the same tenant
    const user = await User.findOneAndUpdate(
      { _id: req.params.id, adminId: req.user?.adminId },
      fields,
      { new: true }
    ).select('-password -refreshToken')

    if (!user) return res.status(404).json({ message: 'User not found or access denied' })
    res.json(user)
  } catch (err) {
    res.status(500).json({ message: (err as Error).message })
  }
}

export const deleteUser = async (req: AuthRequest, res: Response) => {
  try {
    if (req.params.id === String(req.user?._id)) {
      return res.status(400).json({ message: 'Cannot delete your own account' })
    }
    const user = await User.findOneAndDelete({ _id: req.params.id, adminId: req.user?.adminId })
    if (!user) return res.status(404).json({ message: 'User not found or access denied' })
    res.json({ message: 'User deleted' })
  } catch (err) {
    res.status(500).json({ message: (err as Error).message })
  }
}

export const updateUserAvatar = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' })
    const avatar = (req.file as any).path
    const user = await User.findByIdAndUpdate(req.params.id, { avatar }, { new: true }).select('-password')
    if (!user) return res.status(404).json({ message: 'User not found' })
    res.json({ avatar, user })
  } catch (err) {
    res.status(500).json({ message: (err as Error).message })
  }
}

export const resetUserPassword = async (req: Request, res: Response) => {
  try {
    const { newPassword } = req.body
    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' })
    }
    const user = await User.findById(req.params.id)
    if (!user) return res.status(404).json({ message: 'User not found' })
    user.password = newPassword
    await user.save()
    res.json({ message: 'Password reset successfully' })
  } catch (err) {
    res.status(500).json({ message: (err as Error).message })
  }
}
