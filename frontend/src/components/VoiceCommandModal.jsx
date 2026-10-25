import React, { useState } from 'react'
import { Mic, X, Send, Sparkles, Volume2 } from 'lucide-react'
import { getTranslation } from '../utils/translations'

export default function VoiceCommandModal({ isOpen, onClose, onSubmitVoice, selectedLang = 'en' }) {
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
    { icon: '🔨', text: 'Show carpenter jobs', label: 'Carpenter Jobs' },
    { icon: '🎨', text: 'Find painter jobs in Bengaluru', label: 'Painter in Bengaluru' },
    { icon: '⚡', text: 'Show electrician jobs', label: 'Electrician Jobs' },
    { icon: '🔧', text: 'Show plumber jobs', label: 'Plumber Jobs' },
    { icon: '🧱', text: 'Show mason jobs', label: 'Mason Jobs' },
    { icon: '🗣️', text: 'నాకు డ్రైవర్ ఉద్యోగం కావాలి', label: 'తెలుగు: డ్రైవర్ ఉద్యోగం' },
    { icon: '🗣️', text: 'ನನಗೆ ಡ್ರೈವರ್ ಕೆಲಸ ಬೇಕು', label: 'ಕನ್ನಡ: ಡ್ರೈವರ್ ಕೆಲಸ' },
    { icon: '🗣️', text: 'मुझे ड्राइवर की नौकरी चाहिए', label: 'हिंदी: ड्राइवर नौकरी' },
  ]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-in fade-in duration-300">
      <div className="bg-[#0c0c0e]/95 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/15 w-full max-w-lg overflow-hidden relative p-6 space-y-6 shadow-glass-edge">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-white/[0.06] hover:bg-white/[0.12] text-slate-300 hover:text-white rounded-full transition-all border border-white/10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#d4af37] via-[#f3e5ab] to-[#aa7c11] text-[#050505] flex items-center justify-center mx-auto shadow-liquid-gold border border-amber-300/60 ring-4 ring-amber-400/20 animate-liquid-pulse">
            <Mic className="w-7 h-7 stroke-[2.5]" />
          </div>
          <h2 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#d4af37] via-[#f3e5ab] to-white">
            Voice Assistant Ready
          </h2>
          <p className="text-xs font-bold text-slate-400">
            Speak your command or tap any option below:
          </p>
        </div>

        {/* Text Input / Speech Field */}
        <form onSubmit={handleCustomSubmit} className="relative">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type or speak command (e.g. Driver job)..."
            className="w-full pl-5 pr-14 py-3.5 bg-white/[0.04] border border-white/15 rounded-2xl outline-none focus:border-amber-400/50 text-base font-bold text-white placeholder-slate-500 transition-all shadow-glass-edge"
            autoFocus
          />
          <button
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 bg-gradient-to-r from-[#d4af37] to-[#aa7c11] hover:scale-105 active:scale-95 text-[#050505] rounded-xl shadow-liquid-gold transition-all"
          >
            <Send className="w-4 h-4 stroke-[2.5]" />
          </button>
        </form>

        {/* Quick Voice Command Chips */}
        <div>
          <p className="text-[11px] font-black text-[#d4af37] uppercase tracking-widest mb-3 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#f3e5ab]" /> Tap to Speak Command:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-60 overflow-y-auto pr-1">
            {(Array.isArray(sampleCommands) ? sampleCommands : []).map((cmd, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleQuickCommand(cmd.text)}
                className="flex items-center gap-3 p-3 bg-white/[0.03] hover:bg-white/[0.08] text-slate-200 font-extrabold text-xs sm:text-sm rounded-2xl border border-white/10 hover:border-amber-400/40 shadow-sm transition-all text-left group"
              >
                <span className="text-xl group-hover:scale-110 transition-transform">{cmd.icon}</span>
                <span className="truncate group-hover:text-[#f3e5ab] transition-colors">{cmd.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
