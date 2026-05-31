import 'dotenv/config'

export const config = {
  port: process.env.PORT || 4000,
  clientOrigin: (process.env.CLIENT_ORIGIN || '*').split(','),
  razorpay: {
    keyId: process.env.RAZORPAY_KEY_ID,
    keySecret: process.env.RAZORPAY_KEY_SECRET,
  },
}
