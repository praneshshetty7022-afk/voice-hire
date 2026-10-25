import React from 'react'
import { PROFESSIONS } from '../styles/theme'

export default function ProfessionCard({ professionKey, lang = 'en', onClick }) {
  const prof = PROFESSIONS[professionKey] || PROFESSIONS.DRIVER
  const titleText = prof.nativeTitles?.[lang] || prof.nativeTitles?.en || prof.title

  return (
    <button
      type="button"
      onClick={() => onClick && onClick(professionKey)}
      className="group relative flex flex-col items-center text-center p-6 bg-white/[0.035] backdrop-blur-2xl rounded-3xl border border-white/10 hover:border-amber-400/40 shadow-glass-edge hover:shadow-[0_0_20px_rgba(212,175,55,0.2)] hover:-translate-y-1.5 transition-all duration-300 w-full overflow-hidden"
    >
      {/* Background Decorative Gradient Radial */}
      <div
        className="absolute inset-0 opacity-20 group-hover:opacity-40 transition-opacity duration-300 pointer-events-none"
        style={{ background: prof.pattern }}
      />

      {/* 3D Glass Light Highlight Bar */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />

      {/* Profession Badge Icon */}
      <div
        className="w-20 h-20 rounded-2xl flex items-center justify-center text-4xl shadow-glass-edge border border-white/15 mb-3.5 transform group-hover:scale-105 transition-transform duration-300 z-10 bg-white/[0.05] backdrop-blur-xl"
        style={{
          boxShadow: `0 8px 24px -6px ${prof.color}40`,
        }}
      >
        <span>{prof.icon}</span>
      </div>

      {/* Profession Title */}
      <h3 className="text-lg font-black text-white group-hover:text-[#f3e5ab] transition-colors z-10 line-clamp-1">
        {titleText}
      </h3>

      {/* Subtitle / Category Tags */}
      <p className="text-xs font-semibold text-slate-400 mt-1 z-10 line-clamp-1">
        {prof.subtitle}
      </p>

      {/* Action Prompt Pill */}
      <div className="mt-4 px-3.5 py-1 rounded-full text-xs font-extrabold bg-white/[0.06] text-slate-300 border border-white/10 group-hover:bg-gradient-to-r group-hover:from-[#d4af37] group-hover:via-[#f3e5ab] group-hover:to-[#aa7c11] group-hover:text-[#050505] group-hover:border-amber-300 transition-all duration-300 z-10 shadow-sm">
        Choose Work →
      </div>
    </button>
  )
}
