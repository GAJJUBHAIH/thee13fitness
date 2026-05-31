import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { ENV } from '../constants/index.js'

export const isFirebaseEnabled = Boolean(ENV.firebase.apiKey && ENV.firebase.projectId)

let app = null
export const auth = isFirebaseEnabled ? getAuth((app = initializeApp(ENV.firebase))) : null
export const db = isFirebaseEnabled ? getFirestore(app) : null
