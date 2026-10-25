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
    <aside className="hidden md:flex flex-col w-72 bg-[#0c0c0e]/80 backdrop-blur-2xl text-white min-h-screen p-6 border-r border-white/10 shadow-glass-edge shrink-0 sticky top-0 h-screen z-30">
      {/* Brand Header */}
      <Link to="/jobs" className="flex items-center gap-3 mb-8 px-2 group">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#d4af37] via-[#f3e5ab] to-[#aa7c11] flex items-center justify-center shadow-liquid-gold border border-amber-300/40 group-hover:scale-105 transition-transform">
          <Mic className="w-7 h-7 text-[#050505] animate-pulse stroke-[2.5]" />
        </div>
        <div>
          <h1 className="text-2xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-[#d4af37] via-[#f3e5ab] to-[#ffffff]">
            {t.brandName}
          </h1>
          <p className="text-[11px] text-[#d4af37]/80 font-extrabold uppercase tracking-widest">{t.tagline}</p>
        </div>
      </Link>

      {/* Primary Voice Action Button (Liquid Acrylic Gold Capsule) */}
      <button
        type="button"
        onClick={onMicTap}
        className="w-full mb-8 py-3.5 px-5 bg-gradient-to-r from-[#d4af37] via-[#f3e5ab] to-[#aa7c11] text-[#050505] font-black text-base rounded-2xl shadow-liquid-gold flex items-center justify-center gap-3 border border-amber-300/50 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 group relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
        <Mic className="w-5 h-5 text-[#050505] group-hover:scale-110 transition-transform stroke-[2.5]" />
        <span className="tracking-wide">Speak to Find Work</span>
      </button>

      {/* Navigation Links */}
      <nav className="flex-1 space-y-2">
        <p className="px-3 text-[11px] font-black text-slate-500 uppercase tracking-widest mb-3">Main Menu</p>
        {(Array.isArray(links) ? links : []).map((item) => {
          const Icon = item.icon
          const isActive = location.pathname === item.path
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl font-bold text-sm transition-all duration-300 ${
                isActive
                  ? 'bg-gradient-to-r from-[#d4af37]/20 via-[#f3e5ab]/15 to-[#d4af37]/5 text-[#f3e5ab] border border-amber-400/40 shadow-[0_0_15px_rgba(212,175,55,0.25)]'
                  : 'text-slate-400 hover:text-white hover:bg-white/[0.04] border border-transparent'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-[#f3e5ab]' : 'text-slate-400'}`} />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>

      {/* Footer Support Info */}
      <div className="pt-5 border-t border-white/10 text-xs text-slate-400 px-2 space-y-1 bg-white/[0.02] rounded-2xl p-3">
        <p className="font-bold flex items-center gap-1.5 text-slate-200">
          <HelpCircle className="w-4 h-4 text-[#d4af37]" /> Voice-First Engine Active
        </p>
        <p className="text-[11px] text-slate-400">Supported in Telugu, Kannada, Hindi, Tamil & English.</p>
      </div>
    </aside>
  )
}
