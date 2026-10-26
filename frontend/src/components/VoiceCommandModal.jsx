import React, { useState } from 'react'
import { Mic, X, Send, Sparkles, Volume2, ArrowRight } from 'lucide-react'
import { getTranslation } from '../utils/translations'

export default function VoiceCommandModal({ isOpen, onClose, onSubmitVoice, selectedLang = 'en-IN' }) {
  const [inputText, setInputText] = useState('')
  const t = getTranslation(selectedLang)

  if (!isOpen) return null

  const handleQuickCommand = (cmdText) => {
    onSubmitVoice(cmdText)
    onClose()
  }

  const handleCustomSubmit = (e) => {
    e.preventDefault()
    if (!inputText.trim()) return
    onSubmitVoice(inputText.trim())
    setInputText('')
    onClose()
  }

  const sampleCommands = [
    { icon: '🚗', text: 'I need a driver job', label: 'Driver Jobs' },
    { icon: '🪚', text: 'Show carpenter jobs', label: 'Carpenter Jobs' },
    { icon: '🛠️', text: 'General helper work in Bangalore', label: 'Helper in Bangalore' },
    { icon: '🍳', text: 'Cook and house help jobs', label: 'Cook & Househelp' },
    { icon: '⚡', text: 'Show electrician jobs', label: 'Electrician Jobs' },
    { icon: '🔧', text: 'Show plumber jobs', label: 'Plumber Jobs' },
    { icon: '🎨', text: 'Find painter jobs near me', label: 'Painter Jobs' },
    { icon: '📋', text: 'Check my application status', label: 'My Applications' },
    { icon: '🇮🇳', text: 'मुझे ड्राइवर की नौकरी चाहिए', label: 'हिंदी: ड्राइवर नौकरी' },
    { icon: '🇮🇳', text: 'ನನಗೆ ಕಾರ್ಪೆಂಟರ್ ಕೆಲಸ ಬೇಕು', label: 'ಕನ್ನಡ: ಕಾರ್ಪೆಂಟರ್ ಕೆಲಸ' },
    { icon: '🇮🇳', text: 'నాకు హెల్పర్ పని కావాలి', label: 'తెలుగు: హెల్పర్ పని' },
    { icon: '🇮🇳', text: 'எனக்கு ஓட்டுநர் வேலை வேண்டும்', label: 'தமிழ்: ஓட்டுநர் வேலை' },
  ]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-[0_25px_60px_rgba(37,99,235,0.2)] border border-blue-100 w-full max-w-lg overflow-hidden relative p-6 sm:p-8 space-y-6">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-2 bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 rounded-full transition-all cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#2563EB] to-[#1D4ED8] text-white flex items-center justify-center mx-auto shadow-lg shadow-blue-500/25">
            <Mic className="w-8 h-8 stroke-[2.5]" />
          </div>
          <h2 className="text-2xl font-black text-[#0F172A] tracking-tight">
            Voice Assistant & Quick Commands
          </h2>
          <p className="text-xs sm:text-sm font-semibold text-slate-500">
            Type your request or tap any quick command below:
          </p>
        </div>

        {/* Text Input / Speech Field */}
        <form onSubmit={handleCustomSubmit} className="relative">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="e.g. Find driver jobs in Bengaluru..."
            className="w-full pl-5 pr-14 py-3.5 bg-[#F8FAFC] border-2 border-slate-200 focus:border-[#2563EB] focus:ring-4 focus:ring-blue-500/15 rounded-2xl outline-none text-base font-bold text-slate-900 placeholder-slate-400 transition-all"
            autoFocus
          />
          <button
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 bg-[#2563EB] hover:bg-[#1D4ED8] active:scale-95 text-white rounded-xl shadow-md transition-all cursor-pointer"
            aria-label="Submit command"
          >
            <Send className="w-4 h-4 stroke-[2.5]" />
          </button>
        </form>

        {/* Quick Voice Command Chips */}
        <div>
          <p className="text-[11px] font-black text-[#2563EB] uppercase tracking-widest mb-3 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#2563EB]" /> Tap to Run Voice Command:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-60 overflow-y-auto pr-1">
            {sampleCommands.map((cmd, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleQuickCommand(cmd.text)}
                className="flex items-center gap-3 p-3 bg-blue-50/60 hover:bg-blue-100/70 text-slate-800 font-bold text-xs sm:text-sm rounded-2xl border border-blue-200/80 hover:border-blue-400 shadow-sm transition-all text-left group cursor-pointer"
              >
                <span className="text-xl group-hover:scale-110 transition-transform shrink-0">{cmd.icon}</span>
                <span className="truncate group-hover:text-[#2563EB] transition-colors">{cmd.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
