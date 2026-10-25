import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Home, Briefcase, Mic, FileCheck, User } from 'lucide-react'
import { getTranslation } from '../utils/translations'

export default function MobileNavbar({ lang = 'en', onMicTap }) {
  const location = useLocation()
  const t = getTranslation(lang)

  const navItems = [
    { path: '/jobs', label: t.navHome, icon: Home },
    { path: '/jobs-list', label: t.navJobs, icon: Briefcase },
    { isMic: true },
    { path: '/applications/my', label: t.navApplications, icon: FileCheck },
    { path: '/profile', label: t.navProfile, icon: User },
  ]

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#0c0c0e]/85 backdrop-blur-2xl border-t border-white/10 shadow-glass-edge sm:hidden">
      <div className="flex items-center justify-around h-20 px-2 relative">
        {(Array.isArray(navItems) ? navItems : []).map((item, idx) => {
          if (item.isMic) {
            return (
              <div key="mic-btn" className="relative -top-6 flex justify-center">
                <button
                  type="button"
                  onClick={onMicTap}
                  className="w-16 h-16 rounded-full bg-gradient-to-r from-[#d4af37] via-[#f3e5ab] to-[#aa7c11] text-[#050505] flex items-center justify-center shadow-liquid-gold border-2 border-amber-300/60 ring-4 ring-amber-400/20 active:scale-90 transition-transform animate-liquid-pulse"
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
              className={`flex flex-col items-center justify-center flex-1 h-full font-bold text-xs transition-all duration-300 ${
                isActive
                  ? 'text-[#f3e5ab] scale-105 drop-shadow-[0_0_8px_rgba(212,175,55,0.4)]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Icon className={`w-6 h-6 mb-1 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
