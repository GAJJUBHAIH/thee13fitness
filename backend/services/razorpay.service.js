import crypto from 'node:crypto'
import Razorpay from 'razorpay'
import { config } from '../config/env.js'

const client = new Razorpay({
  key_id: config.razorpay.keyId,
  key_secret: config.razorpay.keySecret,
})

export function createOrder({ amount, currency = 'INR', plan }) {
  return client.orders.create({
    amount,
    currency,
    receipt: `rcpt_${Date.now()}`,
    notes: { plan: plan ?? 'membership' },
  })
}

export function verifySignature({ razorpay_order_id, razorpay_payment_id, razorpay_signature }) {
  const expected = crypto
    .createHmac('sha256', config.razorpay.keySecret)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest('hex')
  return expected === razorpay_signature
}
