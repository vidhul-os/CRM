import { Response } from 'express'
import { Note } from '../models/Note'
import { AuthRequest } from '../middlewares/auth'

export const getNotes = async (req: AuthRequest, res: Response) => {
  try {
    const { 
      page = 1, 
      limit = 20, 
      type, 
      leadId, 
      dealId, 
      contactId,
      pinned,
      sort = '-createdAt' 
    } = req.query

    const skip = (Number(page) - 1) * Number(limit)
    const filter: any = {}

    // Multi-tenant check
    if (req.user?.role === 'Sales') {
      filter.owner = req.user._id
    }

    if (type) filter.type = type
    if (leadId) filter.leadId = leadId
    if (dealId) filter.dealId = dealId
    if (contactId) filter.contactId = contactId
    if (pinned === 'true') filter.pinned = true

    const notes = await Note.find(filter)
      .sort(sort as string)
      .skip(skip)
      .limit(Number(limit))
      .populate('owner', 'name email avatar')

    const total = await Note.countDocuments(filter)

    res.json({
      data: notes,
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

export const createNote = async (req: AuthRequest, res: Response) => {
  try {
    const data = { ...req.body, owner: req.user?._id }
    const note = await Note.create(data)
    res.status(201).json(note)
  } catch (err) {
    res.status(500).json({ message: (err as Error).message })
  }
}

export const updateNote = async (req: AuthRequest, res: Response) => {
  try {
    const note = await Note.findByIdAndUpdate(req.params.id, req.body, { new: true })
    if (!note) return res.status(404).json({ message: 'Note not found' })
    res.json(note)
  } catch (err) {
    res.status(500).json({ message: (err as Error).message })
  }
}

export const deleteNote = async (req: AuthRequest, res: Response) => {
  try {
    const note = await Note.findByIdAndDelete(req.params.id)
    if (!note) return res.status(404).json({ message: 'Note not found' })
    res.json({ message: 'Note deleted' })
  } catch (err) {
    res.status(500).json({ message: (err as Error).message })
  }
}
