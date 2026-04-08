import { Request, Response } from 'express'
import { Lead } from '../models/Lead'
import { AuthRequest } from '../middlewares/auth'

export const getLeads = async (req: AuthRequest, res: Response) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      search, 
      status, 
      source, 
      sort = '-createdAt' 
    } = req.query

    const skip = (Number(page) - 1) * Number(limit)
    const filter: any = { adminId: req.user?.adminId }

    // Admin sees all for their ID, Users see only their own assigned leads
    if (req.user?.role === 'user') {
      filter.owner = req.user._id
    } else if (req.query.owner) {
      // Admin can filter by specific user if they want
      filter.owner = req.query.owner
    }

    if (search) {
      filter.$text = { $search: search as string }
    }

    if (status) filter.status = status
    if (source) filter.source = source

    const leads = await Lead.find(filter)
      .sort(sort as string)
      .skip(skip)
      .limit(Number(limit))
      .populate('owner', 'name email avatar')

    const total = await Lead.countDocuments(filter)

    res.json({
      data: leads,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        pages: Math.ceil(total / Number(limit))
      }
    })
  } catch (err) {
    res.status(500).json({ message: (err as Error).message })
  }
}

export const getLeadById = async (req: AuthRequest, res: Response) => {
  try {
    const lead = await Lead.findOne({ 
      _id: req.params.id, 
      adminId: req.user?.adminId 
    }).populate('owner', 'name email avatar')
    
    if (!lead) return res.status(404).json({ message: 'Lead not found or access denied' })

    // User can only view their own leads
    if (req.user?.role === 'user' && lead.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Forbidden: You only have access to your own leads' })
    }

    res.json(lead)
  } catch (err) {
    res.status(500).json({ message: (err as Error).message })
  }
}

export const createLead = async (req: AuthRequest, res: Response) => {
  try {
    console.log(req.user,'----')
    const data = { 
      ...req.body, 
      owner: req.user?._id, // Default to self if not assigned
      adminId: req.user?.adminId 
    }
    const lead = await Lead.create(data)
    res.status(201).json(lead)
  } catch (err) {
    res.status(500).json({ message: (err as Error).message })
  }
}

export const updateLead = async (req: AuthRequest, res: Response) => {
  try {
    const lead = await Lead.findOneAndUpdate(
      { _id: req.params.id, adminId: req.user?.adminId }, 
      req.body, 
      { new: true, runValidators: true }
    )
    if (!lead) return res.status(404).json({ message: 'Lead not found or access denied' })
    res.json(lead)
  } catch (err) {
    res.status(500).json({ message: (err as Error).message })
  }
}

export const deleteLead = async (req: AuthRequest, res: Response) => {
  try {
    const lead = await Lead.findOneAndDelete({ _id: req.params.id, adminId: req.user?.adminId })
    if (!lead) return res.status(404).json({ message: 'Lead not found or access denied' })
    res.json({ message: 'Lead deleted' })
  } catch (err) {
    res.status(500).json({ message: (err as Error).message })
  }
}

export const getMyLeads = async (req: AuthRequest, res: Response) => {
  req.query.owner = (req.user?._id as any).toString()
  return getLeads(req, res)
}

export const getHotLeads = async (req: AuthRequest, res: Response) => {
  req.query.sort = '-score'
  return getLeads(req, res)
}
