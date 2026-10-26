import React from 'react'
import { Mic, MicOff, CheckCircle2, Loader2, Sparkles } from 'lucide-react'
import { getTranslation } from '../utils/translations'
import VoiceWaveform from './VoiceWaveform'

/**
 * HeroVoiceMic Component
 * 
 * Central voice-search interaction area featuring:
 * - Symmetrical decorative audio waveforms flanking the microphone
 * - Dynamic microphone glow and waveform animation connected to actual recording state
 * - Soft animated ambient light halo around the voice-search area
 * - Return to calm tranquil idle state when recording stops
 */
export default function HeroVoiceMic({ voiceState = 'IDLE', onMicClick, lang = 'en', transcript = '' }) {
  const t = getTranslation(lang)
  const isListening = voiceState === 'LISTENING'

  return (
    <div className="flex flex-col items-center justify-center my-4 text-center relative z-10">
      {/* 1. Voice Status Fluid Capsule */}
      <div className="mb-6 min-h-[40px] flex items-center justify-center">
        {voiceState === 'IDLE' && (
          <span className="text-slate-700 font-extrabold text-sm sm:text-base flex items-center gap-2 bg-white/90 backdrop-blur-xl px-5 py-2 rounded-full border border-blue-200/80 shadow-[0_4px_20px_rgba(37,99,235,0.06)] transition-all hover:border-blue-300">
            <Sparkles className="w-4 h-4 text-blue-600 animate-pulse" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 via-indigo-600 to-sky-600 font-black">
              {t.tapToSpeak}
            </span>
          </span>
        )}

        {voiceState === 'LISTENING' && (
          <span className="text-blue-700 font-black text-sm sm:text-base flex items-center gap-2.5 bg-blue-50/95 backdrop-blur-xl px-6 py-2.5 rounded-full border border-blue-400 shadow-[0_0_25px_rgba(37,99,235,0.25)] animate-bounce">
            <span className="w-2.5 h-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full animate-ping" />
            <span>{t.listening}</span>
          </span>
        )}

        {voiceState === 'PROCESSING' && (
          <span className="text-indigo-700 font-black text-sm sm:text-base flex items-center gap-2 bg-indigo-50/90 backdrop-blur-xl px-6 py-2 rounded-full border border-indigo-200 shadow-sm">
            <Loader2 className="w-5 h-5 animate-spin text-indigo-600" />
            <span>{t.findingJobs}</span>
          </span>
        )}

        {voiceState === 'SUCCESS' && (
          <span className="text-emerald-700 font-black text-sm sm:text-base flex items-center gap-2 bg-emerald-50/90 backdrop-blur-xl px-6 py-2 rounded-full border border-emerald-300 shadow-sm">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <span>{t.jobsFound}</span>
          </span>
        )}

        {voiceState === 'ERROR' && (
          <span className="text-rose-700 font-black text-sm sm:text-base flex items-center gap-2 bg-rose-50/90 backdrop-blur-xl px-5 py-2 rounded-full border border-rose-300 shadow-sm">
            <MicOff className="w-5 h-5 text-rose-600" />
            <span>{t.couldNotHear}</span>
          </span>
        )}
      </div>

      {/* 2. Interactive Voice Search Area with Flanking Waveforms & Ambient Light */}
      <div className="relative flex items-center justify-center gap-2 sm:gap-6 p-4">
        {/* Soft Animated Ambient Light Aura */}
        <div
          className={`absolute rounded-full blur-3xl pointer-events-none transition-all duration-700 ${
            isListening
              ? 'w-64 h-64 sm:w-80 sm:h-80 bg-gradient-to-tr from-blue-500/35 via-sky-400/30 to-indigo-500/30 scale-125 animate-pulse'
              : 'w-52 h-52 sm:w-64 sm:h-64 bg-gradient-to-tr from-blue-400/20 via-indigo-300/15 to-sky-300/15 scale-100'
          }`}
        />

        {/* Left Decorative Waveform */}
        <VoiceWaveform voiceState={voiceState} side="left" />

        {/* Central Voice Mic Button with Dynamic Concentric Glow Rings */}
        <div className="relative flex items-center justify-center">
          {/* Outer Concentric Translucent Ring */}
          <div
            className={`absolute rounded-full border pointer-events-none transition-all duration-500 ${
              isListening
                ? 'w-40 h-40 sm:w-48 sm:h-48 border-blue-400/50 bg-blue-100/30 animate-ping'
                : 'w-36 h-36 sm:w-44 sm:h-44 border-blue-200/60 bg-blue-50/20 animate-pulse'
            }`}
          />

          {/* Inner Soft Ring */}
          {isListening && (
            <div className="absolute w-36 h-36 sm:w-44 sm:h-44 rounded-full border border-indigo-400/40 bg-indigo-100/20 animate-pulse pointer-events-none" />
          )}

          {/* Core Interactive Royal Blue Microphone Button */}
          <button
            type="button"
            onClick={onMicClick}
            aria-label={isListening ? 'Stop voice recording' : 'Start voice search'}
            className={`w-28 h-28 sm:w-32 sm:h-32 rounded-full flex flex-col items-center justify-center transition-all duration-300 transform active:scale-95 border-2 relative z-10 overflow-hidden group shadow-lg ${
              voiceState === 'IDLE'
                ? 'bg-gradient-to-br from-blue-600 via-blue-500 to-indigo-600 text-white border-blue-300/80 hover:scale-105 shadow-[0_12px_35px_rgba(37,99,235,0.35)] hover:shadow-[0_16px_45px_rgba(37,99,235,0.45)]'
                : voiceState === 'LISTENING'
                ? 'bg-gradient-to-br from-blue-600 via-sky-500 to-indigo-600 text-white border-white scale-105 ring-4 ring-blue-400/40 shadow-[0_0_40px_rgba(37,99,235,0.55)]'
                : voiceState === 'PROCESSING'
                ? 'bg-gradient-to-br from-indigo-500 to-blue-600 text-white border-indigo-300 shadow-md'
                : voiceState === 'SUCCESS'
                ? 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white border-emerald-300 shadow-[0_0_30px_rgba(16,185,129,0.35)]'
                : 'bg-gradient-to-br from-slate-600 to-slate-800 text-white border-slate-400'
            }`}
          >
            {/* Glass Sheen Reflection Highlight */}
            <div className="absolute inset-0 bg-gradient-to-tr from-white/35 via-transparent to-transparent opacity-75 pointer-events-none" />

            {voiceState === 'IDLE' && (
              <Mic className="w-12 h-12 stroke-[2.5] text-white group-hover:scale-110 transition-transform duration-300" />
            )}

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

        {/* Right Decorative Waveform */}
        <VoiceWaveform voiceState={voiceState} side="right" />
      </div>

      {/* 3. Spoken Transcript Preview */}
      {transcript && (
        <div className="mt-3 max-w-md mx-auto px-4 py-2.5 bg-white/95 backdrop-blur-xl rounded-2xl border border-blue-200/90 text-xs sm:text-sm font-bold text-blue-900 animate-fade-in shadow-[0_4px_20px_rgba(37,99,235,0.08)]">
          <span>{transcript}</span>
        </div>
      )}
    </div>
  )
}
