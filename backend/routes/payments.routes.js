import { Router } from 'express'
import { asyncHandler } from '../middleware/asyncHandler.js'
import { createOrderHandler, verifyHandler } from '../controllers/payments.controller.js'

const router = Router()
router.post('/create-order', asyncHandler(createOrderHandler))
router.post('/verify', asyncHandler(verifyHandler))
export default router
