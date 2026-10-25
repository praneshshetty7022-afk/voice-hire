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
      const userStr = localStorage.getItem('user')
      const user = userStr ? JSON.parse(userStr) : { id: 'worker_1' }

      const res = await axios.get(`/applications/worker/${user.id || 'worker_1'}`)
      const data = Array.isArray(res?.data) 
        ? res.data 
        : (Array.isArray(res?.data?.applications) ? res.data.applications : (Array.isArray(res?.data?.data) ? res.data.data : null))
      if (data && data.length > 0) {
        setApplications(data)
      } else {
        setApplications(getMockApplications())
      }
    } catch (e) {
      console.error(e)
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
      <div className="flex items-center justify-between bg-white p-6 rounded-3xl shadow-lg border-2 border-slate-100">
        <div>
          <h1 className="text-3xl font-black text-slate-900">{t.myApplications}</h1>
          <p className="text-sm font-semibold text-slate-500 mt-1">
            Track your job applications and complete hiring progress
          </p>
        </div>
        <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
          <FileCheck className="w-8 h-8" />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 p-1.5 bg-slate-200/80 rounded-2xl">
        <button
          type="button"
          onClick={() => setFilterTab('ALL')}
          className={`flex-1 py-3 font-extrabold text-sm sm:text-base rounded-xl transition-all ${
            filterTab === 'ALL'
              ? 'bg-white text-slate-900 shadow-md'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          {t.allTab}
        </button>

        <button
          type="button"
          onClick={() => setFilterTab('VOICE')}
          className={`flex-1 py-3 font-extrabold text-sm sm:text-base rounded-xl flex items-center justify-center gap-1.5 transition-all ${
            filterTab === 'VOICE'
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          {t.voiceTab}
        </button>

        <button
          type="button"
          onClick={() => setFilterTab('MANUAL')}
          className={`flex-1 py-3 font-extrabold text-sm sm:text-base rounded-xl flex items-center justify-center gap-1.5 transition-all ${
            filterTab === 'MANUAL'
              ? 'bg-slate-900 text-white shadow-md'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          {t.manualTab}
        </button>
      </div>

      {/* Applications List */}
      {loading ? (
        <div className="p-12 text-center bg-white rounded-3xl border-2 border-slate-100 shadow-sm space-y-3">
          <RefreshCw className="w-10 h-10 animate-spin text-blue-600 mx-auto" />
          <p className="text-lg font-black text-slate-800">Loading Applications...</p>
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
                className="bg-white rounded-3xl p-6 border-2 border-slate-200 shadow-lg space-y-6 relative overflow-hidden"
              >
                {/* Application Header */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shadow-md border-2 shrink-0"
                      style={{
                        background: `linear-gradient(135deg, ${prof.color}20, ${prof.color}40)`,
                        borderColor: prof.color,
                      }}
                    >
                      <span>{prof.icon}</span>
                    </div>

                    <div>
                      <h3 className="text-xl font-black text-slate-900">{app.jobTitle}</h3>
                      <p className="text-sm font-bold text-slate-500 flex items-center gap-2 mt-0.5 flex-wrap">
                        <span className="flex items-center gap-1"><MapPin className="w-4 h-4 text-blue-600" /> {app.jobLocation || app.location || 'Bengaluru'}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1 text-emerald-700 font-extrabold">
                          <IndianRupee className="w-4 h-4 text-emerald-600" /> ₹{app.dailyWage || app.minSalary || 1200}/{app.salaryType === 'MONTHLY' ? 'month' : 'day'}
                        </span>
                        {app.experience && (
                          <>
                            <span>•</span>
                            <span className="text-purple-700 font-bold">⭐ {app.experience}</span>
                          </>
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2 shrink-0">
                    {app.applicationSource === 'VOICE' || app.applicationMethod === 'VOICE' ? (
                      <span className="px-3.5 py-1.5 bg-blue-100 text-blue-800 font-extrabold text-xs rounded-full border border-blue-300 flex items-center gap-1">
                        <Mic className="w-4 h-4 text-blue-600" />
                        <span>Applied by Voice</span>
                      </span>
                    ) : (
                      <span className="px-3.5 py-1.5 bg-slate-100 text-slate-700 font-extrabold text-xs rounded-full border border-slate-300">
                        Manual Application
                      </span>
                    )}

                    <button
                      onClick={() => setSelectedAppModal(app)}
                      className="text-xs font-black text-blue-600 hover:text-blue-800 flex items-center gap-1 hover:underline pt-1"
                    >
                      <Eye className="w-3.5 h-3.5" /> View Details
                    </button>
                  </div>
                </div>

                {/* Voice Recording Player (if present) */}
                {app.voiceRecording && (
                  <div className="p-3.5 bg-blue-50 border border-blue-200 rounded-2xl space-y-2">
                    <p className="text-xs font-black text-blue-700 uppercase flex items-center gap-1.5">
                      <Mic className="w-4 h-4 text-blue-600" />
                      <span>🎤 Voice Recording</span>
                    </p>
                    <audio controls src={app.voiceRecording} className="w-full h-10 rounded-xl" />
                    {app.voiceTranscript && (
                      <p className="text-xs font-semibold text-slate-700 italic">
                        "{app.voiceTranscript}"
                      </p>
                    )}
                  </div>
                )}

                {/* Interview Scheduled Highlight Box */}
                {(app.status === 'INTERVIEW_SCHEDULED' || app.interviewDate) && (
                  <div className="p-4 bg-amber-50 border-2 border-amber-300 rounded-2xl space-y-2">
                    <div className="flex items-center gap-2 text-amber-900 font-black text-base">
                      <Calendar className="w-5 h-5 text-amber-600" />
                      <span>Interview Scheduled Information</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-bold text-slate-800">
                      {app.interviewDate && <div>📅 <span className="font-black">Date:</span> {app.interviewDate}</div>}
                      {app.interviewTime && <div>⏰ <span className="font-black">Time:</span> {app.interviewTime}</div>}
                      {app.interviewMode && <div>📌 <span className="font-black">Mode:</span> {app.interviewMode}</div>}
                      {app.interviewLocation && <div>📍 <span className="font-black">Location:</span> {app.interviewLocation}</div>}
                    </div>

                    {app.employerMessage && (
                      <p className="text-xs font-bold text-slate-700 bg-white/80 p-2.5 rounded-xl border border-amber-200 italic mt-1">
                        "{app.employerMessage}"
                      </p>
                    )}
                  </div>
                )}

                {/* Status Indicator */}
                <div className="pt-4 border-t border-slate-100">
                  <p className="text-xs font-black text-slate-400 uppercase tracking-wider mb-2">Application Status</p>

                  {(app.status === 'ACCEPTED' || app.status === 'APPROVED' || app.status === 'HIRED') ? (
                    <div className="p-4 bg-emerald-50 border-2 border-emerald-300 rounded-2xl flex items-center gap-3 text-emerald-900">
                      <CheckCircle2 className="w-8 h-8 text-emerald-600 shrink-0" />
                      <div>
                        <h4 className="text-base font-black">🎉 Accepted by Admin (स्वीकृत)</h4>
                        <p className="text-xs font-semibold text-emerald-800 mt-0.5">
                          Congratulations! Your application has been reviewed and accepted by Admin based on submitted details.
                        </p>
                      </div>
                    </div>
                  ) : app.status === 'REJECTED' ? (
                    <div className="p-4 bg-rose-50 border-2 border-rose-300 rounded-2xl flex items-center gap-3 text-rose-900">
                      <XCircle className="w-8 h-8 text-rose-600 shrink-0" />
                      <div>
                        <h4 className="text-base font-black">Application Not Selected (अस्वीकृत)</h4>
                        <p className="text-xs font-semibold text-rose-700 mt-0.5">
                          {app.rejectionReason || 'Application was reviewed by Admin and not selected for this position.'}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 bg-amber-50 border-2 border-amber-300 rounded-2xl flex items-center gap-3 text-amber-950">
                      <Clock className="w-8 h-8 text-amber-600 shrink-0 animate-pulse" />
                      <div>
                        <h4 className="text-base font-black">Submitted - Pending Admin Review (समीक्षा के अधीन)</h4>
                        <p className="text-xs font-semibold text-amber-800 mt-0.5">
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
        <div className="p-12 text-center bg-white rounded-3xl border-2 border-slate-200 shadow-lg space-y-3">
          <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center mx-auto text-3xl">
            📋
          </div>
          <h3 className="text-2xl font-black text-slate-900">No applications found</h3>
          <p className="text-base text-slate-500 font-semibold">
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

