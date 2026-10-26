/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        obsidian: {
          DEFAULT: '#050505',
          dark: '#020202',
          surface: '#0c0c0e',
          card: '#121216',
          border: 'rgba(255, 255, 255, 0.08)',
        },
        gold: {
          50: '#fdfbf2',
          100: '#f9f3db',
          200: '#f3e5ab',
          300: '#ebd37d',
          400: '#d4af37', // Signature Champagne Gold
          500: '#c59d27',
          600: '#aa7c11',
          700: '#8c600b',
          800: '#684507',
          900: '#4a2f04',
        },
        silver: {
          100: '#f8fafc',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#c0c0c0', // Brushed Silver
          500: '#94a3b8',
          600: '#64748b',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'liquid-glass': '0 8px 32px 0 rgba(0, 0, 0, 0.45)',
        'liquid-gold': '0 0 25px rgba(56, 189, 248, 0.35), inset 0 1px 1px rgba(255, 255, 255, 0.4)',
        'liquid-silver': '0 0 20px rgba(192, 192, 192, 0.2), inset 0 1px 1px rgba(255, 255, 255, 0.25)',
        'glass-edge': 'inset 0 1px 1px 0 rgba(255, 255, 255, 0.18)',
        'gold-glow': '0 0 35px rgba(56, 189, 248, 0.45)',
      },
      animation: {
        'liquid-pulse': 'liquid-pulse 2.4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float-slow': 'float 5s ease-in-out infinite',
        'shimmer': 'shimmer 2.5s linear infinite',
      },
      keyframes: {
        'liquid-pulse': {
          '0%': { transform: 'scale(1)', opacity: '0.8', boxShadow: '0 0 0 0 rgba(56, 189, 248, 0.6)' },
          '50%': { transform: 'scale(1.06)', opacity: '1', boxShadow: '0 0 40px 15px rgba(56, 189, 248, 0.3)' },
          '100%': { transform: 'scale(1)', opacity: '0.8', boxShadow: '0 0 0 0 rgba(56, 189, 248, 0)' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-5px)' },
        },
        'shimmer': {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      transitionTimingFunction: {
        'fluid': 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
    },
  },
  plugins: [],
}
