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
    <aside className="hidden md:flex flex-col w-72 bg-slate-900/85 backdrop-blur-2xl text-white min-h-screen p-6 border-r border-slate-800 shrink-0 sticky top-0 h-screen z-30">
      {/* Brand Header */}
      <Link to="/jobs" className="flex items-center gap-3 mb-8 px-2 group">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 via-sky-500 to-cyan-400 flex items-center justify-center shadow-md border border-cyan-300/40 group-hover:scale-105 transition-transform">
          <Mic className="w-7 h-7 text-white stroke-[2.5]" />
        </div>
        <div>
          <h1 className="text-2xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-blue-300 to-white">
            {t.brandName}
          </h1>
          <p className="text-[11px] text-cyan-400 font-extrabold uppercase tracking-widest">{t.tagline}</p>
        </div>
      </Link>

      {/* Primary Voice Action Button (Vibrant Blue/Cyan Capsule) */}
      <button
        type="button"
        onClick={onMicTap}
        className="w-full mb-8 py-3.5 px-5 bg-gradient-to-r from-blue-600 via-sky-500 to-cyan-400 text-white font-black text-base rounded-2xl shadow-md hover:shadow-cyan-500/30 flex items-center justify-center gap-3 border border-cyan-300/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 group relative overflow-hidden"
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
                  ? 'bg-gradient-to-r from-blue-600/25 via-sky-500/20 to-transparent text-cyan-300 border border-cyan-400/40 shadow-[0_0_15px_rgba(56,189,248,0.2)]'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60 border border-transparent'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-cyan-400 stroke-[2.5]' : 'stroke-2'}`} />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>

      {/* Bottom Status / Profile Capsule */}
      <div className="pt-4 border-t border-slate-800 text-xs">
        <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-800/60 border border-slate-700/50">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-extrabold text-slate-200">Voice Assistant Ready</span>
          </div>
          <span className="text-[10px] font-bold bg-cyan-500/15 text-cyan-300 border border-cyan-400/30 px-2 py-0.5 rounded-full uppercase">
            v1.0
          </span>
        </div>
      </div>
    </aside>
  )
}
