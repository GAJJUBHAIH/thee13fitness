import { createContext, useContext, useEffect, useState } from 'react'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail
} from 'firebase/auth'
import { auth, isFirebaseEnabled } from '../services/firebase.js'

const LOCAL_USERS_KEY = 'three13_local_users'
const LOCAL_SESSION_KEY = 'three13_local_user'

const getLocalUsers = () => {
  try {
    return JSON.parse(localStorage.getItem(LOCAL_USERS_KEY) || '[]')
  } catch {
    return []
  }
}

const saveLocalUsers = (users) => localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(users))
const getLocalSession = () => {
  try {
    return JSON.parse(localStorage.getItem(LOCAL_SESSION_KEY) || 'null')
  } catch {
    return null
  }
}
const saveLocalSession = (user) => localStorage.setItem(LOCAL_SESSION_KEY, JSON.stringify(user))
const clearLocalSession = () => localStorage.removeItem(LOCAL_SESSION_KEY)

const AuthCtx = createContext(null)
export const useAuth = () => useContext(AuthCtx)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isFirebaseEnabled) {
      // Local fallback for session persistence
      const storedUser = getLocalSession()
      if (storedUser) setUser(storedUser)
      setLoading(false)
      return
    }
    // Firebase auth state listener: Automatically restore the user session and handle persistence
    return onAuthStateChanged(auth, (u) => {
      setUser(u)
      setLoading(false)
    })
  }, [])

  const signup = async (name, email, password) => {
    if (!isFirebaseEnabled) {
      const users = getLocalUsers()
      if (users.some((u) => u.email === email)) {
        throw new Error('Account already exists with this email.')
      }
      const uid = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`
      const newUser = { uid, email, displayName: name || '', password }
      users.push(newUser)
      saveLocalUsers(users)
      const sessionUser = { uid, email, displayName: newUser.displayName }
      setUser(sessionUser)
      saveLocalSession(sessionUser)
      return sessionUser
    }

    const cred = await createUserWithEmailAndPassword(auth, email, password)
    if (name) await updateProfile(cred.user, { displayName: name })
    return cred.user
  }

  const login = async (email, password) => {
    if (!isFirebaseEnabled) {
      const users = getLocalUsers()
      const stored = users.find((u) => u.email === email && u.password === password)
      if (!stored) {
        throw new Error('Invalid email or password.')
      }
      const sessionUser = { uid: stored.uid, email: stored.email, displayName: stored.displayName }
      setUser(sessionUser)
      saveLocalSession(sessionUser)
      return { user: sessionUser }
    }

    return signInWithEmailAndPassword(auth, email, password)
  }

  const googleLogin = async () => {
    if (!isFirebaseEnabled) {
      throw new Error('Firebase is not enabled. Google Sign-In is unavailable.')
    }
    const provider = new GoogleAuthProvider()
    return signInWithPopup(auth, provider)
  }

  const resetPassword = async (email) => {
    if (!isFirebaseEnabled) {
      throw new Error('Firebase is not enabled. Password reset is unavailable.')
    }
    return sendPasswordResetEmail(auth, email)
  }

  const logout = () => {
    if (!isFirebaseEnabled) {
      clearLocalSession()
      setUser(null)
      return Promise.resolve()
    }
    return signOut(auth)
  }

  return (
    <AuthCtx.Provider value={{ user, loading, isFirebaseEnabled, signup, login, googleLogin, resetPassword, logout }}>
      {children}
    </AuthCtx.Provider>
  )
}
