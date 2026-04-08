import { Router } from 'express'
import { getContacts, createContact, updateContact, deleteContact } from '../controllers/contacts'
import { auth, hasPermission } from '../middlewares/auth'

const router = Router()

router.use(auth)

router.get('/',       hasPermission('contacts', 'read'), getContacts)
router.post('/',      hasPermission('contacts', 'create'), createContact)
router.patch('/:id',  hasPermission('contacts', 'update'), updateContact)
router.delete('/:id', hasPermission('contacts', 'delete'), deleteContact)

export default router
