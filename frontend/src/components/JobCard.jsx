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
      className="bg-slate-900/80 backdrop-blur-2xl rounded-3xl p-6 border border-slate-700/60 hover:border-cyan-400/50 shadow-lg hover:shadow-[0_0_25px_rgba(56,189,248,0.25)] transition-all duration-300 group cursor-pointer relative overflow-hidden"
    >
      {/* 3D Glass Light Highlight Bar */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent pointer-events-none" />

      {/* Top Banner with Profession Illustrated Identity */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shadow-sm border border-white/15 shrink-0 group-hover:scale-105 transition-transform bg-white/[0.05] backdrop-blur-xl"
            style={{
              borderColor: `${prof.color}60`,
            }}
          >
            <span>{prof.icon}</span>
          </div>

          <div>
            <span
              className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider mb-1 border border-white/10"
              style={{ backgroundColor: `${prof.color}25`, color: prof.color }}
            >
              {prof.title}
            </span>
            <h3 className="text-lg font-black text-white group-hover:text-cyan-300 transition-colors line-clamp-1">
              {title}
            </h3>
          </div>
        </div>

        {/* Audio Speaker Listener Button */}
        <button
          type="button"
          onClick={handleListenClick}
          className="p-2.5 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 rounded-2xl transition-all shadow-sm active:scale-95 border border-cyan-400/30 shrink-0"
          title="Listen to Job Details"
        >
          <Volume2 className="w-5 h-5 text-cyan-400" />
        </button>
      </div>

      {/* Primary Key Attributes Grid */}
      <div className="grid grid-cols-2 gap-3 my-4 py-3 px-4 bg-slate-800/60 rounded-2xl border border-slate-700/60">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
          <span className="text-sm font-extrabold text-slate-200 truncate">{location}</span>
        </div>

        <div className="flex items-center gap-2">
          <IndianRupee className="w-4 h-4 text-cyan-400 shrink-0" />
          <span className="text-sm font-black text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-blue-300 to-emerald-300 truncate">{salary}</span>
        </div>

        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-slate-400 shrink-0" />
          <span className="text-xs font-bold text-slate-300 truncate">{workTime}</span>
        </div>

        <div className="flex items-center gap-2">
          <Star className="w-4 h-4 text-cyan-400 shrink-0" />
          <span className="text-xs font-bold text-slate-300 truncate">{experience}</span>
        </div>
      </div>

      {/* Employer Info */}
      <div className="flex items-center justify-between text-xs font-extrabold text-slate-400 mb-4 px-1">
        <span className="flex items-center gap-1.5">
          <Briefcase className="w-3.5 h-3.5 text-slate-500" />
          {employerName}
        </span>
        <span className="text-emerald-400 font-black flex items-center gap-1">✓ Verified</span>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-2.5 pt-2 border-t border-slate-800">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            navigate(`/jobs/${job.id || job._id || 1}`)
          }}
          className="w-full py-3 bg-slate-800/80 hover:bg-slate-700 text-slate-200 hover:text-white font-extrabold rounded-2xl text-xs sm:text-sm transition-all border border-slate-700"
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
          className="w-full py-3 bg-gradient-to-r from-blue-600 via-sky-500 to-cyan-400 hover:scale-[1.02] active:scale-[0.98] text-white font-black rounded-2xl text-xs sm:text-sm transition-all shadow-md hover:shadow-cyan-500/25 flex items-center justify-center gap-1.5 border border-white/20"
        >
          <span>🎤</span>
          <span>{t.applyByVoice}</span>
        </button>
      </div>
    </div>
  )
}
