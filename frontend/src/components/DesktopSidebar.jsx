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
    <aside className="hidden md:flex flex-col w-72 bg-white/85 dark:bg-[#151C2C]/85 backdrop-blur-2xl text-[#0F172A] dark:text-[#F8FAFC] min-h-screen p-6 border-r border-slate-200/80 dark:border-white/10 shrink-0 sticky top-0 h-screen z-30 shadow-sm transition-colors duration-300">
      {/* Brand Header */}
      <Link to="/jobs" className="flex items-center gap-3 mb-8 px-2 group">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#2563EB] to-[#1D4ED8] flex items-center justify-center shadow-lg shadow-blue-500/25 border border-blue-400/30 group-hover:scale-105 transition-transform duration-300">
          <Mic className="w-7 h-7 text-white stroke-[2.5]" />
        </div>
        <div>
          <h1 className="text-2xl font-black tracking-tight text-[#0F172A] dark:text-white">
            Voice<span className="text-[#2563EB] dark:text-[#60A5FA]">Hire</span>
          </h1>
          <p className="text-[11px] text-[#2563EB] dark:text-[#60A5FA] font-extrabold uppercase tracking-widest">
            {t.tagline || 'Your Voice. Real Jobs.'}
          </p>
        </div>
      </Link>

      {/* Primary Voice Action Button (Royal Blue Capsule) */}
      <button
        type="button"
        onClick={onMicTap}
        className="w-full mb-8 py-3.5 px-5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-black text-base rounded-2xl shadow-[0_8px_25px_rgba(37,99,235,0.3)] hover:shadow-[0_12px_32px_rgba(37,99,235,0.45)] flex items-center justify-center gap-3 active:scale-[0.98] transition-all duration-300 group relative overflow-hidden cursor-pointer"
      >
        <Mic className="w-5 h-5 text-white group-hover:scale-110 transition-transform stroke-[2.5]" />
        <span className="tracking-wide">Speak to Find Work</span>
      </button>

      {/* Navigation Links */}
      <nav className="flex-1 space-y-2">
        <p className="px-3 text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3">
          Main Menu
        </p>
        {links.map((item) => {
          const Icon = item.icon
          const isActive = location.pathname === item.path
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl font-bold text-sm transition-all duration-200 ${
                isActive
                  ? 'bg-[#2563EB] text-white shadow-md shadow-blue-500/25'
                  : 'text-slate-600 dark:text-[#94A3B8] hover:text-[#2563EB] dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/[0.06]'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-white stroke-[2.5]' : 'stroke-2'}`} />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>

      {/* Bottom Status Capsule */}
      <div className="pt-4 border-t border-slate-200 dark:border-white/10 text-xs">
        <div className="flex items-center justify-between p-3 rounded-2xl bg-blue-50/80 dark:bg-blue-950/30 border border-blue-200/80 dark:border-blue-500/20">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-extrabold text-slate-700 dark:text-slate-200">Voice Assistant Ready</span>
          </div>
          <span className="text-[10px] font-bold bg-blue-100 dark:bg-blue-900/50 text-[#2563EB] dark:text-[#60A5FA] border border-blue-200 dark:border-blue-500/30 px-2 py-0.5 rounded-full uppercase">
            Live
          </span>
        </div>
      </div>
    </aside>
  )
}
