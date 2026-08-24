import React from 'react'
import { PROFESSIONS } from '../styles/theme'
import { useVoice } from '../context/VoiceContext'
import { getTranslation } from '../utils/translations'
import { User, Star, MapPin, Globe, Mic, ShieldCheck, Sparkles } from 'lucide-react'
import toast from 'react-hot-toast'

export default function ProfilePage() {
  const { selectedLang, startListening } = useVoice()
  const t = getTranslation(selectedLang)

  const profCategory = 'DRIVER'
  const prof = PROFESSIONS[profCategory]

  const handleUpdateProfileVoice = () => {
    toast.success('Speak to update your profile details...')
    startListening()
  }

  return (
    <div className="space-y-6 pb-12 max-w-3xl mx-auto">
      {/* Profile Header Hero Card */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white rounded-3xl p-8 shadow-2xl border-4 border-blue-500 text-center relative overflow-hidden">
        {/* Large Avatar Badge */}
        <div className="relative inline-block mb-4">
          <div className="w-28 h-28 rounded-full bg-gradient-to-br from-blue-400 to-indigo-600 border-4 border-white flex items-center justify-center text-6xl shadow-2xl mx-auto">
            🚗
          </div>
          <span className="absolute bottom-0 right-0 w-8 h-8 bg-emerald-500 border-2 border-white rounded-full flex items-center justify-center text-xs font-black text-white">
            ✓
          </span>
        </div>

        <h1 className="text-3xl font-black">Pranesh</h1>
        
        {/* Profession Badge Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30 font-extrabold text-base mt-2">
          <span>{prof.icon}</span>
          <span>{prof.title}</span>
        </div>

        {/* Profile Completion Progress Bar */}
        <div className="mt-6 max-w-sm mx-auto bg-blue-950/60 p-4 rounded-2xl border border-blue-400/20">
          <div className="flex items-center justify-between text-xs font-black mb-1.5">
            <span className="text-blue-300 uppercase tracking-wider">{t.profileCompletion}</span>
            <span className="text-amber-400 font-extrabold text-sm">80%</span>
          </div>
          <div className="w-full h-3 bg-blue-900 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-amber-400 to-emerald-400 rounded-full w-[80%]" />
          </div>
        </div>
      </div>

      {/* Profile Information List */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-slate-100 shadow-xl space-y-4">
        <h3 className="text-xl font-black text-slate-900 border-b border-slate-100 pb-3">{t.profileTitle}</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-200">
            <User className="w-6 h-6 text-blue-600 shrink-0" />
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase">Name</p>
              <p className="text-lg font-black text-slate-900">Pranesh</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-200">
            <span className="text-2xl">{prof.icon}</span>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase">Profession</p>
              <p className="text-lg font-black text-slate-900">{prof.title}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-200">
            <Star className="w-6 h-6 text-amber-500 shrink-0" />
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase">{t.experience}</p>
              <p className="text-lg font-black text-slate-900">2 Years</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-200">
            <MapPin className="w-6 h-6 text-emerald-600 shrink-0" />
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase">{t.location}</p>
              <p className="text-lg font-black text-slate-900">Bengaluru</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-200 col-span-1 sm:col-span-2">
            <Globe className="w-6 h-6 text-purple-600 shrink-0" />
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase">Preferred Language</p>
              <p className="text-lg font-black text-slate-900">తెలుగు (Telugu)</p>
            </div>
          </div>
        </div>

        {/* Update Profile by Voice Button */}
        <div className="pt-4">
          <button
            type="button"
            onClick={handleUpdateProfileVoice}
            className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-black text-lg rounded-2xl shadow-xl flex items-center justify-center gap-2 border border-blue-400/30 active:scale-95 transition-transform"
          >
            <Mic className="w-6 h-6 animate-pulse" />
            <span>{t.updateProfileVoice}</span>
          </button>
        </div>
      </div>
    </div>
  )
}
