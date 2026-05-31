import express from 'express'
import cors from 'cors'
import { config } from './config/env.js'
import api from './api/index.js'
import { errorHandler } from './middleware/errorHandler.js'

const app = express()
app.use(express.json())
app.use(cors({ origin: config.clientOrigin }))

app.get('/health', (_req, res) => res.json({ ok: true }))
app.use('/api', api)
app.use(errorHandler)

app.listen(config.port, () => console.log(`Payments API on :${config.port}`))
