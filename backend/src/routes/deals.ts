import { Router } from 'express'
import { getDeals, getDealById, createDeal, updateDeal, deleteDeal } from '../controllers/deals'
import { auth, hasPermission } from '../middlewares/auth'

const router = Router()

router.use(auth)

router.get('/',       hasPermission('deals', 'read'), getDeals)
router.get('/:id',    hasPermission('deals', 'read'), getDealById)
router.post('/',      hasPermission('deals', 'create'), createDeal)
router.patch('/:id',  hasPermission('deals', 'update'), updateDeal)
router.delete('/:id', hasPermission('deals', 'delete'), deleteDeal)

export default router
