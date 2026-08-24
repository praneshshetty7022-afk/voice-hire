import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Mic, Home, Briefcase, FileCheck, User, Building2, ShieldCheck, HelpCircle } from 'lucide-react'
import { getTranslation } from '../utils/translations'

export default function DesktopSidebar({ lang = 'en', onMicTap }) {
  const location = useLocation()
  const t = getTranslation(lang)

  const links = [
    { path: '/jobs', label: t.navHome, icon: Home },
    { path: '/jobs-list', label: t.navJobs, icon: Briefcase },
    { path: '/applications/my', label: t.navApplications, icon: FileCheck },
    { path: '/profile', label: t.navProfile, icon: User },
    { path: '/employer/dashboard', label: 'Employer Portal', icon: Building2 },
    { path: '/admin/dashboard', label: 'Admin Portal', icon: ShieldCheck },
  ]

  return (
    <aside className="hidden md:flex flex-col w-72 bg-slate-900 text-white min-h-screen p-6 border-r-4 border-blue-600 shrink-0 sticky top-0 h-screen">
      {/* Brand Header */}
      <Link to="/jobs" className="flex items-center gap-3 mb-8 px-2">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg border-2 border-blue-400">
          <Mic className="w-7 h-7 text-white animate-pulse" />
        </div>
        <div>
          <h1 className="text-3xl font-black tracking-tight text-white">{t.brandName}</h1>
          <p className="text-xs text-blue-400 font-extrabold uppercase tracking-wider">{t.tagline}</p>
        </div>
      </Link>

      {/* Primary Voice Action Button */}
      <button
        type="button"
        onClick={onMicTap}
        className="w-full mb-8 py-4 px-6 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-500 hover:to-indigo-600 text-white font-black text-lg rounded-2xl shadow-xl flex items-center justify-center gap-3 border border-blue-400/30 transition-transform active:scale-95 group"
      >
        <Mic className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
        <span>Speak to Find Work</span>
      </button>

      {/* Navigation Links */}
      <nav className="flex-1 space-y-2">
        <p className="px-3 text-xs font-black text-slate-400 uppercase tracking-wider mb-2">Main Menu</p>
        {links.map((item) => {
          const Icon = item.icon
          const isActive = location.pathname === item.path
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl font-bold text-base transition-all ${
                isActive
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/40'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>

      {/* Footer Support Info */}
      <div className="pt-6 border-t border-slate-800 text-xs text-slate-400 px-2 space-y-1">
        <p className="font-bold flex items-center gap-1.5 text-slate-300">
          <HelpCircle className="w-4 h-4 text-blue-400" /> Voice-First Engine Active
        </p>
        <p>Supported in Telugu, Kannada, Hindi, Tamil & English.</p>
      </div>
    </aside>
  )
}
