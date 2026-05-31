import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function ProtectedRoute({ children }) {
  const { user, loading, isFirebaseEnabled } = useAuth()
  if (loading) return null
  if (!isFirebaseEnabled) return children // demo mode without keys
  return user ? children : <Navigate to="/login" replace />
}
