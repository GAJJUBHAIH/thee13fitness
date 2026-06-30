/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        white: 'rgb(var(--color-text) / <alpha-value>)',
        neon: {
          DEFAULT: 'rgb(var(--color-primary) / <alpha-value>)',
          soft: 'rgb(var(--color-primary-soft) / <alpha-value>)',
          dim: 'rgb(var(--color-primary-dim) / <alpha-value>)',
        },
        ink: {
          900: 'rgb(var(--color-bg) / <alpha-value>)',
          800: 'rgb(var(--color-surface) / <alpha-value>)',
          700: 'rgb(var(--color-surface) / 0.8)',
          600: 'rgb(var(--color-surface) / 0.6)',
        },
      },
      fontFamily: {
        display: ['"Orbitron"', 'system-ui', 'sans-serif'],
        body: ['"Inter"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        neon: '0 0 8px rgb(var(--color-primary)), 0 0 24px rgba(var(--color-primary), 0.45)',
        'neon-sm': '0 0 4px rgb(var(--color-primary)), 0 0 10px rgba(var(--color-primary), 0.35)',
        'neon-lg': '0 0 12px rgb(var(--color-primary)), 0 0 40px rgba(var(--color-primary), 0.5), 0 0 80px rgba(var(--color-primary), 0.2)',
        'soft-sm': '0 1px 2px 0 rgba(0,0,0,0.15)',
        'soft-md': '0 4px 6px -1px rgba(0,0,0,0.2), 0 2px 4px -2px rgba(0,0,0,0.1)',
        'soft-lg': '0 10px 15px -3px rgba(0,0,0,0.3), 0 4px 6px -4px rgba(0,0,0,0.1)',
      },
      keyframes: {
        floaty: { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-8px)' } },
        pulseGlow: { '0%,100%': { opacity: 0.6 }, '50%': { opacity: 1 } },
        fadeInUp: { from: { opacity: 0, transform: 'translateY(24px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
        scaleIn: { from: { opacity: 0, transform: 'scale(0.92)' }, to: { opacity: 1, transform: 'scale(1)' } },
        slideInRight: { from: { opacity: 0, transform: 'translateX(24px)' }, to: { opacity: 1, transform: 'translateX(0)' } },
      },
      animation: {
        floaty: 'floaty 6s ease-in-out infinite',
        pulseGlow: 'pulseGlow 2.5s ease-in-out infinite',
        fadeInUp: 'fadeInUp 0.6s ease-out both',
        scaleIn: 'scaleIn 0.4s ease-out both',
        slideInRight: 'slideInRight 0.5s ease-out both',
      },
    },
  },
  plugins: [],
}
