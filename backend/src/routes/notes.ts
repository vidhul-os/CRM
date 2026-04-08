import { Router } from 'express'
import { auth, hasPermission } from '../middlewares/auth'
import { getNotes, createNote, updateNote, deleteNote } from '../controllers/notes'

const router = Router()
router.use(auth)

router.get('/',       hasPermission('notes', 'read'), getNotes)
router.post('/',      hasPermission('notes', 'create'), createNote)
router.patch('/:id',  hasPermission('notes', 'update'), updateNote)
router.delete('/:id', hasPermission('notes', 'delete'), deleteNote)

export default router
