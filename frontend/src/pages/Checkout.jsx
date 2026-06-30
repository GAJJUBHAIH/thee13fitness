import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Input } from '../components/ui/index.js'
import { useAuth } from '../context/AuthContext.jsx'
import { pb } from '../services/pocketbase.js'
import MainLayout from '../layouts/MainLayout.jsx'
import SEO from '../components/SEO.jsx'

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
  const [paymentDone, setPaymentDone] = useState(false)
  const [feedback, setFeedback] = useState('')
  const [loading, setLoading] = useState(false)
  const [appliedDiscountRate, setAppliedDiscountRate] = useState(0)

  // Step 1: Address, Step 2: Order Summary, Step 3: Payment
  const [activeStep, setActiveStep] = useState(1)

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

  const discount = couponApplied ? parseFloat((amount * appliedDiscountRate).toFixed(2)) : 0
  const payable = couponApplied ? parseFloat((amount - discount).toFixed(2)) : amount

  const handleCouponApply = async () => {
    try {
      const result = await pb.collection('coupons').getFirstListItem(`code="${coupon.trim().toUpperCase()}" && active=true`);
      if (result) {
        setCouponApplied(true);
        setAppliedDiscountRate(result.discount_rate);
        setCouponMessage(`Coupon Applied Successfully! ${(result.discount_rate * 100).toFixed(0)}% OFF`);
      }
    } catch (err) {
      setCouponApplied(false);
      setAppliedDiscountRate(0);
      setCouponMessage('Invalid or inactive coupon code.');
    }
  }

  const updateAddress = (field) => (event) => {
    setAddress((prev) => ({ ...prev, [field]: event.target.value }))
  }

  const handleConfirmOrder = async () => {
    if (paymentMethod === 'online' && !paymentDone) {
      setFeedback('Please confirm the payment to complete your order.')
      return
    }
    
    setLoading(true)
    setFeedback('Processing your order...')

    try {
      const orderId = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `ORD-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
      
      const payload = {
        orderId: orderId,
        customerSnapshot: {
          name: address.fullName || user?.displayName || 'Guest User',
          email: user?.email || '',
        },
        addressSnapshot: address,
        phone: address.mobile || '',
        email: user?.email || '',
        products: items.map(item => ({
          id: item.id || item.name,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          subtotal: item.subtotal
        })),
        amount: payable,
        tax: 0,
        discount: discount,
        shipping: 0,
        paymentStatus: paymentMethod === 'cash' ? 'pending' : 'paid',
        deliveryStatus: 'processing',
      };

      if (user?.id) {
        payload.user = user.id;
      }
      
      await pb.collection('orders').create(payload);

      setFeedback('Order confirmed successfully!')
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

  return (
    <MainLayout>
      <SEO title="Checkout - THREE13 Fitness" />
      <div className="min-h-screen bg-ink-900 px-5 pt-28 pb-12 text-white">
        <div className="mx-auto max-w-5xl flex flex-col lg:flex-row gap-6">
          {/* Main Accordion Steps */}
          <div className="flex-1 space-y-4">
            {/* Step 1: Address */}
            <div className={`rounded-xl border ${activeStep === 1 ? 'border-neon shadow-neon-sm' : 'border-white/10'} bg-white/5 overflow-hidden transition-all duration-300`}>
              <div className="flex items-center gap-4 bg-black/40 px-6 py-4 cursor-pointer" onClick={() => activeStep > 1 && setActiveStep(1)}>
                <span className="bg-neon text-ink-900 font-bold w-6 h-6 flex items-center justify-center rounded-sm text-sm">1</span>
                <h2 className="text-lg font-bold text-white uppercase tracking-wider">Delivery Address</h2>
                {activeStep > 1 && (
                  <span className="ml-auto text-sm text-neon font-bold">CHANGE</span>
                )}
              </div>
              {activeStep === 1 && (
                <div className="p-6 bg-transparent border-t border-white/5 space-y-4">
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
                    className="w-full rounded-xl border border-white/10 bg-ink-900 px-4 py-3 text-white outline-none focus:border-neon"
                    rows={3}
                  />
                  <Button type="button" onClick={() => setActiveStep(2)} className="mt-4 bg-neon text-black font-bold h-12 px-8 uppercase tracking-widest hover:bg-neon/90 transition">
                    Deliver Here
                  </Button>
                </div>
              )}
              {activeStep > 1 && address.fullName && (
                <div className="px-16 py-4 text-sm text-white/70 bg-black/20">
                  <span className="font-bold text-white">{address.fullName}</span> {address.house}, {address.city}, {address.state} - {address.pincode}
                </div>
              )}
            </div>

            {/* Step 2: Order Summary */}
            <div className={`rounded-xl border ${activeStep === 2 ? 'border-neon shadow-neon-sm' : 'border-white/10'} bg-white/5 overflow-hidden transition-all duration-300`}>
              <div className="flex items-center gap-4 bg-black/40 px-6 py-4 cursor-pointer" onClick={() => (activeStep > 2 || activeStep === 2) && setActiveStep(2)}>
                <span className={`font-bold w-6 h-6 flex items-center justify-center rounded-sm text-sm ${activeStep >= 2 ? 'bg-neon text-ink-900' : 'bg-white/20 text-white/50'}`}>2</span>
                <h2 className={`text-lg font-bold uppercase tracking-wider ${activeStep >= 2 ? 'text-white' : 'text-white/50'}`}>Order Summary</h2>
                {activeStep > 2 && (
                  <span className="ml-auto text-sm text-neon font-bold">CHANGE</span>
                )}
              </div>
              {activeStep === 2 && (
                <div className="p-6 bg-transparent border-t border-white/5 space-y-4">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-4 border-b border-white/10 pb-4 last:border-0 last:pb-0">
                      <div className="w-16 h-16 bg-black/30 rounded-lg overflow-hidden flex-shrink-0">
                        {item.image ? (
                           <img src={pb.files.getUrl(item, item.image, { thumb: '100x100' })} className="w-full h-full object-cover" />
                        ) : null}
                      </div>
                      <div className="flex-1">
                        <p className="font-bold">{item.name}</p>
                        <p className="text-sm text-white/50 mt-1">Qty: {item.quantity}</p>
                      </div>
                      <div className="text-right font-bold">
                        ₹{item.subtotal.toFixed(2)}
                      </div>
                    </div>
                  ))}
                  <div className="pt-4 flex justify-end">
                    <Button type="button" onClick={() => setActiveStep(3)} className="bg-neon text-black font-bold h-12 px-8 uppercase tracking-widest hover:bg-neon/90 transition">
                      Continue
                    </Button>
                  </div>
                </div>
              )}
              {activeStep > 2 && (
                <div className="px-16 py-4 text-sm text-white/70 bg-black/20">
                  {cart.length} item(s) selected
                </div>
              )}
            </div>

            {/* Step 3: Payment Options */}
            <div className={`rounded-xl border ${activeStep === 3 ? 'border-neon shadow-neon-sm' : 'border-white/10'} bg-white/5 overflow-hidden transition-all duration-300`}>
              <div className="flex items-center gap-4 bg-black/40 px-6 py-4">
                <span className={`font-bold w-6 h-6 flex items-center justify-center rounded-sm text-sm ${activeStep === 3 ? 'bg-neon text-ink-900' : 'bg-white/20 text-white/50'}`}>3</span>
                <h2 className={`text-lg font-bold uppercase tracking-wider ${activeStep === 3 ? 'text-white' : 'text-white/50'}`}>Payment Options</h2>
              </div>
              {activeStep === 3 && (
                <div className="p-6 bg-transparent border-t border-white/5 space-y-6">
                  {/* Coupon Area */}
                  <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
                    <input
                      value={coupon}
                      onChange={(e) => setCoupon(e.target.value)}
                      placeholder="Enter coupon code (try AHPS)"
                      className="h-12 rounded-xl border border-white/10 bg-ink-900 px-4 text-white outline-none focus:border-neon"
                    />
                    <Button type="button" className="min-w-[150px] bg-white/10 hover:bg-white/20 text-white" onClick={handleCouponApply}>
                      Apply
                    </Button>
                  </div>
                  {couponMessage && (
                    <p className={`text-sm ${couponApplied ? 'text-emerald-300' : 'text-rose-400'}`}>{couponMessage}</p>
                  )}

                  <hr className="border-white/10" />

                  {/* Payment Selection */}
                  <div className="space-y-3">
                    <label className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition ${paymentMethod === 'online' ? 'border-neon bg-neon/5' : 'border-white/10 bg-white/5 hover:border-white/30'}`}>
                      <input type="radio" name="payment" checked={paymentMethod === 'online'} onChange={() => setPaymentMethod('online')} className="w-5 h-5 accent-neon" />
                      <span className="font-semibold text-lg">Online Payment (UPI/QR)</span>
                    </label>

                    {paymentMethod === 'online' && (
                      <div className="ml-12 p-6 rounded-xl border border-white/10 bg-slate-950/50 shadow-neon-sm">
                        <p className="text-center text-sm uppercase tracking-[0.32em] text-neon mb-4">Scan & Pay</p>
                        <div className="mx-auto grid h-48 w-48 place-items-center rounded-2xl bg-white p-2">
                           <div className="grid h-full w-full grid-cols-5 grid-rows-5 gap-1">
                             {Array.from({ length: 25 }).map((_, index) => (
                               <div key={index} className={`h-full w-full ${index % 2 === 0 ? 'bg-slate-950' : 'bg-black'}`} />
                             ))}
                           </div>
                        </div>
                        <p className="mt-4 text-center text-sm text-white/70">UPI ID: pay@three13</p>
                        <label className="mt-6 flex items-center justify-center gap-3 text-sm text-white font-bold cursor-pointer">
                          <input type="checkbox" checked={paymentDone} onChange={(e) => setPaymentDone(e.target.checked)} className="h-5 w-5 accent-neon" />
                          I have completed the payment
                        </label>
                      </div>
                    )}

                    <label className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition ${paymentMethod === 'cash' ? 'border-neon bg-neon/5' : 'border-white/10 bg-white/5 hover:border-white/30'}`}>
                      <input type="radio" name="payment" checked={paymentMethod === 'cash'} onChange={() => setPaymentMethod('cash')} className="w-5 h-5 accent-neon" />
                      <span className="font-semibold text-lg">Cash On Delivery</span>
                    </label>
                  </div>

                  <Button 
                    type="button" 
                    disabled={loading || !paymentMethod || (paymentMethod === 'online' && !paymentDone)} 
                    className="w-full mt-4 h-14 text-xl font-bold uppercase tracking-widest disabled:opacity-50 disabled:cursor-not-allowed" 
                    onClick={handleConfirmOrder}
                  >
                    {loading ? 'Processing...' : `Confirm Order • ₹${payable.toFixed(2)}`}
                  </Button>

                  {feedback && <p className="mt-4 rounded-xl bg-white/10 px-4 py-3 text-sm text-white/80 text-center">{feedback}</p>}
                </div>
              )}
            </div>
          </div>

          {/* Right Sidebar: Price Details */}
          <aside className="lg:w-80 shrink-0">
            <div className="glass rounded-xl p-6 shadow-neon-sm border border-white/10 sticky top-28">
              <h2 className="text-lg font-bold text-white/60 uppercase tracking-widest border-b border-white/10 pb-4 mb-4">Price Details</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center text-white/80">
                  <span>Price ({cart.length} items)</span>
                  <span>₹{amount.toFixed(2)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between items-center text-emerald-400">
                    <span>Discount</span>
                    <span>- ₹{discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between items-center text-white/80 border-b border-white/10 pb-4">
                  <span>Delivery Charges</span>
                  <span className="text-emerald-400">Free</span>
                </div>
                <div className="flex justify-between items-center text-xl font-bold py-2 text-white">
                  <span>Payable Amount</span>
                  <span>₹{payable.toFixed(2)}</span>
                </div>
                {discount > 0 && (
                  <div className="text-sm font-bold text-emerald-400 pb-2">
                    You save ₹{discount.toFixed(2)} on this order
                  </div>
                )}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </MainLayout>
  )
}
