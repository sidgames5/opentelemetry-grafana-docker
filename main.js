import './otel.js'
import { logInfo } from './otel-logger.js'
import express from 'express'
import axios from 'axios'

const app = express()
const port = 3005

app.use(express.json())



// Simple health check
app.get('/health', (req, res) => {
  res.send('OK')
})

// Simulated endpoints that call each other
app.get('/api/root', async (req, res, next) => {
  try {
    // Perform multiple internal requests
    await axios.get(`http://localhost:${port}/api/serviceA`)
    await axios.get(`http://localhost:${port}/api/serviceB`)
    res.json({ message: 'Root request complete' })
  } catch (err) {
    next(err)
  }
})

app.get('/api/serviceA', async (req, res, next) => {
  try {
    // Deep nested call to create spans
    await axios.get(`http://localhost:${port}/api/serviceC`)
    await axios.get(`http://localhost:${port}/api/serviceD`)
    res.json({ message: 'ServiceA done' })
  } catch (err) {
    next(err)
  }
})

app.get('/api/serviceB', async (req, res, next) => {
  try {
    await new Promise(resolve => setTimeout(resolve, 50))
    res.json({ message: 'ServiceB delayed response' })
  } catch (err) {
    next(err)
  }
})

app.get('/api/serviceC', (req, res) => {
  // Simulate computation load
  const result = Array.from({ length: 1e5 }, (_, i) => i * Math.random()).reduce((a, b) => a + b, 0)
  res.json({ result })
})

app.get('/api/serviceD', (req, res) => {
  res.json({ timestamp: Date.now() })
})

// Global error handler
app.use((err, req, res, next) => {
  const status = err.status || 500
  res.status(status).json({
    error: status >= 500 ? 'Internal Server Error' : err.message
  })
})

// Start server
app.listen(port, () => {
  logInfo('Server started', { port })
  // Automatically generate periodic calls for load
  setInterval(async () => {
    try {
      await axios.get(`http://localhost:${port}/api/root`)
      logInfo('Triggered internal trace chain')
    } catch (err) {
      console.error('Load generation failed', err.message)
    }
  }, 1000)
})