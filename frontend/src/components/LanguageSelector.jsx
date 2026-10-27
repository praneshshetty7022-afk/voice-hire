import React, { useState } from 'react'
import { Globe, Check, ChevronDown, Activity, Sparkles, RefreshCw } from 'lucide-react'
import { useVoice } from '../context/VoiceContext'

export const LANGUAGES = [
  { code: 'en-IN', name: 'English', native: 'English', flag: '🇬🇧' },
  { code: 'kn-IN', name: 'Kannada', native: 'ಕನ್ನಡ', flag: '🇮🇳' },
  { code: 'hi-IN', name: 'Hindi', native: 'हिंदी', flag: '🇮🇳' },
  { code: 'te-IN', name: 'Telugu', native: 'తెలుగు', flag: '🇮🇳' },
  { code: 'ta-IN', name: 'Tamil', native: 'தமிழ்', flag: '🇮🇳' },
  { code: 'ml-IN', name: 'Malayalam', native: 'മലയാളം', flag: '🇮🇳' },
  { code: 'bn-IN', name: 'Bengali', native: 'বাংলা', flag: '🇮🇳' },
  { code: 'es-ES', name: 'Spanish', native: 'Español', flag: '🇪🇸' },
]

export default function LanguageSelector({ selectedLang = 'en-IN', onSelectLang, isCompact = false }) {
  const [isOpen, setIsOpen] = useState(false)
  const { detectedLangInfo, isLanguageMismatch, detectCurrentLanguage, autoSyncToDetected } = useVoice() || {}

  const currentLangObj = LANGUAGES.find((l) => l.code === selectedLang) || LANGUAGES[0]

  return (
    <div className="relative inline-flex items-center gap-2" data-lang-picker="true" data-no-detect="true">
      {/* Live Text Detection Pill (Shows which language is actually detected on screen right now) */}
      {detectedLangInfo && (
        <div
          title={`Real-Time Detector: Visible page text is in ${detectedLangInfo.name} (${(detectedLangInfo.confidence * 100).toFixed(0)}% confidence)`}
          className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-white/10 text-[11px] font-bold text-slate-700 dark:text-slate-300 shadow-xs cursor-default select-none"
        >
          <span
            className={`w-2 h-2 rounded-full ${
              isLanguageMismatch
                ? 'bg-amber-500 animate-pulse'
                : 'bg-emerald-500'
            }`}
          />
          <span className="text-slate-400 dark:text-slate-500 font-semibold">Text:</span>
          <span className="text-blue-600 dark:text-blue-400 font-black">{detectedLangInfo.native}</span>
          <span className="text-[10px] text-slate-400">({detectedLangInfo.code.toUpperCase()})</span>
        </div>
      )}

      {/* Language Selector Dropdown Button */}
      <button
        type="button"
        onClick={() => {
          if (detectCurrentLanguage) detectCurrentLanguage()
          setIsOpen(!isOpen)
        }}
        className={`flex items-center gap-1.5 sm:gap-2 bg-white dark:bg-[#151C2C] hover:bg-blue-50 dark:hover:bg-[#1E293B] text-slate-800 dark:text-[#F8FAFC] font-extrabold px-2.5 py-2 sm:px-4 sm:py-2 rounded-2xl text-xs sm:text-sm border shadow-sm transition-all active:scale-95 cursor-pointer ${
          isLanguageMismatch
            ? 'border-amber-400/80 dark:border-amber-500/50 ring-2 ring-amber-400/20'
            : 'border-slate-200 dark:border-white/10'
        }`}
      >
        <Globe className="w-4 h-4 text-[#2563EB] shrink-0" />
        <span className="truncate">{currentLangObj.flag} {currentLangObj.native}</span>
        <ChevronDown
          className={`w-3.5 h-3.5 text-slate-400 dark:text-slate-500 transition-transform duration-200 shrink-0 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {isOpen && (
        <>
          {/* Backdrop Click */}
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />

          {/* Dropdown Card */}
          <div className="absolute right-0 mt-2 top-full w-72 bg-white/95 dark:bg-[#151C2C]/95 backdrop-blur-2xl rounded-3xl shadow-[0_15px_40px_rgba(0,0,0,0.35)] border border-slate-200 dark:border-white/10 z-50 p-2 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
            {/* Header: Select Language + Live Detection Summary */}
            <div className="p-3 border-b border-slate-100 dark:border-white/10 bg-blue-50/50 dark:bg-blue-950/20 rounded-2xl mb-1.5 space-y-1.5">
              <div className="flex items-center justify-between">
                <p className="text-[10px] font-black text-[#2563EB] dark:text-[#60A5FA] uppercase tracking-widest">
                  Language / ಭಾಷೆ
                </p>
                {detectedLangInfo && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    Detected: {detectedLangInfo.native}
                  </span>
                )}
              </div>

              {/* Status Banner */}
              {detectedLangInfo && (
                <div className="text-[11px] text-slate-600 dark:text-slate-400 leading-tight">
                  Texts currently shown in:{' '}
                  <strong className="text-slate-900 dark:text-slate-100 font-bold">
                    {detectedLangInfo.flag} {detectedLangInfo.name} ({detectedLangInfo.native})
                  </strong>
                </div>
              )}

              {/* Mismatch Warning & One-Click Sync */}
              {isLanguageMismatch && detectedLangInfo && (
                <div className="pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      if (onSelectLang && detectedLangInfo.fullCode) {
                        onSelectLang(detectedLangInfo.fullCode)
                        setIsOpen(false)
                      }
                    }}
                    className="w-full py-1.5 px-2.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/30 text-[11px] font-black text-left flex items-center justify-between transition-colors cursor-pointer"
                  >
                    <span>⚠️ Sync selector to {detectedLangInfo.name} text</span>
                    <RefreshCw className="w-3 h-3 text-amber-500 shrink-0" />
                  </button>
                </div>
              )}
            </div>

            {/* Language Options List */}
            <div className="py-1 space-y-1 max-h-72 overflow-y-auto">
              {LANGUAGES.map((lang) => {
                const isSelected = lang.code === selectedLang
                const isDetected = detectedLangInfo?.code === lang.code.split('-')[0]

                return (
                  <button
                    key={lang.code}
                    type="button"
                    onClick={() => {
                      onSelectLang(lang.code)
                      setIsOpen(false)
                    }}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl font-bold text-sm text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-blue-50 dark:bg-blue-600/20 text-[#2563EB] dark:text-[#60A5FA] border border-blue-200 dark:border-blue-500/30 shadow-sm'
                        : 'text-slate-700 dark:text-[#94A3B8] hover:bg-slate-100/70 dark:hover:bg-white/[0.06] hover:text-[#0F172A] dark:hover:text-[#F8FAFC] border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-lg">{lang.flag}</span>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="block font-black text-sm">{lang.native}</span>
                          {isDetected && (
                            <span className="text-[9px] px-1.5 py-0.2 rounded-md bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 font-extrabold uppercase tracking-tight">
                              Detected Text
                            </span>
                          )}
                        </div>
                        <span
                          className={`text-[10px] ${
                            isSelected
                              ? 'text-[#2563EB] dark:text-[#60A5FA]'
                              : 'text-slate-400 dark:text-slate-500'
                          }`}
                        >
                          {lang.name}
                        </span>
                      </div>
                    </div>

                    {isSelected && (
                      <Check className="w-4 h-4 stroke-[3] text-[#2563EB] dark:text-[#60A5FA]" />
                    )}
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
