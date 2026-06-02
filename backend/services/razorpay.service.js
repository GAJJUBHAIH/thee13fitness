import crypto from 'node:crypto'
import Razorpay from 'razorpay'
import { config } from '../config/env.js'

let client = null;

if (config.razorpay.keyId && config.razorpay.keySecret) {
  try {
    client = new Razorpay({
      key_id: config.razorpay.keyId,
      key_secret: config.razorpay.keySecret,
    });
  } catch (error) {
    console.error('Razorpay initialization error:', error.message);
  }
} else {
  console.warn('Razorpay NOT initialized: RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET are missing.');
}

export function isRazorpayConfigured() {
  return client !== null;
}

export function createOrder({ amount, currency = 'INR', plan }) {
  if (!client) {
    throw new Error('Razorpay not configured');
  }
  return client.orders.create({
    amount,
    currency,
    receipt: `rcpt_${Date.now()}`,
    notes: { plan: plan ?? 'membership' },
  })
}

export function verifySignature({ razorpay_order_id, razorpay_payment_id, razorpay_signature }) {
  if (!config.razorpay.keySecret) {
     throw new Error('Razorpay not configured');
  }
  const expected = crypto
    .createHmac('sha256', config.razorpay.keySecret)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest('hex')
  return expected === razorpay_signature
}
