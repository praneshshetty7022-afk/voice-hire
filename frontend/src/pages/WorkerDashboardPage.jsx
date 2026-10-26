import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useVoice } from '../context/VoiceContext'
import { getTranslation } from '../utils/translations'
import HeroVoiceMic from '../components/HeroVoiceMic'
import ProfessionCard from '../components/ProfessionCard'
import { PROFESSIONS } from '../styles/theme'
import { Sparkles, ArrowRight, Clock, CheckCircle2, XCircle, RotateCcw } from 'lucide-react'
import axios from '../api/axios'
import toast from 'react-hot-toast'

export default function WorkerDashboardPage() {
  const navigate = useNavigate()
  const { selectedLang, voiceState, debugLog, startListening, stopListening } = useVoice()
  const t = getTranslation(selectedLang)
  const [userState, setUserState] = useState(() => {
    try {
      const u = localStorage.getItem('user') || sessionStorage.getItem('user')
      return u ? JSON.parse(u) : null
    } catch (e) {
      return null
    }
  })

  const [acceptedApps, setAcceptedApps] = useState([])

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

  const handleProfessionSelect = (profKey) => {
    navigate(`/jobs-list?category=${profKey}`)
  }

  const handleMicTap = () => {
    if (voiceState === 'LISTENING') {
      stopListening()
    } else {
      startListening(navigate)
    }
  }

  const handleSuggestionClick = (phraseText) => {
    navigate(`/jobs-list?search=${encodeURIComponent(phraseText)}`)
  }

  const professionKeys = Object.keys(PROFESSIONS)

  return (
    <div className="space-y-8 pb-12 relative z-10">
      {/* Account Approval Status Banner if PENDING */}
      {accountStatus === 'PENDING' && (
        <div className="bg-blue-50/90 backdrop-blur-xl text-slate-800 p-5 rounded-3xl border border-blue-200/90 shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-fade-in">
          <div className="flex items-center gap-4">
            <Clock className="w-8 h-8 shrink-0 text-blue-600 animate-pulse" />
            <div>
              <h3 className="font-black text-lg sm:text-xl text-blue-900">Registration Status: PENDING APPROVAL</h3>
              <p className="font-bold text-sm text-slate-600 mt-0.5">
                Your worker registration is waiting for admin approval.
              </p>
              <p className="text-xs font-semibold text-slate-500 mt-1">
                You can browse platform jobs. Once approved by Admin, job application capabilities will be fully enabled.
              </p>
            </div>
          </div>

          <button
            onClick={handleManualRefreshStatus}
            className="px-4 py-2.5 bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 text-white rounded-2xl font-black text-xs shrink-0 flex items-center gap-1.5 shadow-md active:scale-95 transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Check Approval Status
          </button>
        </div>
      )}

      {accountStatus === 'REJECTED' && (
        <div className="bg-rose-50/90 backdrop-blur-xl text-slate-800 p-5 rounded-3xl border border-rose-200 shadow-md flex items-center gap-4 animate-fade-in">
          <XCircle className="w-8 h-8 shrink-0 text-rose-500" />
          <div>
            <h3 className="font-black text-lg sm:text-xl text-rose-900">Registration Status: NOT APPROVED</h3>
            <p className="font-bold text-sm text-slate-600 mt-0.5">
              Your worker registration was not approved.
            </p>
            {currentUser?.rejectionReason && (
              <p className="text-xs font-bold bg-rose-100 border border-rose-200 px-3 py-1 rounded-xl mt-1 text-rose-800 inline-block">
                Reason: {currentUser.rejectionReason}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Top Greeting & Hero Welcome Banner */}
      <div className="bg-white/85 backdrop-blur-2xl rounded-3xl p-6 sm:p-8 relative overflow-hidden border border-blue-100/90 shadow-[0_10px_35px_rgba(37,99,235,0.06)]">
        {/* Top Glass Light Highlight Bar */}
        <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-blue-300/50 to-transparent pointer-events-none" />

        <div className="relative z-10 max-w-2xl">
          {/* Fluid Pill Capsule */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50/90 backdrop-blur-xl border border-blue-200/80 text-xs sm:text-sm font-extrabold mb-4 text-blue-700 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 via-indigo-600 to-sky-600">
              Voice-First Employment Platform • उद्योग मित्र
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900">
            {displayName ? (
              <>
                {t.greetingMorning}{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 via-indigo-600 to-sky-600">
                  {displayName} 👋
                </span>
              </>
            ) : (
              <>
                {t.greetingGeneric || 'Welcome,'}{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 via-indigo-600 to-sky-600">
                  Guest 👋
                </span>
              </>
            )}
          </h1>

          {!displayName && (
            <div className="mt-3.5 flex items-center gap-2.5 flex-wrap animate-fade-in">
              <span className="text-xs font-bold text-slate-600">Looking for employment?</span>
              <Link
                to="/register"
                className="px-4 py-2 bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 text-white font-black text-xs rounded-xl shadow-md hover:shadow-blue-500/25 transition-all active:scale-95 inline-flex items-center gap-1.5"
              >
                <span>Register Profile</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <span className="text-xs text-slate-400 font-bold">or</span>
              <Link
                to="/login"
                className="px-3.5 py-2 bg-white hover:bg-blue-50 text-blue-700 font-extrabold text-xs rounded-xl border border-blue-200 transition-all shadow-sm"
              >
                Log In
              </Link>
            </div>
          )}

          <p className="text-base sm:text-lg font-bold text-slate-600 mt-3">
            {t.heroQuestion}
          </p>
        </div>

        {/* Ambient Radial Background Gradient */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-blue-200/30 via-indigo-100/20 to-transparent rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Track Job Applications Action Card */}
      <div className="bg-white/85 backdrop-blur-2xl text-slate-900 rounded-3xl p-6 border border-blue-100/90 hover:border-blue-300 shadow-[0_10px_35px_rgba(37,99,235,0.06)] hover:shadow-[0_16px_45px_rgba(37,99,235,0.12)] transition-all duration-300 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-100/80 to-indigo-100/60 border border-blue-200/80 text-blue-700 flex items-center justify-center text-2xl shadow-sm shrink-0">
            📋
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[10px] font-black bg-emerald-50 text-emerald-700 uppercase tracking-widest mb-1 border border-emerald-200">
              Live Job Status
            </div>
            <h3 className="text-xl font-black text-slate-900">Track Applied Jobs (नौकरी का स्टेटस ट्रैक करें)</h3>
            <p className="text-xs font-semibold text-slate-500 mt-0.5">
              View submitted job applications and admin approval status
            </p>
          </div>
        </div>

        <button
          onClick={() => navigate('/applications/my')}
          className="px-6 py-3 bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 hover:scale-[1.02] active:scale-[0.98] text-white font-black text-sm rounded-2xl shadow-md hover:shadow-blue-500/30 flex items-center justify-center gap-2 border border-blue-400/30 shrink-0 transition-all"
        >
          <span>Track Applications</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Accepted Job Applications Banner on Home Page */}
      {Array.isArray(acceptedApps) && acceptedApps.length > 0 && (
        <div className="bg-emerald-50/90 backdrop-blur-2xl text-slate-800 rounded-3xl p-6 sm:p-7 border border-emerald-200 animate-fade-in space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center text-2xl border border-emerald-200">
                🎉
              </div>
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-black bg-emerald-100 text-emerald-800 border border-emerald-200 uppercase tracking-wider mb-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Admin Approved
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900">Accepted Job Applications (स्वीकृत आवेदन)</h3>
                <p className="text-xs font-semibold text-emerald-700 mt-0.5">
                  Congratulations! Your application has been reviewed & accepted by Admin based on accepted documents.
                </p>
              </div>
            </div>
            <span className="bg-emerald-600 text-white font-black px-3.5 py-1 rounded-full text-xs shadow-sm">
              {(Array.isArray(acceptedApps) ? acceptedApps.length : 0)} Accepted
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            {(Array.isArray(acceptedApps) ? acceptedApps : []).map((app) => (
              <div key={app.id || app.applicationId} className="bg-white/90 p-4 rounded-2xl border border-emerald-200/80 flex flex-col justify-between space-y-3 shadow-sm">
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-black text-emerald-800 text-base">{app.jobTitle || app.title}</span>
                    <span className="bg-emerald-600 text-white font-black text-[10px] px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                      ✓ ACCEPTED
                    </span>
                  </div>
                  <div className="text-xs font-bold text-slate-700">
                    🏢 {app.company || app.employerName || 'Verified Employer'}
                  </div>
                  <div className="text-xs font-semibold text-slate-500 flex flex-wrap gap-x-3 gap-y-1 pt-1">
                    <span>📍 {app.location || app.jobLocation || 'Bengaluru'}</span>
                    <span>💰 {app.salary || (app.minSalary ? `₹${app.minSalary} - ₹${app.maxSalary}` : '₹15,000/mo')}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                  <span className="text-emerald-700 font-bold">Approved by Udyoga Mitra Admin</span>
                  <button
                    onClick={() => navigate('/applications/my')}
                    className="text-blue-600 font-black hover:underline flex items-center gap-1"
                  >
                    View Status <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Central HERO VOICE BUTTON Component Container */}
      <div className="bg-white/85 backdrop-blur-2xl rounded-3xl p-6 sm:p-8 border border-blue-100/90 shadow-[0_15px_45px_rgba(37,99,235,0.08)] relative overflow-hidden">
        {/* Soft background light splash */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] bg-gradient-to-tr from-blue-100/40 via-sky-50/30 to-indigo-50/40 rounded-full blur-3xl pointer-events-none" />

        <HeroVoiceMic
          voiceState={voiceState}
          onMicClick={handleMicTap}
          lang={selectedLang}
          transcript={debugLog?.rawSpeech}
        />

        {/* Voice Command Suggestions */}
        <div className="mt-8 pt-6 border-t border-blue-100/80 relative z-10">
          <p className="text-xs font-black text-slate-500 uppercase tracking-widest mb-3 flex items-center justify-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>{t.trySaying}</span>
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2.5">
            {(Array.isArray(t?.voiceCommands) ? t.voiceCommands : []).map((cmd, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSuggestionClick(cmd.replace(/🎤|"/g, '').trim())}
                className="px-4 py-2 bg-blue-50/80 hover:bg-blue-100/90 text-blue-900 font-extrabold text-xs sm:text-sm rounded-full border border-blue-200/80 hover:border-blue-400/60 shadow-sm transition-all hover:scale-105 active:scale-95 text-center"
              >
                {cmd}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Popular Professions Section */}
      <div className="space-y-4 relative z-10">
        <div className="flex items-center justify-between px-1">
          <div>
            <h2 className="text-2xl font-black text-slate-900">{t.chooseWork}</h2>
            <p className="text-xs font-semibold text-slate-500">{t.popularProfessions}</p>
          </div>

          <button
            type="button"
            onClick={() => navigate('/jobs-list')}
            className="flex items-center gap-1 text-blue-600 font-extrabold hover:text-blue-800 text-sm sm:text-base group transition-colors"
          >
            <span>{t.viewAllJobs}</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* 2-Column Mobile / 4-Column Desktop Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {(Array.isArray(professionKeys) ? professionKeys : []).map((profKey) => (
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
