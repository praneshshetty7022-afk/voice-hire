import React from 'react'
import { Mic, MicOff, CheckCircle2, Loader2, Sparkles } from 'lucide-react'
import { getTranslation } from '../utils/translations'

export default function HeroVoiceMic({ voiceState = 'IDLE', onMicClick, lang = 'en', transcript = '' }) {
  const t = getTranslation(lang)

  return (
    <div className="flex flex-col items-center justify-center my-6 text-center">
      {/* Voice Status Fluid Capsule */}
      <div className="mb-6 min-h-[36px] flex items-center justify-center">
        {voiceState === 'IDLE' && (
          <span className="text-slate-200 font-extrabold text-sm sm:text-base flex items-center gap-2 bg-slate-800/80 backdrop-blur-xl px-5 py-2 rounded-full border border-cyan-500/30 shadow-sm">
            <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-cyan-200 font-black">{t.tapToSpeak}</span>
          </span>
        )}

        {voiceState === 'LISTENING' && (
          <span className="text-cyan-300 font-black text-sm sm:text-base flex items-center gap-2 bg-cyan-500/15 backdrop-blur-xl px-6 py-2.5 rounded-full border border-cyan-400/50 shadow-[0_0_20px_rgba(56,189,248,0.35)] animate-bounce">
            <span className="w-2.5 h-2.5 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full animate-ping" />
            <span>{t.listening}</span>
          </span>
        )}

        {voiceState === 'PROCESSING' && (
          <span className="text-sky-300 font-black text-sm sm:text-base flex items-center gap-2 bg-sky-500/15 backdrop-blur-xl px-6 py-2 rounded-full border border-sky-400/40">
            <Loader2 className="w-5 h-5 animate-spin text-sky-400" />
            <span>{t.findingJobs}</span>
          </span>
        )}

        {voiceState === 'SUCCESS' && (
          <span className="text-emerald-300 font-black text-sm sm:text-base flex items-center gap-2 bg-emerald-500/15 backdrop-blur-xl px-6 py-2 rounded-full border border-emerald-400/40 shadow-sm">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <span>{t.jobsFound}</span>
          </span>
        )}

        {voiceState === 'ERROR' && (
          <span className="text-rose-400 font-black text-sm sm:text-base flex items-center gap-2 bg-rose-500/15 backdrop-blur-xl px-5 py-2 rounded-full border border-rose-400/40">
            <MicOff className="w-5 h-5 text-rose-400" />
            <span>{t.couldNotHear}</span>
          </span>
        )}
      </div>

      {/* Multi-Layered Vibrant Sapphire & Cyan Voice Orb */}
      <div className="relative flex items-center justify-center p-6">
        {/* Layer 1: Ambient Reflection Flare Glow */}
        <div className="absolute w-48 h-48 sm:w-56 sm:h-56 rounded-full bg-gradient-to-tr from-blue-600/25 via-sky-400/20 to-transparent blur-2xl pointer-events-none" />

        {/* Layer 2: Translucent Glass Ring with Pulse */}
        <div className="absolute w-36 h-36 sm:w-44 sm:h-44 rounded-full border border-cyan-400/30 bg-white/[0.03] backdrop-blur-xl pointer-events-none animate-pulse" />

        {/* Dynamic Waveform Rings when listening */}
        {voiceState === 'LISTENING' && (
          <>
            <div className="absolute w-44 h-44 sm:w-52 sm:h-52 rounded-full border border-cyan-400/50 bg-cyan-400/10 animate-ping pointer-events-none" />
            <div className="absolute w-40 h-40 sm:w-48 sm:h-48 rounded-full border border-sky-300/30 animate-pulse pointer-events-none" />
          </>
        )}

        {/* Layer 3: Core Interactive Vibrant Blue/Cyan Orb Button */}
        <button
          type="button"
          onClick={onMicClick}
          className={`w-28 h-28 sm:w-32 sm:h-32 rounded-full flex flex-col items-center justify-center transition-all duration-300 transform active:scale-95 border-2 relative z-10 overflow-hidden group shadow-lg ${
            voiceState === 'IDLE'
              ? 'bg-gradient-to-br from-blue-600 via-sky-500 to-cyan-400 text-white border-cyan-300/80 hover:scale-105 shadow-[0_10px_35px_rgba(37,99,235,0.45)]'
              : voiceState === 'LISTENING'
              ? 'bg-gradient-to-br from-blue-600 via-sky-500 to-cyan-400 text-white border-cyan-200 scale-105 ring-4 ring-cyan-400/40 shadow-[0_0_40px_rgba(56,189,248,0.55)]'
              : voiceState === 'PROCESSING'
              ? 'bg-gradient-to-br from-sky-500 to-indigo-600 text-white border-sky-300'
              : voiceState === 'SUCCESS'
              ? 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white border-emerald-300 shadow-emerald-500/50'
              : 'bg-gradient-to-br from-slate-700 to-slate-900 text-white border-slate-500'
          }`}
        >
          {/* Continuous Glass Sheen Highlight */}
          <div className="absolute inset-0 bg-gradient-to-tr from-white/30 via-transparent to-transparent opacity-60 pointer-events-none" />

          {voiceState === 'IDLE' && <Mic className="w-12 h-12 stroke-[2.5] text-white group-hover:scale-110 transition-transform" />}

          {voiceState === 'LISTENING' && (
            <div className="flex items-center gap-1.5 h-10 z-10">
              <span className="w-2.5 bg-white rounded-full wave-bar-1" />
              <span className="w-2.5 bg-white rounded-full wave-bar-2" />
              <span className="w-2.5 bg-white rounded-full wave-bar-3" />
              <span className="w-2.5 bg-white rounded-full wave-bar-4" />
              <span className="w-2.5 bg-white rounded-full wave-bar-5" />
            </div>
          )}

          {voiceState === 'PROCESSING' && (
            <Loader2 className="w-12 h-12 animate-spin stroke-[2.5] text-white" />
          )}

          {voiceState === 'SUCCESS' && (
            <CheckCircle2 className="w-12 h-12 stroke-[2.5] text-white" />
          )}

          {voiceState === 'ERROR' && (
            <MicOff className="w-12 h-12 stroke-[2.5] text-white" />
          )}
        </button>
      </div>

      {/* Spoken Transcript Preview */}
      {transcript && (
        <div className="mt-2 max-w-md mx-auto px-4 py-2 bg-slate-800/80 rounded-2xl border border-cyan-500/30 text-xs font-bold text-cyan-300 animate-fade-in shadow-sm">
          <span>{transcript}</span>
        </div>
      )}
    </div>
  )
}
