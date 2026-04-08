import { Request, Response } from 'express'
import { Contact } from '../models/Contact'
import { AuthRequest } from '../middlewares/auth'

export const getContacts = async (req: AuthRequest, res: Response) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      search, 
      company, 
      sort = '-createdAt' 
    } = req.query

    const skip = (Number(page) - 1) * Number(limit)
    const filter: any = {}

    if (req.user?.role === 'Sales') {
      filter.owner = req.user._id
    }

    if (search) {
      filter.$text = { $search: search as string }
    }

    if (company) filter.company = company

    const contacts = await Contact.find(filter)
      .sort(sort as string)
      .skip(skip)
      .limit(Number(limit))
      .populate('owner', 'name email avatar')

    const total = await Contact.countDocuments(filter)

    res.json({
      data: contacts,
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

export const createContact = async (req: AuthRequest, res: Response) => {
  try {
    const data = { ...req.body, owner: req.user?._id }
    const contact = await Contact.create(data)
    res.status(201).json(contact)
  } catch (err) {
    res.status(500).json({ message: (err as Error).message })
  }
}

export const updateContact = async (req: Request, res: Response) => {
  try {
    const contact = await Contact.findByIdAndUpdate(req.params.id, req.body, { new: true })
    if (!contact) return res.status(404).json({ message: 'Contact not found' })
    res.json(contact)
  } catch (err) {
    res.status(500).json({ message: (err as Error).message })
  }
}

export const deleteContact = async (req: Request, res: Response) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id)
    if (!contact) return res.status(404).json({ message: 'Contact not found' })
    res.json({ message: 'Contact deleted' })
  } catch (err) {
    res.status(500).json({ message: (err as Error).message })
  }
}
