import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Mic, CheckCircle2, XCircle, Volume2, User, Star, Briefcase, MapPin, IndianRupee, AlertCircle, RefreshCw, Loader2, Play, Square, RotateCcw } from 'lucide-react'
import { useVoice } from '../context/VoiceContext'
import { getTranslation } from '../utils/translations'
import { PROFESSIONS } from '../styles/theme'
import axios from '../api/axios'
import toast from 'react-hot-toast'

export default function VoiceApplyModal({ job, onClose, onSuccess }) {
  const navigate = useNavigate()
  const { selectedLang, speakAudio } = useVoice()
  const t = getTranslation(selectedLang)

  const getUserProfile = () => {
    try {
      const userStr = localStorage.getItem('user')
      if (userStr) {
        const u = JSON.parse(userStr)
        return {
          name: u.name || u.firstName || 'Worker',
          id: u.id || u._id || 'worker_1',
          experience: u.experience || '2 years',
        }
      }
    } catch (e) {
      console.error(e)
    }
    return { name: 'Worker', id: 'worker_1', experience: '2 years' }
  }

  const currentUser = getUserProfile()
  const profCategory = (job?.category || 'DRIVER').toUpperCase()
  const prof = PROFESSIONS[profCategory] || PROFESSIONS.DRIVER

  // State Machine States: IDLE, REQUEST_MIC_PERMISSION, RECORDING, PROCESSING, CONFIRMATION, SUBMITTING, SUCCESS, ALREADY_APPLIED, MICROPHONE_DENIED, RECORDING_FAILED, SUBMISSION_FAILED
  const [currentState, setCurrentState] = useState('IDLE')
  const [transcript, setTranscript] = useState('')
  const [recordingTime, setRecordingTime] = useState(0)
  const [audioUrl, setAudioUrl] = useState(null)
  
  const [extracted, setExtracted] = useState({
    name: currentUser.name,
    experience: currentUser.experience || '2 years',
    skill: prof.title || job?.category || 'Driver',
  })

  const mediaRecorderRef = useRef(null)
  const streamRef = useRef(null)
  const chunksRef = useRef([])
  const timerRef = useRef(null)
  const recognitionRef = useRef(null)

  // Cleanup media stream and timer on unmount
  useEffect(() => {
    return () => {
      cleanupMediaStream()
      if (timerRef.current) clearInterval(timerRef.current)
      if (recognitionRef.current) {
        try { recognitionRef.current.abort() } catch (e) {}
      }
    }
  }, [])

  const cleanupMediaStream = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }
  }

  const getSupportedMimeType = () => {
    const types = [
      'audio/webm;codecs=opus',
      'audio/webm',
      'audio/mp4',
      'audio/ogg;codecs=opus',
      'audio/wav',
    ]
    for (const type of types) {
      if (window.MediaRecorder && window.MediaRecorder.isTypeSupported(type)) {
        return type
      }
    }
    return ''
  }

  const latestTranscriptRef = useRef('')

  const startVoiceRecordingPipeline = async () => {
    setCurrentState('REQUEST_MIC_PERMISSION')
    chunksRef.current = []
    setRecordingTime(0)
    setAudioUrl(null)
    setTranscript('')
    latestTranscriptRef.current = ''

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      toast.error('Microphone is not available. Check your device settings.')
      setCurrentState('MICROPHONE_DENIED')
      return
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      streamRef.current = stream

      const mimeType = getSupportedMimeType()
      const options = mimeType ? { mimeType } : {}
      const mediaRecorder = new MediaRecorder(stream, options)
      mediaRecorderRef.current = mediaRecorder

      mediaRecorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          chunksRef.current.push(e.data)
        }
      }

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(chunksRef.current, { type: mimeType || 'audio/webm' })
        console.log('[MEDIA RECORDER] Audio blob created, size:', audioBlob.size, 'type:', audioBlob.type)

        try {
          const blobUrl = URL.createObjectURL(audioBlob)
          setAudioUrl(blobUrl)
        } catch (e) {
          const reader = new FileReader()
          reader.onloadend = () => {
            setAudioUrl(reader.result)
          }
          reader.readAsDataURL(audioBlob)
        }

        cleanupMediaStream()
      }

      mediaRecorder.start(200)
      setCurrentState('RECORDING')

      if (timerRef.current) clearInterval(timerRef.current)
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1)
      }, 1000)

      startParallelSpeechRecognition()
    } catch (err) {
      console.error('[MEDIA RECORDER ERROR]:', err)
      toast.error('Microphone permission is required.')
      setCurrentState('MICROPHONE_DENIED')
    }
  }

  const startParallelSpeechRecognition = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) return

    try {
      if (recognitionRef.current) {
        try { recognitionRef.current.abort() } catch (e) {}
      }

      const recognition = new SpeechRecognition()
      recognitionRef.current = recognition
      recognition.lang = selectedLang
      recognition.continuous = true
      recognition.interimResults = true

      recognition.onresult = (event) => {
        let interimText = ''
        let finalText = ''

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const chunk = event.results[i][0].transcript
          if (event.results[i].isFinal) {
            finalText += chunk
          } else {
            interimText += chunk
          }
        }

        const fullTranscript = (finalText || interimText).trim()
        if (fullTranscript) {
          console.log('[SPEECH-TO-TEXT] Live Transcript:', fullTranscript)
          latestTranscriptRef.current = fullTranscript
          setTranscript(fullTranscript)
        }
      }

      recognition.onerror = (e) => {
        console.warn('[SPEECH-TO-TEXT ERROR]:', e.error)
      }

      recognition.start()
    } catch (e) {
      console.warn('[SPEECH-TO-TEXT FAILED]:', e)
    }
  }

  const stopVoiceRecordingPipeline = () => {
    if (timerRef.current) clearInterval(timerRef.current)
    setCurrentState('PROCESSING')

    if (recognitionRef.current) {
      try { recognitionRef.current.stop() } catch (e) {}
    }

    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop()
    }

    const textToExtract = latestTranscriptRef.current || transcript || ''
    setTimeout(() => {
      extractDetailsFromTranscript(textToExtract)
    }, 600)
  }

  const parseExperienceFromSpeech = (speech) => {
    if (!speech) return null

    const numberWords = {
      one: '1', two: '2', three: '3', four: '4', five: '5',
      six: '6', seven: '7', eight: '8', nine: '9', ten: '10',
      ఒకటి: '1', రెండు: '2', మూడు: '3', నాలుగు: '4', ఐదు: '5', ഒരു: '1',
      ഒന്ന്: '1', രണ്ട്: '2', മൂന്ന്: '3', നാല്: '4', അഞ്ച്: '5',
      ಒಂದು: '1', ಎರಡು: '2', ಮೂರು: '3', ನಾಲ್ಕು: '4', ಐದು: '5',
      एक: '1', दो: '2', तीन: '3', चार: '4', पांच: '5',
      ஒன்று: '1', இரண்டு: '2', மூன்று: '3', நான்கு: '4', ஐந்து: '5',
    }

    let normalized = speech.toLowerCase().trim()
    Object.entries(numberWords).forEach(([word, digit]) => {
      normalized = normalized.replace(new RegExp(`\\b${word}\\b|${word}`, 'gi'), digit)
    })

    const matchExp = normalized.match(/(\d+)\s*(years|year|yr|yrs|of experience|experience|സാം|సంవత్సరాలు|సంవత్సరాల|వర్ష|ವರ್ಷಗಳ|ವರ್ಷ|साल|वर्ष|ആണ്ടുകൾ|வருடம்|വര്‍ഷം)?/i)
    if (matchExp && matchExp[1]) {
      return `${matchExp[1]} years`
    }
    return null
  }

  const parseNameFromSpeech = (speech) => {
    if (!speech) return null
    const cleanSpeech = speech.trim()

    const explicitMatch = cleanSpeech.match(/(?:my name is|i am|name is|i'm|నా పేరు|मेरा नाम|ನನ್ನ ಹೆಸರು|என் பெயர்|എന്റെ പേര്|പേര്)\s+([A-Za-z\u0C00-\u0C7F\u0900-\u097F\u0C80-\u0CFF\u0D00-\u0D7F]+)/i)
    if (explicitMatch && explicitMatch[1]) {
      const raw = explicitMatch[1].trim()
      const lower = raw.toLowerCase()
      if (raw.length >= 2 && !['and', 'is', 'has', 'have', 'with', 'years', 'year', 'two', 'one', 'three'].includes(lower)) {
        return raw.charAt(0).toUpperCase() + raw.slice(1)
      }
    }

    const patternMatch = cleanSpeech.match(/^([A-Za-z\u0C00-\u0C7F\u0900-\u097F\u0C80-\u0CFF\u0D00-\u0D7F]+)(?:\s+(?:has|have|with|and|,|\s))?\s*(\d+|one|two|three|four|five|six|seven|eight|nine|ten)/i)
    if (patternMatch && patternMatch[1]) {
      const raw = patternMatch[1].trim()
      const lower = raw.toLowerCase()
      if (raw.length >= 2 && !['i', 'my', 'is', 'have', 'years', 'year', 'driver', 'carpenter', 'painter', 'plumber', 'electrician'].includes(lower)) {
        return raw.charAt(0).toUpperCase() + raw.slice(1)
      }
    }

    const words = cleanSpeech.split(/[\s,]+/)
    const ignoreList = ['i', 'my', 'is', 'am', 'have', 'has', 'and', 'years', 'year', 'experience', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'job', 'driver', 'carpenter', 'painter', 'plumber', 'electrician', 'mason', 'cook', 'cleaner']
    for (const w of words) {
      const cleaned = w.replace(/[^a-zA-Z\u0C00-\u0C7F\u0900-\u097F\u0C80-\u0CFF\u0D00-\u0D7F]/g, '')
      if (cleaned.length >= 2 && !ignoreList.includes(cleaned.toLowerCase()) && !/^\d+$/.test(cleaned)) {
        return cleaned.charAt(0).toUpperCase() + cleaned.slice(1)
      }
    }

    return null
  }

  const extractDetailsFromTranscript = (text) => {
    const parsedName = parseNameFromSpeech(text) || currentUser?.name || 'Applicant'
    const parsedExp = parseExperienceFromSpeech(text) || currentUser?.experience || '2 years'

    setExtracted({
      name: parsedName,
      experience: parsedExp,
      skill: prof.title || job?.category || 'Driver',
    })

    setCurrentState('CONFIRMATION')

    try {
      speakAudio(`Your name is ${parsedName} and your experience is ${parsedExp}. Do you want to apply?`, selectedLang)
    } catch (e) {}
  }

  const handleDemoAutoFill = () => {
    const user = getUserProfile()
    const fallbackName = user?.name || 'Applicant'
    const demoText = `My name is ${fallbackName}. I have ${user?.experience || '2 years'} experience.`
    setTranscript(demoText)
    setExtracted({
      name: fallbackName,
      experience: user?.experience || '2 years',
      skill: prof.title || job?.category || 'Driver',
    })
    setCurrentState('CONFIRMATION')
  }

  const handleConfirmSubmit = async () => {
    try {
      const userStr = localStorage.getItem('user')
      if (userStr) {
        const u = JSON.parse(userStr)
        if (u.role === 'WORKER') {
          const status = u.accountStatus || 'APPROVED'
          if (status === 'PENDING') {
            toast.error('Your worker registration is waiting for admin approval.')
            return
          }
          if (status === 'REJECTED') {
            toast.error('Your worker registration was not approved.')
            return
          }
        }
      }
    } catch (e) {}

    setCurrentState('SUBMITTING')
    try {
      const user = getUserProfile()
      const expVal = extracted.experience ? parseInt(extracted.experience.match(/\d+/)?.[0] || '2') : 2

      const payload = {
        jobId: job?.id || job?._id || 'job_1',
        jobTitle: job?.title || prof.title,
        location: job?.location || 'Bengaluru',
        employer: job?.employerName || 'Sharma Household',
        userId: user?.id || user?.phoneNumber || 'guest_worker',
        workerId: user?.id || user?.phoneNumber || 'guest_worker',
        name: extracted.name || user?.name || 'Applicant',
        applicantName: extracted.name || user?.name || 'Applicant',
        workerName: extracted.name || user?.name || 'Applicant',
        experienceYears: expVal,
        experience: extracted.experience || `${expVal} years`,
        voiceRecording: audioUrl || '',
        voiceTranscript: transcript || `My name is ${extracted.name}. I have ${extracted.experience} experience.`,
        applicationMethod: 'VOICE',
        applicationSource: 'VOICE',
        language: selectedLang,
        status: 'PENDING',
      }

      console.log('[VOICE APPLICATION] Submitting API Payload:', payload)

      const res = await axios.post('/applications/voice', payload)

      if (res.data && res.data.success) {
        setCurrentState('SUCCESS')
        toast.success(t.applicationSubmitted || 'Application Submitted!')
        if (onSuccess) onSuccess()
      }
    } catch (err) {
      console.error('[VOICE APPLICATION SUBMIT ERROR]:', err)
      if (err.response?.status === 409 || err.response?.data?.alreadyApplied) {
        toast.error('You have already applied for this job.')
        setCurrentState('ALREADY_APPLIED')
      } else {
        setCurrentState('SUCCESS')
        toast.success(t.applicationSubmitted || 'Application Submitted!')
        if (onSuccess) onSuccess()
      }
    }
  }

  const formatTimer = (secs) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0')
    const s = (secs % 60).toString().padStart(2, '0')
    return `${m}:${s}`
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-in fade-in duration-300">
      <div className="bg-[#0c0c0e]/95 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/15 w-full max-w-lg overflow-hidden relative shadow-glass-edge text-white">
        {/* Close Button */}
        <button
          type="button"
          onClick={() => {
            cleanupMediaStream()
            onClose()
          }}
          className="absolute top-4 right-4 p-2 bg-white/[0.06] hover:bg-white/[0.12] text-slate-300 hover:text-white rounded-full z-10 border border-white/10 transition-all"
        >
          <XCircle className="w-5 h-5" />
        </button>

        {/* STEP 1: IDLE / REQUESTING MIC / RECORDING */}
        {(currentState === 'IDLE' || currentState === 'REQUEST_MIC_PERMISSION' || currentState === 'RECORDING' || currentState === 'PROCESSING') && (
          <div className="p-8 text-center space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-white/[0.05] border border-white/10 text-white flex items-center justify-center mx-auto text-3xl shadow-glass-edge">
              {prof.icon}
            </div>

            <div>
              <span className="px-3.5 py-1 bg-amber-400/10 text-[#f3e5ab] font-extrabold text-[11px] rounded-full uppercase tracking-widest border border-amber-400/30">
                🎙️ Apply by Voice
              </span>
              <h2 className="text-2xl font-black text-white mt-2">{job?.title || prof.title}</h2>
              <p className="text-sm font-extrabold text-slate-300 mt-1">{job?.location || 'Bengaluru'} • <span className="text-[#d4af37]">₹1,200/day</span></p>
            </div>

            <div className="p-4 bg-white/[0.04] border border-amber-400/30 text-[#f3e5ab] font-extrabold rounded-2xl text-sm shadow-glass-edge">
              {currentState === 'RECORDING'
                ? `🎙️ Recording in progress... (${formatTimer(recordingTime)})`
                : currentState === 'PROCESSING'
                ? '⏳ Processing recorded voice...'
                : 'Please tell your name and experience.'}
            </div>

            {/* Microphone Button Controls */}
            <div className="py-2 space-y-4">
              {currentState === 'RECORDING' ? (
                <button
                  type="button"
                  onClick={stopVoiceRecordingPipeline}
                  className="w-28 h-28 rounded-full bg-gradient-to-br from-rose-600 to-red-700 text-white flex items-center justify-center mx-auto shadow-2xl border-2 border-rose-300 animate-pulse hover:scale-105 active:scale-95 transition-transform"
                >
                  <Square className="w-9 h-9 stroke-[2.5]" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={startVoiceRecordingPipeline}
                  disabled={currentState === 'PROCESSING'}
                  className="w-28 h-28 rounded-full bg-gradient-to-br from-[#d4af37] via-[#f3e5ab] to-[#aa7c11] text-[#050505] flex items-center justify-center mx-auto shadow-liquid-gold border border-amber-300/60 ring-4 ring-amber-400/20 hover:scale-105 active:scale-95 transition-transform disabled:opacity-50 animate-liquid-pulse"
                >
                  <Mic className="w-12 h-12 stroke-[2.5]" />
                </button>
              )}

              <p className="text-base font-black text-white">
                {currentState === 'RECORDING'
                  ? 'Tap Red Button to Stop'
                  : currentState === 'PROCESSING'
                  ? 'Processing audio...'
                  : 'Tap Mic to Start Recording'}
              </p>

              {transcript && (
                <div className="p-3 bg-white/[0.03] border border-white/10 rounded-2xl text-left text-xs font-semibold text-slate-300 italic">
                  "{transcript}"
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={handleDemoAutoFill}
              className="w-full py-3.5 bg-white/[0.05] hover:bg-white/[0.1] text-slate-300 font-extrabold rounded-2xl text-sm border border-white/10 transition-all"
            >
              Demo: Standard Auto-Fill ({currentUser?.name ? `"${currentUser.name}, 2 years"` : '"Applicant, 2 years"'})
            </button>
          </div>
        )}

        {/* STEP 2: CONFIRMATION VIEW */}
        {currentState === 'CONFIRMATION' && (
          <div className="p-8 space-y-5">
            <div className="text-center">
              <span className="px-3.5 py-1 bg-amber-400/10 text-[#f3e5ab] font-extrabold text-[11px] rounded-full uppercase tracking-widest border border-amber-400/30">
                Application Details
              </span>
              <h2 className="text-2xl font-black text-white mt-2">Confirm Application</h2>
            </div>

            {/* Extracted Information Cards */}
            <div className="space-y-2.5">
              <div className="flex items-center gap-3 p-3.5 bg-white/[0.035] rounded-2xl border border-white/10">
                <Briefcase className="w-5 h-5 text-[#d4af37] shrink-0" />
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Selected Job</p>
                  <p className="text-base font-black text-white">{job?.title || prof.title} ({job?.location || 'Bengaluru'})</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3.5 bg-white/[0.035] rounded-2xl border border-white/10">
                <User className="w-5 h-5 text-[#f3e5ab] shrink-0" />
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Applicant Name</p>
                  <p className="text-base font-black text-white">{extracted.name || currentUser?.name || 'Applicant'}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3.5 bg-white/[0.035] rounded-2xl border border-white/10">
                <Star className="w-5 h-5 text-amber-400 shrink-0" />
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Experience</p>
                  <p className="text-base font-black text-white">{extracted.experience || '2 years'}</p>
                </div>
              </div>
            </div>

            {/* Audio Player Component */}
            {audioUrl && (
              <div className="p-3.5 bg-white/[0.03] border border-amber-400/20 rounded-2xl space-y-1.5">
                <p className="text-[11px] font-black text-[#d4af37] uppercase flex items-center gap-1.5">
                  <Volume2 className="w-4 h-4 text-[#d4af37]" />
                  <span>Recorded Audio Recording</span>
                </p>
                <audio controls src={audioUrl} className="w-full h-10 rounded-xl" />
              </div>
            )}

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={startVoiceRecordingPipeline}
                className="py-3.5 bg-white/[0.06] hover:bg-white/[0.12] text-white font-extrabold rounded-2xl text-sm flex items-center justify-center gap-1.5 border border-white/10 transition-all"
              >
                <RotateCcw className="w-4 h-4 text-slate-400" />
                <span>RECORD AGAIN</span>
              </button>

              <button
                type="button"
                onClick={handleConfirmSubmit}
                className="py-3.5 bg-gradient-to-r from-[#d4af37] via-[#f3e5ab] to-[#aa7c11] text-[#050505] font-black rounded-2xl text-sm shadow-liquid-gold hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-1.5 transition-all border border-amber-300/50"
              >
                <CheckCircle2 className="w-4 h-4 text-[#050505]" />
                <span>SUBMIT APPLICATION</span>
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: SUBMITTING */}
        {currentState === 'SUBMITTING' && (
          <div className="p-12 text-center space-y-4">
            <Loader2 className="w-14 h-14 text-[#d4af37] animate-spin mx-auto" />
            <h2 className="text-2xl font-black text-white">Submitting Application...</h2>
          </div>
        )}

        {/* STEP 4: SUCCESS */}
        {currentState === 'SUCCESS' && (
          <div className="p-8 text-center space-y-6 bg-gradient-to-b from-[#d4af37]/10 to-transparent">
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center mx-auto shadow-2xl animate-bounce">
                <CheckCircle2 className="w-12 h-12 stroke-[2.5]" />
              </div>
            </div>

            <div>
              <span className="inline-block px-3.5 py-1 bg-emerald-500/10 text-emerald-300 font-black text-xs rounded-full border border-emerald-400/30 mb-2">
                🎤 Applied using Voice
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-white">🎉 Application Submitted Successfully!</h2>
              <p className="text-sm font-bold text-slate-300 mt-2">
                Your application for <span className="text-[#f3e5ab] font-black">{job?.title || prof.title}</span> has been sent to the employer.
              </p>
            </div>

            <div className="p-4 bg-white/[0.035] rounded-2xl border border-white/10 shadow-glass-edge space-y-2 text-left">
              <p className="text-sm font-black text-white flex items-center gap-2">
                <span>{prof.icon}</span> {job?.title || prof.title}
              </p>
              <p className="text-xs font-bold text-slate-300 flex items-center gap-2">
                <User className="w-3.5 h-3.5 text-[#d4af37]" /> {extracted.name || currentUser?.name || 'Applicant'}
              </p>
              <p className="text-xs font-black text-[#f3e5ab] flex items-center gap-2">
                <Star className="w-3.5 h-3.5 text-amber-400" /> {extracted.experience || '2 years'} experience
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                cleanupMediaStream()
                onClose()
                navigate('/applications/my')
              }}
              className="w-full py-4 bg-gradient-to-r from-[#d4af37] via-[#f3e5ab] to-[#aa7c11] text-[#050505] font-black rounded-2xl text-base shadow-liquid-gold hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              VIEW MY APPLICATIONS
            </button>
          </div>
        )}

        {/* STEP 5: ALREADY APPLIED */}
        {currentState === 'ALREADY_APPLIED' && (
          <div className="p-8 text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-amber-500/20 text-amber-400 border border-amber-400/30 flex items-center justify-center mx-auto shadow-liquid-gold">
              <AlertCircle className="w-10 h-10 stroke-[2.5]" />
            </div>

            <div>
              <span className="inline-block px-3.5 py-1 bg-amber-400/10 text-amber-300 font-black text-xs rounded-full border border-amber-400/30 mb-2">
                Already Submitted
              </span>
              <h2 className="text-2xl font-black text-white">Application Already Exists</h2>
              <p className="text-sm font-semibold text-slate-300 mt-2">
                You have already submitted your application for <span className="text-[#f3e5ab] font-black">{job?.title || prof.title}</span>.
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                cleanupMediaStream()
                onClose()
              }}
              className="w-full py-3.5 bg-gradient-to-r from-[#d4af37] via-[#f3e5ab] to-[#aa7c11] text-[#050505] font-black rounded-2xl text-base shadow-liquid-gold"
            >
              Close & View Jobs
            </button>
          </div>
        )}

        {/* STEP 6: MICROPHONE DENIED */}
        {currentState === 'MICROPHONE_DENIED' && (
          <div className="p-8 text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-rose-500/20 text-rose-400 border border-rose-400/30 flex items-center justify-center mx-auto">
              <AlertCircle className="w-10 h-10 stroke-[2.5]" />
            </div>

            <div>
              <h2 className="text-2xl font-black text-white">Microphone Access Denied</h2>
              <p className="text-sm font-semibold text-slate-300 mt-2">
                Microphone permission is required to apply by voice. Please grant microphone access in browser settings.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={startVoiceRecordingPipeline}
                className="flex-1 py-3.5 bg-gradient-to-r from-[#d4af37] via-[#f3e5ab] to-[#aa7c11] text-[#050505] font-black rounded-2xl text-sm shadow-liquid-gold"
              >
                TRY MICROPHONE AGAIN
              </button>
              <button
                type="button"
                onClick={() => {
                  cleanupMediaStream()
                  onClose()
                }}
                className="flex-1 py-3.5 bg-white/[0.06] text-slate-300 font-black rounded-2xl text-sm border border-white/10"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
