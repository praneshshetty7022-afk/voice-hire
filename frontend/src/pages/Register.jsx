import React, { useState, useEffect } from 'react'
import { useNavigate, Link, useLocation } from 'react-router-dom'
import {
  User,
  Mail,
  Lock,
  Phone,
  Building2,
  Users,
  ArrowRight,
  Mic,
  AlertCircle,
  Loader2,
  Briefcase,
} from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'
import ThemeToggle from '../components/ThemeToggle'
import LanguageSelector from '../components/LanguageSelector'
import { useVoice } from '../context/VoiceContext'

export default function Register() {
  const navigate = useNavigate()
  const location = useLocation()
  const { register, loading, isAuthenticated, isEmployer } = useAuth()
  const { selectedLang, setSelectedLang } = useVoice()

  // Pre-selected role from query params if any
  const queryParams = new URLSearchParams(location.search)
  const initialRole = queryParams.get('role') === 'employer' ? 'employer' : 'employee'

  const [role, setRole] = useState(initialRole)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [phone, setPhone] = useState('')
  const [tradeCategory, setTradeCategory] = useState('DRIVER')
  const [companyName, setCompanyName] = useState('')
  const [businessType, setBusinessType] = useState('Logistics & Fleet Transport')
  const [errorMessage, setErrorMessage] = useState('')

  // Sync role if query param changes
  useEffect(() => {
    const roleParam = new URLSearchParams(location.search).get('role')
    if (roleParam === 'employer' || roleParam === 'employee') {
      setRole(roleParam)
    }
  }, [location.search])

  // Redirect if already authenticated
  if (isAuthenticated) {
    navigate(isEmployer ? '/employer/dashboard' : '/jobs', { replace: true })
    return null
  }

  const handleSwitchRole = (targetRole) => {
    setRole(targetRole)
    setErrorMessage('')
    navigate(`/register?role=${targetRole}`, { replace: true })
  }

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

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrorMessage('')

    const cleanName = name.trim()
    const cleanEmail = email.trim().toLowerCase()

    if (!cleanName) {
      setErrorMessage('Please enter your full name.')
      toast.error('Name is required.')
      return
    }

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

    if (!password || password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.')
      toast.error('Password must be at least 6 characters long.')
      return
    }

    const payload = {
      name: cleanName,
      fullName: cleanName,
      email: cleanEmail,
      password,
      role,
      phone: phone.trim(),
      tradeCategory: role === 'employee' ? tradeCategory : undefined,
      companyName: role === 'employer' ? (companyName.trim() || `${cleanName}'s Enterprise`) : undefined,
      businessType: role === 'employer' ? businessType : undefined,
      preferredLanguage: selectedLang || 'en',
    }

    const res = await register(payload)
    if (res.success) {
      if (role === 'employer') {
        navigate('/employer/dashboard', { replace: true })
      } else {
        navigate('/jobs', { replace: true })
      }
    } else {
      setErrorMessage(res.message || 'Registration failed. Please try again.')
    }
  }

  const isWorker = role === 'employee'

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0B0F19] text-[#0F172A] dark:text-[#F8FAFC] flex flex-col font-sans transition-colors duration-300">
      {/* Header */}
      <header className="px-6 py-4 flex items-center justify-between border-b border-slate-200/80 dark:border-white/10 bg-white/70 dark:bg-[#0B0F19]/70 backdrop-blur-md">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#2563EB] to-[#1D4ED8] text-white flex items-center justify-center shadow-md shadow-blue-500/25">
            <Mic className="w-5 h-5 text-white stroke-[2.5]" />
          </div>
          <span className="text-xl font-black tracking-tight text-[#0F172A] dark:text-white">
            Voice<span className="text-[#2563EB] dark:text-[#60A5FA]">Hire</span>
          </span>
        </Link>

        <div className="flex items-center gap-3">
          <ThemeToggle className="!w-9 !h-9 !rounded-xl" />
          <LanguageSelector selectedLang={selectedLang} onSelectLang={setSelectedLang} isCompact={true} />
        </div>
      </header>

      {/* Main Container */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 py-8">
        <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-200/90 dark:border-white/10 p-6 sm:p-8 space-y-6">
          {/* Two Dedicated Portal Selector Tabs */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Select Registration Account Type
            </span>
            <div className="grid grid-cols-2 gap-2 p-1.5 rounded-2xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200/80 dark:border-white/10">
              <button
                type="button"
                onClick={() => handleSwitchRole('employee')}
                className={`py-3 px-3 rounded-xl text-xs sm:text-sm font-black flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  isWorker
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25 scale-[1.02]'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Users className="w-4 h-4" />
                <span>Worker Form</span>
              </button>

              <button
                type="button"
                onClick={() => handleSwitchRole('employer')}
                className={`py-3 px-3 rounded-xl text-xs sm:text-sm font-black flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  !isWorker
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/25 scale-[1.02]'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Building2 className="w-4 h-4" />
                <span>Employer Form</span>
              </button>
            </div>
          </div>

          {/* Form Header */}
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold tracking-wide uppercase mb-1">
              {isWorker ? (
                <span className="text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2.5 py-0.5 rounded-full border border-blue-200 dark:border-blue-900/60">
                  👷 Worker Registration
                </span>
              ) : (
                <span className="text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2.5 py-0.5 rounded-full border border-indigo-200 dark:border-indigo-900/60">
                  🏢 Employer Registration
                </span>
              )}
            </div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white">
              {isWorker ? 'Register as a Skilled Worker' : 'Register as an Employer'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">
              {isWorker
                ? 'Create your worker profile to apply for jobs and connect with employers'
                : 'Create your hiring manager account to post vacancies and screen candidates'}
            </p>
          </div>

          {/* Error Banner */}
          {errorMessage && (
            <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-rose-700 dark:text-rose-300 text-xs sm:text-sm flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Dedicated Registration Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                {isWorker ? 'Full Name' : 'Contact Person / Representative Name'}
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={isWorker ? 'e.g. Ramesh Kumar' : 'e.g. Suresh Gowda'}
                  autoComplete="name"
                  required
                  className="w-full px-4 py-3 pl-11 rounded-2xl border border-slate-300 dark:border-white/15 bg-slate-50/50 dark:bg-slate-800/50 text-slate-900 dark:text-white text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all placeholder:text-slate-400"
                />
                <User className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Email Address */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                {isWorker ? 'Personal Email Address' : 'Official Work Email'}
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={isWorker ? 'ramesh@example.com' : 'hr@company.com'}
                  autoComplete="email"
                  required
                  className="w-full px-4 py-3 pl-11 rounded-2xl border border-slate-300 dark:border-white/15 bg-slate-50/50 dark:bg-slate-800/50 text-slate-900 dark:text-white text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all placeholder:text-slate-400"
                />
                <Mail className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Password <span className="font-normal text-slate-400">(min 6 characters)</span>
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a secure password"
                  autoComplete="new-password"
                  required
                  minLength={6}
                  className="w-full px-4 py-3 pl-11 rounded-2xl border border-slate-300 dark:border-white/15 bg-slate-50/50 dark:bg-slate-800/50 text-slate-900 dark:text-white text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all placeholder:text-slate-400"
                />
                <Lock className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Mobile Number */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Mobile Number <span className="font-normal text-slate-400">(for direct calls)</span>
              </label>
              <div className="relative">
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="10-digit mobile number"
                  autoComplete="tel"
                  className="w-full px-4 py-3 pl-11 rounded-2xl border border-slate-300 dark:border-white/15 bg-slate-50/50 dark:bg-slate-800/50 text-slate-900 dark:text-white text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all placeholder:text-slate-400"
                />
                <Phone className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Worker-Specific Field */}
            {isWorker ? (
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Primary Trade Skill</label>
                <div className="relative">
                  <select
                    value={tradeCategory}
                    onChange={(e) => setTradeCategory(e.target.value)}
                    className="w-full px-4 py-3 pl-11 rounded-2xl border border-slate-300 dark:border-white/15 bg-slate-50/50 dark:bg-slate-800/50 text-slate-900 dark:text-white text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  >
                    {TRADES.map((t) => (
                      <option key={t.code} value={t.code} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
                        {t.label}
                      </option>
                    ))}
                  </select>
                  <Briefcase className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
            ) : (
              /* Employer-Specific Fields */
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Company / Enterprise Name
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="e.g. Nandi Transport Logistics"
                      required
                      className="w-full px-4 py-3 pl-11 rounded-2xl border border-slate-300 dark:border-white/15 bg-slate-50/50 dark:bg-slate-800/50 text-slate-900 dark:text-white text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all placeholder:text-slate-400"
                    />
                    <Building2 className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Business Sector</label>
                  <select
                    value={businessType}
                    onChange={(e) => setBusinessType(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl border border-slate-300 dark:border-white/15 bg-slate-50/50 dark:bg-slate-800/50 text-slate-900 dark:text-white text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                  >
                    {BUSINESS_TYPES.map((b) => (
                      <option key={b} value={b} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
                        {b}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3.5 px-4 rounded-2xl text-white font-extrabold text-sm sm:text-base shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed hover:scale-[1.01] active:scale-[0.99] mt-2 ${
                isWorker
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-blue-500/25'
                  : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-indigo-500/25'
              }`}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Creating {isWorker ? 'Worker' : 'Employer'} Account...</span>
                </>
              ) : (
                <>
                  <span>Create {isWorker ? 'Worker' : 'Employer'} Account</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Footer Navigation */}
          <div className="pt-2 text-center text-xs text-slate-500 dark:text-slate-400 font-medium">
            Already have an account?{' '}
            <Link
              to={`/login?role=${role}`}
              className={`font-bold hover:underline ${
                isWorker ? 'text-blue-600 dark:text-blue-400' : 'text-indigo-600 dark:text-indigo-400'
              }`}
            >
              Log in as {isWorker ? 'Worker' : 'Employer'}
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
