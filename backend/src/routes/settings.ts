import { Router } from 'express'
import { 
  getSettings, 
  updateOrganization,
  updateOrgLogo,
  updateBrandingLogo,
  updateBranding, 
  updateModules, 
  getCustomFields, 
  addCustomField, 
  deleteCustomField, 
  getWorkflows, 
  addWorkflow, 
  updateEmailSettings 
} from '../controllers/settings'
import { auth, hasPermission } from '../middlewares/auth'
import { logoUpload } from '../middlewares/cloudinary'

const router = Router()
router.use(auth)

router.get('/', hasPermission('settings', 'read'), getSettings)

// Admin mutation routes protected by dynamic permissions
router.patch('/organization',         hasPermission('settings', 'update'), updateOrganization)
router.post('/organization/logo',     hasPermission('settings', 'update'), logoUpload.single('logo'), updateOrgLogo)
router.post('/branding/logo',         hasPermission('settings', 'update'), logoUpload.single('logo'), updateBrandingLogo)
router.patch('/branding',             hasPermission('settings', 'update'), updateBranding)
router.patch('/modules',              hasPermission('settings', 'update'), updateModules)
router.get('/fields/:module',         hasPermission('settings', 'read'), getCustomFields)
router.post('/fields',                hasPermission('settings', 'create'), addCustomField)
router.delete('/fields/:id',          hasPermission('settings', 'delete'), deleteCustomField)
router.get('/workflows',              hasPermission('settings', 'read'), getWorkflows)
router.post('/workflows',             hasPermission('settings', 'create'), addWorkflow)
router.patch('/email',                hasPermission('settings', 'update'), updateEmailSettings)

export default router
