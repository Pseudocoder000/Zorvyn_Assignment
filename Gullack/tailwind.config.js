/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        teal:   { 300: '#5eead4', 400: '#2dd4bf', 500: '#14b8a6', 600: '#0d9488' },
        coral:  { 300: '#fca5a5', 400: '#f87171', 500: '#ef4444', 600: '#dc2626' },
        amber:  { 300: '#fcd34d', 400: '#fbbf24', 500: '#f59e0b', 600: '#d97706' },
        base: {
          900: '#080812',
          800: '#0e0e1f',
          700: '#141428',
          600: '#1a1a35',
          500: '#22224a',
        },
      },
      fontFamily: { sans: ['Inter', 'sans-serif'] },
      backgroundImage: {
        'grad-primary':  'linear-gradient(135deg, #14b8a6 0%, #f59e0b 100%)',
        'grad-card':     'linear-gradient(135deg, rgba(20,184,166,0.15) 0%, rgba(245,158,11,0.05) 100%)',
        'grad-coral':    'linear-gradient(135deg, #ef4444 0%, #f59e0b 100%)',
        'grad-teal':     'linear-gradient(135deg, #14b8a6 0%, #2dd4bf 100%)',
        'grad-health':   'linear-gradient(135deg, #14b8a6 0%, #f59e0b 50%, #ef4444 100%)',
      },
      boxShadow: {
        'glow-teal':  '0 0 24px rgba(20,184,166,0.35)',
        'glow-coral': '0 0 24px rgba(239,68,68,0.35)',
        'glow-amber': '0 0 24px rgba(245,158,11,0.35)',
        'card':       '0 8px 32px rgba(0,0,0,0.4)',
      },
      animation: {
        'count-up': 'countUp 0.6s ease-out',
        'fade-in':  'fadeIn 0.4s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
      },
      keyframes: {
        countUp:  { '0%': { opacity: 0, transform: 'translateY(10px)' }, '100%': { opacity: 1, transform: 'translateY(0)' } },
        fadeIn:   { '0%': { opacity: 0 }, '100%': { opacity: 1 } },
        slideUp:  { '0%': { opacity: 0, transform: 'translateY(16px)' }, '100%': { opacity: 1, transform: 'translateY(0)' } },
      },
    },
  },
  plugins: [],
}