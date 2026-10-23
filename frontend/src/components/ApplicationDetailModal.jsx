import React from 'react'
import { X, MapPin, IndianRupee, Briefcase, Calendar, Clock, Mic, CheckCircle2, XCircle, Building2, User, Phone, MessageSquare } from 'lucide-react'
import { PROFESSIONS } from '../styles/theme'
import { useVoice } from '../context/VoiceContext'
import { getTranslation } from '../utils/translations'

export default function ApplicationDetailModal({ application, onClose }) {
  if (!application) return null

  const { selectedLang } = useVoice()
  const t = getTranslation(selectedLang)

  const profCategory = (application.category || 'DRIVER').toUpperCase()
  const prof = PROFESSIONS[profCategory] || PROFESSIONS.DRIVER

  const getStatusStepIndex = (status) => {
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
      case 'REJECTED':
        return -1
      default:
        return 0
    }
  }

  const currentStepIdx = getStatusStepIndex(application.status)
  const isRejected = application.status === 'REJECTED'

  const timelineSteps = [
    { id: 0, label: t.statusTimeline.applied || 'Application Submitted' },
    { id: 1, label: t.statusTimeline.underReview || 'Under Review' },
    { id: 2, label: t.statusTimeline.interviewScheduled || 'Interview Scheduled' },
    { id: 3, label: t.statusTimeline.hired || 'Hired' },
  ]

  const formatDate = (timestamp) => {
    if (!timestamp) return 'Recently'
    if (typeof timestamp === 'number') {
      return new Date(timestamp).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })
    }
    return String(timestamp)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border-4 border-slate-200 overflow-hidden relative my-8 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header Bar */}
        <div className="bg-slate-900 text-white p-6 flex items-start justify-between relative border-b-4 border-emerald-500">
          <div className="flex items-center gap-4">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shadow-md border-2 shrink-0 bg-white/10"
              style={{ borderColor: prof.color }}
            >
              <span>{prof.icon}</span>
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-black bg-emerald-500 text-slate-950 uppercase tracking-wider mb-1">
                {application.status || 'APPLIED'}
              </div>
              <h2 className="text-2xl font-black text-white">{application.jobTitle}</h2>
              <p className="text-sm font-semibold text-slate-300 flex items-center gap-1 mt-0.5">
                <Building2 className="w-4 h-4 text-emerald-400" />
                <span>{application.employerName || application.employer || 'Verified Employer'}</span>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 flex items-center justify-center transition-all shrink-0"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-6 max-h-[75vh] overflow-y-auto">

          {/* Job Overview Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 bg-slate-50 border-2 border-slate-200 rounded-2xl space-y-1">
              <span className="text-xs font-black text-slate-400 uppercase">Wage</span>
              <p className="text-sm font-black text-slate-900 flex items-center gap-0.5">
                <IndianRupee className="w-4 h-4 text-emerald-600" />
                ₹{application.dailyWage || application.minSalary || 1200}/{application.salaryType === 'MONTHLY' ? 'mo' : 'day'}
              </p>
            </div>

            <div className="p-3.5 bg-slate-50 border-2 border-slate-200 rounded-2xl space-y-1">
              <span className="text-xs font-black text-slate-400 uppercase">Location</span>
              <p className="text-sm font-black text-slate-900 flex items-center gap-1 truncate">
                <MapPin className="w-4 h-4 text-blue-600 shrink-0" />
                {application.jobLocation || application.location || 'Bengaluru'}
              </p>
            </div>

            <div className="p-3.5 bg-slate-50 border-2 border-slate-200 rounded-2xl space-y-1">
              <span className="text-xs font-black text-slate-400 uppercase">Experience</span>
              <p className="text-sm font-black text-slate-900 flex items-center gap-1">
                <Briefcase className="w-4 h-4 text-purple-600 shrink-0" />
                {application.experience || '2 Years'}
              </p>
            </div>

            <div className="p-3.5 bg-slate-50 border-2 border-slate-200 rounded-2xl space-y-1">
              <span className="text-xs font-black text-slate-400 uppercase">Applied On</span>
              <p className="text-sm font-black text-slate-900 flex items-center gap-1">
                <Calendar className="w-4 h-4 text-amber-600 shrink-0" />
                {formatDate(application.appliedAt)}
              </p>
            </div>
          </div>

          {/* Applicant Info (If view by employer) */}
          {application.workerName && (
            <div className="p-4 bg-slate-100/80 border-2 border-slate-200 rounded-2xl flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-600 text-white font-black flex items-center justify-center">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-black text-slate-400 uppercase">Applicant</p>
                  <p className="text-base font-black text-slate-900">{application.workerName}</p>
                </div>
              </div>
              {application.workerPhone && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-300 rounded-xl text-slate-800 font-bold text-sm">
                  <Phone className="w-4 h-4 text-emerald-600" />
                  <span>{application.workerPhone}</span>
                </div>
              )}
            </div>
          )}

          {/* Application Status Banner */}
          <div className="p-5 bg-white border-2 border-slate-200 rounded-3xl space-y-3">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider">
              Application Status
            </h3>

            {(application.status === 'ACCEPTED' || application.status === 'APPROVED' || application.status === 'HIRED') ? (
              <div className="p-4 bg-emerald-50 border-2 border-emerald-300 rounded-2xl flex items-center gap-3 text-emerald-900">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 shrink-0" />
                <div>
                  <h4 className="text-base font-black">🎉 Accepted by Admin (स्वीकृत)</h4>
                  <p className="text-xs font-semibold text-emerald-800 mt-0.5">
                    Application was reviewed and accepted by Udyoga Mitra Admin based on submitted details.
                  </p>
                </div>
              </div>
            ) : application.status === 'REJECTED' ? (
              <div className="p-4 bg-rose-50 border-2 border-rose-300 rounded-2xl flex items-center gap-3 text-rose-900">
                <XCircle className="w-8 h-8 text-rose-600 shrink-0" />
                <div>
                  <h4 className="text-base font-black">Application Not Selected (अस्वीकृत)</h4>
                  <p className="text-xs font-semibold text-rose-700 mt-0.5">
                    {application.rejectionReason || 'Application was reviewed by Admin and not selected for this position.'}
                  </p>
                </div>
              </div>
            ) : (
              <div className="p-4 bg-amber-50 border-2 border-amber-300 rounded-2xl flex items-center gap-3 text-amber-950">
                <Clock className="w-8 h-8 text-amber-600 shrink-0 animate-pulse" />
                <div>
                  <h4 className="text-base font-black">Submitted - Pending Admin Review (समीक्षा के अधीन)</h4>
                  <p className="text-xs font-semibold text-amber-800 mt-0.5">
                    Application has been received and is waiting for Admin review & approval.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Interview Details Box (If present) */}
          {(application.status === 'INTERVIEW_SCHEDULED' || application.interviewDate || application.interviewLocation) && (
            <div className="p-5 bg-gradient-to-br from-amber-50 to-orange-50 border-4 border-amber-300 rounded-3xl space-y-3">
              <div className="flex items-center gap-2 text-amber-900 font-black text-lg">
                <Calendar className="w-6 h-6 text-amber-600" />
                <span>Interview Scheduled Details</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                {application.interviewDate && (
                  <div className="p-3 bg-white/80 rounded-xl border border-amber-200">
                    <span className="text-xs font-black text-amber-700 uppercase block">Interview Date</span>
                    <span className="text-sm font-extrabold text-slate-900">{application.interviewDate}</span>
                  </div>
                )}

                {application.interviewTime && (
                  <div className="p-3 bg-white/80 rounded-xl border border-amber-200">
                    <span className="text-xs font-black text-amber-700 uppercase block">Interview Time</span>
                    <span className="text-sm font-extrabold text-slate-900">{application.interviewTime}</span>
                  </div>
                )}

                {application.interviewMode && (
                  <div className="p-3 bg-white/80 rounded-xl border border-amber-200">
                    <span className="text-xs font-black text-amber-700 uppercase block">Mode</span>
                    <span className="text-sm font-extrabold text-slate-900">{application.interviewMode}</span>
                  </div>
                )}

                {application.interviewLocation && (
                  <div className="p-3 bg-white/80 rounded-xl border border-amber-200">
                    <span className="text-xs font-black text-amber-700 uppercase block">Location</span>
                    <span className="text-sm font-extrabold text-slate-900">{application.interviewLocation}</span>
                  </div>
                )}
              </div>

              {application.employerMessage && (
                <div className="p-3.5 bg-white rounded-2xl border border-amber-300 space-y-1 mt-2">
                  <span className="text-xs font-black text-amber-800 uppercase flex items-center gap-1">
                    <MessageSquare className="w-3.5 h-3.5" /> Employer Note
                  </span>
                  <p className="text-xs font-bold text-slate-800 italic">
                    "{application.employerMessage}"
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Voice Recording Section */}
          {application.voiceRecording && (
            <div className="p-4 bg-blue-50 border-2 border-blue-200 rounded-2xl space-y-2">
              <p className="text-xs font-black text-blue-800 uppercase flex items-center gap-1.5">
                <Mic className="w-4 h-4 text-blue-600" />
                <span>Voice Application Audio Recording</span>
              </p>
              <audio controls src={application.voiceRecording} className="w-full h-10 rounded-xl" />
              {application.voiceTranscript && (
                <p className="text-xs font-semibold text-slate-700 italic pt-1">
                  "{application.voiceTranscript}"
                </p>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-100 border-t border-slate-200 text-right">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-slate-900 text-white font-extrabold rounded-xl hover:bg-slate-800 transition-all"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
