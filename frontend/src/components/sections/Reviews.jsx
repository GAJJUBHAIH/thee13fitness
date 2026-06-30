import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { SectionHeader, Button } from '../ui/index.js'
import { useAuth } from '../../context/AuthContext.jsx'
import { pb, isPocketBaseEnabled } from '../../services/pocketbase.js'

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } }
}

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
}

export default function Reviews() {
  const { user } = useAuth()
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' })
  const [submitting, setSubmitting] = useState(false)
  const [hoverRating, setHoverRating] = useState(0)

  const fetchReviews = async () => {
    if (!isPocketBaseEnabled) return setLoading(false)
    try {
      const records = await pb.collection('reviews').getList(1, 10, { sort: '-created', expand: 'user' })
      setReviews(records.items)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchReviews()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!user || !isPocketBaseEnabled) return
    setSubmitting(true)
    try {
      await pb.collection('reviews').create({
        user: user.id,
        rating: Number(newReview.rating),
        comment: newReview.comment
      })
      setNewReview({ rating: 5, comment: '' })
      await fetchReviews()
    } catch (e) {
      console.error(e)
      alert('Failed to post review')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section id="reviews" className="relative mx-auto max-w-7xl px-5 py-24 border-t border-white/10">
      <div className="absolute inset-0 gradient-radial-primary pointer-events-none" />
      <SectionHeader
        eyebrow="Testimonials"
        title="Customer Reviews"
        subtitle="See what our community has to say about their experience."
      />

      <div className="grid md:grid-cols-2 gap-10 relative">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {loading ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="p-5 rounded-2xl glass border border-white/10 space-y-3">
                  <div className="skeleton h-4 w-24" />
                  <div className="skeleton h-3 w-full" />
                  <div className="skeleton h-3 w-3/4" />
                </div>
              ))}
            </div>
          ) : reviews.length === 0 ? (
            <p className="text-white/60 italic">No reviews yet. Be the first to share your experience!</p>
          ) : (
            <div className="space-y-4">
              {reviews.map(review => (
                <motion.div key={review.id} variants={cardVariants} className="p-5 rounded-2xl glass border border-white/10 hover:border-neon/30 transition-all duration-300">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-neon/20 flex items-center justify-center text-neon font-bold text-sm border border-neon/30">
                        {(review.expand?.user?.name || 'A')[0].toUpperCase()}
                      </div>
                      <p className="font-bold text-white">{review.expand?.user?.name || 'Anonymous'}</p>
                    </div>
                    <div className="flex text-neon gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <svg key={i} className={`w-4 h-4 ${i < review.rating ? 'text-neon' : 'text-white/20'}`} fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                  <p className="text-white/80 text-sm leading-relaxed">{review.comment}</p>
                  <p className="text-[10px] text-white/40 mt-3">{new Date(review.created).toLocaleDateString()}</p>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        <div>
          <div className="p-6 rounded-3xl glass border border-white/10 sticky top-24">
            <h3 className="text-xl font-bold neon-text mb-4">Write a Review</h3>
            {user ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm text-white/60 mb-2">Rating</label>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map(star => (
                      <button
                        type="button"
                        key={star}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        onClick={() => setNewReview({ ...newReview, rating: star })}
                        className="transition-all duration-200 hover:scale-125"
                      >
                        <svg className={`w-8 h-8 ${star <= (hoverRating || newReview.rating) ? 'text-neon drop-shadow-[0_0_6px_rgba(var(--color-primary),0.6)]' : 'text-white/20'} transition-colors duration-200`} fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-white/60 mb-2">Your Comment</label>
                  <textarea
                    required
                    maxLength={500}
                    rows={4}
                    value={newReview.comment}
                    onChange={e => setNewReview({ ...newReview, comment: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:border-neon outline-none transition-all duration-300 focus:shadow-neon-sm"
                    placeholder="Share your thoughts..."
                  />
                  <p className="text-right text-xs text-white/30 mt-1">{newReview.comment.length}/500</p>
                </div>
                <Button type="submit" loading={submitting} className="w-full">
                  Post Review
                </Button>
              </form>
            ) : (
              <p className="text-sm text-white/60">Please login to write a review.</p>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
