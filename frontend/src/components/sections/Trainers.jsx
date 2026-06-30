import { motion } from 'framer-motion'
import { SectionHeader } from '../ui/index.js'
import { TRAINERS } from '../../data/index.js'
import { useAssets } from '../../context/AssetContext.jsx'

export default function Trainers() {
  const { getAsset } = useAssets()
  return (
    <section id="trainers" className="relative mx-auto max-w-7xl px-5 py-24">
      <SectionHeader eyebrow="Meet The Team" title="Our Trainers" subtitle="Certified professionals dedicated to your goals." />
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {TRAINERS.map((t, i) => {
          const trainerKey = `trainer_${t.name.split(' ')[0].toLowerCase()}`;
          const currentImage = getAsset(trainerKey, t.image);
          
          return (
            <motion.div key={t.name} data-reveal initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.08 }} className="glass overflow-hidden rounded-3xl">
              <div className="relative overflow-hidden bg-gradient-to-br from-ink-700 to-ink-800">
                {currentImage ? (
                  <img src={currentImage} alt={t.name} className="h-full w-full object-cover" />
                ) : (
                  <div className="grid aspect-square place-items-center text-5xl"><span className="opacity-40">👤</span></div>
                )}
            </div>
            <div className="p-5">
              <h3 className="font-display text-lg font-bold">{t.name}</h3>
              <p className="text-sm text-neon/80">{t.specialization}</p>
              <p className="mt-2 text-xs text-white/50">Experience: {t.experience}</p>
              <p className="mt-1 text-xs text-white/50">{t.certs.join(' · ')}</p>
              <div className="mt-3 flex gap-3 text-sm">
                <a href={t.socials.instagram} target="_blank" rel="noreferrer noopener" className="text-white/60 hover:text-neon" aria-label={`${t.name} Instagram`}>IG</a>
                <a href={t.socials.twitter} target="_blank" rel="noreferrer noopener" className="text-white/60 hover:text-neon" aria-label={`${t.name} Twitter`}>X</a>
                <a href={t.socials.linkedin} target="_blank" rel="noreferrer noopener" className="text-white/60 hover:text-neon" aria-label={`${t.name} LinkedIn`}>in</a>
              </div>
            </div>
          </motion.div>
          );
        })}
      </div>
    </section>
  )
}
