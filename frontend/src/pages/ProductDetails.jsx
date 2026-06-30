import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import MainLayout from '../layouts/MainLayout.jsx'
import { Button } from '../components/ui/index.js'
import SEO from '../components/SEO.jsx'
import { pb } from '../services/pocketbase.js'

export default function ProductDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedFlavor, setSelectedFlavor] = useState('')
  const [selectedSize, setSelectedSize] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [cartFeedback, setCartFeedback] = useState('')

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await pb.collection('products').getOne(id)
        setProduct(res)
        if (res.flavors && res.flavors.length > 0) setSelectedFlavor(res.flavors[0])
        if (res.sizes && res.sizes.length > 0) setSelectedSize(res.sizes[0])
      } catch (err) {
        console.error(err)
        setError(true)
      } finally {
        setLoading(false)
      }
    }
    fetchProduct()
  }, [id])

  const handleAddToCart = () => {
    if (!product.active) return
    const savedCart = window.localStorage.getItem('three13_cart')
    let cart = []
    if (savedCart) {
      try { cart = JSON.parse(savedCart) } catch (e) {}
    }
    
    // Check if same item with same variant exists
    const cartItemId = `${product.id}-${selectedFlavor}-${selectedSize}`
    const existingIndex = cart.findIndex(item => item.cartItemId === cartItemId)
    
    if (existingIndex >= 0) {
      cart[existingIndex].quantity += quantity
    } else {
      cart.push({
        ...product,
        cartItemId,
        selectedFlavor,
        selectedSize,
        quantity
      })
    }
    
    window.localStorage.setItem('three13_cart', JSON.stringify(cart))
    
    // dispatch an event or just show feedback locally since this is a separate page
    setCartFeedback('Added to cart successfully!')
    setTimeout(() => setCartFeedback(''), 3000)
    
    // Optionally redirect to store to see cart
    navigate('/store')
  }

  const handleBuyNow = () => {
    if (!product.active) return
    const cartItem = {
      ...product,
      cartItemId: `${product.id}-${selectedFlavor}-${selectedSize}`,
      selectedFlavor,
      selectedSize,
      quantity
    }
    window.localStorage.setItem('three13_checkout_cart', JSON.stringify([cartItem]))
    navigate('/checkout')
  }

  if (loading) {
    return (
      <MainLayout>
        <div className="min-h-screen bg-ink-900 pt-32 pb-12 text-white flex justify-center items-center">
          <p className="text-white/50 text-xl font-bold animate-pulse">Loading product...</p>
        </div>
      </MainLayout>
    )
  }

  if (error || !product) {
    return (
      <MainLayout>
        <div className="min-h-screen bg-ink-900 pt-32 pb-12 text-white flex justify-center items-center">
          <div className="text-center space-y-4">
            <h1 className="text-3xl font-bold text-rose-500">Product Not Found</h1>
            <Button onClick={() => navigate('/store')}>Back to Store</Button>
          </div>
        </div>
      </MainLayout>
    )
  }

  const allImages = []
  if (product.image) allImages.push(product.image)
  if (product.images && Array.isArray(product.images)) {
    product.images.forEach(img => {
      if (img !== product.image) allImages.push(img)
    })
  }

  const discountPercent = product.original_price && product.original_price > product.price 
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100) 
    : 0

  return (
    <MainLayout>
      <SEO title={`${product.name} - THREE13 Fitness`} description={product.description} />
      <div className="min-h-screen bg-ink-900 px-5 pt-28 pb-20 text-white selection:bg-neon selection:text-ink-900">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-center gap-2 text-sm text-white/50 mb-8 font-medium">
            <button onClick={() => navigate('/store')} className="hover:text-neon transition">Store</button>
            <span>/</span>
            <span className="text-white/80">{product.category}</span>
            <span>/</span>
            <span className="text-white line-clamp-1">{product.name}</span>
          </div>

          <div className="flex flex-col lg:flex-row gap-12 bg-white/[0.02] border border-white/5 p-6 md:p-10 rounded-3xl shadow-2xl backdrop-blur-md">
            
            {/* Left Column: Images */}
            <div className="w-full lg:w-2/5 flex flex-col-reverse md:flex-row gap-4">
              <div className="flex md:flex-col gap-3 overflow-auto hide-scrollbar w-full md:w-24 shrink-0">
                {allImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`shrink-0 w-20 h-20 md:w-full md:h-24 rounded-xl border-2 overflow-hidden transition-all duration-300 ${
                      selectedImage === idx ? 'border-neon ring-4 ring-neon/20 shadow-neon-sm' : 'border-white/10 hover:border-white/30 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={pb.files.getUrl(product, img, { thumb: '100x100' })}
                      alt={`Thumbnail ${idx + 1}`}
                      className="w-full h-full object-cover bg-black/40"
                    />
                  </button>
                ))}
              </div>
              <div className="flex-1 bg-black/20 border border-white/5 rounded-2xl flex items-center justify-center p-6 aspect-square md:aspect-auto relative overflow-hidden group">
                {allImages.length > 0 ? (
                  <img
                    src={pb.files.getUrl(product, allImages[selectedImage])}
                    alt={product.name}
                    className="w-full h-full object-contain drop-shadow-2xl group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                ) : (
                  <span className="text-white/20 font-medium">No Image</span>
                )}
                {!product.active && (
                  <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center">
                    <span className="text-3xl font-black text-white tracking-widest uppercase rotate-[-15deg] border-4 border-white px-6 py-2 rounded-xl">Sold Out</span>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Details */}
            <div className="w-full lg:w-3/5 flex flex-col">
              <span className="inline-block px-3 py-1 bg-white/5 border border-white/10 text-neon font-bold text-xs uppercase tracking-widest rounded-full w-fit mb-4">
                {product.category}
              </span>
              <h1 className="text-4xl md:text-5xl font-black font-display tracking-tight leading-tight mb-4">{product.name}</h1>
              
              {/* Ratings */}
              <div className="flex items-center gap-3 mb-6">
                <div className="flex items-center bg-green-500/10 text-green-400 px-2.5 py-1 rounded-lg border border-green-500/20 font-bold text-sm">
                  {product.rating || '4.8'} 
                  <svg className="w-4 h-4 ml-1 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                </div>
                <span className="text-white/40 text-sm font-medium">1,245 Ratings & 320 Reviews</span>
              </div>

              {/* Price */}
              <div className="mb-8">
                <div className="flex items-end gap-4 mb-2">
                  <span className="text-5xl font-black text-neon tracking-tighter">₹{product.price}</span>
                  {product.original_price && product.original_price > product.price && (
                    <span className="text-2xl text-white/40 line-through font-bold mb-1">₹{product.original_price}</span>
                  )}
                  {discountPercent > 0 && (
                    <span className="text-lg text-rose-400 font-black mb-1.5">{discountPercent}% OFF</span>
                  )}
                </div>
                <p className="text-white/50 text-sm font-medium">Inclusive of all taxes</p>
              </div>

              {/* Variations */}
              {product.flavors && product.flavors.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-sm font-bold text-white/80 uppercase tracking-widest mb-3">Flavor</h3>
                  <div className="flex flex-wrap gap-2">
                    {product.flavors.map(flavor => (
                      <button
                        key={flavor}
                        onClick={() => setSelectedFlavor(flavor)}
                        className={`px-4 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 border-2 ${
                          selectedFlavor === flavor 
                            ? 'bg-neon/10 border-neon text-neon shadow-neon-sm' 
                            : 'bg-white/5 border-transparent text-white/70 hover:bg-white/10 hover:text-white'
                        }`}
                      >
                        {flavor}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {product.sizes && product.sizes.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-sm font-bold text-white/80 uppercase tracking-widest mb-3">Size</h3>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map(size => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`px-4 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 border-2 ${
                          selectedSize === size 
                            ? 'bg-neon/10 border-neon text-neon shadow-neon-sm' 
                            : 'bg-white/5 border-transparent text-white/70 hover:bg-white/10 hover:text-white'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center gap-4 mt-auto border-t border-white/5 pt-8">
                <div className="flex items-center justify-between bg-black/40 border border-white/10 rounded-2xl p-2 w-36 shrink-0 h-[60px]">
                  <button 
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-white/60 hover:bg-white/10 hover:text-white transition"
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4"></path></svg>
                  </button>
                  <span className="font-bold text-lg select-none">{quantity}</span>
                  <button 
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-white/60 hover:bg-white/10 hover:text-white transition"
                    onClick={() => setQuantity(q => q + 1)}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                  </button>
                </div>

                <Button 
                  onClick={handleAddToCart} 
                  disabled={!product.active}
                  className="flex-1 h-[60px] text-lg font-bold bg-white text-ink-900 hover:bg-gray-200"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                  ADD TO CART
                </Button>

                <Button 
                  onClick={handleBuyNow} 
                  disabled={!product.active}
                  className="flex-1 h-[60px] text-lg font-bold shadow-neon-sm"
                >
                  BUY NOW
                </Button>
              </div>

            </div>
          </div>
          
          {/* Description Section */}
          <div className="mt-12 bg-white/[0.02] border border-white/5 rounded-3xl p-8 md:p-12">
            <h2 className="text-2xl font-bold font-display uppercase tracking-wider border-b border-white/10 pb-4 mb-6">Product Description</h2>
            <div className="prose prose-invert max-w-none text-white/70 leading-relaxed text-lg" dangerouslySetInnerHTML={{ __html: product.description.replace(/\n/g, '<br/>') }} />
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 pt-12 border-t border-white/10">
              <div className="flex gap-4 items-start">
                <div className="w-12 h-12 bg-neon/10 text-neon rounded-2xl flex items-center justify-center shrink-0">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                </div>
                <div>
                  <h4 className="font-bold text-white mb-1">100% Authentic</h4>
                  <p className="text-sm text-white/50">Directly from the brand</p>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <div className="w-12 h-12 bg-neon/10 text-neon rounded-2xl flex items-center justify-center shrink-0">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                </div>
                <div>
                  <h4 className="font-bold text-white mb-1">Fast Delivery</h4>
                  <p className="text-sm text-white/50">Within 2-4 business days</p>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <div className="w-12 h-12 bg-neon/10 text-neon rounded-2xl flex items-center justify-center shrink-0">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
                </div>
                <div>
                  <h4 className="font-bold text-white mb-1">Easy Returns</h4>
                  <p className="text-sm text-white/50">7 days return policy</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
