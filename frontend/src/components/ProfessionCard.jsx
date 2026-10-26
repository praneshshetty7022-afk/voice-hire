import React from 'react'
import { PROFESSIONS } from '../styles/theme'

export default function ProfessionCard({ professionKey, lang = 'en', onClick }) {
  const prof = PROFESSIONS[professionKey] || PROFESSIONS.DRIVER
  const titleText = prof.nativeTitles?.[lang] || prof.nativeTitles?.en || prof.title

  return (
    <button
      type="button"
      onClick={() => onClick && onClick(professionKey)}
      className="group relative flex flex-col items-center text-center p-6 bg-slate-900/70 backdrop-blur-2xl rounded-3xl border border-slate-700/60 hover:border-cyan-400/50 hover:shadow-[0_0_25px_rgba(56,189,248,0.2)] hover:-translate-y-1.5 transition-all duration-300 w-full overflow-hidden"
    >
      {/* Background Decorative Gradient Radial */}
      <div
        className="absolute inset-0 opacity-20 group-hover:opacity-40 transition-opacity duration-300 pointer-events-none"
        style={{ background: prof.pattern }}
      />

      {/* 3D Glass Light Highlight Bar */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent" />

      {/* Profession Badge Icon */}
      <div
        className="w-20 h-20 rounded-2xl flex items-center justify-center text-4xl border border-white/10 mb-3.5 transform group-hover:scale-105 transition-transform duration-300 z-10 bg-slate-800/80 backdrop-blur-xl"
        style={{
          boxShadow: `0 8px 24px -6px ${prof.color}40`,
        }}
      >
        <span>{prof.icon}</span>
      </div>

      {/* Profession Title */}
      <h3 className="text-lg font-black text-white group-hover:text-cyan-300 transition-colors z-10 line-clamp-1">
        {titleText}
      </h3>

      {/* Subtitle / Category Tags */}
      <p className="text-xs font-semibold text-slate-400 mt-1 z-10 line-clamp-1">
        {prof.subtitle}
      </p>

      {/* Action Prompt Pill */}
      <div className="mt-4 px-3.5 py-1 rounded-full text-xs font-extrabold bg-slate-800 text-slate-300 border border-slate-700 group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:via-sky-500 group-hover:to-cyan-400 group-hover:text-white group-hover:border-transparent transition-all duration-300 z-10 shadow-sm">
        Choose Work →
      </div>
    </button>
  )
}
