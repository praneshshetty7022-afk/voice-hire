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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl border-4 border-blue-500 w-full max-w-lg overflow-hidden relative p-6 space-y-6">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-full"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-600 to-indigo-700 text-white flex items-center justify-center mx-auto shadow-lg animate-mic-pulse border-2 border-blue-300">
            <Mic className="w-8 h-8 stroke-[2.5]" />
          </div>
          <h2 className="text-2xl font-black text-slate-900">Voice Assistant Ready</h2>
          <p className="text-sm font-bold text-slate-500">
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
            className="w-full pl-5 pr-14 py-4 bg-slate-50 border-2 border-blue-300 rounded-2xl outline-none focus:ring-4 focus:ring-blue-200 text-lg font-bold text-slate-900"
            autoFocus
          />
          <button
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md transition-transform active:scale-95"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>

        {/* Quick Voice Command Chips */}
        <div>
          <p className="text-xs font-black text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1">
            <Sparkles className="w-4 h-4 text-amber-500" /> Tap to Speak Command:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-60 overflow-y-auto pr-1">
            {(Array.isArray(sampleCommands) ? sampleCommands : []).map((cmd, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleQuickCommand(cmd.text)}
                className="flex items-center gap-3 p-3 bg-slate-50 hover:bg-blue-50 text-slate-900 font-extrabold text-sm rounded-2xl border-2 border-slate-200 hover:border-blue-400 shadow-sm transition-all text-left group"
              >
                <span className="text-xl group-hover:scale-110 transition-transform">{cmd.icon}</span>
                <span className="truncate">{cmd.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
