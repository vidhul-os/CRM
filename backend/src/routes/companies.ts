import { Router } from 'express'
import { getCompanies, createCompany, updateCompany, deleteCompany } from '../controllers/companies'
import { auth, hasPermission } from '../middlewares/auth'

const router = Router()

router.use(auth)

router.get('/',       hasPermission('companies', 'read'), getCompanies)
router.post('/',      hasPermission('companies', 'create'), createCompany)
router.patch('/:id',  hasPermission('companies', 'update'), updateCompany)
router.delete('/:id', hasPermission('companies', 'delete'), deleteCompany)

export default router
