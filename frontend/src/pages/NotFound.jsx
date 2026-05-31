import { Link } from 'react-router-dom'
import { Button } from '../components/ui/index.js'

export default function NotFound() {
  return (
    <div className="grid min-h-screen place-items-center bg-ink-900 px-5 text-center">
      <div>
        <p className="font-display text-7xl font-black neon-text">404</p>
        <p className="mt-3 text-white/60">This page doesn't exist.</p>
        <Button as={Link} to="/" className="mt-6">Back Home</Button>
      </div>
    </div>
  )
}
