import admin from 'firebase-admin';
import { config } from './env.js';

if (!admin.apps.length) {
  try {
    if (config.firebase.serviceAccountBase64) {
      const serviceAccount = JSON.parse(Buffer.from(config.firebase.serviceAccountBase64, 'base64').toString('utf8'));
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
      });
      console.log('Firebase Admin initialized successfully.');
    } else {
      console.warn('Firebase Admin NOT initialized: FIREBASE_SERVICE_ACCOUNT_BASE64 is missing.');
      // Fallback for local dev if they have GOOGLE_APPLICATION_CREDENTIALS set or are fine with errors
      admin.initializeApp();
    }
  } catch (error) {
    console.error('Firebase Admin initialization error:', error);
  }
}

export const db = admin.apps.length ? admin.firestore() : null;
export default admin;