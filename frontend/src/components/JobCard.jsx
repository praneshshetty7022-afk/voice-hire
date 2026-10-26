import React from 'react'
import { useNavigate } from 'react-router-dom'
import { PROFESSIONS } from '../styles/theme'
import { MapPin, Clock, IndianRupee, Briefcase, Star, Volume2 } from 'lucide-react'
import { useVoice } from '../context/VoiceContext'
import { getTranslation } from '../utils/translations'

export default function JobCard({ job, onApplyVoice }) {
  const navigate = useNavigate()
  const { selectedLang, speakAudio } = useVoice()
  const t = getTranslation(selectedLang)

  const profCategory = (job?.category || 'DRIVER').toUpperCase()
  const prof = PROFESSIONS[profCategory] || PROFESSIONS.DRIVER

  const title = job?.title || prof.title
  const location = job?.location || 'Bengaluru'
  const salary = job?.dailyWage ? `₹${job.dailyWage} / Day` : (job?.salary || '₹1,200 / Day')
  const workTime = job?.workTime || '9 AM – 6 PM'
  const experience = job?.experience || '1+ Years Experience'
  const employerName = job?.employerName || job?.companyName || 'Verified Employer'

  const handleListenClick = (e) => {
    e.stopPropagation()
    const speechText = `${title}. Location ${location}. Salary ${salary}. Work time ${workTime}. Experience required ${experience}.`
    speakAudio(speechText)
  }

  return (
    <div
      onClick={() => navigate(`/jobs/${job.id || job._id || 1}`)}
      className="bg-white/85 backdrop-blur-2xl rounded-3xl p-6 border border-blue-100/90 hover:border-blue-300 shadow-[0_8px_30px_rgba(37,99,235,0.06)] hover:shadow-[0_16px_40px_rgba(37,99,235,0.14)] transition-all duration-300 group cursor-pointer relative overflow-hidden"
    >
      {/* Top Glass Highlight */}
      <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-blue-200/60 to-transparent pointer-events-none" />

      {/* Top Banner with Profession Illustrated Identity */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shadow-sm border border-blue-100 shrink-0 group-hover:scale-105 transition-transform bg-gradient-to-br from-blue-50 to-indigo-50/70"
            style={{
              borderColor: `${prof.color}40`,
            }}
          >
            <span>{prof.icon}</span>
          </div>

          <div>
            <span
              className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider mb-1 border border-blue-100"
              style={{ backgroundColor: `${prof.color}15`, color: prof.color }}
            >
              {prof.title}
            </span>
            <h3 className="text-lg font-black text-slate-900 group-hover:text-blue-700 transition-colors line-clamp-1">
              {title}
            </h3>
          </div>
        </div>

        {/* Audio Speaker Listener Button */}
        <button
          type="button"
          onClick={handleListenClick}
          className="p-2.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-2xl transition-all shadow-sm active:scale-95 border border-blue-200/80 shrink-0"
          title="Listen to Job Details"
        >
          <Volume2 className="w-5 h-5 text-blue-600" />
        </button>
      </div>

      {/* Primary Key Attributes Grid */}
      <div className="grid grid-cols-2 gap-3 my-4 py-3 px-4 bg-blue-50/60 rounded-2xl border border-blue-100/80">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
          <span className="text-sm font-extrabold text-slate-700 truncate">{location}</span>
        </div>

        <div className="flex items-center gap-2">
          <IndianRupee className="w-4 h-4 text-blue-600 shrink-0" />
          <span className="text-sm font-black text-blue-700 truncate">{salary}</span>
        </div>

        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-slate-400 shrink-0" />
          <span className="text-xs font-bold text-slate-600 truncate">{workTime}</span>
        </div>

        <div className="flex items-center gap-2">
          <Star className="w-4 h-4 text-blue-600 shrink-0" />
          <span className="text-xs font-bold text-slate-600 truncate">{experience}</span>
        </div>
      </div>

      {/* Employer Info */}
      <div className="flex items-center justify-between text-xs font-extrabold text-slate-500 mb-4 px-1">
        <span className="flex items-center gap-1.5">
          <Briefcase className="w-3.5 h-3.5 text-slate-400" />
          {employerName}
        </span>
        <span className="text-emerald-600 font-black flex items-center gap-1">✓ Verified</span>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-2.5 pt-2 border-t border-blue-100/80">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            navigate(`/jobs/${job.id || job._id || 1}`)
          }}
          className="w-full py-3 bg-white hover:bg-blue-50/80 text-slate-700 hover:text-blue-800 font-extrabold rounded-2xl text-xs sm:text-sm transition-all border border-blue-200/80 shadow-sm"
        >
          {t.viewJob}
        </button>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            if (onApplyVoice) onApplyVoice(job)
            else navigate(`/jobs/${job.id || job._id || 1}?action=voice-apply`)
          }}
          className="w-full py-3 bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 hover:scale-[1.02] active:scale-[0.98] text-white font-black rounded-2xl text-xs sm:text-sm transition-all shadow-md hover:shadow-blue-500/25 flex items-center justify-center gap-1.5 border border-blue-400/30"
        >
          <span>🎤</span>
          <span>{t.applyByVoice}</span>
        </button>
      </div>
    </div>
  )
}
