import React, { useState } from 'react'
import { useVoice } from '../context/VoiceContext'
import { Terminal, ChevronDown, ChevronUp, Cpu, Database, Activity, Mic, AlertTriangle } from 'lucide-react'

export const VoiceDebugPanel = () => {
  const { debugLog, voiceState, contextMemory, selectedLang } = useVoice()
  const [isOpen, setIsOpen] = useState(true)

  if (import.meta.env?.PROD) return null

  const isSupported = debugLog.isSupported !== false ? 'YES' : 'NO'
  const micPermission = debugLog.micPermission || 'UNKNOWN'
  const lang = debugLog.lang || selectedLang || 'en-IN'
  const recognitionError = debugLog.recognitionError || 'none'
  const recordingStatus = debugLog.recordingStatus || 'READY'

  return (
    <div className="fixed top-20 right-4 z-50 max-w-sm w-full bg-[#0c0c0e]/95 backdrop-blur-2xl text-white rounded-2xl shadow-glass-edge border border-amber-400/30 font-mono text-xs overflow-hidden">
      
      {/* Header Bar */}
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="bg-white/[0.04] px-4 py-2.5 flex items-center justify-between cursor-pointer border-b border-white/10"
      >
        <div className="flex items-center gap-2 text-[#f3e5ab] font-bold">
          <Terminal className="w-4 h-4 text-[#d4af37] animate-pulse" />
          <span className="text-[11px] uppercase tracking-wider">VOICE TELEMETRY HUD</span>
        </div>
        <button className="text-slate-400 hover:text-white">
          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {/* Expanded Log Inspector */}
      {isOpen && (
        <div className="p-3 space-y-2 bg-transparent">
          
          {/* Recognition Supported & Mic Permission */}
          <div className="grid grid-cols-2 gap-1.5 bg-white/[0.025] p-2 rounded-xl border border-white/5">
            <div>
              <span className="text-slate-500 block text-[10px]">Supported:</span>
              <span className={`font-black ${isSupported === 'YES' ? 'text-emerald-400' : 'text-rose-400'}`}>
                {isSupported}
              </span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px]">Mic Permission:</span>
              <span className={`font-black ${
                micPermission === 'GRANTED' ? 'text-emerald-400' :
                micPermission === 'DENIED' ? 'text-rose-400' : 'text-amber-400'
              }`}>
                {micPermission}
              </span>
            </div>
          </div>

          {/* Language & Pipeline Status */}
          <div className="grid grid-cols-2 gap-1.5 bg-white/[0.025] p-2 rounded-xl border border-white/5">
            <div>
              <span className="text-slate-500 block text-[10px]">Language:</span>
              <span className="font-bold text-[#f3e5ab]">{lang}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px]">Status:</span>
              <span className={`font-black px-1.5 py-0.5 rounded text-[10px] uppercase ${
                voiceState === 'LISTENING' ? 'bg-amber-500 text-[#050505] animate-pulse font-black' :
                voiceState === 'PROCESSING' ? 'bg-amber-400/20 text-[#f3e5ab] animate-pulse' :
                voiceState === 'SUCCESS' ? 'bg-emerald-600/40 text-emerald-300' :
                voiceState === 'ERROR' ? 'bg-rose-600/40 text-rose-300' : 'bg-white/[0.05] text-slate-300'
              }`}>
                {voiceState}
              </span>
            </div>
          </div>

          {/* Raw Speech / Transcript */}
          <div className="bg-white/[0.025] p-2 rounded-xl border border-white/5">
            <div className="text-slate-400 font-bold flex items-center gap-1">
              <Mic className="w-3.5 h-3.5 text-[#d4af37]" /> Transcript:
            </div>
            <div className="text-white font-black text-xs truncate mt-0.5">
              {debugLog.rawSpeech ? `"${debugLog.rawSpeech}"` : '(none)'}
            </div>
          </div>

          {/* Recognition Error & Audio Recording Status */}
          <div className="grid grid-cols-2 gap-1.5 bg-white/[0.025] p-2 rounded-xl border border-white/5">
            <div>
              <span className="text-slate-500 block text-[10px]">Recognition Error:</span>
              <span className={`font-bold ${recognitionError === 'none' ? 'text-slate-400' : 'text-rose-400'}`}>
                {recognitionError}
              </span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px]">Audio Recording:</span>
              <span className="font-bold text-amber-300">{recordingStatus}</span>
            </div>
          </div>

          {/* Extracted Intent & Category/Location */}
          <div className="bg-white/[0.025] p-2 rounded-xl border border-white/5 space-y-1">
            <div className="flex justify-between">
              <span className="text-slate-500">Intent:</span>
              <span className="text-[#f3e5ab] font-bold">{debugLog.intent || 'IDLE'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Category:</span>
              <span className="text-emerald-400 font-bold">{debugLog.entities?.category || 'ALL'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Location:</span>
              <span className="text-[#d4af37] font-bold">{debugLog.entities?.location || 'ALL'}</span>
            </div>
          </div>

        </div>
      )}
    </div>
  )
}

export default VoiceDebugPanel

