import React, { useState, useEffect } from 'react'
import { PROFESSIONS } from '../styles/theme'
import { useVoice } from '../context/VoiceContext'
import { getTranslation } from '../utils/translations'
import axios from '../api/axios'
import ApplicationDetailModal from '../components/ApplicationDetailModal'
import { CheckCircle2, Clock, MapPin, IndianRupee, Mic, FileCheck, RefreshCw, Calendar, XCircle, Eye, Info } from 'lucide-react'

export default function MyApplicationsPage() {
  const { selectedLang } = useVoice()
  const t = getTranslation(selectedLang)

  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [filterTab, setFilterTab] = useState('ALL') // ALL, VOICE, MANUAL
  const [selectedAppModal, setSelectedAppModal] = useState(null)

  useEffect(() => {
    fetchMyApplications()
  }, [])

  const fetchMyApplications = async () => {
    setLoading(true)
    try {
      let data = null
      try {
        const res = await axios.get('/applications/my')
        data = Array.isArray(res?.data) ? res.data : null
      } catch (err) {
        // Fallback to worker id endpoint
        const userStr = localStorage.getItem('user')
        const user = userStr ? JSON.parse(userStr) : { id: 'worker_1' }
        const res2 = await axios.get(`/applications/worker/${user._id || user.id || 'worker_1'}`)
        data = Array.isArray(res2?.data) ? res2.data : null
      }

      if (data && data.length > 0) {
        setApplications(data)
      } else {
        setApplications(getMockApplications())
      }
    } catch (e) {
      setApplications(getMockApplications())
    } finally {
      setLoading(false)
    }
  }

  const getMockApplications = () => [
    {
      id: 'app_carp_1',
      jobId: 'job_carp_1',
      jobTitle: 'Wood Carpenter (ಮರಗೆಲಸ / Carpenter)',
      category: 'CARPENTER',
      location: 'Bengaluru',
      dailyWage: 1200,
      experience: '3 years',
      applicationSource: 'VOICE',
      appliedAt: Date.now() - 86400000 * 2,
      status: 'UNDER_REVIEW',
      employerName: 'Mysuru Furniture Works',
    },
    {
      id: 'app_drv_1',
      jobId: 'job_drv_1',
      jobTitle: 'Personal Car Driver (गाड़ी ड्राइवर)',
      category: 'DRIVER',
      location: 'Bengaluru',
      dailyWage: 18000,
      salaryType: 'MONTHLY',
      experience: '5 years',
      applicationSource: 'MANUAL',
      appliedAt: Date.now() - 86400000 * 5,
      status: 'INTERVIEW_SCHEDULED',
      interviewDate: '28 September 2026',
      interviewTime: '10:30 AM',
      interviewMode: 'In Person',
      interviewLocation: 'Koramangala, Bengaluru',
      employerMessage: 'Please bring your valid Driving License and Aadhaar ID proof.',
      employerName: 'Sharma Household',
    },
  ]

  const safeApplications = Array.isArray(applications) ? applications : []
  const filteredApps = safeApplications.filter((app) => {
    if (filterTab === 'VOICE') return app.applicationSource === 'VOICE'
    if (filterTab === 'MANUAL') return app.applicationSource !== 'VOICE'
    return true
  })

  const getStatusIndex = (status) => {
    switch (status) {
      case 'APPLIED':
      case 'PENDING':
        return 0
      case 'UNDER_REVIEW':
        return 1
      case 'INTERVIEW_SCHEDULED':
      case 'SHORTLISTED':
        return 2
      case 'HIRED':
      case 'SELECTED':
        return 3
      default:
        return 0
    }
  }

  const timelineSteps = [
    { id: 0, label: t.statusTimeline?.applied || 'Application Submitted' },
    { id: 1, label: t.statusTimeline?.underReview || 'Under Review' },
    { id: 2, label: t.statusTimeline?.interviewScheduled || 'Interview Scheduled' },
    { id: 3, label: t.statusTimeline?.hired || 'Hired' },
  ]

  return (
    <div className="space-y-6 pb-12 max-w-4xl mx-auto">
      {/* Header Title */}
      <div className="flex items-center justify-between bg-white/[0.035] backdrop-blur-2xl p-6 rounded-3xl shadow-glass-edge border border-white/10 text-white relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">{t.myApplications}</h1>
          <p className="text-xs font-semibold text-slate-400 mt-1">
            Track your job applications and complete hiring progress
          </p>
        </div>
        <div className="w-12 h-12 bg-slate-800 text-cyan-400 border border-cyan-400/30 rounded-2xl flex items-center justify-center shadow-sm">
          <FileCheck className="w-6 h-6" />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 p-1.5 bg-slate-900/80 backdrop-blur-xl border border-slate-700/60 rounded-2xl">
        <button
          type="button"
          onClick={() => setFilterTab('ALL')}
          className={`flex-1 py-2.5 font-black text-xs sm:text-sm rounded-xl transition-all ${
            filterTab === 'ALL'
              ? 'bg-gradient-to-r from-blue-600 via-sky-500 to-cyan-400 text-white shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          {t.allTab}
        </button>

        <button
          type="button"
          onClick={() => setFilterTab('VOICE')}
          className={`flex-1 py-2.5 font-black text-xs sm:text-sm rounded-xl flex items-center justify-center gap-1.5 transition-all ${
            filterTab === 'VOICE'
              ? 'bg-gradient-to-r from-blue-600 via-sky-500 to-cyan-400 text-white shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          {t.voiceTab}
        </button>

        <button
          type="button"
          onClick={() => setFilterTab('MANUAL')}
          className={`flex-1 py-2.5 font-black text-xs sm:text-sm rounded-xl flex items-center justify-center gap-1.5 transition-all ${
            filterTab === 'MANUAL'
              ? 'bg-gradient-to-r from-blue-600 via-sky-500 to-cyan-400 text-white shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          {t.manualTab}
        </button>
      </div>

      {/* Applications List */}
      {loading ? (
        <div className="p-12 text-center bg-slate-900/80 backdrop-blur-2xl rounded-3xl border border-slate-700/60 shadow-lg space-y-3">
          <RefreshCw className="w-9 h-9 animate-spin text-cyan-400 mx-auto" />
          <p className="text-base font-black text-white">Loading Applications...</p>
        </div>
      ) : (Array.isArray(filteredApps) && filteredApps.length > 0) ? (
        <div className="space-y-6">
          {(Array.isArray(filteredApps) ? filteredApps : []).map((app) => {
            const profCategory = (app.category || 'DRIVER').toUpperCase()
            const prof = PROFESSIONS[profCategory] || PROFESSIONS.DRIVER
            const currentStepIdx = getStatusIndex(app.status)
            const isRejected = app.status === 'REJECTED'

            return (
              <div
                key={app.id}
                className="bg-slate-900/80 backdrop-blur-2xl rounded-3xl p-6 border border-slate-700/60 hover:border-cyan-400/50 shadow-lg space-y-6 relative overflow-hidden text-white transition-all"
              >
                {/* 3D Glass Light Highlight Bar */}
                <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent pointer-events-none" />

                {/* Application Header */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shadow-sm border border-white/15 shrink-0 bg-white/[0.05]"
                      style={{
                        borderColor: `${prof.color}60`,
                      }}
                    >
                      <span>{prof.icon}</span>
                    </div>

                    <div>
                      <h3 className="text-lg sm:text-xl font-black text-white">{app.jobTitle}</h3>
                      <p className="text-xs font-bold text-slate-400 flex items-center gap-2 mt-0.5 flex-wrap">
                        <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-slate-400" /> {app.jobLocation || app.location || 'Bengaluru'}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1 text-cyan-400 font-extrabold">
                          <IndianRupee className="w-3.5 h-3.5 text-cyan-400" /> ₹{app.dailyWage || app.minSalary || 1200}/{app.salaryType === 'MONTHLY' ? 'month' : 'day'}
                        </span>
                        {app.experience && (
                          <>
                            <span>•</span>
                            <span className="text-cyan-300 font-bold">⭐ {app.experience}</span>
                          </>
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2 shrink-0">
                    {app.applicationSource === 'VOICE' || app.applicationMethod === 'VOICE' ? (
                      <span className="px-3 py-1 bg-cyan-500/10 text-cyan-300 font-extrabold text-[10px] rounded-full border border-cyan-400/30 flex items-center gap-1">
                        <Mic className="w-3 h-3 text-cyan-400" />
                        <span>Applied by Voice</span>
                      </span>
                    ) : (
                      <span className="px-3 py-1 bg-white/[0.06] text-slate-300 font-extrabold text-[10px] rounded-full border border-white/10">
                        Manual Application
                      </span>
                    )}

                    <button
                      onClick={() => setSelectedAppModal(app)}
                      className="text-xs font-black text-cyan-300 hover:text-white flex items-center gap-1 hover:underline pt-1 transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5" /> View Details
                    </button>
                  </div>
                </div>

                {/* Voice Recording Player (if present) */}
                {app.voiceRecording && (
                  <div className="p-3.5 bg-slate-800/60 border border-cyan-400/30 rounded-2xl space-y-2">
                    <p className="text-[11px] font-black text-cyan-400 uppercase flex items-center gap-1.5">
                      <Mic className="w-3.5 h-3.5 text-cyan-400" />
                      <span>🎤 Voice Recording</span>
                    </p>
                    <audio controls src={app.voiceRecording} className="w-full h-10 rounded-xl" />
                    {app.voiceTranscript && (
                      <p className="text-xs font-semibold text-slate-300 italic">
                        "{app.voiceTranscript}"
                      </p>
                    )}
                  </div>
                )}

                {/* Interview Scheduled Highlight Box */}
                {(app.status === 'INTERVIEW_SCHEDULED' || app.interviewDate) && (
                  <div className="p-4 bg-gradient-to-br from-sky-500/10 to-blue-500/10 border border-sky-400/30 rounded-2xl space-y-2">
                    <div className="flex items-center gap-2 text-cyan-300 font-black text-sm">
                      <Calendar className="w-4 h-4 text-cyan-400" />
                      <span>Interview Scheduled Information</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-bold text-slate-300">
                      {app.interviewDate && <div>📅 <span className="text-slate-400">Date:</span> {app.interviewDate}</div>}
                      {app.interviewTime && <div>⏰ <span className="text-slate-400">Time:</span> {app.interviewTime}</div>}
                      {app.interviewMode && <div>📌 <span className="text-slate-400">Mode:</span> {app.interviewMode}</div>}
                      {app.interviewLocation && <div>📍 <span className="text-slate-400">Location:</span> {app.interviewLocation}</div>}
                    </div>

                    {app.employerMessage && (
                      <p className="text-xs font-bold text-slate-300 bg-white/[0.04] p-2.5 rounded-xl border border-cyan-400/20 italic mt-1">
                        "{app.employerMessage}"
                      </p>
                    )}
                  </div>
                )}

                {/* Status Indicator */}
                <div className="pt-4 border-t border-slate-800">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Application Status</p>

                  {(app.status === 'ACCEPTED' || app.status === 'APPROVED' || app.status === 'HIRED') ? (
                    <div className="p-4 bg-emerald-500/10 border border-emerald-400/30 rounded-2xl flex items-center gap-3 text-emerald-300">
                      <CheckCircle2 className="w-7 h-7 text-emerald-400 shrink-0" />
                      <div>
                        <h4 className="text-sm font-black text-white">🎉 Accepted by Admin (स्वीकृत)</h4>
                        <p className="text-xs font-semibold text-emerald-300/80 mt-0.5">
                          Congratulations! Your application has been reviewed and accepted by Admin based on submitted details.
                        </p>
                      </div>
                    </div>
                  ) : app.status === 'REJECTED' ? (
                    <div className="p-4 bg-rose-500/10 border border-rose-400/30 rounded-2xl flex items-center gap-3 text-rose-300">
                      <XCircle className="w-7 h-7 text-rose-400 shrink-0" />
                      <div>
                        <h4 className="text-sm font-black text-white">Application Not Selected (अस्वीकृत)</h4>
                        <p className="text-xs font-semibold text-rose-300/80 mt-0.5">
                          {app.rejectionReason || 'Application was reviewed by Admin and not selected for this position.'}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 bg-sky-500/10 border border-sky-400/30 rounded-2xl flex items-center gap-3 text-sky-200">
                      <Clock className="w-7 h-7 text-cyan-400 shrink-0 animate-pulse" />
                      <div>
                        <h4 className="text-sm font-black text-white">Submitted - Pending Admin Review (समीक्षा के अधीन)</h4>
                        <p className="text-xs font-semibold text-sky-200/80 mt-0.5">
                          Your application has been received and is waiting for Admin review & approval.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="p-12 text-center bg-slate-900/80 backdrop-blur-2xl rounded-3xl border border-slate-700/60 shadow-lg space-y-3 text-white">
          <div className="w-14 h-14 bg-slate-800 text-cyan-400 border border-cyan-400/30 rounded-3xl flex items-center justify-center mx-auto text-2xl shadow-sm">
            📋
          </div>
          <h3 className="text-2xl font-black text-white">No applications found</h3>
          <p className="text-sm text-slate-400 font-semibold">
            You haven't applied for any jobs yet. Use voice search to find work!
          </p>
        </div>
      )}

      {/* Application Detail Modal */}
      {selectedAppModal && (
        <ApplicationDetailModal
          application={selectedAppModal}
          onClose={() => setSelectedAppModal(null)}
        />
      )}
    </div>
  )
}

