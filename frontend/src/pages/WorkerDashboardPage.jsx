import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useVoice } from '../context/VoiceContext'
import { useTheme } from '../context/ThemeContext'
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
  Globe,
  HardHat,
  ChevronRight
} from 'lucide-react'
import axios from '../api/axios'
import toast from 'react-hot-toast'

export default function WorkerDashboardPage() {
  const navigate = useNavigate()
  const { selectedLang, voiceState, debugLog, startListening, stopListening } = useVoice()
  const { isDark } = useTheme()
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

  // Animated cycling placeholders
  const SAMPLE_PROMPTS = [
    "Try saying 'Find electrician jobs in Bengaluru'...",
    "Try saying 'I need a driver job near me'...",
    "Try saying 'Carpenter work in Whitefield'...",
    "Try saying 'General worker jobs'...",
    "Try saying 'Check my application status'..."
  ]
  const [promptIndex, setPromptIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setPromptIndex((prev) => (prev + 1) % SAMPLE_PROMPTS.length)
    }, 4000)
    return () => clearInterval(timer)
  }, [])

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
      if (!localU) return
      const workerId = localU.id || localU.phoneNumber
      if (!workerId) return
      const res = await axios.get(`/applications/accepted?workerId=${workerId}`)
      const list = Array.isArray(res?.data)
        ? res.data
        : (Array.isArray(res?.data?.applications) ? res.data.applications : [])
      setAcceptedApps(list)
    } catch (e) {
      setAcceptedApps([])
    }
  }

  const syncWorkerProfile = async () => {
    try {
      const localU = JSON.parse(localStorage.getItem('user') || sessionStorage.getItem('user') || 'null')
      if (!localU) return
      const targetId = localU.id || localU.phoneNumber
      if (!targetId) return
      const res = await axios.get(`/workers/profile?id=${targetId}`)
      if (res.data) {
        const updated = { ...localU, ...res.data }
        localStorage.setItem('user', JSON.stringify(updated))
        setUserState(updated)
      }
    } catch (e) {}
  }

  const handleMicTap = () => {
    if (voiceState === 'LISTENING') {
      stopListening()
    } else {
      startListening(navigate)
    }
  }

  const handleSearchSubmit = (e) => {
    if (e) e.preventDefault()
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

  // Featured 4-Column Job Categories as per specification
  const FEATURED_CATEGORIES = [
    {
      id: 'DRIVER',
      title: 'Drivers',
      jobCount: '740+ Jobs',
      wage: '₹800 – ₹1,500/day',
      image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=600&q=80',
      icon: '🚚',
      cta: 'Browse Drivers',
    },
    {
      id: 'CARPENTER',
      title: 'Carpenters',
      jobCount: '550+ Jobs',
      wage: '₹900 – ₹1,600/day',
      image: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=600&q=80',
      icon: '🔨',
      cta: 'Browse Carpenters',
    },
    {
      id: 'HELPER',
      title: 'General Workers',
      jobCount: '1,200+ Jobs',
      wage: '₹700 – ₹1,200/day',
      image: 'https://images.unsplash.com/photo-1541888946425-d0fbb186156f?auto=format&fit=crop&w=600&q=80',
      icon: '🏗️',
      cta: 'Browse Workers',
    },
    {
      id: 'HOUSEHELP',
      title: 'Helpers / Maintenance',
      jobCount: '890+ Jobs',
      wage: '₹650 – ₹1,100/day',
      image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=600&q=80',
      icon: '🧹',
      cta: 'Browse Helpers',
    },
  ]

  // Platform 5-Column Feature Benefits
  const FEATURES = [
    {
      title: 'Voice Search',
      desc: 'Speak in your local dialect to find matching roles instantly.',
      icon: Mic,
      color: 'text-[#2563EB] bg-blue-500/10 dark:bg-blue-500/20',
    },
    {
      title: 'Verified Profiles',
      desc: 'Employer-trusted ID verification & guaranteed payouts.',
      icon: ShieldCheck,
      color: 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 dark:bg-emerald-500/20',
    },
    {
      title: 'Secure Platform',
      desc: 'Encrypted data & zero spam directly to your mobile.',
      icon: Lock,
      color: 'text-indigo-600 dark:text-indigo-400 bg-indigo-500/10 dark:bg-indigo-500/20',
    },
    {
      title: 'Fast Hiring',
      desc: 'Instant match alerts via WhatsApp and direct call.',
      icon: Zap,
      color: 'text-amber-600 dark:text-amber-400 bg-amber-500/10 dark:bg-amber-500/20',
    },
    {
      title: 'Grow Together',
      desc: 'Skill development and verified career progression tracks.',
      icon: TrendingUp,
      color: 'text-sky-600 dark:text-sky-400 bg-sky-500/10 dark:bg-sky-500/20',
    },
  ]

  // Page 3: Mobile Touch Quick Access Tiles (2x3 Grid)
  const MOBILE_QUICK_TILES = [
    { label: 'Voice Search', icon: '🎙️', action: handleMicTap },
    { label: 'Select Language', icon: '🌐', action: () => navigate('/register') },
    { label: 'Driver Jobs', icon: '🚚', action: () => handleChipClick('DRIVER') },
    { label: 'Carpenter Jobs', icon: '🔨', action: () => handleChipClick('CARPENTER') },
    { label: 'Construction', icon: '🏗️', action: () => handleChipClick('HELPER') },
    { label: 'Watch Story 🎬', icon: '🎬', action: () => window.dispatchEvent(new CustomEvent('open-cinematic-intro')) },
  ]

  return (
    <div className="space-y-10 sm:space-y-12 pb-24 sm:pb-16 relative z-10 transition-colors duration-300">
      {/* =====================================================================
          PAGE 3: MOBILE TOUCH QUICK ACCESS TILES (Shown on Mobile screens)
          ===================================================================== */}
      <section className="sm:hidden space-y-4">
        {/* Mobile Prominent Voice Search Card with Pulsing Ring */}
        <div className="p-6 rounded-3xl bg-white/90 dark:bg-[#151C2C]/90 backdrop-blur-xl border border-slate-200 dark:border-white/10 shadow-lg text-center relative overflow-hidden">
          <div className="flex flex-col items-center">
            <div className="relative mb-4">
              {/* Pulsating Wave Ring */}
              <div className={`absolute -inset-2 rounded-full border-2 border-blue-500/40 pointer-events-none transition-all ${isListening ? 'animate-ping' : 'animate-pulse'}`} />
              <button
                type="button"
                onClick={handleMicTap}
                className={`w-20 h-20 rounded-full flex items-center justify-center text-white shadow-xl transition-transform active:scale-90 ${
                  isListening ? 'bg-rose-500 ring-4 ring-rose-400/40 animate-pulse' : 'bg-[#2563EB] shadow-blue-500/40'
                }`}
                aria-label="Tap to speak"
              >
                {isListening ? <MicOff className="w-9 h-9 stroke-[2.5]" /> : <Mic className="w-9 h-9 stroke-[2.5]" />}
              </button>
            </div>

            <h2 className="text-lg font-black text-[#0F172A] dark:text-[#F8FAFC]">
              {isListening ? 'Listening to your voice...' : 'Tap to Speak Job Search'}
            </h2>
            <p className="text-xs text-slate-500 dark:text-[#94A3B8] mt-1">
              "Find driver jobs", "Carpenter work", "Helper work"
            </p>
          </div>
        </div>

        {/* 2x3 Mobile Touch Tile Grid */}
        <div>
          <p className="text-xs font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 px-1 mb-2.5">
            Quick Touch Navigation
          </p>
          <div className="grid grid-cols-2 gap-3">
            {MOBILE_QUICK_TILES.map((tile, idx) => (
              <button
                key={idx}
                type="button"
                onClick={tile.action}
                className="flex items-center gap-3 p-4 rounded-2xl bg-white/95 dark:bg-[#151C2C]/95 border border-slate-200 dark:border-white/10 shadow-sm text-left active:scale-95 transition-all cursor-pointer"
              >
                <span className="text-2xl">{tile.icon}</span>
                <span className="text-xs font-extrabold text-[#0F172A] dark:text-[#F8FAFC] truncate">
                  {tile.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* =====================================================================
          PAGE 2: SECTION B — HERO SECTION (Split Layout)
          Left: Value Proposition & Interactive Voice Bar with Waveform
          Right: HD Worker Cutout in Glowing Backdrop with Floating Badges
          ===================================================================== */}
      <section className="bg-white/85 dark:bg-[#151C2C]/85 backdrop-blur-2xl rounded-3xl border border-slate-200 dark:border-white/10 p-6 sm:p-10 shadow-[0_15px_45px_rgba(0,0,0,0.06)] dark:shadow-[0_20px_60px_rgba(0,0,0,0.45)] relative overflow-hidden transition-colors duration-300">
        {/* Soft Ambient Radial Light Halo */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 dark:bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10">
          {/* Left Column (Value Proposition & Search Engine) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Badges: ⚡ Smart Voice Search · Verified Jobs & 🎬 Watch Story */}
            <div className="flex items-center gap-2.5 flex-wrap">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-500/30 text-xs font-black text-[#2563EB] dark:text-[#60A5FA]">
                <Sparkles className="w-3.5 h-3.5" />
                <span>⚡ Smart Voice Search · Verified Jobs</span>
              </div>

              <button
                type="button"
                onClick={() => window.dispatchEvent(new CustomEvent('open-cinematic-intro'))}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-black shadow-md shadow-blue-500/25 hover:scale-105 active:scale-95 transition-all cursor-pointer"
              >
                <span>🎬 Watch Story: "The Power of Voice"</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* H1 Title: YOUR VOICE. REAL JOBS. */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-[#0F172A] dark:text-[#F8FAFC] tracking-tight leading-[1.12]">
              YOUR VOICE.{' '}
              <span className="text-[#2563EB] dark:text-[#3B82F6] inline-block">
                REAL JOBS.
              </span>
            </h1>

            {/* Subheadline */}
            <p className="text-base sm:text-lg font-medium text-slate-600 dark:text-[#94A3B8] max-w-xl leading-relaxed">
              VoiceHire connects skilled and entry-level workers with real employers using simple voice search.
            </p>

            {/* Interactive Voice Bar (Main Feature) */}
            <div className="pt-2">
              <form onSubmit={handleSearchSubmit} className="relative">
                <div className="relative flex items-center bg-[#F8FAFC] dark:bg-[#0B0F19] border-2 border-slate-200 dark:border-white/15 focus-within:border-[#2563EB] dark:focus-within:border-[#3B82F6] focus-within:ring-4 focus-within:ring-blue-500/15 rounded-3xl p-2 sm:p-2.5 transition-all shadow-md">
                  <Search className="w-5 h-5 text-slate-400 dark:text-slate-500 ml-3 shrink-0" />
                  
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={SAMPLE_PROMPTS[promptIndex]}
                    className="flex-1 px-3 py-2 bg-transparent text-[#0F172A] dark:text-[#F8FAFC] font-semibold placeholder-slate-400 dark:placeholder-slate-500 text-sm sm:text-base outline-none transition-all"
                  />

                  {/* Active Glowing Voice Waveform Visualizer */}
                  <VoiceWaveform voiceState={voiceState} side="left" className="!h-10" />

                  {/* Microphone Button (Pulse animation on hover, active connected to actual speech) */}
                  <button
                    type="button"
                    onClick={handleMicTap}
                    aria-label={isListening ? 'Stop voice recording' : 'Speak to find jobs'}
                    className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center shrink-0 transition-all duration-300 transform active:scale-95 shadow-md ${
                      isListening
                        ? 'bg-rose-500 text-white animate-pulse ring-4 ring-rose-400/40 shadow-rose-500/30'
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

              {/* Quick Filter Category Chips */}
              <div className="mt-4 flex items-center gap-2 flex-wrap">
                <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mr-1">
                  Quick Filters:
                </span>
                <button
                  type="button"
                  onClick={() => handleChipClick('DRIVER')}
                  className="px-3.5 py-1.5 rounded-full bg-white dark:bg-[#0B0F19] hover:bg-blue-50 dark:hover:bg-blue-950/40 text-slate-700 dark:text-slate-200 hover:text-[#2563EB] dark:hover:text-[#60A5FA] border border-slate-200 dark:border-white/10 font-bold text-xs transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
                >
                  <span>🚚</span>
                  <span>Driver</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleChipClick('CARPENTER')}
                  className="px-3.5 py-1.5 rounded-full bg-white dark:bg-[#0B0F19] hover:bg-blue-50 dark:hover:bg-blue-950/40 text-slate-700 dark:text-slate-200 hover:text-[#2563EB] dark:hover:text-[#60A5FA] border border-slate-200 dark:border-white/10 font-bold text-xs transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
                >
                  <span>🔨</span>
                  <span>Carpenter</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleChipClick('HELPER')}
                  className="px-3.5 py-1.5 rounded-full bg-white dark:bg-[#0B0F19] hover:bg-blue-50 dark:hover:bg-blue-950/40 text-slate-700 dark:text-slate-200 hover:text-[#2563EB] dark:hover:text-[#60A5FA] border border-slate-200 dark:border-white/10 font-bold text-xs transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
                >
                  <span>🏗️</span>
                  <span>General Worker</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleChipClick('HOUSEHELP')}
                  className="px-3.5 py-1.5 rounded-full bg-white dark:bg-[#0B0F19] hover:bg-blue-50 dark:hover:bg-blue-950/40 text-slate-700 dark:text-slate-200 hover:text-[#2563EB] dark:hover:text-[#60A5FA] border border-slate-200 dark:border-white/10 font-bold text-xs transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
                >
                  <span>🧹</span>
                  <span>Helper</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleChipClick('ALL')}
                  className="px-3.5 py-1.5 rounded-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-black text-xs transition-all shadow-sm cursor-pointer"
                >
                  + View All
                </button>
              </div>

              {/* Live Spoken Transcript Notification */}
              {debugLog?.rawSpeech && (
                <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-500/30 rounded-2xl text-xs sm:text-sm font-bold text-[#1D4ED8] dark:text-[#60A5FA] flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#2563EB] dark:text-[#60A5FA] shrink-0" />
                  <span>Spoken Voice: "{debugLog.rawSpeech}"</span>
                </div>
              )}
            </div>
          </div>

          {/* Right Column (Hero Visual with HD Worker Photo & Floating Glass Cards) */}
          <div className="lg:col-span-5 flex justify-center relative">
            <div className="relative w-72 h-72 sm:w-96 sm:h-96">
              {/* Ambient Circular Gradient Glow Backdrop */}
              <div className="absolute inset-2 sm:inset-4 rounded-full bg-gradient-to-tr from-blue-500/20 via-sky-400/20 to-indigo-500/20 dark:from-blue-600/30 dark:via-cyan-500/20 dark:to-indigo-600/30 border-4 border-white dark:border-white/15 shadow-2xl overflow-hidden">
                <img
                  src="/worker_hero.jpg"
                  alt="Verified skilled worker wearing hardhat and reflective vest"
                  className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Floating Glass Card 1: Verified Jobs (Green Check Icon) */}
              <div className="absolute -top-3 left-2 sm:left-4 bg-white/95 dark:bg-[#151C2C]/95 backdrop-blur-xl border border-emerald-300 dark:border-emerald-500/30 text-emerald-800 dark:text-emerald-400 px-4 py-2.5 rounded-2xl shadow-xl flex items-center gap-2.5 text-xs sm:text-sm font-black animate-float-slow">
                <span className="w-6 h-6 rounded-full bg-[#10B981] text-white flex items-center justify-center text-xs">
                  ✓
                </span>
                <div>
                  <span className="block leading-tight">Verified Jobs</span>
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-300 font-semibold">100% Authenticated</span>
                </div>
              </div>

              {/* Floating Glass Card 2: Real People, Better Future (Community Icon) */}
              <div className="absolute bottom-4 -right-2 sm:-right-4 bg-white/95 dark:bg-[#151C2C]/95 backdrop-blur-xl border border-blue-200 dark:border-white/10 text-[#0F172A] dark:text-[#F8FAFC] px-4 py-2.5 rounded-2xl shadow-xl flex items-center gap-2.5 text-xs sm:text-sm font-black animate-float-slow" style={{ animationDelay: '2s' }}>
                <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/40 text-[#2563EB] dark:text-[#60A5FA] flex items-center justify-center">
                  <Users className="w-3.5 h-3.5" />
                </div>
                <div>
                  <span className="block leading-tight">Real People, Better Future</span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold">Direct Wage Payouts</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          PAGE 2: SECTION C — PLATFORM FEATURES STRIP (5-Column Grid)
          1. Voice Search
          2. Verified Profiles
          3. Secure Platform
          4. Fast Hiring
          5. Grow Together
          ===================================================================== */}
      <section className="bg-white/80 dark:bg-[#151C2C]/80 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-white/10 shadow-sm transition-colors duration-300">
        <div className="text-center sm:text-left mb-6">
          <h2 className="text-xl sm:text-2xl font-black text-[#0F172A] dark:text-[#F8FAFC] tracking-tight">
            Why Skilled Workers Choose VoiceHire
          </h2>
          <p className="text-xs sm:text-sm font-semibold text-slate-500 dark:text-[#94A3B8] mt-1">
            Built from the ground up for low-literacy accessibility and immediate employment
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
          {FEATURES.map((feat, idx) => {
            const Icon = feat.icon
            return (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-[#F8FAFC] dark:bg-[#0B0F19] border border-slate-100 dark:border-white/10 hover:border-blue-300 dark:hover:border-blue-500/40 hover:shadow-md transition-all duration-300 group"
              >
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-3.5 shadow-sm ${feat.color} group-hover:scale-110 transition-transform`}>
                  <Icon className="w-6 h-6 stroke-[2.5]" />
                </div>
                <h3 className="font-black text-[#0F172A] dark:text-[#F8FAFC] text-base mb-1.5">
                  {feat.title}
                </h3>
                <p className="text-xs font-medium text-slate-500 dark:text-[#94A3B8] leading-relaxed">
                  {feat.desc}
                </p>
              </div>
            )
          })}
        </div>
      </section>

      {/* =====================================================================
          PAGE 2: SECTION D — FEATURED JOB CATEGORIES (4-Column Card Grid)
          Card 1: Drivers (740+ Jobs)
          Card 2: Carpenters (550+ Jobs)
          Card 3: General Workers (1,200+ Jobs)
          Card 4: Helpers / Maintenance (890+ Jobs)
          ===================================================================== */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-[#0F172A] dark:text-[#F8FAFC] tracking-tight">
              Featured Job Categories
            </h2>
            <p className="text-xs sm:text-sm font-semibold text-slate-500 dark:text-[#94A3B8] mt-0.5">
              Verified daily and monthly vacancies matching your trade skills
            </p>
          </div>

          <Link
            to="/jobs-list"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#2563EB] dark:text-[#60A5FA] hover:underline"
          >
            <span>Explore All 3,380+ Vacancies</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURED_CATEGORIES.map((cat) => (
            <div
              key={cat.id}
              className="bg-white dark:bg-[#151C2C] rounded-3xl overflow-hidden border border-slate-200 dark:border-white/10 shadow-sm hover:shadow-[0_15px_40px_rgba(37,99,235,0.15)] hover:border-[#2563EB] dark:hover:border-[#3B82F6] transition-all duration-300 group flex flex-col justify-between"
            >
              <div>
                {/* Image Banner with Badge */}
                <div className="relative h-44 overflow-hidden">
                  <img
                    src={cat.image}
                    alt={cat.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                  {/* Live Job Count Badge */}
                  <div className="absolute top-3.5 right-3.5 bg-black/70 backdrop-blur-md text-emerald-400 border border-emerald-400/30 px-3 py-1 rounded-full text-xs font-black flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-[#10B981] animate-ping" />
                    <span>{cat.jobCount}</span>
                  </div>

                  {/* Icon & Title Overlay */}
                  <div className="absolute bottom-3.5 left-4 right-4 flex items-center gap-2.5">
                    <span className="text-2xl">{cat.icon}</span>
                    <h3 className="text-lg font-black text-white tracking-tight">
                      {cat.title}
                    </h3>
                  </div>
                </div>

                {/* Details */}
                <div className="p-5 space-y-3">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-500 dark:text-[#94A3B8]">
                    <span>Avg. Daily Wage</span>
                    <span className="text-[#2563EB] dark:text-[#60A5FA] font-black">{cat.wage}</span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="p-5 pt-0">
                <button
                  type="button"
                  onClick={() => handleChipClick(cat.id)}
                  className="w-full py-3 px-4 rounded-xl bg-blue-50 dark:bg-white/[0.08] hover:bg-[#2563EB] dark:hover:bg-[#2563EB] text-[#2563EB] dark:text-[#60A5FA] hover:text-white dark:hover:text-white font-extrabold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 group-hover:bg-[#2563EB] group-hover:text-white cursor-pointer"
                >
                  <span>{cat.cta}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
