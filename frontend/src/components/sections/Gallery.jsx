import { motion } from 'framer-motion'
import { SectionHeader } from '../ui/index.js'

const IMAGES = [
  { src: '/assets/store/barbell.jpg', alt: 'Barbell set' },
  { src: '/assets/store/kettlebells.jpg', alt: 'Kettlebell training' },
  { src: '/assets/store/shaker-bottle.jpg', alt: 'Shaker bottle' },
  { src: '/assets/store/yoga-mat.jpg', alt: 'Yoga mat' },
  { src: '/assets/store/gym-bag.jpg', alt: 'Gym bag' },
  { src: '/assets/store/shoes.jpg', alt: 'Training shoes' },
]

export default function Gallery() {
  return (
    <section id="gallery" className="relative mx-auto max-w-7xl px-5 py-24">
      <SectionHeader
        eyebrow="See the store"
        title="Gallery"
        subtitle="Handpicked fitness gear and accessories ready for your home gym."
      />

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {IMAGES.map((image, index) => (
          <motion.div
            key={image.src}
            data-reveal
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: index * 0.08 }}
            className="group overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-neon-sm"
          >
            <img src={image.src} alt={image.alt} className="h-72 w-full object-cover transition duration-500 group-hover:scale-105" />
            <div className="space-y-2 p-5">
              <p className="text-lg font-semibold text-white">{image.alt}</p>
              <p className="text-sm text-white/60">Premium selection for your fitness routine.</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
