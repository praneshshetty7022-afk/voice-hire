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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xl p-4 overflow-y-auto">
      <div className="bg-[#0c0c0e]/95 backdrop-blur-2xl w-full max-w-2xl rounded-3xl shadow-2xl border border-white/15 overflow-hidden relative my-8 animate-in fade-in zoom-in-95 duration-200 shadow-glass-edge text-white">
        
        {/* Header Bar */}
        <div className="bg-white/[0.03] text-white p-6 flex items-start justify-between relative border-b border-white/10">
          <div className="flex items-center gap-4">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shadow-glass-edge border border-white/15 shrink-0 bg-white/[0.05]"
              style={{ borderColor: `${prof.color}60` }}
            >
              <span>{prof.icon}</span>
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[10px] font-black bg-amber-400/10 text-[#f3e5ab] uppercase tracking-widest border border-amber-400/30 mb-1">
                {application.status || 'APPLIED'}
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white">{application.jobTitle}</h2>
              <p className="text-xs font-semibold text-slate-400 flex items-center gap-1 mt-0.5">
                <Building2 className="w-3.5 h-3.5 text-[#d4af37]" />
                <span>{application.employerName || application.employer || 'Verified Employer'}</span>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/[0.06] text-slate-300 hover:text-white hover:bg-white/[0.12] flex items-center justify-center transition-all shrink-0 border border-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-6 max-h-[75vh] overflow-y-auto">

          {/* Job Overview Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 bg-white/[0.035] border border-white/10 rounded-2xl space-y-1">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Wage</span>
              <p className="text-sm font-black text-[#d4af37] flex items-center gap-0.5">
                <IndianRupee className="w-3.5 h-3.5 text-[#d4af37]" />
                ₹{application.dailyWage || application.minSalary || 1200}/{application.salaryType === 'MONTHLY' ? 'mo' : 'day'}
              </p>
            </div>

            <div className="p-3.5 bg-white/[0.035] border border-white/10 rounded-2xl space-y-1">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Location</span>
              <p className="text-sm font-black text-white flex items-center gap-1 truncate">
                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                {application.jobLocation || application.location || 'Bengaluru'}
              </p>
            </div>

            <div className="p-3.5 bg-white/[0.035] border border-white/10 rounded-2xl space-y-1">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Experience</span>
              <p className="text-sm font-black text-white flex items-center gap-1">
                <Briefcase className="w-3.5 h-3.5 text-[#f3e5ab] shrink-0" />
                {application.experience || '2 Years'}
              </p>
            </div>

            <div className="p-3.5 bg-white/[0.035] border border-white/10 rounded-2xl space-y-1">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Applied On</span>
              <p className="text-sm font-black text-white flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-[#d4af37] shrink-0" />
                {formatDate(application.appliedAt)}
              </p>
            </div>
          </div>

          {/* Applicant Info (If view by employer) */}
          {application.workerName && (
            <div className="p-4 bg-white/[0.03] border border-white/10 rounded-2xl flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#d4af37] to-[#aa7c11] text-[#050505] font-black flex items-center justify-center">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Applicant</p>
                  <p className="text-base font-black text-white">{application.workerName}</p>
                </div>
              </div>
              {application.workerPhone && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white/[0.05] border border-white/10 rounded-xl text-slate-200 font-bold text-xs">
                  <Phone className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{application.workerPhone}</span>
                </div>
              )}
            </div>
          )}

          {/* Application Status Banner */}
          <div className="p-5 bg-white/[0.025] border border-white/10 rounded-3xl space-y-3 shadow-glass-edge">
            <h3 className="text-[10px] font-black text-[#d4af37] uppercase tracking-widest">
              Application Status
            </h3>

            {(application.status === 'ACCEPTED' || application.status === 'APPROVED' || application.status === 'HIRED') ? (
              <div className="p-4 bg-emerald-500/10 border border-emerald-400/30 rounded-2xl flex items-center gap-3 text-emerald-300">
                <CheckCircle2 className="w-7 h-7 text-emerald-400 shrink-0" />
                <div>
                  <h4 className="text-sm font-black text-white">🎉 Accepted by Admin (स्वीकृत)</h4>
                  <p className="text-xs font-semibold text-emerald-300/80 mt-0.5">
                    Application was reviewed and accepted by Udyoga Mitra Admin based on submitted details.
                  </p>
                </div>
              </div>
            ) : application.status === 'REJECTED' ? (
              <div className="p-4 bg-rose-500/10 border border-rose-400/30 rounded-2xl flex items-center gap-3 text-rose-300">
                <XCircle className="w-7 h-7 text-rose-400 shrink-0" />
                <div>
                  <h4 className="text-sm font-black text-white">Application Not Selected (अस्वीकृत)</h4>
                  <p className="text-xs font-semibold text-rose-300/80 mt-0.5">
                    {application.rejectionReason || 'Application was reviewed by Admin and not selected for this position.'}
                  </p>
                </div>
              </div>
            ) : (
              <div className="p-4 bg-amber-500/10 border border-amber-400/30 rounded-2xl flex items-center gap-3 text-amber-200">
                <Clock className="w-7 h-7 text-[#d4af37] shrink-0 animate-pulse" />
                <div>
                  <h4 className="text-sm font-black text-white">Submitted - Pending Admin Review (समीक्षा के अधीन)</h4>
                  <p className="text-xs font-semibold text-amber-200/80 mt-0.5">
                    Application has been received and is waiting for Admin review & approval.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Interview Details Box (If present) */}
          {(application.status === 'INTERVIEW_SCHEDULED' || application.interviewDate || application.interviewLocation) && (
            <div className="p-5 bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-400/30 rounded-3xl space-y-3">
              <div className="flex items-center gap-2 text-[#f3e5ab] font-black text-base">
                <Calendar className="w-5 h-5 text-[#d4af37]" />
                <span>Interview Scheduled Details</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                {application.interviewDate && (
                  <div className="p-3 bg-white/[0.04] rounded-xl border border-white/10">
                    <span className="text-[10px] font-black text-[#d4af37] uppercase block">Interview Date</span>
                    <span className="text-xs font-extrabold text-white">{application.interviewDate}</span>
                  </div>
                )}

                {application.interviewTime && (
                  <div className="p-3 bg-white/[0.04] rounded-xl border border-white/10">
                    <span className="text-[10px] font-black text-[#d4af37] uppercase block">Interview Time</span>
                    <span className="text-xs font-extrabold text-white">{application.interviewTime}</span>
                  </div>
                )}

                {application.interviewMode && (
                  <div className="p-3 bg-white/[0.04] rounded-xl border border-white/10">
                    <span className="text-[10px] font-black text-[#d4af37] uppercase block">Mode</span>
                    <span className="text-xs font-extrabold text-white">{application.interviewMode}</span>
                  </div>
                )}

                {application.interviewLocation && (
                  <div className="p-3 bg-white/[0.04] rounded-xl border border-white/10">
                    <span className="text-[10px] font-black text-[#d4af37] uppercase block">Location</span>
                    <span className="text-xs font-extrabold text-white">{application.interviewLocation}</span>
                  </div>
                )}
              </div>

              {application.employerMessage && (
                <div className="p-3.5 bg-white/[0.04] rounded-2xl border border-amber-400/20 space-y-1 mt-2">
                  <span className="text-[10px] font-black text-[#d4af37] uppercase flex items-center gap-1">
                    <MessageSquare className="w-3.5 h-3.5" /> Employer Note
                  </span>
                  <p className="text-xs font-bold text-slate-300 italic">
                    "{application.employerMessage}"
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Voice Recording Section */}
          {application.voiceRecording && (
            <div className="p-4 bg-white/[0.035] border border-amber-400/20 rounded-2xl space-y-2">
              <p className="text-[11px] font-black text-[#d4af37] uppercase flex items-center gap-1.5">
                <Mic className="w-4 h-4 text-[#d4af37]" />
                <span>Voice Application Audio Recording</span>
              </p>
              <audio controls src={application.voiceRecording} className="w-full h-10 rounded-xl" />
              {application.voiceTranscript && (
                <p className="text-xs font-semibold text-slate-300 italic pt-1">
                  "{application.voiceTranscript}"
                </p>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-white/[0.02] border-t border-white/10 text-right">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-white/[0.08] hover:bg-white/[0.14] text-white font-extrabold rounded-xl border border-white/10 transition-all text-xs"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
