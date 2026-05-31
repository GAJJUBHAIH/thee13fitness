import { createContext, useContext, useEffect, useState } from 'react'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from 'firebase/auth'
import { auth, isFirebaseEnabled } from '../services/firebase.js'

const AuthCtx = createContext(null)
export const useAuth = () => useContext(AuthCtx)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isFirebaseEnabled) {
      setLoading(false)
      return
    }
    return onAuthStateChanged(auth, (u) => {
      setUser(u)
      setLoading(false)
    })
  }, [])

  const signup = async (name, email, password) => {
    if (!isFirebaseEnabled) throw new Error('Auth not configured (.env missing).')
    const cred = await createUserWithEmailAndPassword(auth, email, password)
    if (name) await updateProfile(cred.user, { displayName: name })
    return cred.user
  }
  const login = (email, password) => {
    if (!isFirebaseEnabled) throw new Error('Auth not configured (.env missing).')
    return signInWithEmailAndPassword(auth, email, password)
  }
  const logout = () => (isFirebaseEnabled ? signOut(auth) : Promise.resolve())

  return (
    <AuthCtx.Provider value={{ user, loading, isFirebaseEnabled, signup, login, logout }}>
      {children}
    </AuthCtx.Provider>
  )
}
