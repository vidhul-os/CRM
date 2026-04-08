import { Router } from 'express'
import { getProfile, updateProfile, changePassword, updateAvatar, getTeamMembers } from '../controllers/users'
import { auth } from '../middlewares/auth'
import { avatarUpload } from '../middlewares/cloudinary'

const router = Router()
router.use(auth)

router.get('/profile',            getProfile)
router.patch('/profile',          updateProfile)
router.patch('/change-password',  changePassword)
router.post('/avatar',            avatarUpload.single('avatar'), updateAvatar)
router.get('/team-members',       getTeamMembers)

export default router
