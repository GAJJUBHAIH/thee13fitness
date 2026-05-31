import Navbar from './Navbar.jsx'
import Footer from './Footer.jsx'

export default function MainLayout({ children, withFooter = true }) {
  return (
    <>
      <Navbar />
      {children}
      {withFooter && <Footer />}
    </>
  )
}
