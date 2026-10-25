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
      <div className="bg-white/[0.035] backdrop-blur-2xl text-white rounded-3xl p-8 shadow-glass-edge border border-white/10 text-center relative overflow-hidden">
        {/* Ambient Top Glow */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-80 h-32 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />

        {/* Large Avatar Badge */}
        <div className="relative inline-block mb-4">
          <div className="w-28 h-28 rounded-full bg-gradient-to-br from-amber-400/20 via-white/[0.05] to-amber-600/20 border-2 border-amber-400/40 shadow-liquid-gold flex items-center justify-center text-6xl mx-auto backdrop-blur-xl">
            {prof?.icon || '👤'}
          </div>
          {displayName && (
            <span className="absolute bottom-0 right-0 w-8 h-8 bg-gradient-to-br from-amber-300 to-amber-500 border-2 border-[#0c0c0e] rounded-full flex items-center justify-center text-xs font-black text-slate-950 shadow-md">
              ✓
            </span>
          )}
        </div>

        <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#d4af37] via-[#f3e5ab] to-[#aa7c11]">
          {displayName || 'Guest User'}
        </h1>
        
        {/* Profession Badge Pill or Guest Tag */}
        {displayName ? (
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-400/10 text-amber-300 border border-amber-400/30 font-extrabold text-base mt-2 shadow-sm">
            <span>{prof.icon}</span>
            <span>{user?.skill || prof.title}</span>
          </div>
        ) : (
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 text-slate-300 border border-white/10 font-extrabold text-sm mt-2">
            <span>👋 Browsing as Guest</span>
          </div>
        )}

        {/* Profile Completion or Guest Prompt */}
        {displayName ? (
          <div className="mt-6 max-w-sm mx-auto bg-[#0c0c0e]/80 p-4 rounded-2xl border border-white/10 shadow-glass-edge">
            <div className="flex items-center justify-between text-xs font-black mb-1.5">
              <span className="text-slate-400 uppercase tracking-wider">{t.profileCompletion}</span>
              <span className="text-amber-400 font-extrabold text-sm">{user?.profileCompletion || '85%'}</span>
            </div>
            <div className="w-full h-2.5 bg-white/5 rounded-full overflow-hidden p-0.5 border border-white/5">
              <div className="h-full bg-gradient-to-r from-[#d4af37] via-[#f3e5ab] to-[#aa7c11] rounded-full w-[85%] shadow-liquid-gold" />
            </div>
          </div>
        ) : (
          <div className="mt-6 max-w-md mx-auto bg-[#0c0c0e]/80 p-5 rounded-2xl border border-amber-400/20 shadow-glass-edge">
            <p className="text-sm text-slate-300 font-medium mb-4 leading-relaxed">
              You are currently using VoiceHire without a registered session. Create a profile to save applications and get contacted by employers.
            </p>
            <div className="flex items-center justify-center gap-3">
              <Link
                to="/register"
                className="btn-primary px-5 py-2.5 rounded-xl text-slate-950 font-black text-sm shadow-liquid-gold inline-flex items-center gap-1.5"
              >
                <UserPlus className="w-4 h-4" />
                <span>Register Now</span>
              </Link>
              <Link
                to="/login"
                className="btn-secondary px-5 py-2.5 rounded-xl text-slate-200 font-extrabold text-sm inline-flex items-center gap-1.5"
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
        <div className="bg-white/[0.035] backdrop-blur-2xl rounded-3xl p-6 sm:p-8 border border-white/10 shadow-glass-edge space-y-5">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <h3 className="text-xl font-black text-white">{t.profileTitle}</h3>
            <span className="text-xs font-black bg-amber-400/10 text-amber-300 border border-amber-400/30 px-3 py-1 rounded-full uppercase tracking-wider">
              {user?.accountStatus || 'ACTIVE'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-4 bg-white/[0.025] hover:bg-white/[0.05] rounded-2xl border border-white/5 transition-all">
              <div className="w-10 h-10 rounded-xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-amber-400 shrink-0">
                <User className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Full Name</p>
                <p className="text-base font-black text-white">{displayName}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-white/[0.025] hover:bg-white/[0.05] rounded-2xl border border-white/5 transition-all">
              <div className="w-10 h-10 rounded-xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-xl shrink-0">
                {prof.icon}
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Profession</p>
                <p className="text-base font-black text-white">{user?.skill || prof.title}</p>
              </div>
            </div>

            {user?.phoneNumber && (
              <div className="flex items-center gap-3 p-4 bg-white/[0.025] hover:bg-white/[0.05] rounded-2xl border border-white/5 transition-all">
                <div className="w-10 h-10 rounded-xl bg-emerald-400/10 border border-emerald-400/20 flex items-center justify-center text-emerald-400 shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Phone Number</p>
                  <p className="text-base font-black text-white">{user.phoneNumber}</p>
                </div>
              </div>
            )}

            <div className="flex items-center gap-3 p-4 bg-white/[0.025] hover:bg-white/[0.05] rounded-2xl border border-white/5 transition-all">
              <div className="w-10 h-10 rounded-xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-amber-400 shrink-0">
                <Star className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{t.experience}</p>
                <p className="text-base font-black text-white">{user?.experience || '1+ Year'}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-white/[0.025] hover:bg-white/[0.05] rounded-2xl border border-white/5 transition-all">
              <div className="w-10 h-10 rounded-xl bg-cyan-400/10 border border-cyan-400/20 flex items-center justify-center text-cyan-400 shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{t.location}</p>
                <p className="text-base font-black text-white">{user?.location || user?.preferredLocation || 'Bengaluru'}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-white/[0.025] hover:bg-white/[0.05] rounded-2xl border border-white/5 transition-all col-span-1 sm:col-span-2">
              <div className="w-10 h-10 rounded-xl bg-purple-400/10 border border-purple-400/20 flex items-center justify-center text-purple-400 shrink-0">
                <Globe className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Preferred Language</p>
                <p className="text-base font-black text-white">{user?.preferredLanguage || 'English / Regional'}</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={handleUpdateProfileVoice}
              className="btn-primary flex-1 py-4 rounded-2xl font-black text-base flex items-center justify-center gap-2 shadow-liquid-gold active:scale-95 transition-all"
            >
              <Mic className="w-5 h-5 animate-pulse" />
              <span>{t.updateProfileVoice}</span>
            </button>

            <button
              type="button"
              onClick={handleLogout}
              className="px-6 py-4 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 font-black text-base rounded-2xl shadow transition-all active:scale-95 flex items-center justify-center gap-2"
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
