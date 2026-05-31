import { createOrder, verifySignature } from '../services/razorpay.service.js'

export async function createOrderHandler(req, res) {
  const { amount, currency, plan } = req.body
  if (!amount || amount < 100) return res.status(400).json({ error: 'Invalid amount' })
  const order = await createOrder({ amount, currency, plan })
  res.json(order)
}

export async function verifyHandler(req, res) {
  const valid = verifySignature(req.body)
  // On valid: grant membership via Firestore Admin SDK here.
  res.json({ valid })
}
