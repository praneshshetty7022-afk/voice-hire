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
      className="card-premium group cursor-pointer border-2 hover:border-blue-500 transition-all duration-200"
      style={{
        background: `linear-gradient(180deg, #ffffff 70%, ${prof.color}08 100%)`,
      }}
    >
      {/* Top Banner with Profession Illustrated Identity */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shadow-md border-2 shrink-0 group-hover:scale-110 transition-transform"
            style={{
              background: `linear-gradient(135deg, ${prof.color}20, ${prof.color}40)`,
              borderColor: prof.color,
            }}
          >
            <span>{prof.icon}</span>
          </div>

          <div>
            <span
              className="inline-block px-2.5 py-0.5 rounded-full text-xs font-black uppercase tracking-wider mb-1"
              style={{ backgroundColor: `${prof.color}20`, color: prof.color }}
            >
              {prof.title}
            </span>
            <h3 className="text-xl font-black text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1">
              {title}
            </h3>
          </div>
        </div>

        {/* Audio Speaker Listener Button */}
        <button
          type="button"
          onClick={handleListenClick}
          className="p-2.5 bg-amber-100 hover:bg-amber-200 text-amber-900 rounded-2xl transition-all shadow-sm active:scale-95 border border-amber-300 shrink-0"
          title="Listen to Job Details"
        >
          <Volume2 className="w-5 h-5 text-amber-700" />
        </button>
      </div>

      {/* Primary Key Attributes Grid */}
      <div className="grid grid-cols-2 gap-3 my-4 py-3 px-4 bg-slate-50 rounded-2xl border border-slate-100">
        <div className="flex items-center gap-2">
          <MapPin className="w-5 h-5 text-blue-600 shrink-0" />
          <span className="text-base font-extrabold text-slate-800 truncate">{location}</span>
        </div>

        <div className="flex items-center gap-2">
          <IndianRupee className="w-5 h-5 text-emerald-600 shrink-0" />
          <span className="text-base font-black text-emerald-700 truncate">{salary}</span>
        </div>

        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-amber-600 shrink-0" />
          <span className="text-sm font-bold text-slate-700 truncate">{workTime}</span>
        </div>

        <div className="flex items-center gap-2">
          <Star className="w-5 h-5 text-purple-600 shrink-0" />
          <span className="text-sm font-bold text-slate-700 truncate">{experience}</span>
        </div>
      </div>

      {/* Employer Info */}
      <div className="flex items-center justify-between text-xs font-extrabold text-slate-500 mb-4 px-1">
        <span className="flex items-center gap-1">
          <Briefcase className="w-4 h-4 text-slate-400" />
          {employerName}
        </span>
        <span className="text-emerald-600 font-black">✓ Verified</span>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            navigate(`/jobs/${job.id || job._id || 1}`)
          }}
          className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-900 font-extrabold rounded-2xl text-sm transition-all border border-slate-300"
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
          className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-black rounded-2xl text-sm transition-all shadow-md flex items-center justify-center gap-1.5"
        >
          <span>🎤</span>
          <span>{t.applyByVoice}</span>
        </button>
      </div>
    </div>
  )
}
