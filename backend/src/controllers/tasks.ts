import { Request, Response } from 'express'
import { Task } from '../models/Task'
import { AuthRequest } from '../middlewares/auth'

export const getTasks = async (req: AuthRequest, res: Response) => {
  try {
    const { 
      page = 1, 
      limit = 20, 
      status, 
      priority, 
      assignedTo,
      sort = '-createdAt' 
    } = req.query

    const skip = (Number(page) - 1) * Number(limit)
    const filter: any = {}

    if (req.user?.role === 'Sales') {
      filter.assignedTo = req.user._id
    } else if (assignedTo) {
      filter.assignedTo = assignedTo
    }

    if (status) filter.status = status
    if (priority) filter.priority = priority

    const tasks = await Task.find(filter)
      .sort(sort as string)
      .skip(skip)
      .limit(Number(limit))
      .populate('assignedTo', 'name email avatar')

    const total = await Task.countDocuments(filter)

    res.json({
      data: tasks,
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

export const createTask = async (req: AuthRequest, res: Response) => {
  try {
    const data = { ...req.body, owner: req.user?._id }
    if (!data.assignedTo) data.assignedTo = req.user?._id
    const task = await Task.create(data)
    res.status(201).json(task)
  } catch (err) {
    res.status(500).json({ message: (err as Error).message })
  }
}

export const updateTask = async (req: Request, res: Response) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true })
    if (!task) return res.status(404).json({ message: 'Task not found' })
    res.json(task)
  } catch (err) {
    res.status(500).json({ message: (err as Error).message })
  }
}

export const deleteTask = async (req: Request, res: Response) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id)
    if (!task) return res.status(404).json({ message: 'Task not found' })
    res.json({ message: 'Task deleted' })
  } catch (err) {
    res.status(500).json({ message: (err as Error).message })
  }
}
