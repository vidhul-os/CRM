import { Router } from 'express'
import { getStats, getActivities, getLeadsFunnel } from '../controllers/dashboard'
import { auth } from '../middlewares/auth'

const router = Router()

router.use(auth)

router.get('/stats',       getStats)
router.get('/activities',  getActivities)
router.get('/leads-funnel', getLeadsFunnel)

export default router
