import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useVoice } from '../context/VoiceContext'
import { getTranslation } from '../utils/translations'
import HeroVoiceMic from '../components/HeroVoiceMic'
import ProfessionCard from '../components/ProfessionCard'
import { PROFESSIONS } from '../styles/theme'
import { Sparkles, ArrowRight } from 'lucide-react'

export default function WorkerDashboardPage() {
  const navigate = useNavigate()
  const { selectedLang, voiceState, debugLog, startListening } = useVoice()
  const t = getTranslation(selectedLang)

  const handleProfessionSelect = (profKey) => {
    navigate(`/jobs-list?category=${profKey}`)
  }

  const handleMicTap = () => {
    startListening(navigate)
  }

  const handleSuggestionClick = (phraseText) => {
    // Fill search or start voice processing with suggestion phrase
    navigate(`/jobs-list?search=${encodeURIComponent(phraseText)}`)
  }

  const professionKeys = Object.keys(PROFESSIONS)

  return (
    <div className="space-y-8 pb-12">
      {/* Top Greeting & Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden border border-blue-500/30">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30 text-sm font-extrabold mb-3">
            <Sparkles className="w-4 h-4 text-blue-400" />
            <span>Voice-First Employment Platform</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
            {t.greetingMorning} <span className="text-amber-400">Pranesh 👋</span>
          </h1>
          <p className="text-lg sm:text-xl font-bold text-blue-100 mt-2">
            {t.heroQuestion}
          </p>
        </div>

        {/* Ambient Radial Background Pattern */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Central HERO VOICE BUTTON Component */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border-2 border-slate-100">
        <HeroVoiceMic
          voiceState={voiceState}
          onMicClick={handleMicTap}
          lang={selectedLang}
          transcript={debugLog?.rawSpeech}
        />

        {/* Voice Command Suggestions */}
        <div className="mt-8 pt-6 border-t border-slate-100">
          <p className="text-sm font-black text-slate-500 uppercase tracking-wider mb-3 flex items-center justify-center gap-1.5">
            <span>{t.trySaying}</span>
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2.5">
            {t.voiceCommands.map((cmd, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSuggestionClick(cmd.replace(/🎤|"/g, '').trim())}
                className="px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-900 font-extrabold text-sm rounded-full border border-blue-200 shadow-sm transition-all hover:scale-105 active:scale-95 text-center"
              >
                {cmd}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Popular Professions Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <div>
            <h2 className="text-2xl font-black text-slate-900">{t.chooseWork}</h2>
            <p className="text-sm font-semibold text-slate-500">{t.popularProfessions}</p>
          </div>

          <button
            type="button"
            onClick={() => navigate('/jobs-list')}
            className="flex items-center gap-1 text-blue-600 font-extrabold hover:text-blue-700 text-sm sm:text-base group"
          >
            <span>{t.viewAllJobs}</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* 2-Column Mobile / 4-Column Desktop Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {professionKeys.map((profKey) => (
            <ProfessionCard
              key={profKey}
              professionKey={profKey}
              lang={selectedLang}
              onClick={handleProfessionSelect}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
