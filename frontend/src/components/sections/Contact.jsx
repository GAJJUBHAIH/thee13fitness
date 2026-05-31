import { useState } from 'react'
import { SectionHeader, Input, Button } from '../ui/index.js'
import { CONTACT } from '../../constants/index.js'

export default function Contact() {
  const [sent, setSent] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))
  const submit = (e) => { e.preventDefault(); setSent(true) }

  const waLink = `https://wa.me/${CONTACT.whatsappNumber}?text=${encodeURIComponent("Hi ThreeB Fitness! I'd like to know more about membership.")}`

  return (
    <section id="contact" className="relative mx-auto max-w-7xl px-5 py-24">
      <SectionHeader eyebrow="Get In Touch" title="Contact Us" />
      <div className="grid gap-8 lg:grid-cols-2">
        <form onSubmit={submit} className="glass rounded-3xl p-7">
          <Input id="cname" label="Name" value={form.name} onChange={set('name')} required />
          <div className="mt-4"><Input id="cemail" label="Email" type="email" value={form.email} onChange={set('email')} required /></div>
          <label htmlFor="cmsg" className="mt-4 block text-sm text-white/60">Message</label>
          <textarea id="cmsg" value={form.message} onChange={set('message')} rows={4} required className="mt-1 w-full rounded-xl border border-white/10 bg-ink-700/60 px-4 py-3 outline-none focus:border-neon" />
          <Button type="submit" className="mt-6 w-full">Send Message</Button>
          {sent && <p className="mt-3 text-sm text-neon">Thanks! We’ll get back to you soon.</p>}
          <div className="mt-6 space-y-2 text-sm text-white/70"><p>{CONTACT.email}</p><p>{CONTACT.phone}</p></div>
          <Button as="a" href={waLink} target="_blank" rel="noreferrer" variant="whatsapp" className="mt-4 w-full py-3">Chat on WhatsApp</Button>
        </form>
        <div className="glass overflow-hidden rounded-3xl">
          <iframe title="ThreeB Fitness location" src={CONTACT.mapsEmbed} className="h-full min-h-[360px] w-full grayscale invert-[0.92] hue-rotate-[60deg]" loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
        </div>
      </div>
    </section>
  )
}
