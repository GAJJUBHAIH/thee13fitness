import { useEffect, useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import MainLayout from '../layouts/MainLayout.jsx'
import { Button } from '../components/ui/index.js'
import SEO from '../components/SEO.jsx'
import { pb } from '../services/pocketbase.js'

export default function Cart() {
  const navigate = useNavigate()
  const [cart, setCart] = useState([])

  useEffect(() => {
    const savedCart = window.localStorage.getItem('three13_cart')
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart))
      } catch {
        setCart([])
      }
    }
  }, [])

  useEffect(() => {
    window.localStorage.setItem('three13_cart', JSON.stringify(cart))
  }, [cart])

  const removeFromCart = (productId) => {
    setCart((current) => current.filter((item) => item.id !== productId))
  }

  const updateQuantity = (productId, delta) => {
    setCart((current) =>
      current
        .map((item) =>
          item.id === productId ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
        )
        .filter((item) => item.quantity > 0)
    )
  }

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const originalTotal = cart.reduce((sum, item) => sum + (item.original_price || item.price) * item.quantity, 0)
  const discount = originalTotal - total

  const gotoCheckout = () => {
    window.localStorage.setItem('three13_checkout_cart', JSON.stringify(cart))
    navigate('/checkout')
  }

  return (
    <MainLayout>
      <SEO title="Cart - THREE13 Fitness" />
      <div className="min-h-screen bg-ink-900 px-5 pt-28 pb-12 text-white relative">
        <div className="absolute inset-0 gradient-mesh pointer-events-none" />
        <div className="relative mx-auto max-w-5xl flex flex-col lg:flex-row gap-6">
          {/* Cart Items List */}
          <div className="flex-1 space-y-4">
            <div className="glass rounded-xl p-6 shadow-neon-sm border border-white/10">
              <h1 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <svg className="w-7 h-7 text-neon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                Shopping Cart ({cart.reduce((sum, item) => sum + item.quantity, 0)})
              </h1>

              <AnimatePresence mode="popLayout">
                {cart.length > 0 ? (
                  <div className="space-y-6">
                    {cart.map((item) => (
                      <motion.div
                        key={item.id}
                        layout
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 30, height: 0, marginBottom: 0 }}
                        transition={{ duration: 0.35 }}
                        className="flex flex-col sm:flex-row gap-6 border-b border-white/10 pb-6 last:border-0 last:pb-0"
                      >
                        <div className="w-24 h-24 sm:w-32 sm:h-32 bg-black/30 rounded-xl overflow-hidden shrink-0 flex items-center justify-center cursor-pointer group" onClick={() => navigate(`/product/${item.id}`)}>
                          {item.image ? (
                            <img src={pb.files.getUrl(item, item.image, { thumb: '200x200' })} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                          ) : (
                            <span className="text-white/20 text-xs">No Image</span>
                          )}
                        </div>
                        <div className="flex-1 flex flex-col">
                          <div className="flex justify-between items-start">
                            <div>
                              <h2 className="text-lg font-bold text-white hover:text-neon cursor-pointer transition-colors" onClick={() => navigate(`/product/${item.id}`)}>{item.name}</h2>
                              <p className="text-sm text-white/50 uppercase tracking-wider mt-1">{item.category}</p>
                              {item.size && <p className="text-sm text-white/70 mt-1">Size: {item.size}</p>}
                              {item.flavor && <p className="text-sm text-white/70">Flavor: {item.flavor}</p>}
                            </div>
                            <div className="text-right">
                              <span className="text-xl font-bold text-neon block">₹{item.price}</span>
                              {item.original_price > item.price && (
                                <span className="text-sm text-white/40 line-through">₹{item.original_price}</span>
                              )}
                            </div>
                          </div>
                          <div className="mt-auto pt-4 flex justify-between items-center">
                            <div className="flex items-center gap-3">
                              <div className="flex items-center gap-1 border border-white/20 rounded-full px-2 py-1">
                                <button type="button" onClick={() => updateQuantity(item.id, -1)} className="w-8 h-8 rounded-full flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 text-lg transition-all duration-200 active:scale-90">-</button>
                                <motion.span
                                  key={item.quantity}
                                  initial={{ scale: 0.5, opacity: 0 }}
                                  animate={{ scale: 1, opacity: 1 }}
                                  className="w-8 text-center font-bold"
                                >
                                  {item.quantity}
                                </motion.span>
                                <button type="button" onClick={() => updateQuantity(item.id, 1)} className="w-8 h-8 rounded-full flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 text-lg transition-all duration-200 active:scale-90">+</button>
                              </div>
                            </div>
                            <button onClick={() => removeFromCart(item.id)} className="text-sm font-bold text-rose-400 hover:text-rose-300 uppercase tracking-widest transition-all duration-200 hover:scale-105">
                              Remove
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="py-16 flex flex-col items-center justify-center text-white/40 space-y-6"
                  >
                    <motion.div
                      animate={{ y: [0, -8, 0] }}
                      transition={{ duration: 3, repeat: Infinity }}
                    >
                      <svg className="w-24 h-24 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                    </motion.div>
                    <p className="text-xl font-semibold">Your cart is empty!</p>
                    <p className="text-sm">Looks like you haven't added anything yet.</p>
                    <Button onClick={() => navigate('/store')} size="lg">Shop Now</Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Price Details */}
          <AnimatePresence>
            {cart.length > 0 && (
              <motion.aside
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 30 }}
                className="lg:w-80 shrink-0"
              >
                <div className="glass rounded-xl p-6 shadow-neon-sm border border-white/10 sticky top-28">
                  <h2 className="text-lg font-bold text-white/60 uppercase tracking-widest border-b border-white/10 pb-4 mb-4">Price Details</h2>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center text-white/80">
                      <span>Price ({cart.length} item{cart.length !== 1 && 's'})</span>
                      <span>₹{originalTotal.toFixed(2)}</span>
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
                    <div className="flex justify-between items-center text-xl font-bold py-2">
                      <span>Total Amount</span>
                      <motion.span key={total} initial={{ scale: 1.2 }} animate={{ scale: 1 }}>
                        ₹{total.toFixed(2)}
                      </motion.span>
                    </div>
                    {discount > 0 && (
                      <div className="text-sm font-bold text-emerald-400 pb-2">
                        You will save ₹{discount.toFixed(2)} on this order
                      </div>
                    )}
                    <Button onClick={gotoCheckout} size="lg" variant="solid" className="w-full text-lg font-black uppercase tracking-widest">
                      Place Order
                    </Button>
                  </div>
                </div>
              </motion.aside>
            )}
          </AnimatePresence>
        </div>
      </div>
    </MainLayout>
  )
}
