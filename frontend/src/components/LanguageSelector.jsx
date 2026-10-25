import React, { useState } from 'react'
import { Globe, Check, ChevronDown } from 'lucide-react'

export const LANGUAGES = [
  { code: 'en-IN', name: 'English', native: 'English', flag: '🇮🇳' },
  { code: 'te-IN', name: 'Telugu', native: 'తెలుగు', flag: '🇮🇳' },
  { code: 'kn-IN', name: 'Kannada', native: 'ಕನ್ನಡ', flag: '🇮🇳' },
  { code: 'hi-IN', name: 'Hindi', native: 'हिन्दी', flag: '🇮🇳' },
  { code: 'ta-IN', name: 'Tamil', native: 'தமிழ்', flag: '🇮🇳' },
  { code: 'ml-IN', name: 'Malayalam', native: 'മലയാളം', flag: '🇮🇳' },
]

export default function LanguageSelector({ selectedLang = 'kn-IN', onSelectLang }) {
  const [isOpen, setIsOpen] = useState(false)
  const currentLangObj = LANGUAGES.find((l) => l.code === selectedLang) || LANGUAGES[0]

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 bg-white/[0.06] hover:bg-white/[0.1] text-white font-extrabold px-3 py-2 sm:px-4 sm:py-2 rounded-2xl text-xs sm:text-sm border border-white/10 shadow-glass-edge transition-all active:scale-95"
      >
        <Globe className="w-4 h-4 text-[#d4af37]" />
        <span>{currentLangObj.flag} {currentLangObj.native}</span>
        <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          {/* Backdrop Click */}
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />

          {/* Modal Dropdown Card */}
          <div className="absolute right-0 mt-2 w-64 bg-[#0c0c0e]/95 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/15 z-50 p-2 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="p-3 border-b border-white/10 bg-white/[0.02] rounded-t-2xl">
              <p className="text-[10px] font-black text-[#d4af37] uppercase tracking-widest">Select Language / భాష</p>
            </div>

            <div className="py-1 space-y-1">
              {(Array.isArray(LANGUAGES) ? LANGUAGES : []).map((lang) => {
                const isSelected = lang.code === selectedLang
                return (
                  <button
                    key={lang.code}
                    type="button"
                    onClick={() => {
                      onSelectLang(lang.code)
                      setIsOpen(false)
                    }}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl font-bold text-sm text-left transition-all ${
                      isSelected
                        ? 'bg-gradient-to-r from-[#d4af37]/20 via-[#f3e5ab]/15 to-[#d4af37]/10 text-[#f3e5ab] border border-amber-400/30'
                        : 'text-slate-300 hover:bg-white/[0.05] hover:text-white border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-lg">{lang.flag}</span>
                      <div>
                        <span className="block font-black text-sm">{lang.native}</span>
                        <span className={`text-[10px] ${isSelected ? 'text-[#f3e5ab]/80' : 'text-slate-400'}`}>
                          {lang.name}
                        </span>
                      </div>
                    </div>

                    {isSelected && <Check className="w-4 h-4 stroke-[3] text-[#f3e5ab]" />}
                  </button>
                )
              })}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
