import React from 'react'
import { PROFESSIONS } from '../styles/theme'

export default function ProfessionCard({ professionKey, lang = 'en', onClick }) {
  const prof = PROFESSIONS[professionKey] || PROFESSIONS.DRIVER
  const titleText = prof.nativeTitles?.[lang] || prof.nativeTitles?.en || prof.title

  return (
    <button
      type="button"
      onClick={() => onClick && onClick(professionKey)}
      className="group relative flex flex-col items-center text-center p-5 bg-white rounded-3xl border-2 border-slate-100 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-200 w-full overflow-hidden"
    >
      {/* Background Decorative Gradient Radial */}
      <div
        className="absolute inset-0 opacity-40 group-hover:opacity-70 transition-opacity"
        style={{ background: prof.pattern }}
      />

      {/* Profession Badge Icon */}
      <div
        className="w-20 h-20 rounded-3xl flex items-center justify-center text-4xl shadow-md border-2 mb-3 transform group-hover:scale-105 transition-transform duration-200 z-10"
        style={{
          background: `linear-gradient(135deg, ${prof.color}20, ${prof.color}40)`,
          borderColor: prof.color,
        }}
      >
        <span>{prof.icon}</span>
      </div>

      {/* Profession Title */}
      <h3 className="text-lg font-black text-slate-900 group-hover:text-blue-600 transition-colors z-10 line-clamp-1">
        {titleText}
      </h3>

      {/* Subtitle / Category Tags */}
      <p className="text-xs font-semibold text-slate-500 mt-1 z-10 line-clamp-1">
        {prof.subtitle}
      </p>

      {/* Action Prompt Pill */}
      <div className="mt-4 px-3 py-1 rounded-full text-xs font-extrabold bg-slate-100 text-slate-700 group-hover:bg-blue-600 group-hover:text-white transition-all z-10">
        Choose Work →
      </div>
    </button>
  )
}
