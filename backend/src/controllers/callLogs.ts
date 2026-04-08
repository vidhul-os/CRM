import { Request, Response } from 'express'
import { CallLog } from '../models/CallLogModel'
import { AuthRequest } from '../middlewares/auth'

export const getCallLogs = async (req: AuthRequest, res: Response) => {
  try {
    const { 
      page = 1, 
      limit = 20, 
      status, 
      sort = '-startTime' 
    } = req.query

    const adminId = req.user?.adminId || req.user?._id
    const skip = (Number(page) - 1) * Number(limit)
    
    // Fetch logs where user is caller or receiver, within their organization
    const filter: any = { 
      adminId,
      $or: [
        { callerId: req.user?._id },
        { receiverId: req.user?._id }
      ]
    }

    if (status) filter.status = status

    const logs = await CallLog.find(filter)
      .sort(sort as string)
      .skip(skip)
      .limit(Number(limit))
      .populate('callerId', 'name email avatar')
      .populate('receiverId', 'name email avatar')

    const total = await CallLog.countDocuments(filter)

    res.json({
      data: logs,
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

export const deleteCallLog = async (req: Request, res: Response) => {
  try {
    const log = await CallLog.findByIdAndDelete(req.params.id)
    if (!log) return res.status(404).json({ message: 'Call log not found' })
    res.json({ message: 'Call log deleted' })
  } catch (err) {
    res.status(500).json({ message: (err as Error).message })
  }
}
