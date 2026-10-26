import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Home, Briefcase, Mic, Bookmark, User } from 'lucide-react'
import { getTranslation } from '../utils/translations'

/**
 * PAGE 3: Mobile Touch Interface — Bottom Floating Navigation Bar
 * 
 * Components:
 * - Home (House Icon)
 * - Jobs (Briefcase Icon)
 * - Voice Mic (Center Oversized Pulsing Button)
 * - Saved / Applications (Bookmark Icon)
 * - Profile (User Icon)
 */
export default function MobileNavbar({ lang = 'en', onMicTap }) {
  const location = useLocation()
  const t = getTranslation(lang)

  const navItems = [
    { path: '/jobs', label: 'Home', icon: Home },
    { path: '/jobs-list', label: 'Jobs', icon: Briefcase },
    { isMic: true },
    { path: '/applications/my', label: 'Saved', icon: Bookmark },
    { path: '/profile', label: 'Profile', icon: User },
  ]

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 dark:bg-[#151C2C]/95 backdrop-blur-2xl border-t border-slate-200 dark:border-white/10 shadow-[0_-4px_25px_rgba(0,0,0,0.15)] sm:hidden transition-colors duration-300">
      <div className="flex items-center justify-around h-20 px-2 relative">
        {navItems.map((item, idx) => {
          if (item.isMic) {
            return (
              <div key="mic-btn" className="relative -top-6 flex justify-center">
                <button
                  type="button"
                  onClick={onMicTap}
                  aria-label="Tap to speak"
                  className="w-16 h-16 rounded-full bg-gradient-to-br from-[#2563EB] to-[#1D4ED8] text-white flex items-center justify-center shadow-[0_8px_25px_rgba(37,99,235,0.45)] border-2 border-white dark:border-[#151C2C] ring-4 ring-blue-500/25 active:scale-90 transition-transform cursor-pointer"
                >
                  <Mic className="w-8 h-8 stroke-[2.5]" />
                </button>
              </div>
            )
          }

          const Icon = item.icon
          const isActive = location.pathname === item.path

          return (
            <Link
              key={item.path || idx}
              to={item.path}
              className={`flex flex-col items-center justify-center flex-1 h-full font-bold text-xs transition-all duration-200 ${
                isActive
                  ? 'text-[#2563EB] dark:text-[#60A5FA] font-black scale-105'
                  : 'text-slate-500 dark:text-[#94A3B8] hover:text-[#0F172A] dark:hover:text-white'
              }`}
            >
              <Icon className={`w-5 h-5 mb-1 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
