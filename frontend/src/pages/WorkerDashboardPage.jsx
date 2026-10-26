import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useVoice } from '../context/VoiceContext'
import { getTranslation } from '../utils/translations'
import VoiceWaveform from '../components/VoiceWaveform'
import {
  Mic,
  MicOff,
  Search,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Users,
  Zap,
  TrendingUp,
  Lock,
  Briefcase,
  MapPin,
  Clock,
  RotateCcw,
  Check,
  Star
} from 'lucide-react'
import axios from '../api/axios'
import toast from 'react-hot-toast'

export default function WorkerDashboardPage() {
  const navigate = useNavigate()
  const { selectedLang, voiceState, debugLog, startListening, stopListening } = useVoice()
  const t = getTranslation(selectedLang)

  const [searchQuery, setSearchQuery] = useState('')
  const [userState, setUserState] = useState(() => {
    try {
      const u = localStorage.getItem('user') || sessionStorage.getItem('user')
      return u ? JSON.parse(u) : null
    } catch (e) {
      return null
    }
  })

  const [acceptedApps, setAcceptedApps] = useState([])

  // Live real-time sync of spoken transcript into search query
  useEffect(() => {
    if (debugLog?.rawSpeech) {
      setSearchQuery(debugLog.rawSpeech)
    }
  }, [debugLog?.rawSpeech])

  useEffect(() => {
    syncWorkerProfile()
    fetchAcceptedApps()
  }, [])

  const fetchAcceptedApps = async () => {
    try {
      const localU = JSON.parse(localStorage.getItem('user') || sessionStorage.getItem('user') || 'null')
      if (!localU) {
        setAcceptedApps([])
        return
      }
      const workerId = localU.id || localU.phoneNumber
      if (!workerId) {
        setAcceptedApps([])
        return
      }
      const res = await axios.get(`/applications/accepted?workerId=${workerId}`)
      const list = Array.isArray(res?.data)
        ? res.data
        : (Array.isArray(res?.data?.applications) ? res.data.applications : (Array.isArray(res?.data?.data) ? res.data.data : []))
      setAcceptedApps(list)
    } catch (e) {
      console.error('Failed to fetch accepted applications:', e)
      setAcceptedApps([])
    }
  }

  const syncWorkerProfile = async () => {
    try {
      const localU = JSON.parse(localStorage.getItem('user') || sessionStorage.getItem('user') || 'null')
      if (!localU) return
      const targetId = localU.id || localU.phoneNumber || localU.email
      if (!targetId) return
      const res = await axios.get(`/workers/profile?id=${targetId}`)
      if (res.data) {
        const updated = { ...localU, ...res.data }
        localStorage.setItem('user', JSON.stringify(updated))
        setUserState(updated)
      }
    } catch (e) {
      console.error('Failed to sync worker profile:', e)
    }
  }

  const handleManualRefreshStatus = async () => {
    toast.loading('Checking registration status...', { id: 'status-toast' })
    await syncWorkerProfile()
    await fetchAcceptedApps()
    toast.success('Status updated!', { id: 'status-toast' })
  }

  const currentUser = userState
  const displayName = currentUser?.name || currentUser?.fullName ? (currentUser.name || currentUser.fullName).trim() : null
  const accountStatus = currentUser?.role === 'WORKER' ? (currentUser.accountStatus || 'APPROVED') : 'APPROVED'

  const handleMicTap = () => {
    if (voiceState === 'LISTENING') {
      stopListening()
    } else {
      startListening(navigate)
    }
  }

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/jobs-list?search=${encodeURIComponent(searchQuery.trim())}`)
    } else {
      navigate('/jobs-list')
    }
  }

  const handleChipClick = (category) => {
    if (category === 'ALL') {
      navigate('/jobs-list')
    } else {
      navigate(`/jobs-list?category=${category}`)
    }
  }

  const isListening = voiceState === 'LISTENING'

  // Popular Category Items
  const CATEGORIES = [
    {
      id: 'DRIVER',
      title: 'Drivers',
      hindiTitle: 'ड्राइवर',
      count: '1,420+ Jobs',
      wage: '₹800 – ₹1,500/day',
      icon: '🚗',
      color: 'from-blue-500/10 to-blue-600/10',
      borderColor: 'hover:border-blue-400',
    },
    {
      id: 'CARPENTER',
      title: 'Carpenters',
      hindiTitle: 'बढ़ई / कारपेंटर',
      count: '890+ Jobs',
      wage: '₹900 – ₹1,600/day',
      icon: '🪚',
      color: 'from-amber-500/10 to-orange-500/10',
      borderColor: 'hover:border-amber-400',
    },
    {
      id: 'HELPER',
      title: 'General Workers',
      hindiTitle: 'श्रमिक / कामगार',
      count: '2,150+ Jobs',
      wage: '₹700 – ₹1,200/day',
      icon: '🛠️',
      color: 'from-emerald-500/10 to-teal-500/10',
      borderColor: 'hover:border-emerald-400',
    },
    {
      id: 'HOUSEHELP',
      title: 'Helpers & Cooks',
      hindiTitle: 'हेल्पर और रसोइया',
      count: '1,870+ Jobs',
      wage: '₹600 – ₹1,100/day',
      icon: '🍳',
      color: 'from-purple-500/10 to-indigo-500/10',
      borderColor: 'hover:border-purple-400',
    },
  ]

  // 5 Feature Highlights
  const FEATURES = [
    {
      title: 'Voice Search',
      desc: 'Speak in your language to find nearby jobs instantly.',
      icon: Mic,
      color: 'text-[#2563EB] bg-blue-50',
    },
    {
      title: 'Verified Workers',
      desc: 'Pre-verified employer profiles and direct contact details.',
      icon: ShieldCheck,
      color: 'text-emerald-600 bg-emerald-50',
    },
    {
      title: 'Secure Platform',
      desc: 'Zero spam, daily wage guarantees, and direct payouts.',
      icon: Lock,
      color: 'text-indigo-600 bg-indigo-50',
    },
    {
      title: 'Fast Hiring',
      desc: 'Apply in 1-tap with voice; no resumes or passwords.',
      icon: Zap,
      color: 'text-amber-600 bg-amber-50',
    },
    {
      title: 'Grow Together',
      desc: 'Build your verified work record and increase earnings.',
      icon: TrendingUp,
      color: 'text-sky-600 bg-sky-50',
    },
  ]

  return (
    <div className="space-y-12 pb-16 relative z-10">
      {/* Account Approval Status Banner if PENDING */}
      {accountStatus === 'PENDING' && (
        <div className="bg-blue-50 text-slate-800 p-5 rounded-3xl border border-blue-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-fade-in">
          <div className="flex items-center gap-4">
            <Clock className="w-8 h-8 shrink-0 text-[#2563EB] animate-pulse" />
            <div>
              <h3 className="font-black text-lg sm:text-xl text-blue-900">Registration Status: PENDING APPROVAL</h3>
              <p className="font-bold text-sm text-slate-600 mt-0.5">
                Your worker registration is waiting for admin approval.
              </p>
              <p className="text-xs font-semibold text-slate-500 mt-1">
                You can browse jobs. Once approved by Admin, applications will be enabled.
              </p>
            </div>
          </div>

          <button
            onClick={handleManualRefreshStatus}
            className="px-4 py-2.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-2xl font-black text-xs shrink-0 flex items-center gap-1.5 shadow-md active:scale-95 transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Check Status
          </button>
        </div>
      )}

      {/* =====================================================================
          SECTION 1: HERO SECTION (2-Column Desktop Grid)
          ===================================================================== */}
      <section className="bg-white/90 backdrop-blur-xl rounded-3xl border border-blue-100 p-6 sm:p-10 shadow-[0_15px_45px_rgba(37,99,235,0.06)] relative overflow-hidden">
        {/* Soft Ambient Light Halo */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-100/50 rounded-full blur-3xl pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10">
          {/* Left Column: Headlines & Voice Search Bar */}
          <div className="lg:col-span-7 space-y-6">
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-xs font-black text-[#2563EB]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Voice-Powered Job Search for Skilled Workers</span>
            </div>

            {/* Main Catchy Headline */}
            <h1 className="text-3xl sm:text-5xl font-black text-[#0F172A] tracking-tight leading-[1.15]">
              Your Voice.{' '}
              <span className="text-[#2563EB] inline-block">
                Your Next Opportunity.
              </span>
            </h1>

            {/* Subheadline */}
            <p className="text-base sm:text-lg font-medium text-slate-600 max-w-xl leading-relaxed">
              Skip the complicated forms. Just speak in your native language to discover and apply for verified local jobs for drivers, carpenters, helpers, and trades in seconds.
            </p>

            {/* Prominent Voice Search Bar */}
            <div className="pt-2">
              <form onSubmit={handleSearchSubmit} className="relative">
                <div className="relative flex items-center bg-[#F8FAFC] border-2 border-blue-200 focus-within:border-[#2563EB] focus-within:ring-4 focus-within:ring-blue-500/15 rounded-3xl p-2 sm:p-2.5 transition-all shadow-md">
                  <Search className="w-5 h-5 text-slate-400 ml-3 shrink-0" />
                  
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Type or click the microphone to speak..."
                    className="flex-1 px-3 py-2 bg-transparent text-slate-900 font-semibold placeholder-slate-400 text-sm sm:text-base outline-none"
                  />

                  {/* Integrated Audio Waveform (Visible beside mic) */}
                  <VoiceWaveform voiceState={voiceState} side="left" className="!h-10" />

                  {/* Prominent Microphone CTA Button */}
                  <button
                    type="button"
                    onClick={handleMicTap}
                    aria-label={isListening ? 'Stop voice recording' : 'Speak to find jobs'}
                    className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center shrink-0 transition-all duration-300 transform active:scale-95 shadow-md ${
                      isListening
                        ? 'bg-rose-500 text-white animate-pulse ring-4 ring-rose-400/30'
                        : 'bg-[#2563EB] hover:bg-[#1D4ED8] text-white hover:scale-105 shadow-blue-500/30'
                    }`}
                  >
                    {isListening ? (
                      <MicOff className="w-6 h-6 stroke-[2.5]" />
                    ) : (
                      <Mic className="w-6 h-6 stroke-[2.5]" />
                    )}
                  </button>
                </div>
              </form>

              {/* Sample Prompt Chip */}
              <div className="mt-3 flex items-center gap-2 flex-wrap text-xs font-semibold text-slate-500">
                <span className="text-slate-400">Sample prompt:</span>
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('Find driver jobs near me')
                    navigate('/jobs-list?search=driver')
                  }}
                  className="px-3 py-1 rounded-full bg-blue-50 hover:bg-blue-100 text-[#2563EB] border border-blue-200 transition-all cursor-pointer font-bold inline-flex items-center gap-1"
                >
                  <span>🎤 "Find driver jobs near me"</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('Carpenter work in Bangalore')
                    navigate('/jobs-list?search=carpenter')
                  }}
                  className="px-3 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all cursor-pointer hidden sm:inline-flex"
                >
                  "Carpenter work in Bangalore"
                </button>
              </div>

              {/* Live Spoken Transcript Feedback */}
              {debugLog?.rawSpeech && (
                <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-2xl text-xs sm:text-sm font-bold text-[#1D4ED8] flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#2563EB] shrink-0" />
                  <span>Heard: "{debugLog.rawSpeech}"</span>
                </div>
              )}
            </div>

            {/* Quick Category Chips */}
            <div className="pt-2 border-t border-slate-100">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
                Popular Categories:
              </span>
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  type="button"
                  onClick={() => handleChipClick('DRIVER')}
                  className="px-3.5 py-1.5 rounded-full bg-white hover:bg-blue-50 text-slate-700 hover:text-[#2563EB] border border-slate-200 hover:border-blue-300 font-bold text-xs transition-all shadow-sm flex items-center gap-1.5"
                >
                  <span>🚗</span>
                  <span>Driver</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleChipClick('CARPENTER')}
                  className="px-3.5 py-1.5 rounded-full bg-white hover:bg-blue-50 text-slate-700 hover:text-[#2563EB] border border-slate-200 hover:border-blue-300 font-bold text-xs transition-all shadow-sm flex items-center gap-1.5"
                >
                  <span>🪚</span>
                  <span>Carpenter</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleChipClick('HELPER')}
                  className="px-3.5 py-1.5 rounded-full bg-white hover:bg-blue-50 text-slate-700 hover:text-[#2563EB] border border-slate-200 hover:border-blue-300 font-bold text-xs transition-all shadow-sm flex items-center gap-1.5"
                >
                  <span>🛠️</span>
                  <span>General Worker</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleChipClick('HOUSEHELP')}
                  className="px-3.5 py-1.5 rounded-full bg-white hover:bg-blue-50 text-slate-700 hover:text-[#2563EB] border border-slate-200 hover:border-blue-300 font-bold text-xs transition-all shadow-sm flex items-center gap-1.5"
                >
                  <span>🍳</span>
                  <span>Helper</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleChipClick('ALL')}
                  className="px-3.5 py-1.5 rounded-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-xs transition-all shadow-sm"
                >
                  All Jobs →
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Photo Cutout with Floating Badge Tags */}
          <div className="lg:col-span-5 flex justify-center relative">
            <div className="relative w-72 h-72 sm:w-96 sm:h-96">
              {/* Soft Circular Backdrop */}
              <div className="absolute inset-2 sm:inset-4 rounded-full bg-gradient-to-tr from-blue-100 via-sky-100 to-indigo-100 border-4 border-white shadow-2xl overflow-hidden">
                <img
                  src="/worker_hero.jpg"
                  alt="Smiling verified worker in hardhat and safety vest"
                  className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Floating Badge Tag 1: Real Jobs */}
              <div className="absolute -top-2 left-2 sm:left-4 bg-white/95 backdrop-blur-md border border-emerald-200 text-emerald-800 px-3.5 py-2 rounded-2xl shadow-lg flex items-center gap-2 text-xs sm:text-sm font-black animate-float-slow">
                <span className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px]">
                  ✓
                </span>
                <span>Real Jobs</span>
              </div>

              {/* Floating Badge Tag 2: Real People */}
              <div className="absolute top-14 -right-2 sm:-right-4 bg-white/95 backdrop-blur-md border border-blue-200 text-[#1D4ED8] px-3.5 py-2 rounded-2xl shadow-lg flex items-center gap-2 text-xs sm:text-sm font-black animate-float-slow" style={{ animationDelay: '1.5s' }}>
                <Users className="w-4 h-4 text-[#2563EB]" />
                <span>Real People</span>
              </div>

              {/* Floating Badge Tag 3: Better Future */}
              <div className="absolute -bottom-2 left-6 sm:left-8 bg-white/95 backdrop-blur-md border border-amber-200 text-amber-900 px-3.5 py-2 rounded-2xl shadow-lg flex items-center gap-2 text-xs sm:text-sm font-black animate-float-slow" style={{ animationDelay: '3s' }}>
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>Better Future</span>
              </div>

              {/* Floating Badge Tag 4: 100% Voice Enabled */}
              <div className="absolute bottom-16 -right-3 sm:-right-6 bg-[#0F172A] text-white px-3 py-1.5 rounded-full shadow-xl flex items-center gap-1.5 text-xs font-bold border border-slate-700">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>100% Voice Enabled</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          SECTION 2: 5-COLUMN FEATURE HIGHLIGHTS BAR
          ===================================================================== */}
      <section className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-blue-100 shadow-[0_10px_35px_rgba(37,99,235,0.05)]">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {FEATURES.map((feat, idx) => {
            const Icon = feat.icon
            return (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-[#F8FAFC] border border-slate-100 hover:border-blue-200 hover:shadow-md transition-all duration-300 group"
              >
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-3 shadow-sm ${feat.color} group-hover:scale-110 transition-transform`}>
                  <Icon className="w-5 h-5 stroke-[2.5]" />
                </div>
                <h3 className="font-black text-slate-900 text-base mb-1">
                  {feat.title}
                </h3>
                <p className="text-xs font-medium text-slate-500 leading-relaxed">
                  {feat.desc}
                </p>
              </div>
            )
          })}
        </div>
      </section>

      {/* =====================================================================
          SECTION 3: POPULAR JOB CATEGORIES (4-Column Grid)
          ===================================================================== */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 px-1">
          <div>
            <span className="text-xs font-black uppercase tracking-widest text-[#2563EB] block mb-1">
              Explore Openings
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#0F172A] tracking-tight">
              Popular Job Categories
            </h2>
            <p className="text-sm font-semibold text-slate-500 mt-1">
              Thousands of verified local employers ready to hire today
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate('/jobs-list')}
            className="inline-flex items-center gap-1.5 text-sm font-black text-[#2563EB] hover:text-[#1D4ED8] group"
          >
            <span>View All Categories</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => handleChipClick(cat.id)}
              className={`bg-white rounded-3xl p-6 border border-slate-200 ${cat.borderColor} shadow-[0_4px_20px_rgba(0,0,0,0.04)] hover:shadow-[0_15px_35px_rgba(37,99,235,0.12)] hover:-translate-y-1.5 transition-all duration-300 text-left group relative overflow-hidden`}
            >
              {/* Top Accent Icon & Count Badge */}
              <div className="flex items-start justify-between mb-4">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${cat.color} flex items-center justify-center text-3xl shadow-sm border border-slate-100 group-hover:scale-105 transition-transform`}>
                  <span>{cat.icon}</span>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-black bg-blue-50 text-[#2563EB] border border-blue-200">
                  {cat.count}
                </span>
              </div>

              {/* Title & Hindi Title */}
              <h3 className="text-lg font-black text-[#0F172A] group-hover:text-[#2563EB] transition-colors">
                {cat.title}
              </h3>
              <p className="text-xs font-semibold text-slate-500 mt-0.5">
                {cat.hindiTitle}
              </p>

              {/* Typical Daily Wage Info */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-600">
                <span>Avg: <strong className="text-emerald-700">{cat.wage}</strong></span>
                <span className="text-[#2563EB] group-hover:translate-x-1 transition-transform flex items-center">
                  Apply →
                </span>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Track Applied Jobs Action Card (if worker has profile) */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 border border-blue-100 shadow-[0_8px_30px_rgba(37,99,235,0.06)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 text-[#2563EB] border border-blue-200 flex items-center justify-center text-2xl shrink-0 shadow-sm">
            📋
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[10px] font-black bg-emerald-50 text-emerald-700 border border-emerald-200 uppercase tracking-widest mb-1">
              Application Tracker
            </div>
            <h3 className="text-xl font-black text-[#0F172A]">
              Track Your Applications (आवेदन ट्रैक करें)
            </h3>
            <p className="text-xs font-medium text-slate-500 mt-0.5">
              Check the status of your voice job submissions and interview approvals
            </p>
          </div>
        </div>

        <button
          onClick={() => navigate('/applications/my')}
          className="px-6 py-3.5 bg-[#2563EB] hover:bg-[#1D4ED8] active:scale-95 text-white font-black text-sm rounded-2xl shadow-md shadow-blue-500/25 flex items-center gap-2 shrink-0 transition-all"
        >
          <span>View My Applications</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </section>

      {/* Accepted Applications Banner if Any */}
      {Array.isArray(acceptedApps) && acceptedApps.length > 0 && (
        <section className="bg-emerald-50 rounded-3xl p-6 border border-emerald-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🎉</span>
              <div>
                <h3 className="font-black text-lg text-emerald-950">Accepted Job Applications</h3>
                <p className="text-xs text-emerald-800 font-medium">Your application has been accepted by verified employers.</p>
              </div>
            </div>
            <span className="bg-emerald-600 text-white font-black px-3.5 py-1 rounded-full text-xs">
              {acceptedApps.length} Accepted
            </span>
          </div>
        </section>
      )}

      {/* =====================================================================
          SECTION 4: FOOTER CTA BANNER (Dark Navy #0F172A)
          ===================================================================== */}
      <section id="about" className="bg-[#0F172A] text-white rounded-3xl p-8 sm:p-12 relative overflow-hidden shadow-2xl">
        {/* Ambient Gradient Glow */}
        <div className="absolute -top-24 -right-24 w-80 h-80 bg-blue-600/25 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-2xl relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-bold text-blue-300 border border-white/10">
            <span>✨ Join VoiceHire Today</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
            Ready to Find Your Next Opportunity?
          </h2>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-medium">
            Join thousands of skilled workers and verified employers connecting through the power of voice. Zero fees, transparent wages, and direct connections.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <Link
              to="/register"
              className="px-6 py-3.5 bg-[#2563EB] hover:bg-[#1D4ED8] active:scale-95 text-white font-black text-sm rounded-2xl shadow-lg shadow-blue-500/30 flex items-center gap-2 transition-all"
            >
              <span>Get Started Free (पंजीकरण करें)</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/jobs-list"
              className="px-6 py-3.5 bg-white/10 hover:bg-white/20 active:scale-95 text-white font-bold text-sm rounded-2xl border border-white/15 transition-all"
            >
              <span>Browse All Openings</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
