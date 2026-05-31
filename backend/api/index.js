import { Router } from 'express'
import paymentsRoutes from '../routes/payments.routes.js'

const api = Router()
api.use('/payments', paymentsRoutes)
export default api
