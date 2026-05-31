// All brand copy, contact details, and runtime config live here.
export const BRAND = {
  name: 'ThreeB Fitness',
  short: 'ThreeB',
  tagline: 'Health is Real Wealth',
  quote: 'Body Makes You 80% Ahead',
}

export const CONTACT = {
  email: 'hello@threebfitness.com',
  phone: '+91 99999 99999',
  whatsappNumber: '919999999999',
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
  firebase: {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
  },
  razorpayKeyId: import.meta.env.VITE_RAZORPAY_KEY_ID,
  paymentsApi: import.meta.env.VITE_PAYMENTS_API,
}

export const asset = (path) => `/assets/${path}`
