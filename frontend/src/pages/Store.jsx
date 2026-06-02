import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../components/ui/index.js'
import { payWithRazorpay } from '../services/payment.js'
import { useAuth } from '../context/AuthContext.jsx'

const PRODUCTS = [
  {
    id: 'premium-barbell-set',
    name: 'Premium Barbell Set',
    category: 'Strength',
    description: 'Heavy-duty barbell set built for serious lifting.',
    price: 2999,
    image: `${import.meta.env.BASE_URL}assets/store/barbell.jpg`,
    soldOut: false,
    icon: '🏋️',
  },
  {
    id: 'resistance-band-kit',
    name: 'Resistance Band Kit',
    category: 'Accessories',
    description: 'Durable resistance bands for every level of training.',
    price: 899,
    image: `${import.meta.env.BASE_URL}assets/store/resistance-bands.jpg`,
    soldOut: false,
    icon: '💪',
  },
  {
    id: 'whey-protein-powder',
    name: 'Whey Protein Powder',
    category: 'Nutrition',
    description: 'High-protein formula for muscle recovery.',
    price: 1499,
    image: `${import.meta.env.BASE_URL}assets/store/protein-powder.jpg`,
    soldOut: true,
    icon: '🥤',
  },
  {
    id: 'shaker-bottle',
    name: 'Premium Shaker Bottle',
    category: 'Hydration',
    description: 'Leak-proof shaker for pre-workout and protein mixes.',
    price: 749,
    image: `${import.meta.env.BASE_URL}assets/store/shaker-bottle.jpg`,
    soldOut: false,
    icon: '💧',
  },
  {
    id: 'yoga-training-mat',
    name: 'Yoga & Training Mat',
    category: 'Recovery',
    description: 'Non-slip mat for stretching, yoga, and floor workouts.',
    price: 1299,
    image: `${import.meta.env.BASE_URL}assets/store/yoga-mat.jpg`,
    soldOut: false,
    icon: '🧘',
  },
  {
    id: 'kettlebell-set',
    name: 'Cast Iron Kettlebells',
    category: 'Strength',
    description: 'Premium kettlebells for swings, squats and full-body training.',
    price: 3999,
    image: `${import.meta.env.BASE_URL}assets/store/kettlebells.jpg`,
    soldOut: false,
    icon: '🏋️',
  },
  {
    id: 'gym-bag',
    name: 'Gym Duffle Bag',
    category: 'Apparel',
    description: 'Water-resistant gym bag with compartments for shoes and gear.',
    price: 1199,
    image: `${import.meta.env.BASE_URL}assets/store/gym-bag.jpg`,
    soldOut: false,
    icon: '🎒',
  },
  {
    id: 'training-shoes',
    name: 'Training Shoes',
    category: 'Apparel',
    description: 'Lightweight gym shoes for cardio, lifting and training sessions.',
    price: 2499,
    image: `${import.meta.env.BASE_URL}assets/store/shoes.jpg`,
    soldOut: false,
    icon: '👟',
  },
  {
    id: 'protein-bar',
    name: 'Protein Snack Bars',
    category: 'Nutrition',
    description: 'High-protein bars for on-the-go energy and recovery.',
    price: 399,
    image: `${import.meta.env.BASE_URL}assets/store/protein-bar.jpg`,
    soldOut: false,
    icon: '🍫',
  },
  {
    id: 'gym-poster',
    name: 'Motivational Gym Poster',
    category: 'Gear',
    description: 'Premium wall poster to keep your workout space inspired.',
    price: 599,
    image: `${import.meta.env.BASE_URL}assets/store/gym-poster.png`,
    soldOut: false,
    icon: '🖼️',
  },
]

const CATEGORIES = ['All', 'Strength', 'Accessories', 'Nutrition', 'Hydration', 'Recovery', 'Apparel', 'Gear']

