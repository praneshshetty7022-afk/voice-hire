import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useVoice } from '../context/VoiceContext'
import { getTranslation } from '../utils/translations'
import HeroVoiceMic from '../components/HeroVoiceMic'
import ProfessionCard from '../components/ProfessionCard'
import { PROFESSIONS } from '../styles/theme'
import { Sparkles, ArrowRight, Clock, AlertTriangle, CheckCircle2, XCircle, RotateCcw } from 'lucide-react'
import axios from '../api/axios'
import toast from 'react-hot-toast'

export default function WorkerDashboardPage() {
  const navigate = useNavigate()
  const { selectedLang, voiceState, debugLog, startListening, stopListening } = useVoice()
  const t = getTranslation(selectedLang)
  const [userState, setUserState] = useState(() => {
    try {
      const u = localStorage.getItem('user')
      return u ? JSON.parse(u) : {}
    } catch (e) {
      return {}
    }
  })

  const [acceptedApps, setAcceptedApps] = useState([])

  useEffect(() => {
    syncWorkerProfile()
    fetchAcceptedApps()
  }, [])

  const fetchAcceptedApps = async () => {
    try {
      const localU = JSON.parse(localStorage.getItem('user') || '{}')
      const workerId = localU.id || localU.phoneNumber || 'worker_1'
      const res = await axios.get(`/applications/accepted?workerId=${workerId}`)
      if (res.data) {
        setAcceptedApps(res.data)
      }
    } catch (e) {
      console.error('Failed to fetch accepted applications:', e)
    }
  }

  const syncWorkerProfile = async () => {
    try {
      const localU = JSON.parse(localStorage.getItem('user') || '{}')
      const targetId = localU.id || localU.phoneNumber || localU.email || 'worker_1'
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
  const accountStatus = currentUser.role === 'WORKER' ? (currentUser.accountStatus || 'APPROVED') : 'APPROVED'

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
    <div className="space-y-8 pb-12">
      {/* Account Approval Status Banner if PENDING or REJECTED */}
      {accountStatus === 'PENDING' && (
        <div className="bg-amber-500 text-slate-950 p-5 rounded-3xl border-4 border-amber-300 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-fade-in">
          <div className="flex items-center gap-4">
            <Clock className="w-9 h-9 shrink-0 text-slate-950 animate-pulse" />
            <div>
              <h3 className="font-black text-lg sm:text-xl">Registration Status: PENDING APPROVAL</h3>
              <p className="font-extrabold text-sm text-slate-900 mt-0.5">
                Your worker registration is waiting for admin approval.
              </p>
              <p className="text-xs font-bold text-slate-800 mt-1">
                You can browse platform jobs. Once approved by Admin, job application capabilities will be fully enabled.
              </p>
            </div>
          </div>

          <button
            onClick={handleManualRefreshStatus}
            className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-amber-400 rounded-2xl font-black text-xs shrink-0 flex items-center gap-1.5 shadow active:scale-95 transition-all"
          >
            <RotateCcw className="w-4 h-4" /> Check Approval Status
          </button>
        </div>
      )}

      {accountStatus === 'REJECTED' && (
        <div className="bg-rose-600 text-white p-5 rounded-3xl border-4 border-rose-400 shadow-xl flex items-center gap-4 animate-fade-in">
          <XCircle className="w-9 h-9 shrink-0 text-white" />
          <div>
            <h3 className="font-black text-lg sm:text-xl">Registration Status: NOT APPROVED</h3>
            <p className="font-extrabold text-sm text-rose-100 mt-0.5">
              Your worker registration was not approved.
            </p>
            {currentUser.rejectionReason && (
              <p className="text-xs font-bold bg-rose-700/80 px-3 py-1 rounded-xl mt-1 text-rose-100 inline-block">
                Reason: {currentUser.rejectionReason}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Top Greeting & Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden border border-blue-500/30">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30 text-sm font-extrabold mb-3">
            <Sparkles className="w-4 h-4 text-blue-400" />
            <span>Voice-First Employment Platform</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
            {t.greetingMorning} <span className="text-amber-400">{currentUser.name || 'Worker'} 👋</span>
          </h1>
          <p className="text-lg sm:text-xl font-bold text-blue-100 mt-2">
            {t.heroQuestion}
          </p>
        </div>

        {/* Ambient Radial Background Pattern */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Track Job Applications Action Card */}
      <div className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white rounded-3xl p-6 shadow-xl border-4 border-blue-500 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-blue-600 text-white flex items-center justify-center text-2xl shadow-lg border border-blue-400 shrink-0">
            📋
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-black bg-blue-500/30 text-blue-300 uppercase tracking-wider mb-1 border border-blue-400/30">
              Live Job Status
            </div>
            <h3 className="text-xl font-black text-white">Track Applied Jobs (नौकरी का स्टेटस ट्रैक करें)</h3>
            <p className="text-xs font-bold text-slate-300 mt-0.5">
              View submitted job applications and admin approval status
            </p>
          </div>
        </div>

        <button
          onClick={() => navigate('/applications/my')}
          className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black text-sm rounded-2xl shadow-lg flex items-center justify-center gap-2 border border-blue-300 shrink-0 active:scale-95 transition-all"
        >
          <span>Track Applications</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Accepted Job Applications Banner on Home Page */}
      {acceptedApps.length > 0 && (
        <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white rounded-3xl p-6 sm:p-7 shadow-2xl border-4 border-emerald-500 animate-fade-in space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/30 text-emerald-300 flex items-center justify-center text-2xl border border-emerald-400/40">
                🎉
              </div>
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-black bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 uppercase tracking-wider mb-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Admin Approved
                </div>
                <h3 className="text-xl sm:text-2xl font-black">Accepted Job Applications (स्वीकृत आवेदन)</h3>
                <p className="text-xs font-bold text-emerald-200 mt-0.5">
                  Congratulations! Your application has been reviewed & accepted by Admin based on accepted documents.
                </p>
              </div>
            </div>
            <span className="bg-emerald-500 text-slate-950 font-black px-3.5 py-1 rounded-full text-xs">
              {acceptedApps.length} Accepted
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            {acceptedApps.map((app) => (
              <div key={app.id || app.applicationId} className="bg-slate-800/90 p-4 rounded-2xl border-2 border-emerald-400/60 shadow-lg flex flex-col justify-between space-y-3">
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-black text-emerald-400 text-base">{app.jobTitle || app.title}</span>
                    <span className="bg-emerald-500 text-slate-950 font-black text-[10px] px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                      ✓ ACCEPTED
                    </span>
                  </div>
                  <div className="text-xs font-bold text-slate-300">
                    🏢 {app.company || app.employerName || 'Verified Employer'}
                  </div>
                  <div className="text-xs font-semibold text-slate-400 flex flex-wrap gap-x-3 gap-y-1 pt-1">
                    <span>📍 {app.location || app.jobLocation || 'Bengaluru'}</span>
                    <span>💰 {app.salary || (app.minSalary ? `₹${app.minSalary} - ₹${app.maxSalary}` : '₹15,000/mo')}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-700 text-xs">
                  <span className="text-emerald-300 font-bold">Approved by Udyoga Mitra Admin</span>
                  <button
                    onClick={() => navigate('/applications/my')}
                    className="text-amber-400 font-black hover:underline flex items-center gap-1"
                  >
                    View Status <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Central HERO VOICE BUTTON Component */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border-2 border-slate-100">
        <HeroVoiceMic
          voiceState={voiceState}
          onMicClick={handleMicTap}
          lang={selectedLang}
          transcript={debugLog?.rawSpeech}
        />

        {/* Voice Command Suggestions */}
        <div className="mt-8 pt-6 border-t border-slate-100">
          <p className="text-sm font-black text-slate-500 uppercase tracking-wider mb-3 flex items-center justify-center gap-1.5">
            <span>{t.trySaying}</span>
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2.5">
            {t.voiceCommands.map((cmd, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSuggestionClick(cmd.replace(/🎤|"/g, '').trim())}
                className="px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-900 font-extrabold text-sm rounded-full border border-blue-200 shadow-sm transition-all hover:scale-105 active:scale-95 text-center"
              >
                {cmd}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Popular Professions Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <div>
            <h2 className="text-2xl font-black text-slate-900">{t.chooseWork}</h2>
            <p className="text-sm font-semibold text-slate-500">{t.popularProfessions}</p>
          </div>

          <button
            type="button"
            onClick={() => navigate('/jobs-list')}
            className="flex items-center gap-1 text-blue-600 font-extrabold hover:text-blue-700 text-sm sm:text-base group"
          >
            <span>{t.viewAllJobs}</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* 2-Column Mobile / 4-Column Desktop Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {professionKeys.map((profKey) => (
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
