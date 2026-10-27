import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  User,
  Phone,
  MapPin,
  Briefcase,
  DollarSign,
  Globe,
  Award,
  ShieldCheck,
  Building2,
  CheckCircle2,
  Save,
  Mic,
  ArrowRight,
  Clock,
  Sparkles,
} from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'
import { useVoice } from '../context/VoiceContext'

export default function ProfilePage() {
  const { user, isEmployer, isEmployee, updateProfile, refreshUser } = useAuth()
  const { selectedLang, setSelectedLang, t } = useVoice()

  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [locationCity, setLocationCity] = useState('Bengaluru')
  const [preferredLanguage, setPreferredLanguage] = useState('en')

  // Employee State
  const [tradeCategory, setTradeCategory] = useState('DRIVER')
  const [experience, setExperience] = useState('2+ Years')
  const [expectedWage, setExpectedWage] = useState('1200')
  const [bio, setBio] = useState('')

  // Employer State
  const [companyName, setCompanyName] = useState('')
  const [businessType, setBusinessType] = useState('Logistics & Fleet Transport')
  const [businessDescription, setBusinessDescription] = useState('')

  const [saving, setSaving] = useState(false)

  // Populate from live MongoDB user on mount
  useEffect(() => {
    if (user) {
      setFullName(user.fullName || '')
      setPhone(user.phone || user.phoneNumber || '')
      setLocationCity(user.location || user.city || 'Bengaluru')
      setPreferredLanguage(user.preferredLanguage || selectedLang || 'en')

      if (user.role === 'employer') {
        setCompanyName(user.companyName || '')
        setBusinessType(user.businessType || 'Logistics & Fleet Transport')
        setBusinessDescription(user.businessDescription || '')
      } else {
        setTradeCategory(user.tradeCategory || user.workType || 'DRIVER')
        setExperience(user.experience || '2+ Years')
        setExpectedWage(String(user.expectedWage || 1200))
        setBio(user.bio || '')
      }
    }
  }, [user, selectedLang])

  const handleSave = async (e) => {
    e.preventDefault()

    if (!fullName.trim()) {
      toast.error('Name cannot be empty.')
      return
    }

    try {
      setSaving(true)
      const payload = {
        fullName: fullName.trim(),
        location: locationCity.trim(),
        preferredLanguage,
      }

      if (isEmployer) {
        payload.companyName = companyName.trim()
        payload.businessType = businessType
        payload.businessDescription = businessDescription.trim()
      } else {
        payload.tradeCategory = tradeCategory.toUpperCase()
        payload.experience = experience
        payload.expectedWage = Number(expectedWage) || 1000
        payload.bio = bio.trim()
      }

      const res = await updateProfile(payload)
      if (res?.success) {
        if (setSelectedLang) setSelectedLang(preferredLanguage)
      }
    } finally {
      setSaving(false)
    }
  }

  const TRADES = [
    { code: 'DRIVER', label: t.tradeDriver || 'Driver (Commercial & Private)' },
    { code: 'CARPENTER', label: t.tradeCarpenter || 'Carpenter & Modular Interior' },
    { code: 'ELECTRICIAN', label: t.tradeElectrician || 'Electrician & Wireman' },
    { code: 'PLUMBER', label: t.tradePlumber || 'Plumber & Pipe Fitting' },
    { code: 'COOK', label: t.tradeCook || 'Cook & Kitchen Assistant' },
    { code: 'PAINTER', label: t.tradePainter || 'Painter & Wall Polisher' },
    { code: 'HELPER', label: t.tradeHelper || 'Warehouse & Construction Helper' },
  ]

  const LANGUAGES = [
    { code: 'en', label: 'English' },
    { code: 'kn', label: 'ಕನ್ನಡ (Kannada)' },
    { code: 'hi', label: 'हिंदी (Hindi)' },
    { code: 'ta', label: 'தமிழ் (Tamil)' },
    { code: 'te', label: 'తెలుగు (Telugu)' },
  ]

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      {/* Profile Header Card */}
      <div className="mb-8 p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#151C2C] border border-slate-200/80 dark:border-white/10 shadow-xl shadow-slate-200/40 dark:shadow-black/40 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-[#2563EB] to-[#1D4ED8] text-white font-black text-2xl flex items-center justify-center shadow-lg shadow-blue-500/30">
            {fullName ? fullName.charAt(0).toUpperCase() : 'U'}
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                {isEmployer ? companyName || fullName : fullName || (t.profileTitle || 'Worker Profile')}
              </h1>
              <span className="inline-flex items-center gap-1 text-[11px] font-black px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                <CheckCircle2 className="w-3 h-3" />
                <span>{t.verifiedEmployer || 'Verified'}</span>
              </span>
            </div>

            <p className="text-xs sm:text-sm font-semibold text-slate-500 dark:text-slate-400">
              {isEmployer
                ? `Employer Account • Contact: ${fullName}`
                : `${tradeCategory} • ${locationCity} • Trust Score: ${user?.trustScore || 96}/100`}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-white/[0.04] border border-slate-200/80 dark:border-white/10 text-center">
            <span className="text-xs font-black uppercase text-slate-400">Role</span>
            <p className="text-sm font-black text-[#2563EB] dark:text-[#60A5FA] capitalize">
              {user?.role || (isEmployer ? 'Employer' : 'Employee')}
            </p>
          </div>

          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-white/[0.04] border border-slate-200/80 dark:border-white/10 text-center">
            <span className="text-xs font-black uppercase text-slate-400">Trust Score</span>
            <p className="text-sm font-black text-emerald-600 dark:text-emerald-400">
              {user?.trustScore || 96}%
            </p>
          </div>
        </div>
      </div>

      {/* Main Profile Form */}
      <form
        onSubmit={handleSave}
        className="bg-white dark:bg-[#151C2C] rounded-3xl p-6 sm:p-10 border border-slate-200/80 dark:border-white/10 shadow-xl shadow-slate-200/40 dark:shadow-black/40 space-y-6"
      >
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-white/10">
          <div>
            <h2 className="text-lg font-black text-slate-900 dark:text-white">
              {isEmployer ? 'Company & Contact Details' : 'Personal & Trade Credentials'}
            </h2>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Directly synced with MongoDB for instant profile verification.
            </p>
          </div>
          <button
            type="submit"
            disabled={saving}
            className="px-5 py-2.5 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-extrabold text-xs sm:text-sm flex items-center gap-2 shadow-md shadow-blue-500/25 active:scale-95 transition-all cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? (t.savingProfile || 'Saving...') : (t.saveProfile || 'Save Profile')}</span>
          </button>
        </div>

        {/* Common Info: Name & Mobile */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
              {isEmployer ? (t.contactPersonLabel || 'Contact Person Name') : (t.fullNameLabel || 'Full Name')}
            </label>
            <div className="relative">
              <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 text-sm font-bold text-slate-900 dark:text-white outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
              {t.mobilePhoneLabel || 'Registered Phone Number'}
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                disabled
                value={`+91 ${phone}`}
                className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-100 dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 text-sm font-bold text-slate-500 dark:text-slate-400 cursor-not-allowed outline-none"
              />
            </div>
          </div>
        </div>

        {/* Common Location & Preferred Language */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
              {t.location || 'Location / City'}
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={locationCity}
                onChange={(e) => setLocationCity(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 text-sm font-bold text-slate-900 dark:text-white outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
              {t.preferredLanguage || 'Preferred Language'}
            </label>
            <select
              value={preferredLanguage}
              onChange={(e) => setPreferredLanguage(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 text-sm font-bold text-slate-900 dark:text-white outline-none"
            >
              {LANGUAGES.map((l) => (
                <option key={l.code} value={l.code} className="dark:bg-[#151C2C]">
                  {l.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Role Specific Section */}
        {isEmployer ? (
          <>
            <div className="pt-2 border-t border-slate-100 dark:border-white/10">
              <h3 className="text-sm font-black uppercase tracking-wider text-amber-600 dark:text-amber-400 mb-4">
                Enterprise & Hiring Specifications
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                    {t.companyNameLabel || 'Company / Organization Name'}
                  </label>
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="e.g. Nandi Transport Logistics"
                    className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 text-sm font-bold text-slate-900 dark:text-white outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                    {t.industryTypeLabel || 'Industry / Business Domain'}
                  </label>
                  <input
                    type="text"
                    value={businessType}
                    onChange={(e) => setBusinessType(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 text-sm font-bold text-slate-900 dark:text-white outline-none"
                  />
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                  Company Bio & Typical Hiring Roles
                </label>
                <textarea
                  rows={3}
                  value={businessDescription}
                  onChange={(e) => setBusinessDescription(e.target.value)}
                  placeholder="Tell workers about your company, work culture, and prompt payout reliability."
                  className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 text-sm font-medium text-slate-900 dark:text-white outline-none resize-none"
                />
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="pt-2 border-t border-slate-100 dark:border-white/10">
              <h3 className="text-sm font-black uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-4">
                Worker Trade & Wage Credentials
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                    {t.tradeCategoryLabel || 'Primary Trade'}
                  </label>
                  <select
                    value={tradeCategory}
                    onChange={(e) => setTradeCategory(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 text-sm font-bold text-slate-900 dark:text-white outline-none"
                  >
                    {TRADES.map((t) => (
                      <option key={t.code} value={t.code} className="dark:bg-[#151C2C]">
                        {t.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                    {t.experience || 'Experience Level'}
                  </label>
                  <select
                    value={experience}
                    onChange={(e) => setExperience(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 text-sm font-bold text-slate-900 dark:text-white outline-none"
                  >
                    <option value="Fresher">Fresher / Learner</option>
                    <option value="1-2 Years">1-2 Years</option>
                    <option value="2+ Years">2+ Years</option>
                    <option value="3-5 Years">3-5 Years</option>
                    <option value="5+ Years">5+ Years</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                    {t.salary || 'Expected Daily Wage'} (₹)
                  </label>
                  <input
                    type="number"
                    value={expectedWage}
                    onChange={(e) => setExpectedWage(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 text-sm font-bold text-slate-900 dark:text-white outline-none"
                  />
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                  Worker Audio Intro / Spoken Bio
                </label>
                <textarea
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="e.g. 4 years commercial car driving experience in Bengaluru. Familiar with Airport and Electronic City routes."
                  className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 text-sm font-medium text-slate-900 dark:text-white outline-none resize-none"
                />
              </div>
            </div>
          </>
        )}

        {/* Submit */}
        <div className="pt-4 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] hover:from-[#1D4ED8] hover:to-[#1E40AF] text-white font-black text-sm shadow-xl shadow-blue-500/30 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? (t.savingProfile || 'Updating MongoDB Profile...') : (t.saveProfile || 'Save & Update Profile')}</span>
          </button>
        </div>
      </form>
    </div>
  )
}
