import { createContext, useContext, useEffect, useState } from 'react'
import { pb, isPocketBaseEnabled } from '../services/pocketbase.js'

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
    if (!isPocketBaseEnabled) {
      // Local fallback for session persistence
      const storedUser = getLocalSession()
      if (storedUser) setUser(storedUser)
      setLoading(false)
      return
    }

    // Initialize state from pocketbase authStore
    setUser(pb.authStore.model)
    setLoading(false)

    // Listen for auth changes
    return pb.authStore.onChange((token, model) => {
      setUser(model)
    })
  }, [])

  const signup = async (name, email, password, role = 'User', username, mobile) => {
    if (!isPocketBaseEnabled) {
      const users = getLocalUsers()
      if (users.some((u) => u.email === email)) {
        throw new Error('Account already exists with this email.')
      }
      const uid = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`
      const newUser = { uid, username, email, displayName: name || '', password, role, mobile }
      users.push(newUser)
      saveLocalUsers(users)
      const sessionUser = { uid, username, email, displayName: newUser.displayName, role }
      setUser(sessionUser)
      saveLocalSession(sessionUser)
      return sessionUser
    }

    // Create user in PocketBase
    const record = await pb.collection('users').create({
      username,
      email,
      password,
      passwordConfirm: password,
      name,
      role,
      mobile
    })

    // Sign in after creation
    await pb.collection('users').authWithPassword(email, password)
    return record
  }

  const login = async (email, password) => {
    if (!isPocketBaseEnabled) {
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

    return pb.collection('users').authWithPassword(email, password)
  }

  const googleLogin = async () => {
    if (!isPocketBaseEnabled) {
      throw new Error('PocketBase is not enabled. Google Sign-In is unavailable.')
    }
    return pb.collection('users').authWithOAuth2({ provider: 'google' })
  }

  const resetPassword = async (email) => {
    if (!isPocketBaseEnabled) {
      throw new Error('PocketBase is not enabled. Password reset is unavailable.')
    }
    return pb.collection('users').requestPasswordReset(email)
  }

  const logout = () => {
    if (!isPocketBaseEnabled) {
      clearLocalSession()
      setUser(null)
      return Promise.resolve()
    }
    pb.authStore.clear()
    setUser(null)
    return Promise.resolve()
  }

  return (
    <AuthCtx.Provider value={{ user, loading, isFirebaseEnabled: isPocketBaseEnabled, signup, login, googleLogin, resetPassword, logout }}>
      {children}
    </AuthCtx.Provider>
  )
}
