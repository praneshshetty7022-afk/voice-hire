import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, useSearchParams } from 'react-router-dom'
import { PROFESSIONS } from '../styles/theme'
import { useVoice } from '../context/VoiceContext'
import { getTranslation } from '../utils/translations'
import VoiceApplyModal from '../components/VoiceApplyModal'
import axios from '../api/axios'
import { ArrowLeft, MapPin, Clock, IndianRupee, Star, ShieldCheck, Volume2, Mic, CheckCircle2, AlertCircle } from 'lucide-react'
import toast from 'react-hot-toast'

export default function JobDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { selectedLang, speakAudio } = useVoice()
  const t = getTranslation(selectedLang)

  const [job, setJob] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showVoiceModal, setShowVoiceModal] = useState(searchParams.get('action') === 'voice-apply')
  const [hasApplied, setHasApplied] = useState(false)
  const [applicationMode, setApplicationMode] = useState(null)
  const [isApplying, setIsApplying] = useState(false)

  const getUserProfile = () => {
    try {
      const userStr = localStorage.getItem('user')
      if (userStr) return JSON.parse(userStr)
    } catch (e) {
      console.error(e)
    }
    return null
  }

  useEffect(() => {
    fetchJobDetails()
    checkIfAlreadyApplied()
  }, [id])

  const checkIfAlreadyApplied = async () => {
    const user = getUserProfile()
    if (!user || (!user.id && !user.name)) return

    try {
      const workerId = user.id || 'worker_1'
      const targetJobId = id || 'job_1'
      const res = await axios.get(`/applications/check?jobId=${targetJobId}&workerId=${workerId}`)
      if (res.data && res.data.applied) {
        setHasApplied(true)
        setApplicationMode(res.data.application?.applicationSource || 'MANUAL')
      }
    } catch (e) {
      console.error('Error checking application status:', e)
    }
  }

  const fetchJobDetails = async () => {
    setLoading(true)
    try {
      const res = await axios.get(`/jobs/${id}`)
      if (res.data) setJob(res.data)
      else setJob(getFallbackJob(id))
    } catch (e) {
      console.error(e)
      setJob(getFallbackJob(id))
    } finally {
      setLoading(false)
    }
  }

  const getFallbackJob = (jobId) => {
    return {
      id: jobId || '1',
      title: 'Professional Driver (Private Car & Cab)',
      category: 'DRIVER',
      location: 'Bengaluru',
      dailyWage: 1200,
      workTime: '9 AM – 6 PM',
      experience: '2+ Years',
      employerName: 'Nandi Motors & Cab Services',
      description: 'Looking for an experienced car driver for full-time city driving in Bengaluru. Must have a valid driving license and clean driving record.',
    }
  }

  const profCategory = (job?.category || 'DRIVER').toUpperCase()
  const prof = PROFESSIONS[profCategory] || PROFESSIONS.DRIVER

  const handleListenJob = () => {
    const text = `${job?.title || prof.title}. Located in ${job?.location || 'Bengaluru'}. Daily salary ${job?.dailyWage ? `₹${job.dailyWage}` : '₹1200'}. Work timing ${job?.workTime || '9 AM to 6 PM'}. Experience required ${job?.experience || '2 years'}.`
    speakAudio(text)
  }

  const checkAccountStatus = () => {
    try {
      const userStr = localStorage.getItem('user')
      if (userStr) {
        const u = JSON.parse(userStr)
        if (u.role === 'WORKER') {
          const status = u.accountStatus || 'APPROVED'
          if (status === 'PENDING') {
            toast.error('Your worker registration is waiting for admin approval.')
            return false
          }
          if (status === 'REJECTED') {
            toast.error('Your worker registration was not approved.')
            return false
          }
        }
      }
    } catch (e) {}
    return true
  }

  const handleNormalApply = async () => {
    if (!checkAccountStatus()) return

    const user = getUserProfile()
    if (!user || (!user.id && !user.phoneNumber && !user.name)) {
      toast.error('Please login to apply for this job.')
      navigate('/login')
      return
    }

    const workerId = user.id || 'worker_1'
    const workerName = user.name || 'Worker'
    const targetJobId = job?.id || id || 'job_1'

    console.log('[APPLY JOB] Submitting normal application:', { jobId: targetJobId, workerId, workerName })

    setIsApplying(true)
    try {
      const res = await axios.post('/applications', {
        jobId: targetJobId,
        workerId: workerId,
        workerName: workerName,
        applicationSource: 'MANUAL',
      })

      if (res.data && res.data.success) {
        setHasApplied(true)
        setApplicationMode('MANUAL')
        toast.success('🎉 Application Submitted Successfully!')
        setTimeout(() => {
          navigate('/applications/my')
        }, 1500)
      }
    } catch (err) {
      console.error('[APPLY JOB ERROR]:', err)
      if (err.response?.status === 409 || err.response?.data?.alreadyApplied) {
        toast.error('You have already applied for this job.')
        setHasApplied(true)
      } else {
        toast.error('Unable to submit application. Please try again.')
      }
    } finally {
      setIsApplying(false)
    }
  }

  const handleVoiceApplyClick = () => {
    if (!checkAccountStatus()) return

    const user = getUserProfile()
    if (!user || (!user.id && !user.phoneNumber && !user.name)) {
      toast.error('Please login to apply for this job.')
      navigate('/login')
      return
    }
    setShowVoiceModal(true)
  }

  if (loading) {
    return (
      <div className="p-12 text-center bg-white rounded-3xl border-2 border-slate-100 shadow-sm">
        <p className="text-lg font-black text-slate-800">Loading Job Details...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6 pb-28 max-w-4xl mx-auto">
      {/* Back Button Header */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 font-extrabold text-slate-400 hover:text-white text-sm transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Jobs</span>
      </button>

      {/* Top Hero Banner */}
      <div className="bg-white/[0.035] backdrop-blur-2xl p-8 text-center border border-white/10 hover:border-amber-400/30 shadow-glass-edge rounded-3xl overflow-hidden relative text-white">
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />

        {/* Profession Icon Banner */}
        <div
          className="w-24 h-24 rounded-3xl flex items-center justify-center text-5xl shadow-glass-edge border border-white/20 mx-auto mb-4 bg-white/[0.05] backdrop-blur-xl"
          style={{
            borderColor: `${prof.color}80`,
          }}
        >
          <span>{prof.icon}</span>
        </div>

        <span
          className="inline-block px-3.5 py-1 rounded-full text-[11px] font-black uppercase tracking-widest mb-2 border border-white/10"
          style={{ backgroundColor: `${prof.color}25`, color: prof.color }}
        >
          {prof.title}
        </span>

        <h1 className="text-3xl sm:text-4xl font-black text-white">{job?.title}</h1>
        
        <p className="text-lg font-extrabold text-slate-300 mt-2 flex items-center justify-center gap-1.5">
          <MapPin className="w-4 h-4 text-slate-400" /> {job?.location}
        </p>

        <p className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-blue-300 to-emerald-300 mt-1">
          ₹{job?.dailyWage || job?.minSalary || 1200} / Day
        </p>

        {/* Audio Speaker Listener Pill */}
        <button
          onClick={handleListenJob}
          className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 font-extrabold rounded-full text-sm border border-cyan-400/30 shadow-sm transition-all active:scale-95"
        >
          <Volume2 className="w-4 h-4 text-cyan-400" />
          <span>{t.listenToJob}</span>
        </button>
      </div>

      {/* Information Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-5 bg-slate-900/80 backdrop-blur-xl rounded-3xl border border-slate-700/60 shadow-lg text-center">
          <MapPin className="w-6 h-6 text-slate-400 mx-auto mb-1.5" />
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t.location}</p>
          <p className="text-base font-black text-white mt-0.5">{job?.location}</p>
        </div>

        <div className="p-5 bg-slate-900/80 backdrop-blur-xl rounded-3xl border border-slate-700/60 shadow-lg text-center">
          <Clock className="w-6 h-6 text-slate-400 mx-auto mb-1.5" />
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t.workTime}</p>
          <p className="text-base font-black text-white mt-0.5">{job?.workTime || '9 AM – 6 PM'}</p>
        </div>

        <div className="p-5 bg-slate-900/80 backdrop-blur-xl rounded-3xl border border-slate-700/60 shadow-lg text-center">
          <IndianRupee className="w-6 h-6 text-cyan-400 mx-auto mb-1.5" />
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t.salary}</p>
          <p className="text-base font-black text-cyan-300 mt-0.5">₹{job?.dailyWage || job?.minSalary || 1200} / Day</p>
        </div>

        <div className="p-5 bg-slate-900/80 backdrop-blur-xl rounded-3xl border border-slate-700/60 shadow-lg text-center">
          <Star className="w-6 h-6 text-cyan-400 mx-auto mb-1.5" />
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t.experience}</p>
          <p className="text-base font-black text-white mt-0.5">{job?.experience || '2+ Years'}</p>
        </div>
      </div>

      {/* Employer & Description Card */}
      <div className="bg-slate-900/80 backdrop-blur-2xl rounded-3xl p-6 sm:p-8 border border-slate-700/60 shadow-lg space-y-4 text-white">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t.employer}</p>
            <p className="text-xl font-black text-white">{job?.employerName}</p>
          </div>
          <span className="flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 text-emerald-300 font-extrabold text-xs rounded-full border border-emerald-400/30">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>{t.verifiedEmployer}</span>
          </span>
        </div>

        <div>
          <h3 className="text-base font-black text-white mb-2">Job Description</h3>
          <p className="text-sm text-slate-300 leading-relaxed font-normal">
            {job?.description}
          </p>
        </div>

        {/* Requirements Bullet Points */}
        <div className="pt-2">
          <h4 className="text-xs font-black text-cyan-400 uppercase tracking-widest mb-2">Key Requirements:</h4>
          <ul className="space-y-2">
            {(prof?.props || []).map((prop, idx) => (
              <li key={idx} className="flex items-center gap-2 text-sm font-bold text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>{prop}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Sticky Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-slate-900/95 backdrop-blur-2xl border-t border-slate-800 shadow-2xl z-40">
        <div className="max-w-xl mx-auto">
          {hasApplied ? (
            <button
              type="button"
              disabled
              className="w-full py-4 bg-emerald-500/15 text-emerald-300 font-black text-base rounded-2xl border border-emerald-400/30 flex items-center justify-center gap-2 cursor-not-allowed opacity-95 shadow-glass-edge"
            >
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <span>{applicationMode === 'VOICE' ? '🎤 Applied by Voice' : '✓ Already Applied'}</span>
            </button>
          ) : (
            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleNormalApply}
                disabled={isApplying}
                className="flex-1 py-3.5 bg-slate-800 hover:bg-slate-700 text-white font-extrabold rounded-2xl text-sm border border-slate-700 disabled:opacity-50 transition-all"
              >
                {isApplying ? 'Applying...' : t.applyNormally}
              </button>

              <button
                type="button"
                onClick={handleVoiceApplyClick}
                className="flex-2 py-3.5 px-6 bg-gradient-to-r from-blue-600 via-sky-500 to-cyan-400 hover:scale-[1.02] active:scale-[0.98] text-white font-black text-base rounded-2xl shadow-md flex items-center justify-center gap-2 border border-white/20 transition-transform"
              >
                <Mic className="w-5 h-5 stroke-[2.5]" />
                <span>{t.applyByVoice}</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Voice Application Modal */}
      {showVoiceModal && (
        <VoiceApplyModal
          job={job}
          onClose={() => setShowVoiceModal(false)}
          onSuccess={() => {
            setShowVoiceModal(false)
            setHasApplied(true)
            setApplicationMode('VOICE')
            setTimeout(() => navigate('/applications/my'), 1000)
          }}
        />
      )}
    </div>
  )
}
