import { Suspense, lazy } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import ProtectedRoute from './ProtectedRoute.jsx'

const Home = lazy(() => import('../pages/Home.jsx'))
const Login = lazy(() => import('../pages/Login.jsx'))
const Signup = lazy(() => import('../pages/Signup.jsx'))
const ForgotPassword = lazy(() => import('../pages/ForgotPassword.jsx'))
const Store = lazy(() => import('../pages/Store.jsx'))
const Cart = lazy(() => import('../pages/Cart.jsx'))
const Checkout = lazy(() => import('../pages/Checkout.jsx'))
const DashboardPage = lazy(() => import('../pages/DashboardPage.jsx'))
const VerifyToken = lazy(() => import('../pages/VerifyToken.jsx'))
const AdminDashboard = lazy(() => import('../pages/AdminDashboard.jsx'))
const Receipt = lazy(() => import('../pages/Receipt.jsx'))
const ProductDetails = lazy(() => import('../pages/ProductDetails.jsx'))
const NotFound = lazy(() => import('../pages/NotFound.jsx'))

const Page = ({ children }) => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.35 }}>
    {children}
  </motion.div>
)

export default function AppRoutes() {
  const location = useLocation()
  return (
    <Suspense fallback={null}>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Page><Home /></Page>} />
          <Route path="/login" element={<Page><Login /></Page>} />
          <Route path="/signup" element={<Page><Signup /></Page>} />
          <Route path="/forgot-password" element={<Page><ForgotPassword /></Page>} />
          <Route path="/store" element={<Page><Store /></Page>} />
          <Route path="/cart" element={<Page><Cart /></Page>} />
          <Route path="/checkout" element={<Page><Checkout /></Page>} />
          <Route path="/product/:id" element={<Page><ProductDetails /></Page>} />
          <Route path="/verify-token" element={<Page><VerifyToken /></Page>} />
          <Route path="/dashboard" element={<Page><ProtectedRoute><DashboardPage /></ProtectedRoute></Page>} />
          <Route path="/admin" element={<Page><ProtectedRoute><AdminDashboard /></ProtectedRoute></Page>} />
          <Route path="/receipt" element={<Page><Receipt /></Page>} />
          <Route path="*" element={<Page><NotFound /></Page>} />
        </Routes>
      </AnimatePresence>
    </Suspense>
  )
}

