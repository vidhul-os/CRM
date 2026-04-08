import { Request, Response } from 'express'
import { Settings } from '../models/Settings'
import { Workflow, CustomField } from '../models/Customizations'
import { AuthRequest } from '../middlewares/auth'

const getOrCreate = async () => {
  let s = await Settings.findOne()
  if (!s) s = await Settings.create({})
  return s
}

export const getSettings = async (req: Request, res: Response) => {
  try {
    res.json(await getOrCreate())
  } catch (err) {
    res.status(500).json({ message: (err as Error).message })
  }
}

export const updateOrganization = async (req: Request, res: Response) => {
  try {
    const s = await getOrCreate()
    s.organization = { ...s.organization, ...req.body }
    s.lastUpdated = new Date()
    await s.save()
    res.json(s.organization)
  } catch (err) {
    res.status(500).json({ message: (err as Error).message })
  }
}

export const updateOrgLogo = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' })
    const s = await getOrCreate()
    s.organization.logo = (req.file as any).path
    await s.save()
    res.json({ logo: s.organization.logo })
  } catch (err) {
    res.status(500).json({ message: (err as Error).message })
  }
}

export const updateBrandingLogo = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' })
    const s = await getOrCreate()
    s.branding.logo = (req.file as any).path
    await s.save()
    res.json({ logo: s.branding.logo })
  } catch (err) {
    res.status(500).json({ message: (err as Error).message })
  }
}

export const updateBranding = async (req: Request, res: Response) => {
  try {
    const s = await getOrCreate()
    s.branding = { ...s.branding, ...req.body }
    await s.save()
    res.json(s.branding)
  } catch (err) {
    res.status(500).json({ message: (err as Error).message })
  }
}

export const updateModules = async (req: Request, res: Response) => {
  try {
    const s = await getOrCreate()
    s.modules = req.body
    await s.save()
    res.json(s.modules)
  } catch (err) {
    res.status(500).json({ message: (err as Error).message })
  }
}

export const getCustomFields = async (req: Request, res: Response) => {
  try {
    res.json(await CustomField.find({ module: req.params.module }))
  } catch (err) {
    res.status(500).json({ message: (err as Error).message })
  }
}

export const addCustomField = async (req: Request, res: Response) => {
  try {
    const field = await CustomField.create(req.body)
    res.status(201).json(field)
  } catch (err) {
    res.status(500).json({ message: (err as Error).message })
  }
}

export const deleteCustomField = async (req: Request, res: Response) => {
  try {
    const field = await CustomField.findByIdAndDelete(req.params.id)
    if (!field) return res.status(404).json({ message: 'Field not found' })
    res.json({ message: 'Field deleted' })
  } catch (err) {
    res.status(500).json({ message: (err as Error).message })
  }
}

export const getWorkflows = async (req: Request, res: Response) => {
  try {
    res.json(await Workflow.find())
  } catch (err) {
    res.status(500).json({ message: (err as Error).message })
  }
}

export const addWorkflow = async (req: Request, res: Response) => {
  try {
    const workflow = await Workflow.create(req.body)
    res.status(201).json(workflow)
  } catch (err) {
    res.status(500).json({ message: (err as Error).message })
  }
}

export const updateEmailSettings = async (req: Request, res: Response) => {
  try {
    const s = await getOrCreate()
    s.email = { ...s.email, ...req.body }
    await s.save()
    res.json(s.email)
  } catch (err) {
    res.status(500).json({ message: (err as Error).message })
  }
}
