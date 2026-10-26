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
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-2xl border-t border-blue-100/90 shadow-[0_-4px_25px_rgba(37,99,235,0.06)] sm:hidden">
      <div className="flex items-center justify-around h-20 px-2 relative">
        {(Array.isArray(navItems) ? navItems : []).map((item, idx) => {
          if (item.isMic) {
            return (
              <div key="mic-btn" className="relative -top-6 flex justify-center">
                <button
                  type="button"
                  onClick={onMicTap}
                  className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 text-white flex items-center justify-center shadow-[0_8px_25px_rgba(37,99,235,0.35)] border-2 border-white ring-4 ring-blue-500/20 active:scale-90 transition-transform"
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
                  ? 'text-blue-600 scale-105 font-black'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Icon className={`w-6 h-6 mb-1 ${isActive ? 'stroke-[2.5] text-blue-600' : 'stroke-2'}`} />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
