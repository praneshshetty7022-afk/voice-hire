import React from 'react'
import { Sun, Moon } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'

export default function ThemeToggle({ className = '' }) {
  const { theme, toggleTheme, isDark } = useTheme()

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      className={`relative inline-flex items-center justify-center w-10 h-10 rounded-2xl transition-all duration-300 border active:scale-95 cursor-pointer ${
        isDark
          ? 'bg-[#151C2C] hover:bg-[#1E293B] text-amber-400 border-white/10 shadow-[0_0_15px_rgba(251,191,36,0.15)]'
          : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200 shadow-sm'
      } ${className}`}
      title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
    >
      <div className="relative w-5 h-5 flex items-center justify-center">
        {isDark ? (
          <Sun className="w-5 h-5 text-amber-400 animate-in spin-in-180 duration-300 stroke-[2.5]" />
        ) : (
          <Moon className="w-5 h-5 text-slate-700 animate-in spin-in-180 duration-300 stroke-[2.5]" />
        )}
      </div>
    </button>
  )
}
