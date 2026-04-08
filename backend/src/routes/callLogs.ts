import { Router } from 'express'
import { getCallLogs, deleteCallLog } from '../controllers/callLogs'
import { auth } from '../middlewares/auth'

const router = Router()

router.use(auth)

router.get('/',      getCallLogs)
router.delete('/:id', deleteCallLog)

export default router
