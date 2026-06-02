import { Router } from 'express'
import paymentsRoutes from '../routes/payments.routes.js'
import tokensRoutes from '../routes/tokens.routes.js'
import adminRoutes from '../routes/admin.routes.js'

const api = Router()
api.use('/payments', paymentsRoutes)
api.use('/tokens', tokensRoutes)
api.use('/admin', adminRoutes)

export default api
