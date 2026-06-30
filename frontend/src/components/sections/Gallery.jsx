import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { SectionHeader, Button } from '../ui/index.js'
import { useAuth } from '../../context/AuthContext.jsx'
import { pb, isPocketBaseEnabled } from '../../services/pocketbase.js'

export default function Gallery() {
  const { user } = useAuth()
  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)

  const fetchImages = async () => {
    if (!isPocketBaseEnabled) return setLoading(false)
    try {
      const records = await pb.collection('gallery').getList(1, 50, { sort: '-created', expand: 'user' })
      setImages(records.items)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchImages()
  }, [])

  const handleUpload = async (e) => {
    const files = Array.from(e.target.files)
    if (!files.length || !isPocketBaseEnabled) return
    setUploading(true)
    try {
      for (const file of files) {
        const formData = new FormData()
        formData.append('image', file)
        formData.append('caption', 'Uploaded by ' + (user?.displayName || 'User'))
        formData.append('user', user.id)
        await pb.collection('gallery').create(formData)
      }
      await fetchImages()
    } catch (e) {
      console.error(e)
      alert('Failed to upload image')
    } finally {
      setUploading(false)
    }
  }

  const handleLike = async (imgId, currentLikes) => {
    if (!user) return alert('Please login to like')
    const hasLiked = currentLikes.includes(user.id)
    const newLikes = hasLiked ? currentLikes.filter(id => id !== user.id) : [...currentLikes, user.id]
    try {
      await pb.collection('gallery').update(imgId, { likes: newLikes })
      await fetchImages()
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <section id="gallery" className="relative mx-auto max-w-7xl px-5 py-24">
      <SectionHeader
        eyebrow="Community"
        title="Fitness Gallery"
        subtitle="Share your progress and get inspired by others."
      />

      {user && (
        <div className="mb-8 p-6 rounded-3xl border border-white/10 bg-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="font-display text-xl font-bold neon-text">Upload to Gallery</h3>
            <p className="text-sm text-white/60">Share your workout moments with the community.</p>
          </div>
          <div className="relative">
            <Button disabled={uploading}>{uploading ? 'Uploading...' : 'Choose Images'}</Button>
            <input 
              type="file" 
              multiple 
              accept="image/*" 
              onChange={handleUpload} 
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
              title="Upload Images"
              disabled={uploading}
            />
          </div>
        </div>
      )}

      {loading ? (
        <p className="text-center text-white/60">Loading gallery...</p>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {images.map((image, index) => (
            <motion.div
              key={image.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
              className="group overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-neon-sm"
            >
              <img src={`${pb.baseUrl}/api/files/gallery/${image.id}/${image.image}`} alt={image.caption} loading="lazy" className="h-72 w-full object-cover transition duration-500 group-hover:scale-105" />
              <div className="space-y-2 p-5 flex justify-between items-start">
                <div>
                  <p className="text-sm font-semibold text-white">{image.caption}</p>
                  <p className="text-xs text-white/60">By {image.expand?.user?.name || 'Unknown'}</p>
                </div>
                <button onClick={() => handleLike(image.id, image.likes || [])} className="flex flex-col items-center gap-1 text-neon hover:text-white transition-colors">
                  <span className="text-xl">{(image.likes || []).includes(user?.id) ? '♥' : '♡'}</span>
                  <span className="text-xs">{(image.likes || []).length}</span>
                </button>
              </div>
            </motion.div>
          ))}
          {images.length === 0 && <p className="text-white/60 col-span-3 text-center py-10">No images in the gallery yet.</p>}
        </div>
      )}
    </section>
  )
}
