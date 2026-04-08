import { Router } from 'express'
import { getMessages, getRecentChats } from '../controllers/chat'
import { auth } from '../middlewares/auth'

const router = Router()

router.use(auth)

router.get('/recent',     getRecentChats)
router.get('/:contactId', getMessages)

export default router
