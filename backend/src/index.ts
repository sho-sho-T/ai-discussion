import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import dotenv from 'dotenv'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001

// Middleware
app.use(helmet())
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}))
app.use(express.json())

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'AI Team Chat Backend is running' })
})

// API routes
app.use('/api', (req, res, next) => {
  console.log(`${req.method} ${req.path}`)
  next()
})

// Basic route for testing
app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'AI Team Chat API is working!',
    timestamp: new Date().toISOString()
  })
})

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`)
  console.log(`📊 Health check: http://localhost:${PORT}/health`)
})