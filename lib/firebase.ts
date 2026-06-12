import { initializeApp, getApps } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getAnalytics, isSupported } from 'firebase/analytics'

const firebaseConfig = {
  apiKey:            process.env.NEXT_PUBLIC_FIREBASE_API_KEY             || 'AIzaSyBGfKrH1ZNmIwxPh_k2-P0hfTLnE0cQ4kU',
  authDomain:        process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN         || 'issueflow-60794.firebaseapp.com',
  projectId:         process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID          || 'issueflow-60794',
  storageBucket:     process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET      || 'issueflow-60794.firebasestorage.app',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '447179047466',
  appId:             process.env.NEXT_PUBLIC_FIREBASE_APP_ID              || '1:447179047466:web:ec6b1c22b5bd2bbc7f3953',
  measurementId:     process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID      || 'G-S60CQMDE7J',
}

// Prevent duplicate app initialization in Next.js (hot reload / SSR)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]

export const auth = getAuth(app)
export const db = getFirestore(app)

// Analytics only runs in the browser
if (typeof window !== 'undefined') {
  isSupported().then((yes) => {
    if (yes) getAnalytics(app)
  })
}
