import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { User, IUser } from '../models/User'
import { Role } from '../models/Role'

export interface AuthRequest extends Request {
  user?: IUser
}

export const auth = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.header('Authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No authentication token, access denied' })
    }

    const token = authHeader.replace('Bearer ', '')
    const secret = process.env.JWT_SECRET || 'crm_jwt_secret'
    
    const decoded = jwt.verify(token, secret) as { id: string }
    const user = await User.findById(decoded.id)

    if (!user) {
      return res.status(401).json({ message: 'Token is invalid, user not found' })
    }

    if (user.status === 'Inactive') {
      return res.status(403).json({ message: 'User account is inactive' })
    }

    req.user = user
    next()
  } catch (err) {
    res.status(401).json({ message: 'Token is invalid or expired' })
  }
}

export const adminOnly = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (req.user?.role !== 'Admin') {
    return res.status(403).json({ message: 'Forbidden: Admin access required' })
  }
  next()
}

export const hasPermission = (module: string, action: 'create' | 'read' | 'update' | 'delete' | 'export' = 'read') => {
  return async (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) return res.status(401).json({ message: 'Authentication required' })
    
    if (req.user.role === 'Admin') return next()

    const role = await Role.findOne({ name: req.user.role })
    if (!role) return res.status(403).json({ message: `Forbidden: Role ${req.user.role} not found` })

    const permissions = role.permissions[module]
    if (!permissions || !permissions[action]) {
      return res.status(403).json({ message: `Forbidden: No ${action} permission for ${module}` })
    }

    next()
  }
}
