import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Users,
  Mic,
  Phone,
  CheckCircle2,
  XCircle,
  Clock,
  Sparkles,
  ArrowRight,
  Filter,
  Volume2,
  Briefcase,
  Calendar,
  AlertCircle,
} from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'

export default function ManageApplicantsPage() {
  const { user } = useAuth()
  const [applicants, setApplicants] = useState([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [selectedVoiceTranscript, setSelectedVoiceTranscript] = useState(null)

  const fetchApplicants = async () => {
    try {
      setLoading(true)
      const res = await api.get('/applications/employer')
      if (Array.isArray(res.data)) {
        setApplicants(res.data)
      } else {
        setApplicants([])
      }
    } catch (err) {
      console.error('Error fetching applicants:', err)
      toast.error('Could not load applicants.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchApplicants()
  }, [])

  const handleUpdateStatus = async (appId, nextStatus) => {
    try {
      const res = await api.put(`/applications/${appId}/status`, {
        status: nextStatus,
      })

      if (res.data?.success) {
        toast.success(`Candidate marked as ${nextStatus}!`)
        setApplicants((prev) =>
          prev.map((app) =>
            (app._id === appId || app.id === appId ? { ...app, status: nextStatus } : app)
          )
        )
      }
    } catch (err) {
      toast.error('Could not update status.')
    }
  }

  const playVoiceNote = (transcript) => {
    if ('speechSynthesis' in window && transcript) {
      window.speechSynthesis.cancel()
      const u = new SpeechSynthesisUtterance(transcript)
      u.rate = 0.95
      window.speechSynthesis.speak(u)
      toast('🔊 Playing candidate voice recording...', { icon: '🎤' })
    }
  }

  const filteredApplicants =
    statusFilter === 'ALL'
      ? applicants
      : applicants.filter((a) => a.status?.toUpperCase() === statusFilter)

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8">
      {/* Header */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
            <Link to="/employer/dashboard" className="hover:text-[#2563EB]">
              Employer Dashboard
            </Link>
            <span>/</span>
            <span className="text-[#2563EB] dark:text-[#60A5FA]">Applicants</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Candidate Applications & Voice Screenings
          </h1>
          <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 mt-1">
            Review applicant trade credentials, listen to spoken audio introductions, and schedule interviews.
          </p>
        </div>

        <Link
          to="/employer/post-job"
          className="px-4 py-2.5 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-extrabold text-xs sm:text-sm flex items-center gap-2 shadow-md shadow-blue-500/25 w-fit"
        >
          <span>+ Post Another Job</span>
        </Link>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6">
        {[
          { key: 'ALL', label: 'All Candidates' },
          { key: 'APPLIED', label: 'New / Applied' },
          { key: 'SHORTLISTED', label: 'Shortlisted' },
          { key: 'HIRED', label: 'Hired' },
          { key: 'REJECTED', label: 'Rejected' },
        ].map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setStatusFilter(tab.key)}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-extrabold whitespace-nowrap transition-all cursor-pointer ${
              statusFilter === tab.key
                ? 'bg-[#2563EB] text-white shadow-md shadow-blue-500/20'
                : 'bg-white dark:bg-[#151C2C] text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-white/10 hover:border-blue-400'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Applicants List */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center">
          <div className="w-10 h-10 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mb-3" />
          <p className="text-xs font-bold text-slate-400">Loading candidates from MongoDB...</p>
        </div>
      ) : filteredApplicants.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-white dark:bg-[#151C2C] border border-slate-200/80 dark:border-white/10">
          <Users className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
          <h3 className="text-lg font-black text-slate-800 dark:text-white">
            No applicants found in this category
          </h3>
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1">
            New candidate applications will appear here as soon as workers apply.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredApplicants.map((app) => {
            const appId = app._id || app.id
            const status = app.status?.toUpperCase() || 'APPLIED'

            return (
              <div
                key={appId}
                className="p-6 rounded-3xl bg-white dark:bg-[#151C2C] border border-slate-200/80 dark:border-white/10 shadow-lg shadow-slate-200/30 dark:shadow-black/30 flex flex-col lg:flex-row lg:items-center justify-between gap-6 transition-all hover:border-blue-500/30"
              >
                {/* Left: Candidate Credentials */}
                <div className="space-y-3 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full ${
                        status === 'HIRED'
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                          : status === 'SHORTLISTED'
                          ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                          : status === 'REJECTED'
                          ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
                          : 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20'
                      }`}
                    >
                      {status}
                    </span>

                    {app.appliedMode === 'VOICE' && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-500 border border-indigo-500/20">
                        <Mic className="w-3 h-3" />
                        <span>Voice Applied</span>
                      </span>
                    )}

                    <span className="text-xs font-bold text-slate-400">
                      Applied for: <strong className="text-slate-700 dark:text-slate-200">{app.jobTitle}</strong>
                    </span>
                  </div>

                  <div>
                    <h3 className="text-lg font-black text-slate-900 dark:text-white">
                      {app.applicantName}
                    </h3>
                    <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-slate-500 dark:text-slate-400 mt-1">
                      <span className="flex items-center gap-1">
                        <Briefcase className="w-3.5 h-3.5 text-blue-500" />
                        <span>{app.applicantTrade || 'Trade Worker'}</span>
                      </span>
                      <span>•</span>
                      <span>{app.applicantExperience || '2+ Years Experience'}</span>
                      <span>•</span>
                      <span>Expected: ₹{app.expectedWage || 1000}/day</span>
                    </div>
                  </div>

                  {/* Spoken Voice Transcript Note */}
                  {app.voiceTranscript && (
                    <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/[0.04] border border-slate-200/60 dark:border-white/5 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-black uppercase text-blue-600 dark:text-blue-400 flex items-center gap-1">
                          <Mic className="w-3 h-3" />
                          <span>Candidate Voice Audio Transcript</span>
                        </span>
                        <button
                          type="button"
                          onClick={() => playVoiceNote(app.voiceTranscript)}
                          className="flex items-center gap-1 text-xs font-bold text-[#2563EB] hover:underline cursor-pointer"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                          <span>Play Audio</span>
                        </button>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-300 italic font-medium">
                        "{app.voiceTranscript}"
                      </p>
                    </div>
                  )}
                </div>

                {/* Right: Actions (Direct Call, Shortlist, Hire, Reject) */}
                <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 shrink-0">
                  <a
                    href={`tel:+91${app.applicantPhone}`}
                    className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-white/[0.08] hover:bg-slate-200 text-slate-800 dark:text-white font-extrabold text-xs sm:text-sm flex items-center gap-1.5 transition-all"
                  >
                    <Phone className="w-4 h-4 text-blue-500" />
                    <span>Call Worker</span>
                  </a>

                  {status !== 'SHORTLISTED' && status !== 'HIRED' && (
                    <button
                      type="button"
                      onClick={() => handleUpdateStatus(appId, 'SHORTLISTED')}
                      className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-xs sm:text-sm flex items-center gap-1.5 transition-all cursor-pointer shadow-md shadow-amber-500/20"
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>Shortlist</span>
                    </button>
                  )}

                  {status !== 'HIRED' && (
                    <button
                      type="button"
                      onClick={() => handleUpdateStatus(appId, 'HIRED')}
                      className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs sm:text-sm flex items-center gap-1.5 transition-all cursor-pointer shadow-md shadow-emerald-600/20"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Hire</span>
                    </button>
                  )}

                  {status !== 'REJECTED' && (
                    <button
                      type="button"
                      onClick={() => handleUpdateStatus(appId, 'REJECTED')}
                      className="p-2.5 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-white/[0.06] transition-all cursor-pointer"
                      title="Decline Candidate"
                    >
                      <XCircle className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
