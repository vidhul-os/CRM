import { Router } from 'express'
import { auth, hasPermission } from '../middlewares/auth'
import { avatarUpload } from '../middlewares/cloudinary'
import {
  getRoles, createRole, updateRole, deleteRole,
  getUsers, createUser, updateUser, deleteUser, resetUserPassword, updateUserAvatar
} from '../controllers/admin'

const router = Router()
router.use(auth)

// — Roles
router.get('/roles',             hasPermission('settings', 'read'),   getRoles)
router.post('/roles',            hasPermission('settings', 'create'), createRole)
router.patch('/roles/:id',       hasPermission('settings', 'update'), updateRole)
router.delete('/roles/:id',      hasPermission('settings', 'delete'), deleteRole)

// — Users (admin management)
router.get('/users',             hasPermission('users', 'read'),   getUsers)
router.post('/users',            hasPermission('users', 'create'), createUser)
router.patch('/users/:id',       hasPermission('users', 'update'), updateUser)
router.delete('/users/:id',      hasPermission('users', 'delete'), deleteUser)
router.patch('/users/:id/reset-password', hasPermission('users', 'update'), resetUserPassword)
router.post('/users/:id/avatar', hasPermission('users', 'update'), avatarUpload.single('avatar'), updateUserAvatar)

export default router
