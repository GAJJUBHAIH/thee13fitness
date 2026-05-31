import { Component } from 'react'
import Button from './Button.jsx'

export default class ErrorBoundary extends Component {
  state = { hasError: false, error: null }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, info) {
    console.error('ErrorBoundary caught:', error, info)
  }

  render() {
    if (!this.state.hasError) return this.props.children
    return (
      <div className="grid min-h-screen place-items-center bg-ink-900 px-5 text-center">
        <div className="glass max-w-md rounded-3xl p-8">
          <h1 className="font-display text-2xl font-bold neon-text">Something went wrong</h1>
          <p className="mt-3 text-sm text-white/60">
            An unexpected error occurred. Try reloading the page.
          </p>
          <Button className="mt-6" onClick={() => window.location.reload()}>
            Reload
          </Button>
        </div>
      </div>
    )
  }
}
