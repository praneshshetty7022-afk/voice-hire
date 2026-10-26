import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Mic, Home, Briefcase, FileCheck, User, Building2, ShieldCheck } from 'lucide-react'
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
    <aside className="hidden md:flex flex-col w-72 bg-white/85 backdrop-blur-2xl text-slate-800 min-h-screen p-6 border-r border-blue-100/90 shrink-0 sticky top-0 h-screen z-30 shadow-[4px_0_24px_rgba(37,99,235,0.03)]">
      {/* Brand Header */}
      <Link to="/jobs" className="flex items-center gap-3 mb-8 px-2 group">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 via-blue-500 to-indigo-600 flex items-center justify-center shadow-md border border-blue-300/40 group-hover:scale-105 transition-transform duration-300">
          <Mic className="w-7 h-7 text-white stroke-[2.5]" />
        </div>
        <div>
          <h1 className="text-2xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-700 via-indigo-600 to-sky-600">
            {t.brandName}
          </h1>
          <p className="text-[11px] text-blue-600 font-extrabold uppercase tracking-widest">{t.tagline}</p>
        </div>
      </Link>

      {/* Primary Voice Action Button (Royal Blue Gradient Capsule) */}
      <button
        type="button"
        onClick={onMicTap}
        className="w-full mb-8 py-3.5 px-5 bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 text-white font-black text-base rounded-2xl shadow-[0_8px_25px_rgba(37,99,235,0.25)] hover:shadow-[0_12px_32px_rgba(37,99,235,0.35)] flex items-center justify-center gap-3 border border-blue-400/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 group relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
        <Mic className="w-5 h-5 text-white group-hover:scale-110 transition-transform stroke-[2.5]" />
        <span className="tracking-wide">Speak to Find Work</span>
      </button>

      {/* Navigation Links */}
      <nav className="flex-1 space-y-2">
        <p className="px-3 text-[11px] font-black text-slate-400 uppercase tracking-widest mb-3">Main Menu</p>
        {(Array.isArray(links) ? links : []).map((item) => {
          const Icon = item.icon
          const isActive = location.pathname === item.path
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl font-bold text-sm transition-all duration-300 ${
                isActive
                  ? 'bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 text-white shadow-[0_6px_20px_rgba(37,99,235,0.25)]'
                  : 'text-slate-600 hover:text-blue-700 hover:bg-blue-50/80 border border-transparent'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-white stroke-[2.5]' : 'stroke-2'}`} />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>

      {/* Bottom Status / Profile Capsule */}
      <div className="pt-4 border-t border-blue-100 text-xs">
        <div className="flex items-center justify-between p-3 rounded-2xl bg-blue-50/80 border border-blue-100">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-extrabold text-slate-700">Voice Assistant Ready</span>
          </div>
          <span className="text-[10px] font-bold bg-blue-100 text-blue-700 border border-blue-200 px-2 py-0.5 rounded-full uppercase">
            v1.0
          </span>
        </div>
      </div>
    </aside>
  )
}
