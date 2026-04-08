import { Request, Response } from 'express'
import { Company } from '../models/Company'
import { AuthRequest } from '../middlewares/auth'

export const getCompanies = async (req: AuthRequest, res: Response) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      search, 
      industry, 
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

    if (industry) filter.industry = industry

    const companies = await Company.find(filter)
      .sort(sort as string)
      .skip(skip)
      .limit(Number(limit))
      .populate('owner', 'name email avatar')

    const total = await Company.countDocuments(filter)

    res.json({
      data: companies,
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

export const createCompany = async (req: AuthRequest, res: Response) => {
  try {
    const data = { ...req.body, owner: req.user?._id }
    const company = await Company.create(data)
    res.status(201).json(company)
  } catch (err) {
    res.status(500).json({ message: (err as Error).message })
  }
}

export const updateCompany = async (req: Request, res: Response) => {
  try {
    const company = await Company.findByIdAndUpdate(req.params.id, req.body, { new: true })
    if (!company) return res.status(404).json({ message: 'Company not found' })
    res.json(company)
  } catch (err) {
    res.status(500).json({ message: (err as Error).message })
  }
}

export const deleteCompany = async (req: Request, res: Response) => {
  try {
    const company = await Company.findByIdAndDelete(req.params.id)
    if (!company) return res.status(404).json({ message: 'Company not found' })
    res.json({ message: 'Company deleted' })
  } catch (err) {
    res.status(500).json({ message: (err as Error).message })
  }
}
