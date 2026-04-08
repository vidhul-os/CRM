import { Router } from 'express'
import { getMessages, getRecentChats, markMessagesAsRead } from '../controllers/chat'
import { auth } from '../middlewares/auth'

const router = Router()

router.use(auth)

router.get('/recent',               getRecentChats)
router.patch('/mark-read/:contactId', markMessagesAsRead)
router.get('/:contactId',           getMessages)

export default router
