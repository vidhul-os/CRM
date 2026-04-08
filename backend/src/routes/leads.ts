import { Router } from 'express'
import { getLeads, getLeadById, createLead, updateLead, deleteLead, getMyLeads, getHotLeads } from '../controllers/leads'
import { auth, hasPermission } from '../middlewares/auth'

const router = Router()

router.use(auth)

router.get('/',          hasPermission('leads', 'read'), getLeads)
router.get('/my-leads',  hasPermission('leads', 'read'), getMyLeads)
router.get('/hot-leads', hasPermission('leads', 'read'), getHotLeads)
router.get('/:id',       hasPermission('leads', 'read'), getLeadById)
router.post('/',         hasPermission('leads', 'create'), createLead)
router.patch('/:id',     hasPermission('leads', 'update'), updateLead)
router.delete('/:id',    hasPermission('leads', 'delete'), deleteLead)

export default router