export default function Store() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [cart, setCart] = useState([])
  const [category, setCategory] = useState('All')
  const [name, setName] = useState(user?.displayName || '')
  const [email, setEmail] = useState(user?.email || '')
  const [feedback, setFeedback] = useState('')
  const [loading, setLoading] = useState(false)
  const [galleryImages, setGalleryImages] = useState([])
  const [uploadError, setUploadError] = useState('')

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

  useEffect(() => {
    if (!user) {
      setGalleryImages([])
      return
    }
    const saved = window.localStorage.getItem(`three13_gallery_${user.uid || user.email}`)
    if (saved) {
      try {
        setGalleryImages(JSON.parse(saved))
      } catch {
        setGalleryImages([])
      }
    } else {
      setGalleryImages([])
    }
  }, [user])

  useEffect(() => {
    if (!user) return
    window.localStorage.setItem(
      `three13_gallery_${user.uid || user.email}`,
      JSON.stringify(galleryImages)
    )
  }, [galleryImages, user])

  const filteredProducts = useMemo(
    () => (category === 'All' ? PRODUCTS : PRODUCTS.filter((product) => product.category === category)),
    [category]
  )

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0)

  const addToCart = (product) => {
    if (product.soldOut) {
      setFeedback('Sorry, this item is sold out.')
      return
    }
    setFeedback('')
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

  const gotoCheckout = () => {
    if (!cart.length) {
      setFeedback('Add at least one product before proceeding to checkout.')
      return
    }
    window.localStorage.setItem('three13_checkout_cart', JSON.stringify(cart))
    navigate('/checkout')
  }

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

  const handleImageUpload = (event) => {
    if (!user) {
      setUploadError('Please log in to upload images.')
      return
    }
    const file = event.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setUploadError('Only image files are allowed.')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      setUploadError('Image size must be less than 5MB.')
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      setGalleryImages((current) => [
        ...current,
        {
          id: `${file.name}-${Date.now()}`,
          src: reader.result,
          name: file.name,
        },
      ])
      setUploadError('')
      setFeedback('Image uploaded successfully!')
      setTimeout(() => setFeedback(''), 3000)
    }
    reader.onerror = () => {
      setUploadError('Failed to read file. Please try again.')
    }
    reader.readAsDataURL(file)
  }

  const removeGalleryImage = (id) => {
    setGalleryImages((current) => current.filter((image) => image.id !== id))
  }

  const handleCheckout = async (singleProduct = null) => {
    const orderItems = singleProduct ? [{ ...singleProduct, quantity: 1 }] : cart
    if (!orderItems.length) {
      setFeedback('Please add at least one item to the cart.')
      return
    }
    if (!name || !email) {
      setFeedback('Enter your name and email before checkout.')
      return
    }

    setLoading(true)
    setFeedback('')

    const amount = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
    const plan = orderItems.map((item) => `${item.name} x${item.quantity}`).join(', ')

    await payWithRazorpay({
      amount,
      name,
      email,
      plan,
      onSuccess: () => {
        setLoading(false)
        if (!singleProduct) setCart([])
        setFeedback('Payment successful! Your gym items are confirmed.')
      },
      onError: (message) => {
        setLoading(false)
        setFeedback(message || 'Payment failed. Please try again.')
      },
    })
  }

  return (
    <main className="min-h-screen bg-ink-900 px-5 py-24 text-white">
      <div className="mx-auto max-w-7xl space-y-10">
        <section className="glass rounded-[2rem] border border-white/10 p-8 shadow-neon-sm">
          <div className="grid gap-8 lg:grid-cols-[1.6fr_1fr] lg:items-center">
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-neon">Gym Store</p>
              <h1 className="mt-4 text-4xl font-display font-black sm:text-5xl">Shop premium gym essentials built for performance.</h1>
              <p className="mt-4 max-w-2xl text-sm text-white/70">
                Browse gym gear, recovery tools, and hydration accessories. Add to cart, adjust quantities, and pay safely with Razorpay.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                {CATEGORIES.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setCategory(item)}
                    className={`rounded-full border px-4 py-2 text-sm font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-neon ${
                      category === item
                        ? 'border-neon bg-neon text-ink-900 shadow-neon-sm'
                        : 'border-white/15 text-white/70 hover:border-neon/60 hover:text-neon'
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-neon-sm">
              <p className="text-sm uppercase tracking-[0.35em] text-neon">Quick cart</p>
              <div className="mt-5 space-y-4 text-sm text-white/70">
                <div className="flex items-center justify-between gap-4 rounded-3xl bg-white/5 px-4 py-4">
                  <div>
                    <p className="font-semibold text-white">Items</p>
                    <p className="text-xs text-white/50">Products in cart</p>
                  </div>
                  <span className="rounded-full bg-neon/10 px-3 py-1 text-sm text-neon">{itemCount}</span>
                </div>
                <div className="flex items-center justify-between gap-4 rounded-3xl bg-white/5 px-4 py-4">
                  <div>
                    <p className="font-semibold text-white">Total</p>
                    <p className="text-xs text-white/50">Secure checkout amount</p>
                  </div>
                  <span className="text-xl font-bold text-neon">₹{total}</span>
                </div>
                <Button onClick={() => handleCheckout()} variant="solid" className="w-full" disabled={loading || !cart.length}>
                  {loading ? 'Processing...' : 'Checkout Cart'}
                </Button>
                <Button onClick={gotoCheckout} variant="ghost" className="w-full mt-3" disabled={!cart.length}>
                  Continue to Checkout
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-[2fr_1fr]">
          <div className="space-y-6">
            <div className="grid gap-5 md:grid-cols-2">
              {filteredProducts.map((product) => (
                <article key={product.id} className="glass rounded-3xl border border-white/10 p-6 shadow-neon-sm transition hover:-translate-y-1">
                  <div className="relative overflow-hidden rounded-3xl bg-white/5 shadow-neon-sm">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-52 w-full object-cover"
                    />
                    {product.soldOut && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/60 text-center text-xl font-bold uppercase tracking-[0.25em] text-white">
                        Sold Out
                      </div>
                    )}
                  </div>
                  <div className="mt-4 flex items-center justify-between gap-4">
                    <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.35em] text-neutral-300">
                      {product.category}
                    </span>
                    <div className="grid h-14 w-14 place-items-center rounded-3xl bg-white/5 text-2xl shadow-neon-sm">
                      {product.icon}
                    </div>
                  </div>
                  <h2 className="mt-6 text-xl font-semibold text-white">{product.name}</h2>
                  <p className="mt-3 text-sm text-white/60">{product.description}</p>
                  <div className="mt-6 flex items-center justify-between gap-4">
                    <div>
                      <p className="text-2xl font-bold text-neon">₹{product.price}</p>
                      <p className="text-xs text-white/50">Fast shipping available</p>
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={() => addToCart(product)} disabled={loading || product.soldOut} className="whitespace-nowrap">
                        Add to Cart
                      </Button>
                      <Button onClick={() => handleCheckout(product)} variant="ghost" className="whitespace-nowrap" disabled={loading || product.soldOut}>
                        Buy Now
                      </Button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <aside className="space-y-6">
            <section className="glass rounded-3xl border border-white/10 p-6 shadow-neon-sm">
              <h3 className="text-xl font-semibold text-white">Your cart</h3>
              {cart.length ? (
                <div className="mt-5 space-y-4">
                  {cart.map((item) => (
                    <div key={item.id} className="rounded-3xl border border-white/10 bg-white/5 p-4">
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <p className="font-semibold text-white">{item.name}</p>
                          <p className="text-sm text-white/50">₹{item.price} × {item.quantity}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, -1)}
                            className="rounded-full border border-white/10 px-3 py-1 text-white/80 hover:border-neon"
                          >
                            -
                          </button>
                          <span className="w-8 text-center text-sm text-white">{item.quantity}</span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, 1)}
                            className="rounded-full border border-white/10 px-3 py-1 text-white/80 hover:border-neon"
                          >
                            +
                          </button>
                        </div>
                      </div>
                      <div className="mt-4 flex items-center justify-between gap-4">
                        <p className="text-sm text-white/60">Subtotal: ₹{item.price * item.quantity}</p>
                        <Button variant="ghost" onClick={() => removeFromCart(item.id)}>
                          Remove
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="mt-5 text-sm text-white/60">Start adding items to see them here.</p>
              )}
            </section>

            <section className="glass rounded-3xl border border-white/10 p-6 shadow-neon-sm">
              <h3 className="text-xl font-semibold text-white">Customer info</h3>
              <div className="mt-5 grid gap-4 text-sm text-white/60">
                <label className="grid gap-2">
                  Name
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="rounded-2xl border border-white/10 bg-ink-900 px-4 py-3 text-white outline-none focus:border-neon"
                    placeholder="Your full name"
                  />
                </label>
                <label className="grid gap-2">
                  Email
                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="rounded-2xl border border-white/10 bg-ink-900 px-4 py-3 text-white outline-none focus:border-neon"
                    placeholder="you@example.com"
                    type="email"
                  />
                </label>
                <Button onClick={() => handleCheckout()} variant="solid" className="w-full" disabled={loading || !cart.length}>
                  {loading ? 'Processing...' : 'Checkout Cart'}
                </Button>
                {feedback && <p className="text-sm text-white/70">{feedback}</p>}
              </div>
            </section>

            <section className="glass rounded-3xl border border-white/10 p-6 shadow-neon-sm">
              <h3 className="text-xl font-semibold text-white">Upload Gallery</h3>
              <p className="mt-2 text-sm text-white/60">Upload your image after login and view it here.</p>
              {!user ? (
                <p className="mt-4 text-sm text-white/70">Please <span className="text-neon">login</span> to upload images.</p>
              ) : (
                <div className="mt-5 space-y-4 text-sm text-white/60">
                  <label className="block text-sm text-white/70">Upload image</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="w-full rounded-2xl border border-white/10 bg-ink-900 px-4 py-3 text-white outline-none file:cursor-pointer file:rounded-full file:border-0 file:bg-neon file:px-4 file:py-2 file:text-ink-900"
                  />
                  {uploadError && <p className="text-sm text-rose-400">{uploadError}</p>}
                  {galleryImages.length ? (
                    <div className="grid gap-3 sm:grid-cols-2">
                      {galleryImages.map((image) => (
                        <div key={image.id} className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5">
                          <img src={image.src} alt={image.name} className="h-36 w-full object-cover" />
                          <button
                            type="button"
                            onClick={() => removeGalleryImage(image.id)}
                            className="absolute right-3 top-3 rounded-full bg-black/70 px-3 py-1 text-xs text-white"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-white/50">No uploaded images yet. Add one to save it to your gallery.</p>
                  )}
                </div>
              )}
            </section>
          </aside>
        </section>
      </div>
    </main>
  )
}
