import React, { useState, useEffect, useRef } from 'react'
import { useNavigate, Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Phone,
  User,
  Building2,
  Briefcase,
  Globe,
  Mic,
  MicOff,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  MapPin,
  Clock,
  Award,
} from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'
import { useVoice } from '../context/VoiceContext'
import ThemeToggle from '../components/ThemeToggle'
import LanguageSelector from '../components/LanguageSelector'

export default function Register() {
  const navigate = useNavigate()
  const location = useLocation()
  const { register, loading } = useAuth()
  const { selectedLang, setSelectedLang } = useVoice()

  // Pre-selected role from query params if any (e.g. /register?role=employer)
  const queryParams = new URLSearchParams(location.search)
  const initialRole = queryParams.get('role') === 'employer' ? 'employer' : 'employee'

  const [role, setRole] = useState(initialRole)
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState(location.state?.phone || '')
  const [locationCity, setLocationCity] = useState('Bengaluru')
  const [preferredLanguage, setPreferredLanguage] = useState(selectedLang || 'en')

  // Employee-specific state
  const [tradeCategory, setTradeCategory] = useState('DRIVER')
  const [experience, setExperience] = useState('2+ Years')
  const [expectedWage, setExpectedWage] = useState('1200')

  // Employer-specific state
  const [companyName, setCompanyName] = useState('')
  const [businessType, setBusinessType] = useState('Logistics & Fleet')

  // Voice input states
  const [isListeningName, setIsListeningName] = useState(false)
  const [isListeningPhone, setIsListeningPhone] = useState(false)
  const recognitionRef = useRef(null)

  const TRADES = [
    { code: 'DRIVER', label: 'Driver (Commercial & Private)' },
    { code: 'CARPENTER', label: 'Carpenter & Modular Interior' },
    { code: 'ELECTRICIAN', label: 'Electrician & Wireman' },
    { code: 'PLUMBER', label: 'Plumber & Pipe Fitting' },
    { code: 'COOK', label: 'Cook & Kitchen Assistant' },
    { code: 'PAINTER', label: 'Painter & Wall Polisher' },
    { code: 'HELPER', label: 'Warehouse & Construction Helper' },
  ]

  const BUSINESS_TYPES = [
    'Logistics & Fleet Transport',
    'Construction & Real Estate',
    'Interior & Woodwork Firm',
    'Facility Management',
    'Restaurant & Hospitality',
    'Private Residential Employer',
  ]

  // Voice input recognition helper
  const startVoiceInput = (field) => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) {
      toast.error('Voice input is not supported in this browser. Please type manually.')
      return
    }

    try {
      if (recognitionRef.current) recognitionRef.current.abort()

      const recognition = new SpeechRecognition()
      recognition.lang = preferredLanguage === 'kn' ? 'kn-IN' : preferredLanguage === 'hi' ? 'hi-IN' : 'en-IN'
      recognition.continuous = false
      recognition.interimResults = false

      recognition.onstart = () => {
        if (field === 'name') setIsListeningName(true)
        if (field === 'phone') setIsListeningPhone(true)
        toast('🎤 Listening... Speak now', { id: 'voice-rec' })
      }

      recognition.onresult = (e) => {
        const spoken = e.results[0][0].transcript.trim()
        if (field === 'name') {
          const clean = spoken.replace(/[0-9]/g, '').trim()
          if (clean) setFullName(clean)
        } else if (field === 'phone') {
          const digits = spoken.replace(/\D/g, '').slice(-10)
          if (digits) setPhone(digits)
        }
        toast.success(`Captured: "${spoken}"`, { id: 'voice-rec' })
      }

      recognition.onerror = () => {
        setIsListeningName(false)
        setIsListeningPhone(false)
      }

      recognition.onend = () => {
        setIsListeningName(false)
        setIsListeningPhone(false)
      }

      recognitionRef.current = recognition
      recognition.start()
    } catch (err) {
      setIsListeningName(false)
      setIsListeningPhone(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!fullName.trim()) {
      toast.error('Please enter your full name.')
      return
    }

    const cleanPhone = phone.replace(/\D/g, '').slice(-10)
    if (cleanPhone.length < 10) {
      toast.error('Please enter a valid 10-digit mobile number.')
      return
    }

    const payload = {
      fullName: fullName.trim(),
      phone: cleanPhone,
      role,
      location: locationCity,
      preferredLanguage,
      tradeCategory,
      experience,
      expectedWage: Number(expectedWage) || 1000,
      companyName: companyName.trim(),
      businessType,
    }

    const res = await register(payload)
    if (res.success) {
      if (role === 'employer') {
        navigate('/employer/dashboard', { replace: true })
      } else {
        navigate('/jobs', { replace: true })
      }
    }
  }

  // 1-Tap Quick Sample Fill
  const fillSample = (targetRole) => {
    setRole(targetRole)
    if (targetRole === 'employee') {
      setFullName('Ramesh Kumar')
      setPhone('9876543210')
      setLocationCity('Bengaluru')
      setTradeCategory('DRIVER')
      setExperience('4+ Years')
      setExpectedWage('1200')
    } else {
      setFullName('Vikram Hegde')
      setPhone('9123456789')
      setCompanyName('Nandi Transport Logistics')
      setBusinessType('Logistics & Fleet Transport')
      setLocationCity('Bengaluru')
    }
    toast.success(`Filled sample ${targetRole} credentials!`)
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0B0F19] text-[#0F172A] dark:text-[#F8FAFC] flex flex-col font-sans transition-colors duration-300">
      {/* Top Header */}
      <header className="px-6 py-4 flex items-center justify-between border-b border-slate-200/80 dark:border-white/10 bg-white/70 dark:bg-[#0B0F19]/70 backdrop-blur-md">
        <Link to="/jobs" className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#2563EB] to-[#1D4ED8] text-white flex items-center justify-center shadow-md shadow-blue-500/25">
            <Mic className="w-5 h-5 text-white stroke-[2.5]" />
          </div>
          <span className="text-xl font-black tracking-tight text-[#0F172A] dark:text-white">
            Voice<span className="text-[#2563EB] dark:text-[#60A5FA]">Hire</span>
          </span>
        </Link>

        <div className="flex items-center gap-2 sm:gap-3">
          <ThemeToggle className="!w-9 !h-9 !rounded-xl" />
          <LanguageSelector selectedLang={selectedLang} onSelectLang={setSelectedLang} />
          <Link
            to="/login"
            className="text-xs sm:text-sm font-bold text-slate-600 dark:text-slate-300 hover:text-[#2563EB] dark:hover:text-white px-3 py-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-white/[0.08]"
          >
            Sign In
          </Link>
        </div>
      </header>

      {/* Main Split-Screen Layout */}
      <main className="flex-1 flex flex-col lg:flex-row max-w-7xl mx-auto w-full p-4 sm:p-8 lg:p-12 gap-8 items-center">
        {/* ===================================================================
            LEFT COLUMN: Human-Centric Editorial Visual Storytelling
            =================================================================== */}
        <div className="w-full lg:w-5/12 flex flex-col space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-500/20 text-xs font-black uppercase tracking-wider w-fit">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Inclusive Employment Platform</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
            {role === 'employee' ? (
              <>
                Let your voice open <span className="text-[#2563EB] dark:text-[#60A5FA]">real job opportunities.</span>
              </>
            ) : (
              <>
                Hire verified tradesmen <span className="text-[#2563EB] dark:text-[#60A5FA]">in under 24 hours.</span>
              </>
            )}
          </h1>

          <p className="text-base text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
            {role === 'employee'
              ? 'No resumes, complex forms, or English requirements. Speak your trade in your native language and connect directly with verified employers.'
              : 'Access pre-verified drivers, carpenters, electricians, cooks, and helpers with voice screening recordings and identity proofs.'}
          </p>

          {/* Social Proof / Editorial Testimonial Card */}
          <div className="p-6 rounded-3xl bg-white dark:bg-[#151C2C] border border-slate-200/80 dark:border-white/10 shadow-xl shadow-slate-200/40 dark:shadow-black/40 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white font-black text-base flex items-center justify-center">
                {role === 'employee' ? 'RK' : 'NH'}
              </div>
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                  {role === 'employee' ? 'Ramesh Kumar' : 'Nandi Logistics Fleet'}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
                  {role === 'employee' ? 'Commercial Driver • Bengaluru' : 'Employer • 45 Verified Hires'}
                </p>
              </div>
              <div className="ml-auto flex items-center gap-1 text-emerald-500 text-xs font-black">
                <CheckCircle2 className="w-4 h-4" />
                <span>Verified</span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 italic">
              {role === 'employee'
                ? '"I registered by speaking Kannada into the mic. Within 3 hours I received an interview call from a company in Electronic City."'
                : '"Voice screening lets us hear driver communication and experience before calling. Saved our hiring team 15 hours every week."'}
            </p>
          </div>

          {/* Trust Highlights */}
          <div className="grid grid-cols-3 gap-3 pt-2">
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/[0.04] border border-slate-200/60 dark:border-white/5 text-center">
              <span className="text-lg font-black text-[#2563EB] dark:text-[#60A5FA]">12,500+</span>
              <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 mt-0.5">Active Workers</p>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/[0.04] border border-slate-200/60 dark:border-white/5 text-center">
              <span className="text-lg font-black text-emerald-600 dark:text-emerald-400">100%</span>
              <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 mt-0.5">No Resume</p>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/[0.04] border border-slate-200/60 dark:border-white/5 text-center">
              <span className="text-lg font-black text-amber-500">₹1,150</span>
              <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 mt-0.5">Avg Daily Wage</p>
            </div>
          </div>
        </div>

        {/* ===================================================================
            RIGHT COLUMN: Clean High-Contrast Tactile Registration Form
            =================================================================== */}
        <div className="w-full lg:w-7/12 max-w-xl">
          <div className="bg-white dark:bg-[#151C2C] rounded-3xl p-6 sm:p-10 border border-slate-200/80 dark:border-white/10 shadow-2xl shadow-slate-200/50 dark:shadow-black/50">
            {/* Role Switcher Tabs */}
            <div className="mb-6">
              <label className="block text-xs font-black uppercase tracking-wider text-slate-400 mb-2">
                I am registering as:
              </label>
              <div className="grid grid-cols-2 gap-2 p-1.5 rounded-2xl bg-slate-100 dark:bg-white/[0.06] border border-slate-200/80 dark:border-white/10">
                <button
                  type="button"
                  onClick={() => setRole('employee')}
                  className={`py-3 px-4 rounded-xl text-xs sm:text-sm font-black flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    role === 'employee'
                      ? 'bg-[#2563EB] text-white shadow-md shadow-blue-500/30'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <User className="w-4 h-4" />
                  <span>Looking for Work (Worker)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setRole('employer')}
                  className={`py-3 px-4 rounded-xl text-xs sm:text-sm font-black flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    role === 'employer'
                      ? 'bg-amber-500 text-white shadow-md shadow-amber-500/30'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Building2 className="w-4 h-4" />
                  <span>Hiring Workers (Employer)</span>
                </button>
              </div>
            </div>

            {/* Quick 1-Tap Fill Button */}
            <div className="flex items-center justify-between pb-4 mb-5 border-b border-slate-100 dark:border-white/10">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                Quick testing:
              </span>
              <button
                type="button"
                onClick={() => fillSample(role)}
                className="text-xs font-black text-[#2563EB] dark:text-[#60A5FA] hover:underline cursor-pointer"
              >
                1-Tap Fill Demo {role === 'employer' ? 'Employer' : 'Worker'}
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Full Name Input with Voice Mic */}
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  {role === 'employer' ? 'Contact Person Name' : 'Full Name'}
                </label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder={role === 'employer' ? 'e.g. Vikram Hegde' : 'e.g. Ramesh Kumar'}
                    className="w-full pl-10 pr-12 py-3 rounded-2xl bg-slate-50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 focus:border-[#2563EB] focus:ring-2 focus:ring-blue-500/20 text-sm font-bold text-slate-900 dark:text-white outline-none transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => startVoiceInput('name')}
                    className={`absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-xl transition-all cursor-pointer ${
                      isListeningName
                        ? 'bg-rose-500 text-white animate-pulse'
                        : 'text-slate-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-white/[0.08]'
                    }`}
                    title="Speak Name"
                  >
                    <Mic className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Phone Number Input with Voice Mic */}
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  10-Digit Mobile Number
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-3.5 text-xs font-bold text-slate-500 border-r border-slate-300 dark:border-slate-700 pr-2">
                    +91
                  </span>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                    placeholder="98765 43210"
                    className="w-full pl-16 pr-12 py-3 rounded-2xl bg-slate-50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 focus:border-[#2563EB] focus:ring-2 focus:ring-blue-500/20 text-sm font-bold text-slate-900 dark:text-white outline-none tracking-wider transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => startVoiceInput('phone')}
                    className={`absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-xl transition-all cursor-pointer ${
                      isListeningPhone
                        ? 'bg-rose-500 text-white animate-pulse'
                        : 'text-slate-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-white/[0.08]'
                    }`}
                    title="Speak Mobile Number"
                  >
                    <Mic className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Role Specific Conditional Fields */}
              {role === 'employee' ? (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Primary Trade Category */}
                    <div>
                      <label className="block text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                        Your Trade / Work
                      </label>
                      <select
                        value={tradeCategory}
                        onChange={(e) => setTradeCategory(e.target.value)}
                        className="w-full px-3.5 py-3 rounded-2xl bg-slate-50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 text-sm font-bold text-slate-900 dark:text-white outline-none"
                      >
                        {TRADES.map((t) => (
                          <option key={t.code} value={t.code} className="dark:bg-[#151C2C]">
                            {t.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Expected Daily Wage */}
                    <div>
                      <label className="block text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                        Expected Daily Wage (₹)
                      </label>
                      <input
                        type="number"
                        value={expectedWage}
                        onChange={(e) => setExpectedWage(e.target.value)}
                        placeholder="1200"
                        className="w-full px-3.5 py-3 rounded-2xl bg-slate-50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 text-sm font-bold text-slate-900 dark:text-white outline-none"
                      />
                    </div>
                  </div>
                </>
              ) : (
                <>
                  {/* Employer: Company / Business Name */}
                  <div>
                    <label className="block text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                      Company / Organization Name
                    </label>
                    <div className="relative">
                      <Building2 className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        required
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        placeholder="e.g. Nandi Transport Logistics"
                        className="w-full pl-10 pr-3.5 py-3 rounded-2xl bg-slate-50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 text-sm font-bold text-slate-900 dark:text-white outline-none"
                      />
                    </div>
                  </div>

                  {/* Business Type */}
                  <div>
                    <label className="block text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                      Business Domain
                    </label>
                    <select
                      value={businessType}
                      onChange={(e) => setBusinessType(e.target.value)}
                      className="w-full px-3.5 py-3 rounded-2xl bg-slate-50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 text-sm font-bold text-slate-900 dark:text-white outline-none"
                    >
                      {BUSINESS_TYPES.map((b) => (
                        <option key={b} value={b} className="dark:bg-[#151C2C]">
                          {b}
                        </option>
                      ))}
                    </select>
                  </div>
                </>
              )}

              {/* City Location */}
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  Location / City
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={locationCity}
                    onChange={(e) => setLocationCity(e.target.value)}
                    placeholder="Bengaluru"
                    className="w-full pl-10 pr-3.5 py-3 rounded-2xl bg-slate-50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 text-sm font-bold text-slate-900 dark:text-white outline-none"
                  />
                </div>
              </div>

              {/* Submit CTA Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] hover:from-[#1D4ED8] hover:to-[#1E40AF] text-white font-black text-sm sm:text-base shadow-xl shadow-blue-500/30 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer mt-4"
              >
                {loading ? (
                  <span>Processing...</span>
                ) : (
                  <>
                    <span>Create {role === 'employer' ? 'Employer Account' : 'Worker Profile'}</span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 pt-5 border-t border-slate-100 dark:border-white/10 text-center">
              <p className="text-xs sm:text-sm font-semibold text-slate-500 dark:text-slate-400">
                Already registered?{' '}
                <Link to="/login" className="text-[#2563EB] dark:text-[#60A5FA] font-black hover:underline">
                  Sign In to Account
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
