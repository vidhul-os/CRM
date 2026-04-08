import { Router } from 'express'
import { register, login, sendOtp, verifyOtp, resetPassword, refreshToken } from '../controllers/auth'
import { auth } from '../middlewares/auth'

const router = Router()

router.post('/register',      register)
router.post('/login',         login)
router.post('/send-otp',      sendOtp)
router.post('/verify-otp',    verifyOtp)
router.post('/reset-password', resetPassword)
router.post('/refresh-token', refreshToken)

export default router
