import { Response } from 'express'
import { Message } from '../models/Message'
import { AuthRequest } from '../middlewares/auth'
import mongoose from 'mongoose'

export const getMessages = async (req: AuthRequest, res: Response) => {
  try {
    const { contactId } = req.params
    const adminId = req.user?.adminId || req.user?._id
    
    const messages = await Message.find({
      adminId,
      $or: [
        { senderId: req.user?._id, receiverId: contactId },
        { senderId: contactId, receiverId: req.user?._id }
      ]
    }).sort('timestamp')

    res.json({ data: messages })
  } catch (err) {
    res.status(500).json({ message: (err as Error).message })
  }
}

export const getRecentChats = async (req: AuthRequest, res: Response) => {
    try {
        const adminId = req.user?.adminId || req.user?._id
        const userId = req.user?._id

        if (!adminId || !userId) return res.status(401).json({ message: 'Unauthorized' })

        const recentMessages = await Message.aggregate([
            { $match: { 
                adminId: new mongoose.Types.ObjectId(adminId as any), 
                $or: [ 
                    { senderId: new mongoose.Types.ObjectId(userId as any) }, 
                    { receiverId: new mongoose.Types.ObjectId(userId as any) } 
                ] 
            } },
            { $sort: { timestamp: -1 } },
            { 
                $group: { 
                    _id: {
                        $cond: [
                            { $eq: ["$senderId", new mongoose.Types.ObjectId(userId as any)] },
                            "$receiverId",
                            "$senderId"
                        ]
                    },
                    lastMessage: { $first: "$$ROOT" }
                } 
            },
            { $replaceRoot: { newRoot: "$lastMessage" } }
        ]);

        res.json({ data: recentMessages });
    } catch (err) {
        res.status(500).json({ message: (err as Error).message });
    }
}
