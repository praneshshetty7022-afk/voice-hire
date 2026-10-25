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
        className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white font-extrabold px-3 py-2 sm:px-4 sm:py-2 rounded-2xl text-sm sm:text-base border border-slate-700 shadow-md transition-all active:scale-95"
      >
        <Globe className="w-5 h-5 text-blue-400" />
        <span>{currentLangObj.flag} {currentLangObj.native}</span>
        <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          {/* Backdrop Click */}
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />

          {/* Modal Dropdown Card */}
          <div className="absolute right-0 mt-2 w-64 bg-white rounded-3xl shadow-2xl border-2 border-slate-200 z-50 p-2 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="p-3 border-b border-slate-100 bg-slate-50 rounded-t-2xl">
              <p className="text-xs font-black text-slate-500 uppercase tracking-wider">Select Language / భాష</p>
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
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl font-bold text-base text-left transition-all ${
                      isSelected
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'text-slate-800 hover:bg-blue-50 hover:text-blue-700'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{lang.flag}</span>
                      <div>
                        <span className="block font-black text-lg">{lang.native}</span>
                        <span className={`text-xs ${isSelected ? 'text-blue-100' : 'text-slate-400'}`}>
                          {lang.name}
                        </span>
                      </div>
                    </div>

                    {isSelected && <Check className="w-6 h-6 stroke-[3]" />}
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
