import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import MainLayout from '../layouts/MainLayout.jsx'
import { Button } from '../components/ui/index.js'
import { SkeletonCard } from '../components/ui/Skeleton.jsx'
import { Reviews } from '../components/sections/index.js'
import { useAuth } from '../context/AuthContext.jsx'
import SEO from '../components/SEO.jsx'
import { pb } from '../services/pocketbase.js'

const CATEGORIES = ['All', 'Supplements', 'Gear', 'Merch']

const cardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: (i) => ({
    opacity: 1, y: 0, scale: 1,
    transition: { duration: 0.5, delay: i * 0.08, ease: [0.25, 0.46, 0.45, 0.94] }
  }),
}

export default function Store() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [cart, setCart] = useState([])
  const [products, setProducts] = useState([])
  const [category, setCategory] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [feedback, setFeedback] = useState('')
  const [loading, setLoading] = useState(true)
  const [addedId, setAddedId] = useState(null)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await pb.collection('products').getFullList({ sort: '-created' })
        setProducts(res)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [])

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

  const filteredProducts = useMemo(
    () => {
      let filtered = category === 'All' ? products : products.filter((p) => p.category === category);
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        filtered = filtered.filter(p => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
      }
      return filtered;
    },
    [category, products, searchQuery]
  )

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0)

  const addToCart = (product) => {
    if (!product.active) {
      setFeedback('Sorry, this item is sold out.')
      return
    }
    setFeedback('')
    setAddedId(product.id)
    setTimeout(() => setAddedId(null), 1200)
    setCart((current) => {
      const existing = current.find((item) => item.id === product.id)
      if (existing) {
        return current.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        )
      }
      return [...current, { ...product, quantity: 1 }]
    })
  }

  const navigateToCart = () => {
    navigate('/cart')
  }

  const buyNow = (product) => {
    if (!product.active) return;
    window.localStorage.setItem('three13_checkout_cart', JSON.stringify([{ ...product, quantity: 1 }]))
    navigate('/checkout')
  }

  return (
    <MainLayout>
      <SEO title="Store - THREE13 Fitness" description="Shop premium gym gear, supplements, and fitness accessories." />
      <div className="min-h-screen bg-ink-900 px-5 pt-24 pb-12 text-white relative">
        {/* Ambient gradient background */}
        <div className="absolute inset-0 gradient-mesh pointer-events-none" />

        {/* Store Header (Flipkart Style) */}
        <div className="relative mx-auto max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-4 bg-white/5 border border-white/10 rounded-2xl p-4 shadow-neon-sm mb-8 backdrop-blur-sm">
          <div className="flex-1 w-full relative">
            <input
              type="text"
              placeholder="Search for supplements, gear, and more..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-ink-900 border border-white/20 rounded-xl px-4 py-3 pl-11 text-white focus:outline-none focus:border-neon transition-all duration-300 focus:shadow-neon-sm"
            />
            <svg className="w-5 h-5 absolute left-4 top-3.5 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
          </div>
          <button
            onClick={navigateToCart}
            className="flex items-center gap-2 bg-neon text-ink-900 font-bold px-6 py-3 rounded-xl hover:shadow-neon transition-all duration-300 shrink-0 relative active:scale-95"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
            <span>Cart</span>
            {itemCount > 0 && (
              <motion.span
                key={itemCount}
                initial={{ scale: 0.5 }}
                animate={{ scale: 1 }}
                className="absolute -top-2 -right-2 bg-rose-500 text-white text-xs w-6 h-6 flex items-center justify-center rounded-full border-2 border-ink-900 font-bold"
              >
                {itemCount}
              </motion.span>
            )}
          </button>
        </div>

        <div className="relative mx-auto max-w-7xl flex flex-col md:flex-row gap-8">
          {/* Sidebar / Filters */}
          <aside className="md:w-64 shrink-0 space-y-6 hidden md:block mt-8">
            <div className="glass rounded-2xl p-6 shadow-neon-sm border border-white/10 sticky top-24">
              <h2 className="text-xl font-bold uppercase tracking-wider text-neon mb-4">Categories</h2>
              <div className="space-y-2 flex flex-col">
                {CATEGORIES.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setCategory(item)}
                    className={`text-left px-4 py-2.5 rounded-xl transition-all duration-300 font-medium ${
                      category === item
                        ? 'bg-neon/10 text-neon border border-neon/30 shadow-neon-sm'
                        : 'text-white/60 hover:bg-white/5 hover:text-white hover:translate-x-1'
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1 space-y-8">
            <header className="flex flex-col gap-2">
              <h1 className="text-3xl font-display font-black">Gym Store</h1>
              <p className="text-sm text-white/60">Equip yourself with premium gear and supplements.</p>

              {/* Mobile categories */}
              <div className="md:hidden mt-4 flex overflow-x-auto gap-2 pb-2 hide-scrollbar">
                {CATEGORIES.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setCategory(item)}
                    className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
                      category === item
                        ? 'bg-neon text-ink-900 shadow-neon-sm'
                        : 'bg-white/5 text-white/70 border border-white/10 hover:border-neon/30'
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </header>

            {/* Feedback toast */}
            <AnimatePresence>
              {addedId && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="fixed top-20 right-6 z-50 bg-neon text-ink-900 font-bold px-5 py-3 rounded-xl shadow-neon-sm"
                >
                  ✓ Added to cart!
                </motion.div>
              )}
            </AnimatePresence>

            {loading ? (
              <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="grid place-items-center h-64 text-white/50">
                <div className="text-center space-y-3">
                  <svg className="w-16 h-16 mx-auto opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                  <p>No products available in this category.</p>
                </div>
              </div>
            ) : (
              <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {filteredProducts.map((product, i) => (
                  <motion.article
                    key={product.id}
                    custom={i}
                    variants={cardVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: '-50px' }}
                    onClick={() => navigate(`/product/${product.id}`)}
                    className="cursor-pointer glass rounded-2xl border border-white/10 p-5 shadow-soft-md flex flex-col group relative hover:border-neon/50 transition-all duration-500 overflow-hidden bg-white/[0.02] hover:bg-white/[0.04] animated-border"
                  >
                    <div className="relative overflow-hidden rounded-xl bg-black/50 aspect-square flex items-center justify-center">
                      {product.image ? (
                        <img
                          src={pb.files.getUrl(product, product.image, { thumb: '400x400' })}
                          alt={product.name}
                          loading="lazy"
                          className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                        />
                      ) : (
                        <div className="text-white/20 text-sm">No Image</div>
                      )}
                      {!product.active && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/60 text-center text-lg font-bold uppercase tracking-widest text-white backdrop-blur-sm">
                          Sold Out
                        </div>
                      )}
                      {product.active && (
                        <button
                          onClick={(e) => { e.stopPropagation(); addToCart(product); }}
                          className="absolute bottom-4 right-4 bg-neon text-ink-900 w-11 h-11 rounded-full flex items-center justify-center shadow-neon-sm opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 z-10 hover:scale-110 active:scale-90"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                        </button>
                      )}
                    </div>
                    <div className="mt-4 flex flex-col flex-1">
                      <span className="text-[10px] uppercase tracking-widest text-white/40 font-semibold mb-1">
                        {product.category}
                      </span>
                      <h2 className="text-lg font-bold text-white mb-2 line-clamp-1" title={product.name}>{product.name}</h2>
                      <div className="mt-auto flex items-end justify-between">
                        <div className="flex flex-col">
                          <span className="text-2xl font-black text-neon">₹{product.price}</span>
                        </div>
                        <Button onClick={(e) => { e.stopPropagation(); buyNow(product); }} variant="ghost" className="text-sm px-3 py-1.5 h-auto text-white/70 hover:text-white z-10" disabled={!product.active}>
                          Buy Now
                        </Button>
                      </div>
                    </div>
                  </motion.article>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <Reviews />
    </MainLayout>
  )
}
