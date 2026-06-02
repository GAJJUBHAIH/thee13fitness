import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Input } from '../components/ui/index.js'
import { useAuth } from '../context/AuthContext.jsx'

const COUPON_CODE = 'AHPS'
const DISCOUNT_RATE = 0.9

export default function Checkout() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [cart, setCart] = useState([])
  const [address, setAddress] = useState({
    fullName: '',
    mobile: '',
    pincode: '',
    city: '',
    state: '',
    house: '',
  })
  const [paymentMethod, setPaymentMethod] = useState(null)
  const [coupon, setCoupon] = useState('')
  const [couponApplied, setCouponApplied] = useState(false)
  const [couponMessage, setCouponMessage] = useState('')
  const [showQr, setShowQr] = useState(false)
  const [paymentDone, setPaymentDone] = useState(false)
  const [feedback, setFeedback] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const stored = window.localStorage.getItem('three13_checkout_cart')
    if (!stored) {
      navigate('/store')
      return
    }
    try {
      setCart(JSON.parse(stored))
    } catch {
      navigate('/store')
    }
  }, [navigate])

  const items = useMemo(
    () => cart.map((item) => ({ ...item, subtotal: item.price * item.quantity })),
    [cart]
  )

  const amount = useMemo(
    () => items.reduce((sum, item) => sum + item.subtotal, 0),
    [items]
  )

  const discount = couponApplied ? parseFloat((amount * DISCOUNT_RATE).toFixed(2)) : 0
  const payable = couponApplied ? parseFloat((amount - discount).toFixed(2)) : amount

  const handleCouponApply = () => {
    if (coupon.trim().toUpperCase() === COUPON_CODE) {
      setCouponApplied(true)
      setCouponMessage('Coupon Applied Successfully! 90% OFF')
      return
    }
    setCouponApplied(false)
    setCouponMessage('Invalid coupon code.')
  }

  const handlePayNow = () => {
    if (!cart.length) {
      setFeedback('Your cart is empty.')
      return
    }
    setFeedback('')
    if (paymentMethod === 'cash') {
      setShowQr(false)
      setPaymentDone(true)
      setFeedback('Ready for Cash On Delivery.')
      return
    }
    setShowQr(true)
  }

  const handleConfirmOrder = async () => {
    if (!paymentDone) {
      setFeedback('Please confirm the payment to complete your order.')
      return
    }
    
    setLoading(true)
    setFeedback('Processing your order and generating tokens...')

    try {
      const apiUrl = import.meta.env.VITE_API_URL
      
      // Create a token for each item in the cart
      const promises = items.map(item => {
        return fetch(`${apiUrl}/payments/create-mock-purchase`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            tokenData: {
              type: 'product',
              userId: user?.uid || 'guest',
              userName: address.fullName || user?.displayName || 'Guest User',
              email: user?.email || '',
              phone: address.mobile || '',
              itemId: item.id || item.name,
              itemName: item.name,
              amount: item.subtotal,
              quantity: item.quantity
            }
          })
        })
      });

      await Promise.all(promises);

      setFeedback('Order confirmed successfully! Check your dashboard for tokens.')
      window.localStorage.removeItem('three13_cart')
      window.localStorage.removeItem('three13_checkout_cart')
      
      setTimeout(() => {
        if (user) navigate('/dashboard')
        else navigate('/store')
      }, 2000)

    } catch (err) {
      console.error(err)
      setFeedback('An error occurred while confirming your order.')
      setLoading(false)
    }
  }

  const updateAddress = (field) => (event) => {
    setAddress((prev) => ({ ...prev, [field]: event.target.value }))
  }

  return (
    <main className="min-h-screen bg-ink-900 px-5 py-20 text-white">
      <div className="mx-auto w-full max-w-2xl rounded-[2rem] border border-white/10 bg-slate-950/60 p-8 shadow-neon-sm">
        <h1 className="text-3xl font-bold">Delivery Address</h1>
        <p className="mt-2 text-sm text-white/60">Fill your Address.</p>

        <div className="mt-8 space-y-4">
          <div className="flex items-center justify-between text-base font-semibold text-white">
            <span>Products</span>
            <span>₹{amount.toFixed(2)}</span>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/5 p-4 text-sm text-white/70">
            {items.map((item) => (
              <div key={item.id} className="flex items-center justify-between gap-4 py-3">
                <span>{item.name} × {item.quantity}</span>
                <span>₹{item.subtotal.toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-white/10 pt-4 text-xl font-semibold text-white">
            Total Amount: ₹{amount.toFixed(2)}
          </div>
        </div>

        <div className="mt-8 space-y-3">
          <Input id="fullName" label="Full Name" value={address.fullName} onChange={updateAddress('fullName')} placeholder="Full Name" />
          <Input id="mobile" label="Mobile Number" value={address.mobile} onChange={updateAddress('mobile')} placeholder="Mobile Number" />
          <Input id="pincode" label="Pincode" value={address.pincode} onChange={updateAddress('pincode')} placeholder="Pincode" />
          <div className="grid gap-4 sm:grid-cols-2">
            <Input id="city" label="City" value={address.city} onChange={updateAddress('city')} placeholder="City" />
            <Input id="state" label="State" value={address.state} onChange={updateAddress('state')} placeholder="State" />
          </div>
          <label className="block text-sm text-white/60">House No, Area, Road Name</label>
          <textarea
            value={address.house}
            onChange={updateAddress('house')}
            placeholder="House No, Area, Road Name"
            className="w-full rounded-3xl border border-white/10 bg-ink-900 px-4 py-3 text-white outline-none focus:border-neon"
            rows={4}
          />
        </div>

        <div className="mt-8 space-y-4 border-t border-white/10 pt-6">
          <h2 className="text-xl font-semibold">Select Payment Method</h2>
          <div className="space-y-3 text-white/70">
            {!paymentMethod ? (
              <>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('online')}
                  className="w-full rounded-3xl border border-white/10 bg-white/5 px-4 py-5 text-left text-sm text-white transition hover:border-neon"
                >
                  Online Payment through Scanner
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('cash')}
                  className="w-full rounded-3xl border border-white/10 bg-white/5 px-4 py-5 text-left text-sm text-white transition hover:border-neon"
                >
                  Cash On Delivery
                </button>
              </>
            ) : (
              <div className="rounded-3xl border border-white/10 bg-white/5 p-4 text-sm text-white">
                <div className="flex items-center justify-between gap-4">
                  <span className="font-semibold text-white">
                    {paymentMethod === 'online' ? 'Online Payment through Scanner' : 'Cash On Delivery'}
                  </span>
                  <span className="rounded-full bg-neon/10 px-3 py-1 text-xs uppercase tracking-[0.35em] text-neon">
                    Selected
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setPaymentMethod(null)}
                  className="mt-4 text-sm text-neon underline"
                >
                  Change payment method
                </button>
              </div>
            )}
          </div>

          <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
            <input
              value={coupon}
              onChange={(e) => setCoupon(e.target.value)}
              placeholder="Enter coupon code"
              className="h-12 rounded-3xl border border-white/10 bg-ink-900 px-4 text-white outline-none focus:border-neon"
            />
            <Button type="button" className="min-w-[190px]" onClick={handleCouponApply}>
              Get Offer - 90% off apply AHPS coupon code
            </Button>
          </div>
          {couponMessage && (
            <p className={`text-sm ${couponApplied ? 'text-emerald-300' : 'text-rose-400'}`}>{couponMessage}</p>
          )}
        </div>

        <div className="mt-6">
          <Button type="button" className="w-full" onClick={handlePayNow}>
            Pay Now
          </Button>
        </div>

        {showQr && (
          <div className="mt-8 rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-neon-sm">
            <p className="text-center text-sm uppercase tracking-[0.32em] text-neon">Scan & Pay</p>
            <div className="mx-auto mt-6 grid h-56 w-56 place-items-center rounded-3xl border border-white/10 bg-slate-950">
              <div className="grid h-48 w-48 grid-cols-6 grid-rows-6 gap-1 bg-white p-2">
                {Array.from({ length: 36 }).map((_, index) => (
                  <div key={index} className={`h-full w-full ${index % 3 === 0 ? 'bg-slate-950' : 'bg-black'}`} />
                ))}
              </div>
            </div>
            <p className="mt-6 text-center text-sm text-white/70">UPI ID: enter yoi upi@ybl</p>
            <p className="mt-1 text-center text-sm text-white/70">Total Amount: ₹{payable.toFixed(2)}</p>
            <label className="mt-4 flex items-center gap-3 text-sm text-white/70">
              <input
                type="checkbox"
                checked={paymentDone}
                onChange={(e) => setPaymentDone(e.target.checked)}
                className="h-4 w-4 accent-neon"
              />
              Payment Done
            </label>
            <Button type="button" disabled={loading} className="mt-6 w-full disabled:opacity-50" onClick={handleConfirmOrder}>
              {loading ? 'Processing...' : 'Confirm Order'}
            </Button>
          </div>
        )}
        
        {paymentMethod === 'cash' && !showQr && paymentDone && (
            <Button type="button" disabled={loading} className="mt-6 w-full disabled:opacity-50" onClick={handleConfirmOrder}>
              {loading ? 'Processing...' : 'Confirm Order'}
            </Button>
        )}

        {feedback && <p className="mt-4 rounded-2xl bg-white/5 px-4 py-3 text-sm text-white/80">{feedback}</p>}
      </div>
    </main>
  )
}
