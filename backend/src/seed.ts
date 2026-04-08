import mongoose from 'mongoose'
import dotenv from 'dotenv'
import { User } from './models/User'
import { Lead } from './models/Lead'
import { Deal } from './models/Deal'
import { Contact } from './models/Contact'

dotenv.config()

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/frappe_crm')
    console.log('Connected to MongoDB for seeding...')

    // Clear existing data
    await User.deleteMany({})
    await Lead.deleteMany({})
    await Deal.deleteMany({})
    await Contact.deleteMany({})

    // Create Admin User
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@crm.com',
      password: 'admin123',
      role: 'Admin',
      status: 'Active'
    })
    console.log('✅ Admin user created: admin@crm.com / admin123')

    // Create Sample Leads
    const leads = await Lead.insertMany([
      { name: 'Priya Sharma', email: 'priya@techcorp.in', company: 'TechCorp India', status: 'New', owner: admin._id, score: 85 },
      { name: 'Rahul Verma', email: 'rahul@startupx.com', company: 'StartupX', status: 'Contacted', owner: admin._id, score: 60 },
      { name: 'Anjali Singh', email: 'anjali@bigbiz.com', company: 'BigBiz Ltd', status: 'Qualified', owner: admin._id, score: 92 }
    ])
    console.log('✅ Sample leads created')

    // Create Sample Deals
    await Deal.insertMany([
      { name: 'ERP Implementation', contact: 'Priya Sharma', company: 'TechCorp India', value: 500000, stage: 'Qualification', owner: admin._id },
      { name: 'SaaS License', contact: 'Rahul Verma', company: 'StartupX', value: 150000, stage: 'Proposal', owner: admin._id }
    ])
    console.log('✅ Sample deals created')

    // Create Sample Contacts
    await Contact.insertMany([
      { name: 'Priya Sharma', email: 'priya@techcorp.in', company: 'TechCorp India', role: 'CTO', owner: admin._id },
      { name: 'Rahul Verma', email: 'rahul@startupx.com', company: 'StartupX', role: 'CEO', owner: admin._id }
    ])
    console.log('✅ Sample contacts created')

    console.log('🚀 Seeding completed successfully!')
    process.exit(0)
  } catch (err: any) {
    console.error('❌ Seeding failed!')
    console.error('Error Code:', err.code)
    console.error('Error Message:', err.message)
    if (err.errors) console.error('Validation Errors:', JSON.stringify(err.errors, null, 2))
    console.error('Stack:', err.stack)
    process.exit(1)
  }
}

seed()
