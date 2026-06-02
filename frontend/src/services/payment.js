import { ENV } from '../constants/index.js'

function loadScript() {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true)
    const s = document.createElement('script')
    s.src = 'https://checkout.razorpay.com/v1/checkout.js'
    s.onload = () => resolve(true)
    s.onerror = () => resolve(false)
    document.body.appendChild(s)
  })
}

/** Starts a verified Razorpay checkout. Relays errors via onError. */
export async function payWithRazorpay({ amount, name, email, plan, onSuccess, onError }) {
  try {
    if (!ENV.razorpayKeyId || !ENV.paymentsApi) {
      return onError?.('Payments not configured. Set VITE_RAZORPAY_KEY_ID and VITE_PAYMENTS_API.')
    }
    if (!(await loadScript())) return onError?.('Failed to load Razorpay checkout.')

    const orderRes = await fetch(`${ENV.paymentsApi}/api/payments/create-order`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: amount * 100, currency: 'INR', plan }),
    })
    if (!orderRes.ok) return onError?.('Could not create order. Try again later.')
    const order = await orderRes.json()

    const rzp = new window.Razorpay({
      key: ENV.razorpayKeyId,
      amount: order.amount,
      currency: order.currency,
      name: 'Three13 Fitness',
      description: plan,
      order_id: order.id,
      prefill: { name, email },
      theme: { color: '#39FF14' },
      handler: async (resp) => {
        try {
          const v = await fetch(`${ENV.paymentsApi}/api/payments/verify`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(resp),
          })
          const result = await v.json()
          result.valid ? onSuccess?.(result) : onError?.('Payment verification failed.')
        } catch {
          onError?.('Verification request failed.')
        }
      },
    })
    rzp.on('payment.failed', (e) => onError?.(e.error?.description || 'Payment failed.'))
    rzp.open()
  } catch (err) {
    onError?.(err.message || 'Unexpected payment error.')
  }
}
