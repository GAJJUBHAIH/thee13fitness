/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
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
      },
      boxShadow: {
        neon: '0 0 8px rgb(var(--color-primary)), 0 0 24px rgba(var(--color-primary), 0.45)',
        'neon-sm': '0 0 4px rgb(var(--color-primary)), 0 0 10px rgba(var(--color-primary), 0.35)',
      },
      keyframes: {
        floaty: { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-8px)' } },
        pulseGlow: { '0%,100%': { opacity: 0.6 }, '50%': { opacity: 1 } },
      },
      animation: {
        floaty: 'floaty 6s ease-in-out infinite',
        pulseGlow: 'pulseGlow 2.5s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
