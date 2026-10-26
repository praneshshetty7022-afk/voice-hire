/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Specified Global Dual-Theme Palette
        vh: {
          // Dark Mode Primary Tokens
          'dark-canvas': '#0B0F19',
          'dark-surface': '#151C2C',
          'dark-card': '#151C2C',
          'dark-text': '#F8FAFC',
          'dark-muted': '#94A3B8',
          'dark-border': 'rgba(255, 255, 255, 0.1)',
          
          // Light Mode Secondary Tokens
          'light-canvas': '#F8FAFC',
          'light-surface': '#FFFFFF',
          'light-card': '#FFFFFF',
          'light-text': '#0F172A',
          'light-muted': '#475569',
          'light-border': '#E2E8F0',

          // Shared Accents
          'royal': '#2563EB',
          'royal-hover': '#1D4ED8',
          'navy-accent': '#1E40AF',
          'neon': '#3B82F6',
          'cyan-glow': '#60A5FA',
          'success-dark': '#10B981',
          'success-light': '#059669',
        },
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'glow-royal': '0 0 25px rgba(37, 99, 235, 0.45)',
        'glow-neon': '0 0 30px rgba(59, 130, 246, 0.5)',
        'glow-emerald': '0 0 20px rgba(16, 185, 129, 0.4)',
        'dark-card': '0 10px 40px rgba(0, 0, 0, 0.45)',
        'light-card': '0 10px 35px rgba(37, 99, 235, 0.06), 0 1px 3px rgba(0, 0, 0, 0.04)',
      },
      animation: {
        'wave-bar': 'wave 1.2s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 2.5s ease-in-out infinite',
        'float-slow': 'float 5s ease-in-out infinite',
      },
      keyframes: {
        'wave': {
          '0%, 100%': { transform: 'scaleY(0.3)' },
          '50%': { transform: 'scaleY(1)' },
        },
        'pulse-glow': {
          '0%, 100%': { opacity: '0.6', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.05)' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        },
      },
      transitionTimingFunction: {
        'fluid': 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
    },
  },
  plugins: [],
}
