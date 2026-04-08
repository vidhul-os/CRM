import mongoose from 'mongoose'

export const connectDB = async (): Promise<void> => {
  try {
    const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/frappe_crm'
    await mongoose.connect(uri)
    console.log(`✅ MongoDB connected: ${mongoose.connection.host}`)

    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err)
    })

    mongoose.connection.on('disconnected', () => {
      console.warn('MongoDB disconnected — retrying...')
    })
  } catch (err) {
    console.error('❌ MongoDB connection failed:', err)
    process.exit(1)
  }
}
