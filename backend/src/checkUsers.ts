import mongoose from 'mongoose'
import { User } from './models/User'
import dotenv from 'dotenv'

dotenv.config()

const check = async () => {
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/frappe_crm')
  const users = await User.find({}).select('name email adminId role')
  console.log('All Users:', JSON.stringify(users, null, 2))
  process.exit(0)
}

check()
