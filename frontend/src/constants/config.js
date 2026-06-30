// All brand copy, contact details, and runtime config live here.
export const BRAND = {
  name: 'three13 fitness',
  short: 'three13',
  tagline: 'Health is Real Wealth',
  quote: 'Body Makes You 80% Ahead',
}

export const CONTACT = {
  email: 'hello@three13fitness.com',
  phone: '+91 75620 54232',
  whatsappNumber: '917562054232',
  mapsEmbed: 'https://www.google.com/maps?q=gym&output=embed',
}

export const NAV_LINKS = [
  { label: 'Home', href: '/#home' },
  { label: 'Explorer', href: '/#explorer' },
  { label: 'Membership', href: '/#membership' },
  { label: 'Services', href: '/#services' },
  { label: 'BMI', href: '/#bmi' },
  { label: 'Planner', href: '/#planner' },
  { label: 'Trainers', href: '/#trainers' },
  { label: 'Contact', href: '/#contact' },
]

export const ENV = {
  pocketbase: {
    url: import.meta.env.VITE_POCKETBASE_URL || 'http://localhost:8090',
  },
  razorpayKeyId: import.meta.env.VITE_RAZORPAY_KEY_ID,
  paymentsApi: import.meta.env.VITE_PAYMENTS_API,
}

export const asset = (path) => `${import.meta.env.BASE_URL}assets/${path}`
