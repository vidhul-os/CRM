import { Response } from 'express'
import { Lead } from '../models/Lead'
import { Deal } from '../models/Deal'
import { Contact } from '../models/Contact'
import { Task } from '../models/Task'
import { AuthRequest } from '../middlewares/auth'

export const getStats = async (req: AuthRequest, res: Response) => {
  try {
    const filter: any = { adminId: req.user?.adminId }
    if (req.user?.role === 'user') {
      filter.owner = req.user._id
    }

    const [leadsCount, dealsCount, contactsCount, openTasksCount] = await Promise.all([
      Lead.countDocuments(filter),
      Deal.countDocuments(filter),
      Contact.countDocuments(filter),
      Task.countDocuments({ ...filter, status: { $ne: 'Completed' } })
    ])

    const wonDeals = await Deal.find({ ...filter, stage: 'Closed Won' })
    const totalPipeline = wonDeals.reduce((sum, d) => sum + d.value, 0)

    res.json({
      leads: leadsCount,
      deals: dealsCount,
      contacts: contactsCount,
      openTasks: openTasksCount,
      revenue: totalPipeline
    })
  } catch (err) {
    res.status(500).json({ message: (err as Error).message })
  }
}

export const getLeadsFunnel = async (req: AuthRequest, res: Response) => {
  try {
    const filter: any = { adminId: req.user?.adminId }
    if (req.user?.role === 'user') filter.owner = req.user._id

    const funnel = await Lead.aggregate([
      { $match: filter },
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ])

    res.json(funnel)
  } catch (err) {
    res.status(500).json({ message: (err as Error).message })
  }
}

export const getActivities = async (req: AuthRequest, res: Response) => {
  try {
    // This could combine recent leads, deals, tasks, etc.
    const filter: any = { adminId: req.user?.adminId }
    if (req.user?.role === 'user') filter.owner = req.user._id

    const recentLeads = await Lead.find(filter).sort('-createdAt').limit(5)
    const recentDeals = await Deal.find(filter).sort('-createdAt').limit(5)
    
    res.json({
      recentLeads,
      recentDeals
    })
  } catch (err) {
    res.status(500).json({ message: (err as Error).message })
  }
}
