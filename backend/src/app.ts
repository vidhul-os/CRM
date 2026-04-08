import express, { Application } from 'express'
import cors from 'cors'
import helmet from 'helmet'
import path from 'path'
import { errorHandler, logger } from './middlewares/common'

// Routes
import authRoutes      from './routes/auth'
import userRoutes      from './routes/users'
import leadRoutes      from './routes/leads'
import dealRoutes      from './routes/deals'
import contactRoutes   from './routes/contacts'
import companyRoutes   from './routes/companies'
import taskRoutes      from './routes/tasks'
import callLogRoutes   from './routes/callLogs'
import noteRoutes      from './routes/notes'
import dashboardRoutes from './routes/dashboard'
import settingsRoutes  from './routes/settings'
import adminRoutes     from './routes/admin'
import paymentRoutes from './routes/paymentRoutes'
import chatRoutes      from './routes/chat'
// import { apiSetupAdmin } from './controllers/adminSetup' // Removed as per request

const app: Application = express()

// Middlewares
app.use(helmet())
app.use(cors({ origin: ['http://localhost:5173', 'http://localhost:5174'], credentials: true }))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(logger)

// Static files
app.use('/uploads', express.static(path.join(__dirname, '../uploads')))

// Health check
app.get('/health', (_req, res) => res.json({ status: 'UP', timestamp: new Date().toISOString() }))

// Main API Routes
app.use('/auth',       authRoutes)
app.use('/users',      userRoutes)
app.use('/leads',      leadRoutes)
app.use('/deals',      dealRoutes)
app.use('/contacts',   contactRoutes)
app.use('/companies',  companyRoutes)
app.use('/tasks',      taskRoutes)
app.use('/call-logs',  callLogRoutes)
app.use('/notes',      noteRoutes)
app.use('/dashboard',  dashboardRoutes)
app.use('/settings',   settingsRoutes)
app.use('/admin',      adminRoutes)
app.use('/payment',    paymentRoutes)
app.use('/messages',   chatRoutes)
// app.post('/admin/setup', apiSetupAdmin) // Removed as per request


// 404 handler
app.use((_req, res) => res.status(404).json({ message: 'API route not found' }))

// Error handler
app.use(errorHandler)

export default app
