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
  { label: 'Gallery', href: '/#gallery' },
  { label: 'Trainers', href: '/#trainers' },
  { label: 'Store', href: '/store' },
  { label: 'Contact', href: '/#contact' },
  { label: 'Signup', href: '/signup' },
  { label: 'Login', href: '/login' },
]

export const ENV = {
  firebase: {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
  },
  razorpayKeyId: import.meta.env.VITE_RAZORPAY_KEY_ID,
  paymentsApi: import.meta.env.VITE_PAYMENTS_API,
}

export const asset = (path) => `/assets/${path}`
