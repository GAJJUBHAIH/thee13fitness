# Firebase Setup

1. Create a project at https://console.firebase.google.com
2. Authentication -> Sign-in method -> enable Email/Password.
3. Firestore Database -> create in production mode.
4. Project settings -> add a Web app, copy config into VITE_FIREBASE_* in frontend/.env.
5. Restrict the API key by HTTP referrer to your domain(s).
6. Deploy rules:
   ```bash
   npm i -g firebase-tools
   firebase login
   firebase init firestore
   firebase deploy --only firestore:rules
   ```

## Data model
- users/{uid} - profile
- users/{uid}/weightLog/{id} - { date, kg }
- users/{uid}/measurements/{id}
- memberships/{uid} - written by backend after payment verification
