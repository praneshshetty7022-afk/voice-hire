import React from 'react'
import { PROFESSIONS } from '../styles/theme'

/**
 * ProfessionCard Component
 * 
 * Clean white and light-blue job category card featuring:
 * - Gentle hover lift and glowing blue border transitions
 * - Dynamic icon scaling
 * - Accessible high-contrast typography
 */
export default function ProfessionCard({ professionKey, lang = 'en', onClick }) {
  const prof = PROFESSIONS[professionKey] || PROFESSIONS.DRIVER
  const titleText = prof.nativeTitles?.[lang] || prof.nativeTitles?.en || prof.title

  return (
    <button
      type="button"
      onClick={() => onClick && onClick(professionKey)}
      className="group relative flex flex-col items-center text-center p-6 bg-white/85 backdrop-blur-xl rounded-3xl border border-blue-100/90 hover:border-blue-300 hover:shadow-[0_15px_35px_rgba(37,99,235,0.14)] hover:-translate-y-1.5 transition-all duration-300 w-full overflow-hidden shadow-[0_4px_20px_rgba(37,99,235,0.06)]"
    >
      {/* Background Subtle Gradient Tint */}
      <div
        className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity duration-300 pointer-events-none"
        style={{ background: prof.pattern }}
      />

      {/* Top Glass Highlight */}
      <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-blue-200/60 to-transparent" />

      {/* Profession Badge Icon */}
      <div
        className="w-20 h-20 rounded-2xl flex items-center justify-center text-4xl border border-blue-100/80 mb-3.5 transform group-hover:scale-105 transition-transform duration-300 z-10 bg-gradient-to-br from-blue-50 to-indigo-50/70 shadow-sm"
        style={{
          boxShadow: `0 8px 24px -6px ${prof.color}25`,
        }}
      >
        <span>{prof.icon}</span>
      </div>

      {/* Profession Title */}
      <h3 className="text-lg font-black text-slate-900 group-hover:text-blue-700 transition-colors z-10 line-clamp-1">
        {titleText}
      </h3>

      {/* Subtitle / Category Tags */}
      <p className="text-xs font-semibold text-slate-500 mt-1 z-10 line-clamp-1">
        {prof.subtitle}
      </p>

      {/* Action Prompt Pill */}
      <div className="mt-4 px-3.5 py-1 rounded-full text-xs font-extrabold bg-blue-50 text-blue-700 border border-blue-200/80 group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:via-blue-500 group-hover:to-indigo-600 group-hover:text-white group-hover:border-transparent transition-all duration-300 z-10 shadow-sm">
        Choose Work →
      </div>
    </button>
  )
}
