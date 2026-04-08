import { Request, Response } from 'express'
import { Deal } from '../models/Deal'
import { AuthRequest } from '../middlewares/auth'

export const getDeals = async (req: AuthRequest, res: Response) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      search, 
      stage, 
      ownerId, 
      sort = '-createdAt' 
    } = req.query

    const skip = (Number(page) - 1) * Number(limit)
    const filter: any = { adminId: req.user?.adminId }

    if (req.user?.role === 'user') {
      filter.owner = req.user._id
    } else if (ownerId) {
      filter.owner = ownerId
    }

    if (search) {
      filter.$text = { $search: search as string }
    }

    if (stage) filter.stage = stage

    const deals = await Deal.find(filter)
      .sort(sort as string)
      .skip(skip)
      .limit(Number(limit))
      .populate('owner', 'name email avatar')

    const total = await Deal.countDocuments(filter)

    res.json({
      data: deals,
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

export const getDealById = async (req: AuthRequest, res: Response) => {
  try {
    const deal = await Deal.findOne({ 
      _id: req.params.id, 
      adminId: req.user?.adminId 
    }).populate('owner', 'name email avatar')
    
    if (!deal) return res.status(404).json({ message: 'Deal not found or access denied' })

    // User can only view their own deals
    if (req.user?.role === 'user' && deal.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Forbidden: You only have access to your own deals' })
    }

    res.json(deal)
  } catch (err) {
    res.status(500).json({ message: (err as Error).message })
  }
}

export const createDeal = async (req: AuthRequest, res: Response) => {
  try {
    const data = { 
      ...req.body, 
      owner: req.body.owner || req.user?._id, 
      adminId: req.user?.adminId 
    }
    const deal = await Deal.create(data)
    res.status(201).json(deal)
  } catch (err) {
    res.status(500).json({ message: (err as Error).message })
  }
}

export const updateDeal = async (req: AuthRequest, res: Response) => {
  try {
    const deal = await Deal.findOneAndUpdate(
      { _id: req.params.id, adminId: req.user?.adminId }, 
      req.body, 
      { new: true, runValidators: true }
    )
    if (!deal) return res.status(404).json({ message: 'Deal not found or access denied' })
    res.json(deal)
  } catch (err) {
    res.status(500).json({ message: (err as Error).message })
  }
}

export const deleteDeal = async (req: AuthRequest, res: Response) => {
  try {
    const deal = await Deal.findOneAndDelete({ _id: req.params.id, adminId: req.user?.adminId })
    if (!deal) return res.status(404).json({ message: 'Deal not found or access denied' })
    res.json({ message: 'Deal deleted' })
  } catch (err) {
    res.status(500).json({ message: (err as Error).message })
  }
}
