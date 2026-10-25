import React from 'react'
import { Mic, MicOff, CheckCircle2, Loader2, Sparkles, RefreshCw } from 'lucide-react'
import { getTranslation } from '../utils/translations'

export default function HeroVoiceMic({ voiceState = 'IDLE', onMicClick, lang = 'en', transcript = '' }) {
  const t = getTranslation(lang)

  return (
    <div className="flex flex-col items-center justify-center my-6 text-center">
      {/* Voice Status Fluid Capsule */}
      <div className="mb-6 min-h-[36px] flex items-center justify-center">
        {voiceState === 'IDLE' && (
          <span className="text-slate-200 font-extrabold text-sm sm:text-base flex items-center gap-2 bg-white/[0.05] backdrop-blur-xl px-5 py-2 rounded-full border border-white/15 shadow-glass-edge">
            <Sparkles className="w-4 h-4 text-[#f3e5ab] animate-pulse" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#d4af37] via-[#f3e5ab] to-white">{t.tapToSpeak}</span>
          </span>
        )}

        {voiceState === 'LISTENING' && (
          <span className="text-[#f3e5ab] font-black text-sm sm:text-base flex items-center gap-2 bg-amber-500/10 backdrop-blur-xl px-6 py-2.5 rounded-full border border-amber-400/40 shadow-liquid-gold animate-bounce">
            <span className="w-2.5 h-2.5 bg-gradient-to-r from-[#d4af37] to-amber-500 rounded-full animate-ping" />
            <span>{t.listening}</span>
          </span>
        )}

        {voiceState === 'PROCESSING' && (
          <span className="text-[#f3e5ab] font-black text-sm sm:text-base flex items-center gap-2 bg-amber-400/10 backdrop-blur-xl px-6 py-2 rounded-full border border-amber-400/30">
            <Loader2 className="w-5 h-5 animate-spin text-[#d4af37]" />
            <span>{t.findingJobs}</span>
          </span>
        )}

        {voiceState === 'SUCCESS' && (
          <span className="text-emerald-400 font-black text-sm sm:text-base flex items-center gap-2 bg-emerald-500/10 backdrop-blur-xl px-6 py-2 rounded-full border border-emerald-400/30">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <span>{t.jobsFound}</span>
          </span>
        )}

        {voiceState === 'ERROR' && (
          <span className="text-rose-400 font-black text-sm sm:text-base flex items-center gap-2 bg-rose-500/10 backdrop-blur-xl px-5 py-2 rounded-full border border-rose-400/30">
            <MicOff className="w-5 h-5 text-rose-400" />
            <span>{t.couldNotHear}</span>
          </span>
        )}
      </div>

      {/* Multi-Layered OPPO Liquid Glass Orb */}
      <div className="relative flex items-center justify-center p-6">
        {/* Layer 1: Ambient Reflection Flare Glow */}
        <div className="absolute w-48 h-48 sm:w-56 sm:h-56 rounded-full bg-gradient-to-tr from-[#d4af37]/20 via-[#f3e5ab]/10 to-transparent blur-2xl pointer-events-none" />

        {/* Layer 2: Translucent Glass Ring with Liquid Pulse Keyframe */}
        <div className="absolute w-36 h-36 sm:w-44 sm:h-44 rounded-full border border-amber-400/30 bg-white/[0.02] backdrop-blur-xl shadow-glass-edge pointer-events-none animate-liquid-pulse" />

        {/* Dynamic Waveform Rings when listening */}
        {voiceState === 'LISTENING' && (
          <>
            <div className="absolute w-44 h-44 sm:w-52 sm:h-52 rounded-full border border-amber-400/40 bg-amber-400/5 animate-ping pointer-events-none" />
            <div className="absolute w-40 h-40 sm:w-48 sm:h-48 rounded-full border border-[#f3e5ab]/20 animate-pulse pointer-events-none" />
          </>
        )}

        {/* Layer 3: Core Interactive Metallic Gold Orb Button */}
        <button
          type="button"
          onClick={onMicClick}
          className={`w-28 h-28 sm:w-32 sm:h-32 rounded-full flex flex-col items-center justify-center shadow-liquid-gold transition-all duration-300 transform active:scale-95 border-2 relative z-10 overflow-hidden group ${
            voiceState === 'IDLE'
              ? 'bg-gradient-to-br from-[#d4af37] via-[#f3e5ab] to-[#aa7c11] text-[#050505] border-amber-200/80 hover:scale-105'
              : voiceState === 'LISTENING'
              ? 'bg-gradient-to-br from-[#d4af37] via-[#f3e5ab] to-[#aa7c11] text-[#050505] border-amber-300 scale-105 ring-4 ring-amber-400/30'
              : voiceState === 'PROCESSING'
              ? 'bg-gradient-to-br from-amber-500 to-orange-600 text-white border-amber-300'
              : voiceState === 'SUCCESS'
              ? 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white border-emerald-300 shadow-emerald-500/50'
              : 'bg-gradient-to-br from-slate-700 to-slate-900 text-white border-slate-500'
          }`}
        >
          {/* Continuous Glass Sheen Highlight */}
          <div className="absolute inset-0 bg-gradient-to-tr from-white/30 via-transparent to-transparent opacity-60 pointer-events-none" />

          {voiceState === 'IDLE' && <Mic className="w-12 h-12 stroke-[2.5] text-[#050505] group-hover:scale-110 transition-transform" />}

          {voiceState === 'LISTENING' && (
            <div className="flex items-center gap-1.5 h-10 z-10">
              <span className="w-2.5 bg-[#050505] rounded-full wave-bar-1" />
              <span className="w-2.5 bg-[#050505] rounded-full wave-bar-2" />
              <span className="w-2.5 bg-[#050505] rounded-full wave-bar-3" />
              <span className="w-2.5 bg-[#050505] rounded-full wave-bar-4" />
              <span className="w-2.5 bg-[#050505] rounded-full wave-bar-5" />
            </div>
          )}

          {voiceState === 'PROCESSING' && (
            <Loader2 className="w-12 h-12 animate-spin stroke-[2.5]" />
          )}

          {voiceState === 'SUCCESS' && (
            <CheckCircle2 className="w-12 h-12 stroke-[2.5]" />
          )}

          {voiceState === 'ERROR' && (
            <RefreshCw className="w-10 h-10 animate-spin" />
          )}
        </button>
      </div>

      {/* Live Transcript Display Capsule */}
      {transcript && (
        <div className="mt-5 px-6 py-3 bg-white/[0.04] backdrop-blur-2xl border border-amber-400/30 shadow-glass-edge rounded-2xl max-w-lg animate-fade-in">
          <p className="text-[11px] font-black text-[#d4af37] uppercase tracking-widest">{t.youSaid}</p>
          <p className="text-white font-extrabold text-base italic mt-1">"{transcript}"</p>
        </div>
      )}
    </div>
  )
}
