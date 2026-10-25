import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { PROFESSIONS } from '../styles/theme'
import { useVoice } from '../context/VoiceContext'
import { getTranslation } from '../utils/translations'
import { User, Star, MapPin, Globe, Mic, ShieldCheck, Sparkles, LogOut, Phone, UserPlus, LogIn, ArrowRight } from 'lucide-react'
import toast from 'react-hot-toast'

export default function ProfilePage() {
  const navigate = useNavigate()
  const { selectedLang, startListening } = useVoice()
  const t = getTranslation(selectedLang)

  const [user, setUser] = useState(() => {
    try {
      const u = localStorage.getItem('user') || sessionStorage.getItem('user')
      return u ? JSON.parse(u) : null
    } catch (e) {
      return null
    }
  })

  const displayName = user?.name ? user.name.trim() : null
  const profCategory = (user?.skill || user?.preferredJob || user?.category || 'DRIVER').toUpperCase()
  const prof = PROFESSIONS[profCategory] || PROFESSIONS.DRIVER

  const handleUpdateProfileVoice = () => {
    toast.success('Speak to update your profile details...')
    startListening(navigate)
  }

  const handleLogout = () => {
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    localStorage.removeItem('user_explicit_login')
    sessionStorage.removeItem('user')
    sessionStorage.removeItem('token')
    setUser(null)
    toast.success('Logged out successfully.')
    navigate('/jobs')
  }

  return (
    <div className="space-y-6 pb-12 max-w-3xl mx-auto">
      {/* Profile Header Hero Card */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white rounded-3xl p-8 shadow-2xl border-4 border-blue-500 text-center relative overflow-hidden">
        {/* Large Avatar Badge */}
        <div className="relative inline-block mb-4">
          <div className="w-28 h-28 rounded-full bg-gradient-to-br from-blue-400 to-indigo-600 border-4 border-white flex items-center justify-center text-6xl shadow-2xl mx-auto">
            {prof?.icon || '👤'}
          </div>
          {displayName && (
            <span className="absolute bottom-0 right-0 w-8 h-8 bg-emerald-500 border-2 border-white rounded-full flex items-center justify-center text-xs font-black text-white">
              ✓
            </span>
          )}
        </div>

        <h1 className="text-3xl font-black">
          {displayName || 'Guest User'}
        </h1>
        
        {/* Profession Badge Pill or Guest Tag */}
        {displayName ? (
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30 font-extrabold text-base mt-2">
            <span>{prof.icon}</span>
            <span>{user?.skill || prof.title}</span>
          </div>
        ) : (
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30 font-extrabold text-sm mt-2">
            <span>👋 Browsing as Guest</span>
          </div>
        )}

        {/* Profile Completion or Guest Prompt */}
        {displayName ? (
          <div className="mt-6 max-w-sm mx-auto bg-blue-950/60 p-4 rounded-2xl border border-blue-400/20">
            <div className="flex items-center justify-between text-xs font-black mb-1.5">
              <span className="text-blue-300 uppercase tracking-wider">{t.profileCompletion}</span>
              <span className="text-amber-400 font-extrabold text-sm">{user?.profileCompletion || '85%'}</span>
            </div>
            <div className="w-full h-3 bg-blue-900 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-amber-400 to-emerald-400 rounded-full w-[85%]" />
            </div>
          </div>
        ) : (
          <div className="mt-6 max-w-md mx-auto bg-blue-950/70 p-4 rounded-2xl border border-blue-400/30">
            <p className="text-sm text-blue-200 font-semibold mb-3">
              You are currently using VoiceHire without a registered session. Create a profile to save applications and get contacted by employers.
            </p>
            <div className="flex items-center justify-center gap-3">
              <Link
                to="/register"
                className="px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-sm rounded-xl shadow-md transition-all active:scale-95 inline-flex items-center gap-1.5"
              >
                <UserPlus className="w-4 h-4" />
                <span>Register Now</span>
              </Link>
              <Link
                to="/login"
                className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white font-extrabold text-sm rounded-xl border border-white/20 transition-all inline-flex items-center gap-1.5"
              >
                <LogIn className="w-4 h-4" />
                <span>Log In</span>
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Profile Information List (If logged in) */}
      {displayName && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-slate-100 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-xl font-black text-slate-900">{t.profileTitle}</h3>
            <span className="text-xs font-black bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full uppercase">
              {user?.accountStatus || 'ACTIVE'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <User className="w-6 h-6 text-blue-600 shrink-0" />
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase">Full Name</p>
                <p className="text-lg font-black text-slate-900">{displayName}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <span className="text-2xl">{prof.icon}</span>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase">Profession</p>
                <p className="text-lg font-black text-slate-900">{user?.skill || prof.title}</p>
              </div>
            </div>

            {user?.phoneNumber && (
              <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-200">
                <Phone className="w-6 h-6 text-emerald-600 shrink-0" />
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase">Phone Number</p>
                  <p className="text-lg font-black text-slate-900">{user.phoneNumber}</p>
                </div>
              </div>
            )}

            <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <Star className="w-6 h-6 text-amber-500 shrink-0" />
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase">{t.experience}</p>
                <p className="text-lg font-black text-slate-900">{user?.experience || '1+ Year'}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <MapPin className="w-6 h-6 text-emerald-600 shrink-0" />
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase">{t.location}</p>
                <p className="text-lg font-black text-slate-900">{user?.location || user?.preferredLocation || 'Bengaluru'}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-200 col-span-1 sm:col-span-2">
              <Globe className="w-6 h-6 text-purple-600 shrink-0" />
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase">Preferred Language</p>
                <p className="text-lg font-black text-slate-900">{user?.preferredLanguage || 'English / Regional'}</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={handleUpdateProfileVoice}
              className="flex-1 py-4 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-black text-base rounded-2xl shadow-xl flex items-center justify-center gap-2 border border-blue-400/30 active:scale-95 transition-transform"
            >
              <Mic className="w-5 h-5 animate-pulse" />
              <span>{t.updateProfileVoice}</span>
            </button>

            <button
              type="button"
              onClick={handleLogout}
              className="px-6 py-4 bg-rose-50 hover:bg-rose-100 text-rose-700 border-2 border-rose-200 font-black text-base rounded-2xl shadow transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              <LogOut className="w-5 h-5" />
              <span>Log Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
