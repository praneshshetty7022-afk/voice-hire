import React, { useState, useEffect } from 'react'
import { useNavigate, Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Mail,
  Lock,
  ArrowRight,
  ArrowLeft,
  Mic,
  Users,
  Building2,
  AlertCircle,
  Loader2,
  RefreshCw,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Eye,
  EyeOff,
  Zap,
  PhoneCall,
  Globe2,
} from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'
import ThemeToggle from '../components/ThemeToggle'
import LanguageSelector from '../components/LanguageSelector'
import { useVoice } from '../context/VoiceContext'
import { getTranslation } from '../utils/translations'

export default function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login, loading, isAuthenticated, isEmployer } = useAuth()
  const { selectedLang, setSelectedLang } = useVoice()
  const t = getTranslation(selectedLang)

  const queryParams = new URLSearchParams(location.search)
  const roleParam = queryParams.get('role')

  // Step 1: 'choose' (The 2 boxes: Worker vs Employer)
  // Step 2: 'form' (The world-class login form)
  const [step, setStep] = useState(() => {
    return roleParam === 'employer' || roleParam === 'employee' ? 'form' : 'choose'
  })

  const [activeRole, setActiveRole] = useState(() => {
    return roleParam === 'employer' ? 'employer' : 'employee'
  })

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [roleMismatchData, setRoleMismatchData] = useState(null)

  // Sync role if query param changes
  useEffect(() => {
    const param = new URLSearchParams(location.search).get('role')
    if (param === 'employer' || param === 'employee') {
      setActiveRole(param)
      setStep('form')
    }
  }, [location.search])

  // Redirect if already authenticated
  if (isAuthenticated) {
    navigate(isEmployer ? '/employer/dashboard' : '/jobs', { replace: true })
    return null
  }

  const handleSelectRole = (role) => {
    setActiveRole(role)
    setErrorMessage('')
    setRoleMismatchData(null)
    setStep('form')
    navigate(`/login?role=${role}`, { replace: true })
  }

  const handleBackToChoose = () => {
    setStep('choose')
    setErrorMessage('')
    setRoleMismatchData(null)
    navigate('/login', { replace: true })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrorMessage('')
    setRoleMismatchData(null)

    const cleanEmail = email.trim().toLowerCase()
    if (!cleanEmail) {
      setErrorMessage('Please enter your email address.')
      toast.error('Email address is required.')
      return
    }

    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,})+$/
    if (!emailRegex.test(cleanEmail)) {
      setErrorMessage('Please enter a valid email address.')
      toast.error('Invalid email address format.')
      return
    }

    if (!password) {
      setErrorMessage('Please enter your password.')
      toast.error('Password is required.')
      return
    }

    const res = await login({ email: cleanEmail, password, role: activeRole })
    if (res.success) {
      if (res.user?.role === 'employer') {
        navigate('/employer/dashboard', { replace: true })
      } else {
        navigate('/jobs', { replace: true })
      }
    } else {
      if (res.roleMismatch) {
        setRoleMismatchData({
          actualRole: res.actualRole,
          message: res.message,
        })
      }
      setErrorMessage(res.message || 'Invalid email or password.')
    }
  }

  const isWorker = activeRole === 'employee'

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#070B14] text-[#0F172A] dark:text-[#F8FAFC] flex flex-col font-sans transition-colors duration-300 relative overflow-x-hidden">
      {/* Background Ambient Glows */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[350px] bg-gradient-to-tr from-blue-600/15 via-indigo-600/10 to-transparent blur-[120px] pointer-events-none rounded-full" />
      <div className="absolute bottom-10 right-1/4 w-[450px] h-[350px] bg-gradient-to-bl from-purple-600/10 via-sky-600/10 to-transparent blur-[120px] pointer-events-none rounded-full" />

      {/* Top Header */}
      <header className="sticky top-0 z-50 px-6 py-4 flex items-center justify-between border-b border-slate-200/80 dark:border-white/10 bg-white/80 dark:bg-[#070B14]/80 backdrop-blur-xl">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#2563EB] to-[#1D4ED8] text-white flex items-center justify-center shadow-lg shadow-blue-500/25 group-hover:scale-105 transition-transform">
            <Mic className="w-5 h-5 text-white stroke-[2.5]" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-black tracking-tight text-[#0F172A] dark:text-white leading-none">
              Voice<span className="text-[#2563EB] dark:text-[#60A5FA]">Hire</span>
            </span>
            <span className="text-[10px] font-bold tracking-wider text-slate-400 dark:text-slate-500 uppercase mt-0.5">
              {t.brandName || 'Udyoga Mitra'}
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-3">
          <ThemeToggle className="!w-9 !h-9 !rounded-xl" />
          <LanguageSelector selectedLang={selectedLang} onSelectLang={setSelectedLang} isCompact={true} />
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-10 relative z-10">
        <AnimatePresence mode="wait">
          {step === 'choose' ? (
            /* ===================================================================
               STEP 1: THE TWO ROLE BOXES ("Choose How You Want to Use VoiceHire")
               =================================================================== */
            <motion.div
              key="choose-role"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className="w-full max-w-5xl mx-auto space-y-10 py-6"
            >
              {/* Header */}
              <div className="text-center space-y-3">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-xs font-black uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{t.chooseAccountTypeBadge || 'Choose Your Account Type'}</span>
                </div>
                <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
                  {t.roleSectionTitle || 'Choose How You Want to Use VoiceHire'}
                </h1>
                <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 font-medium max-w-xl mx-auto">
                  {t.roleSectionSubhead || 'Tailored workflows for job seekers and hiring managers.'}
                </p>
              </div>

              {/* The Two Dedicated Role Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                {/* 1. Skilled Worker Card */}
                <motion.div
                  whileHover={{ y: -6, transition: { duration: 0.2 } }}
                  onClick={() => handleSelectRole('employee')}
                  className="group relative p-8 sm:p-9 rounded-[32px] bg-white/90 dark:bg-[#0E1526]/90 border border-slate-200/90 dark:border-white/10 hover:border-blue-500/60 dark:hover:border-blue-500/60 shadow-xl shadow-slate-200/50 dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)] backdrop-blur-xl flex flex-col justify-between cursor-pointer transition-all"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl pointer-events-none group-hover:bg-blue-500/20 transition-all" />

                  <div className="space-y-6 relative z-10">
                    <div className="flex items-center justify-between">
                      <div className="w-14 h-14 rounded-2xl bg-blue-500/10 dark:bg-blue-600/20 text-blue-600 dark:text-blue-400 flex items-center justify-center ring-1 ring-blue-500/30 group-hover:scale-110 transition-transform">
                        <Users className="w-7 h-7 stroke-[2.2]" />
                      </div>
                      <span className="text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                        {t.jobSeekersBadge || 'Job Seekers'}
                      </span>
                    </div>

                    <div className="space-y-2">
                      <h2 className="text-2xl font-black text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {t.workerCardTitle || 'I am a Skilled Worker'}
                      </h2>
                      <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                        {t.workerCardDesc ||
                          'Looking for driving, carpentry, plumbing, electrical, or construction opportunities. Apply by speaking your experience.'}
                      </p>
                    </div>

                    <ul className="space-y-3 pt-2 text-xs font-bold text-slate-600 dark:text-slate-300">
                      <li className="flex items-center gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                        <span>{t.workerBullet1 || 'Search daily wage & monthly salary jobs'}</span>
                      </li>
                      <li className="flex items-center gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                        <span>{t.workerBullet2 || 'Apply via audio mic in your native tongue'}</span>
                      </li>
                      <li className="flex items-center gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                        <span>{t.workerBullet3 || 'Track interview calls & job status in real time'}</span>
                      </li>
                    </ul>
                  </div>

                  <div className="pt-8 relative z-10">
                    <button
                      type="button"
                      className="w-full py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-black text-sm sm:text-base shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 group-hover:shadow-blue-500/40 transition-all cursor-pointer"
                    >
                      <span>{t.logInAsWorker || 'Log In as Worker'}</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </motion.div>

                {/* 2. Employer Card */}
                <motion.div
                  whileHover={{ y: -6, transition: { duration: 0.2 } }}
                  onClick={() => handleSelectRole('employer')}
                  className="group relative p-8 sm:p-9 rounded-[32px] bg-white/90 dark:bg-[#0E1526]/90 border border-slate-200/90 dark:border-white/10 hover:border-indigo-500/60 dark:hover:border-indigo-500/60 shadow-xl shadow-slate-200/50 dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)] backdrop-blur-xl flex flex-col justify-between cursor-pointer transition-all"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none group-hover:bg-indigo-500/20 transition-all" />

                  <div className="space-y-6 relative z-10">
                    <div className="flex items-center justify-between">
                      <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 dark:bg-indigo-600/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center ring-1 ring-indigo-500/30 group-hover:scale-110 transition-transform">
                        <Building2 className="w-7 h-7 stroke-[2.2]" />
                      </div>
                      <span className="text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                        {t.employersBadge || 'Employers & Recruiters'}
                      </span>
                    </div>

                    <div className="space-y-2">
                      <h2 className="text-2xl font-black text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        {t.employerCardTitle || 'I am an Employer'}
                      </h2>
                      <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                        {t.employerCardDesc ||
                          'Hiring verified workers for logistics, fleet, manufacturing, construction, or private services.'}
                      </p>
                    </div>

                    <ul className="space-y-3 pt-2 text-xs font-bold text-slate-600 dark:text-slate-300">
                      <li className="flex items-center gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                        <span>{t.employerBullet1 || 'Post job openings with daily/monthly wage terms'}</span>
                      </li>
                      <li className="flex items-center gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                        <span>{t.employerBullet2 || 'Listen to worker voice applications & transcripts'}</span>
                      </li>
                      <li className="flex items-center gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                        <span>{t.employerBullet3 || 'Shortlist and connect directly over call'}</span>
                      </li>
                    </ul>
                  </div>

                  <div className="pt-8 relative z-10">
                    <button
                      type="button"
                      className="w-full py-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-black text-sm sm:text-base shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2 group-hover:shadow-indigo-500/40 transition-all cursor-pointer"
                    >
                      <span>{t.logInAsEmployer || 'Log In as Employer'}</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </motion.div>
              </div>

              {/* Bottom Switch to Register */}
              <div className="text-center text-sm font-medium text-slate-500 dark:text-slate-400 pt-2">
                <span>{t.dontHaveAccount || "Don't have an account yet?"} </span>
                <Link to="/register" className="font-extrabold text-[#2563EB] dark:text-[#60A5FA] hover:underline">
                  {t.createAccountSignUp || 'Create Account (Sign Up) →'}
                </Link>
              </div>
            </motion.div>
          ) : (
            /* ===================================================================
               STEP 2: WORLD-CLASS MODERN LOGIN FORM (Split-Canvas Experience)
               =================================================================== */
            <motion.div
              key="login-form"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.3 }}
              className="w-full max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center py-4"
            >
              {/* Left Column: World-Class Interactive Experience Showcase */}
              <div className="hidden lg:flex lg:col-span-5 flex-col justify-between p-8 rounded-[36px] bg-gradient-to-br from-slate-900 via-[#0B132B] to-[#070B14] text-white border border-white/10 shadow-2xl relative overflow-hidden min-h-[580px]">
                {/* Ambient Glow */}
                <div
                  className={`absolute -top-20 -right-20 w-64 h-64 rounded-full blur-3xl opacity-40 pointer-events-none ${
                    isWorker ? 'bg-blue-500' : 'bg-indigo-500'
                  }`}
                />

                <div className="space-y-6 relative z-10">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/15 text-xs font-black uppercase tracking-wider backdrop-blur-md">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>{isWorker ? (t.workerVoiceNetwork || 'Worker Voice Network') : (t.verifiedEmployerHub || 'Verified Employer Hub')}</span>
                  </div>

                  <div className="space-y-3">
                    <h2 className="text-3xl font-black tracking-tight leading-tight">
                      {isWorker
                        ? (t.workerShowcaseHeadline || 'Your Voice is Your Resume.')
                        : (t.employerShowcaseHeadline || 'Hire Verified Trades in Minutes.')}
                    </h2>
                    <p className="text-slate-300 text-sm leading-relaxed font-medium">
                      {isWorker
                        ? (t.workerShowcaseDesc || 'Skip typed resumes. Apply by speaking in Kannada, Hindi, or English, and connect directly with licensed employers.')
                        : (t.employerShowcaseDesc || 'Review genuine voice introductions, screen verified candidate histories, and fill open positions same-day.')}
                    </p>
                  </div>

                  {/* Animated Soundwave / Voice Feature Pill */}
                  <div className="p-4 rounded-2xl bg-white/[0.05] border border-white/10 backdrop-blur-md space-y-2.5">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-300">
                      <span className="flex items-center gap-1.5">
                        <Mic className="w-4 h-4 text-blue-400" />
                        <span>{t.voiceRecognitionNLP || 'Voice Recognition NLP'}</span>
                      </span>
                      <span className="text-emerald-400 text-[10px] uppercase font-black">{t.activeStatus || 'Active'}</span>
                    </div>

                    {/* Equalizer Soundwave Bars */}
                    <div className="flex items-center gap-1.5 h-7">
                      {[40, 75, 55, 90, 65, 80, 45, 95, 60, 85, 50, 70, 90, 40].map((h, i) => (
                        <span
                          key={i}
                          style={{ height: `${h}%` }}
                          className={`flex-1 rounded-full ${
                            isWorker ? 'bg-blue-400' : 'bg-indigo-400'
                          } opacity-80`}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Bottom Proof Metric */}
                <div className="pt-6 border-t border-white/10 flex items-center justify-between text-xs text-slate-400 relative z-10">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>{isWorker ? (t.freeForWorkers || '100% Free for Workers') : (t.directEmployerConnect || 'Direct Employer Connect')}</span>
                  </div>
                  <span className="font-bold text-slate-300">{t.placedStat || '15,000+ Placed'}</span>
                </div>
              </div>

              {/* Right Column: World-Class Form Canvas */}
              <div className="lg:col-span-7">
                <div className="p-7 sm:p-10 rounded-[36px] bg-white/95 dark:bg-[#0E1526]/95 border border-slate-200/90 dark:border-white/10 shadow-2xl backdrop-blur-2xl space-y-6">
                  {/* Top Bar: Back to Choice + Active Role Badge */}
                  <div className="flex items-center justify-between gap-2 pb-2 border-b border-slate-100 dark:border-white/10">
                    <button
                      type="button"
                      onClick={handleBackToChoose}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer py-1 px-2 rounded-xl hover:bg-slate-100 dark:hover:bg-white/5"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>{t.backToAccountTypes || 'Change Account Type'}</span>
                    </button>

                    <div
                      className={`inline-flex items-center gap-1.5 text-xs font-black px-3 py-1 rounded-full border ${
                        isWorker
                          ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/25'
                          : 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/25'
                      }`}
                    >
                      {isWorker ? <Users className="w-3.5 h-3.5" /> : <Building2 className="w-3.5 h-3.5" />}
                      <span>{isWorker ? (t.workerPortalBadge || 'Worker Portal') : (t.employerPortalBadge || 'Employer Portal')}</span>
                    </div>
                  </div>

                  {/* Header */}
                  <div className="space-y-1">
                    <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                      {isWorker
                        ? (t.loginTitleWorker || 'Worker Login Portal')
                        : (t.loginTitleEmployer || 'Employer Login Portal')}
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">
                      {isWorker
                        ? (t.loginDescWorker || 'Sign in to browse daily wage & monthly jobs and voice applications.')
                        : (t.loginDescEmployer || 'Sign in to post job vacancies and screen verified applicants.')}
                    </p>
                  </div>

                  {/* Role Mismatch Warning Banner */}
                  {roleMismatchData && (
                    <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-amber-900 dark:text-amber-200 text-xs sm:text-sm space-y-2.5">
                      <div className="flex items-start gap-2.5">
                        <AlertCircle className="w-5 h-5 shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" />
                        <div className="space-y-1">
                          <p className="font-bold">{roleMismatchData.message}</p>
                          <p className="text-xs opacity-90">
                            {t.accountTypeWarning || 'Accounts cannot be used interchangeably across Worker and Employer portals.'}
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          handleSelectRole(roleMismatchData.actualRole || (isWorker ? 'employer' : 'employee'))
                        }
                        className="w-full py-2.5 px-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>{roleMismatchData.actualRole === 'employer' ? (t.switchPortalEmployer || 'Switch to Employer Portal') : (t.switchPortalWorker || 'Switch to Worker Portal')}</span>
                      </button>
                    </div>
                  )}

                  {/* Standard Error Banner */}
                  {errorMessage && !roleMismatchData && (
                    <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-rose-700 dark:text-rose-300 text-xs sm:text-sm flex items-center gap-2.5">
                      <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  {/* Modern Form Fields */}
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Email Field */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                        {isWorker ? (t.workerEmailLabel || 'Worker Email Address') : (t.employerEmailLabel || 'Employer Work Email')}
                      </label>
                      <div className="relative group/input">
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder={isWorker ? 'worker@example.com' : 'hr@company.com'}
                          autoComplete="email"
                          required
                          className="w-full px-4 py-3.5 pl-11 rounded-2xl border border-slate-300 dark:border-white/15 bg-slate-50/70 dark:bg-[#151D30] text-slate-900 dark:text-white text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-all placeholder:text-slate-400"
                        />
                        <Mail className="w-5 h-5 text-slate-400 group-focus-within/input:text-blue-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none transition-colors" />
                      </div>
                    </div>

                    {/* Password Field */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                          {t.passwordLabel || 'Password'}
                        </label>
                      </div>
                      <div className="relative group/input">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="••••••••••••"
                          autoComplete="current-password"
                          required
                          className="w-full px-4 py-3.5 pl-11 pr-11 rounded-2xl border border-slate-300 dark:border-white/15 bg-slate-50/70 dark:bg-[#151D30] text-slate-900 dark:text-white text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-all placeholder:text-slate-400"
                        />
                        <Lock className="w-5 h-5 text-slate-400 group-focus-within/input:text-blue-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none transition-colors" />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 cursor-pointer"
                          aria-label={showPassword ? 'Hide password' : 'Show password'}
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    {/* Submit CTA */}
                    <button
                      type="submit"
                      disabled={loading}
                      className={`w-full py-4 px-4 rounded-2xl text-white font-black text-sm sm:text-base shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed hover:scale-[1.01] active:scale-[0.99] mt-3 ${
                        isWorker
                          ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-800 shadow-blue-500/25'
                          : 'bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 hover:from-indigo-700 hover:to-purple-800 shadow-indigo-500/25'
                      }`}
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          <span>{t.verifyingCredentials || 'Verifying Credentials...'}</span>
                        </>
                      ) : (
                        <>
                          <span>{isWorker ? (t.signInWorkerBtn || 'Sign In as Worker') : (t.signInEmployerBtn || 'Sign In as Employer')}</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </form>

                  {/* Switch to Register */}
                  <div className="pt-2 text-center text-xs text-slate-500 dark:text-slate-400 font-medium">
                    <p>
                      {t.dontHaveAccount || "Don't have an account yet?"}{' '}
                      <Link
                        to={`/register?role=${activeRole}`}
                        className={`font-extrabold hover:underline ${
                          isWorker ? 'text-blue-600 dark:text-blue-400' : 'text-indigo-600 dark:text-indigo-400'
                        }`}
                      >
                        {isWorker ? (t.findJobsAsWorker || 'Find Jobs as Worker') : (t.hireTalentAsEmployer || 'Hire Talent as Employer')} →
                      </Link>
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  )
}
