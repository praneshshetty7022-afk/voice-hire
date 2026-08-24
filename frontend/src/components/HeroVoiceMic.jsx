import React from 'react'
import { Mic, MicOff, CheckCircle2, Loader2, Sparkles, RefreshCw } from 'lucide-react'
import { getTranslation } from '../utils/translations'

export default function HeroVoiceMic({ voiceState = 'IDLE', onMicClick, lang = 'en', transcript = '' }) {
  const t = getTranslation(lang)

  return (
    <div className="flex flex-col items-center justify-center my-6 text-center">
      {/* Voice Status Text Banner */}
      <div className="mb-4 min-h-[32px] flex items-center justify-center">
        {voiceState === 'IDLE' && (
          <span className="text-slate-600 font-extrabold text-lg flex items-center gap-2 bg-blue-50 px-4 py-1.5 rounded-full border border-blue-200">
            <Sparkles className="w-5 h-5 text-blue-600 animate-pulse" />
            {t.tapToSpeak}
          </span>
        )}

        {voiceState === 'LISTENING' && (
          <span className="text-blue-700 font-black text-xl flex items-center gap-2 bg-blue-100 px-5 py-2 rounded-full animate-bounce">
            <span className="w-3 h-3 bg-red-500 rounded-full animate-ping" />
            {t.listening}
          </span>
        )}

        {voiceState === 'PROCESSING' && (
          <span className="text-amber-700 font-black text-xl flex items-center gap-2 bg-amber-100 px-5 py-2 rounded-full">
            <Loader2 className="w-6 h-6 animate-spin text-amber-600" />
            {t.findingJobs}
          </span>
        )}

        {voiceState === 'SUCCESS' && (
          <span className="text-emerald-700 font-black text-xl flex items-center gap-2 bg-emerald-100 px-5 py-2 rounded-full">
            <CheckCircle2 className="w-6 h-6 text-emerald-600" />
            {t.jobsFound}
          </span>
        )}

        {voiceState === 'ERROR' && (
          <span className="text-rose-700 font-black text-lg flex items-center gap-2 bg-rose-100 px-4 py-1.5 rounded-full">
            <MicOff className="w-5 h-5 text-rose-600" />
            {t.couldNotHear}
          </span>
        )}
      </div>

      {/* Main 110px Circular Microphone Button */}
      <div className="relative flex items-center justify-center">
        {/* Outer Glow Ring Animations */}
        {voiceState === 'LISTENING' && (
          <div className="absolute w-36 h-36 rounded-full bg-blue-500/20 animate-ping pointer-events-none" />
        )}
        
        <button
          type="button"
          onClick={onMicClick}
          className={`w-28 h-28 sm:w-32 sm:h-32 rounded-full flex flex-col items-center justify-center shadow-2xl transition-all duration-300 transform active:scale-90 border-4 ${
            voiceState === 'IDLE'
              ? 'bg-gradient-to-br from-blue-600 via-indigo-600 to-blue-800 text-white border-blue-400 hover:scale-105 animate-mic-pulse'
              : voiceState === 'LISTENING'
              ? 'bg-gradient-to-br from-red-500 to-rose-600 text-white border-red-300 scale-105 shadow-red-500/50'
              : voiceState === 'PROCESSING'
              ? 'bg-gradient-to-br from-amber-500 to-orange-600 text-white border-amber-300'
              : voiceState === 'SUCCESS'
              ? 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white border-emerald-300 shadow-emerald-500/50'
              : 'bg-gradient-to-br from-slate-700 to-slate-900 text-white border-slate-500'
          }`}
        >
          {voiceState === 'IDLE' && <Mic className="w-12 h-12 stroke-[2.5]" />}

          {voiceState === 'LISTENING' && (
            <div className="flex items-center gap-1.5 h-10">
              <span className="w-2 bg-white rounded-full wave-bar-1" />
              <span className="w-2 bg-white rounded-full wave-bar-2" />
              <span className="w-2 bg-white rounded-full wave-bar-3" />
              <span className="w-2 bg-white rounded-full wave-bar-4" />
              <span className="w-2 bg-white rounded-full wave-bar-5" />
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

      {/* Live Transcript Display Pill */}
      {transcript && (
        <div className="mt-4 px-6 py-2 bg-white border-2 border-blue-200 shadow-md rounded-2xl max-w-lg">
          <p className="text-xs font-extrabold text-blue-600 uppercase tracking-wider">{t.youSaid}</p>
          <p className="text-slate-900 font-black text-lg italic mt-0.5">"{transcript}"</p>
        </div>
      )}
    </div>
  )
}
