import React, { useState } from 'react'
import { Globe, Check, ChevronDown } from 'lucide-react'

export const LANGUAGES = [
  { code: 'en-IN', name: 'English', native: 'English', flag: '🇬🇧' },
  { code: 'hi-IN', name: 'Hindi', native: 'हिंदी', flag: '🇮🇳' },
  { code: 'bn-IN', name: 'Bengali', native: 'বাংলা', flag: '🇮🇳' },
  { code: 'es-ES', name: 'Spanish', native: 'Español', flag: '🇪🇸' },
  { code: 'ta-IN', name: 'Tamil', native: 'தமிழ்', flag: '🇮🇳' },
  { code: 'te-IN', name: 'Telugu', native: 'తెలుగు', flag: '🇮🇳' },
  { code: 'kn-IN', name: 'Kannada', native: 'ಕನ್ನಡ', flag: '🇮🇳' },
]

export default function LanguageSelector({ selectedLang = 'en-IN', onSelectLang, isCompact = false }) {
  const [isOpen, setIsOpen] = useState(false)
  const currentLangObj = LANGUAGES.find((l) => l.code === selectedLang) || LANGUAGES[0]

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 sm:gap-2 bg-white dark:bg-[#151C2C] hover:bg-blue-50 dark:hover:bg-[#1E293B] text-slate-800 dark:text-[#F8FAFC] font-extrabold px-2.5 py-2 sm:px-4 sm:py-2 rounded-2xl text-xs sm:text-sm border border-slate-200 dark:border-white/10 shadow-sm transition-all active:scale-95"
      >
        <Globe className="w-4 h-4 text-[#2563EB] shrink-0" />
        <span className="truncate">{currentLangObj.flag} {currentLangObj.native}</span>
        <ChevronDown className={`w-3.5 h-3.5 text-slate-400 dark:text-slate-500 transition-transform duration-200 shrink-0 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          {/* Backdrop Click */}
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />

          {/* Dropdown Card */}
          <div className="absolute right-0 mt-2 w-64 bg-white/95 dark:bg-[#151C2C]/95 backdrop-blur-2xl rounded-3xl shadow-[0_15px_40px_rgba(0,0,0,0.35)] border border-slate-200 dark:border-white/10 z-50 p-2 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="p-3 border-b border-slate-100 dark:border-white/10 bg-blue-50/50 dark:bg-blue-950/20 rounded-t-2xl">
              <p className="text-[10px] font-black text-[#2563EB] dark:text-[#60A5FA] uppercase tracking-widest">
                Select Language / भाषा चुनें
              </p>
            </div>

            <div className="py-1 space-y-1 max-h-72 overflow-y-auto">
              {LANGUAGES.map((lang) => {
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
                        ? 'bg-blue-50 dark:bg-blue-600/20 text-[#2563EB] dark:text-[#60A5FA] border border-blue-200 dark:border-blue-500/30 shadow-sm'
                        : 'text-slate-700 dark:text-[#94A3B8] hover:bg-slate-100/70 dark:hover:bg-white/[0.06] hover:text-[#0F172A] dark:hover:text-[#F8FAFC] border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-lg">{lang.flag}</span>
                      <div>
                        <span className="block font-black text-sm">{lang.native}</span>
                        <span className={`text-[10px] ${isSelected ? 'text-[#2563EB] dark:text-[#60A5FA]' : 'text-slate-400 dark:text-slate-500'}`}>
                          {lang.name}
                        </span>
                      </div>
                    </div>

                    {isSelected && <Check className="w-4 h-4 stroke-[3] text-[#2563EB] dark:text-[#60A5FA]" />}
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
