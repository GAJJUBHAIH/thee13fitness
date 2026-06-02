import { Router } from 'express'
import { asyncHandler } from '../middleware/asyncHandler.js'
import { createOrderHandler, verifyHandler } from '../controllers/payments.controller.js'
import { createAndSaveToken } from '../services/token.service.js'
import { sendPurchaseNotifications } from '../services/notification.service.js'
import { appendToExcelReport } from '../services/report.service.js'

const router = Router()
router.post('/create-order', asyncHandler(createOrderHandler))
router.post('/verify', asyncHandler(verifyHandler))

// Added for frontend mock flows without real Razorpay
router.post('/create-mock-purchase', asyncHandler(async (req, res) => {
  const tokenData = req.body.tokenData;
  if (!tokenData) return res.status(400).json({ error: 'Token data required' });
  
  const tokenDoc = await createAndSaveToken(tokenData);
  sendPurchaseNotifications(tokenDoc).catch(console.error);
  appendToExcelReport(tokenDoc).catch(console.error);
  
  res.json({ valid: true, token: tokenDoc.tokenId, qrCodeData: tokenDoc.qrCodeData });
}))

export default router
