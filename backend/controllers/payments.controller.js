import { createOrder, verifySignature } from '../services/razorpay.service.js'
import { createAndSaveToken } from '../services/token.service.js'
import { sendPurchaseNotifications } from '../services/notification.service.js'
import { appendToExcelReport } from '../services/report.service.js'

export async function createOrderHandler(req, res) {
  const { amount, currency, plan } = req.body
  if (!amount || amount < 100) return res.status(400).json({ error: 'Invalid amount' })
  const order = await createOrder({ amount, currency, plan })
  res.json(order)
}

export async function verifyHandler(req, res) {
  const valid = verifySignature(req.body)
  
  if (valid) {
    try {
      // Assuming frontend passes token details in req.body.tokenData
      const tokenData = req.body.tokenData || {
        type: req.body.type || 'membership',
        userId: req.body.userId,
        userName: req.body.userName || 'Customer',
        email: req.body.email || '',
        phone: req.body.phone || '',
        itemId: req.body.itemId || req.body.plan || 'unknown',
        itemName: req.body.itemName || req.body.planName || 'Membership Plan',
        amount: req.body.amount || 0,
        quantity: req.body.quantity || 1
      };
      
      const tokenDoc = await createAndSaveToken(tokenData);
      
      // Fire notifications and report generation in background
      sendPurchaseNotifications(tokenDoc).catch(console.error);
      appendToExcelReport(tokenDoc).catch(console.error);
      
      return res.json({ valid: true, token: tokenDoc.tokenId, qrCodeData: tokenDoc.qrCodeData });
    } catch (error) {
      console.error('Error generating token after verification:', error);
      return res.status(500).json({ valid: true, error: 'Payment verified, but token generation failed.' });
    }
  }

  res.json({ valid })
}
