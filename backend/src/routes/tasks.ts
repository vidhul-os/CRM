import { Router } from 'express'
import { getTasks, createTask, updateTask, deleteTask } from '../controllers/tasks'
import { auth, hasPermission } from '../middlewares/auth'

const router = Router()

router.use(auth)

router.get('/',       hasPermission('tasks', 'read'), getTasks)
router.post('/',      hasPermission('tasks', 'create'), createTask)
router.patch('/:id',  hasPermission('tasks', 'update'), updateTask)
router.delete('/:id', hasPermission('tasks', 'delete'), deleteTask)

export default router
