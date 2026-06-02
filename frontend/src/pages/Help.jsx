import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Button } from '../components/ui/index.js'
import { CONTACT, BRAND } from '../constants/index.js'

export default function Help() {
  const supportOptions = [
    {
      icon: '💬',
      title: 'WhatsApp',
      description: 'Chat with us on WhatsApp for instant support',
      action: 'Chat Now',
      href: `https://wa.me/${CONTACT.whatsappNumber}?text=Hello%20${BRAND.short},%20I%20need%20help!`,
      external: true,
    },
    {
      icon: '📧',
      title: 'Email',
      description: 'Send us an email and we\'ll get back to you within 24 hours',
      action: 'Send Email',
      href: `mailto:${CONTACT.email}?subject=Support Request - ${BRAND.short}`,
      external: true,
    },
    {
      icon: '📱',
      title: 'Call Us',
      description: 'Call directly for immediate assistance',
      action: 'Call Now',
      href: `tel:${CONTACT.phone.replace(/\s/g, '')}`,
      external: true,
    },
    {
      icon: '📝',
      title: 'Contact Form',
      description: 'Fill out our contact form and we\'ll reach out soon',
      action: 'Go to Contact',
      href: '/#contact',
      external: false,
    },
  ]

  return (
    <section className="relative min-h-screen w-full pt-24 pb-12">
      <div className="grid-bg absolute inset-0" />
      <div className="relative mx-auto max-w-4xl px-5">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="font-display text-4xl sm:text-5xl font-black leading-tight">
            How Can We <span className="neon-text">Help You?</span>
          </h1>
          <p className="mt-4 text-lg text-white/70 max-w-2xl mx-auto">
            We're here to support your fitness journey. Choose your preferred way to contact us.
          </p>
        </motion.div>

        {/* Support Options Grid */}
        <div className="grid gap-6 sm:grid-cols-2 mb-12">
          {supportOptions.map((option, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="glass rounded-xl border border-white/10 p-6 hover:border-neon/50 transition-all group"
            >
              <div className="text-4xl mb-3">{option.icon}</div>
              <h3 className="font-display text-xl font-bold mb-2">{option.title}</h3>
              <p className="text-sm text-white/60 mb-6">{option.description}</p>
              <Button
                as={option.external ? 'a' : Link}
                href={option.external ? option.href : undefined}
                to={option.external ? undefined : option.href}
                target={option.external ? '_blank' : undefined}
                rel={option.external ? 'noopener noreferrer' : undefined}
                className="w-full"
              >
                {option.action}
              </Button>
            </motion.div>
          ))}
        </div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="glass rounded-xl border border-white/10 p-8 mb-8"
        >
          <h2 className="font-display text-2xl font-bold mb-6 neon-text">Frequently Asked Questions</h2>
          <div className="space-y-6">
            {[
              {
                q: 'How do I reset my password?',
                a: 'Click on "Need help?" at the login page and use our WhatsApp or email support to verify your identity. We\'ll help you reset your password securely.',
              },
              {
                q: 'What payment methods do you accept?',
                a: 'We accept all major credit/debit cards and digital wallets through Razorpay. All payments are secure and encrypted.',
              },
              {
                q: 'Can I cancel my membership?',
                a: 'Yes, you can manage your membership through your Dashboard. Contact us for cancellation assistance.',
              },
              {
                q: 'How does the AI Planner work?',
                a: 'Our AI Planner analyzes your fitness goals, body type, and preferences to create a personalized workout plan tailored just for you.',
              },
              {
                q: 'Do you offer trainer consultations?',
                a: 'Yes! Book a session with our professional trainers through the Personal Trainer section. First consultation is available at special rates.',
              },
              {
                q: 'Is my data secure?',
                a: 'Absolutely. We use Firebase with security rules and SSL encryption to protect all your personal and payment information.',
              },
            ].map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
              >
                <h4 className="font-semibold text-neon mb-2">{faq.q}</h4>
                <p className="text-white/70 text-sm">{faq.a}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="text-center"
        >
          <Link to="/" className="text-neon hover:text-white transition">
            ← Back to Home
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
