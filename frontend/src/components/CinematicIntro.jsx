import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Play,
  Pause,
  RotateCcw,
  X,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  AlertTriangle,
  FileText,
  Lock,
  Globe,
  Phone,
  User,
  ChevronRight,
  Maximize2,
  Minimize2
} from 'lucide-react'

/**
 * Cinematic Sound Synthesizer via Web Audio API
 * Generates futuristic drone, heartbeat, glitches, whooshes, chimes, and cinematic boom without external audio files.
 */
class CinematicSoundEngine {
  constructor() {
    this.ctx = null
    this.droneOsc = null
    this.droneGain = null
    this.isMuted = false
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext
      if (AudioCtx) {
        this.ctx = new AudioCtx()
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume()
    }
  }

  setMuted(muted) {
    this.isMuted = muted
    if (this.droneGain) {
      this.droneGain.gain.setValueAtTime(muted ? 0 : 0.08, this.ctx?.currentTime || 0)
    }
  }

  startAmbientDrone() {
    if (this.isMuted || !this.ctx) return
    try {
      this.stopAmbientDrone()
      const osc = this.ctx.createOscillator()
      const gain = this.ctx.createGain()
      const filter = this.ctx.createBiquadFilter()

      osc.type = 'sawtooth'
      osc.frequency.setValueAtTime(45, this.ctx.currentTime)

      filter.type = 'lowpass'
      filter.frequency.setValueAtTime(110, this.ctx.currentTime)

      gain.gain.setValueAtTime(0.01, this.ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.08, this.ctx.currentTime + 2)

      osc.connect(filter)
      filter.connect(gain)
      gain.connect(this.ctx.destination)

      osc.start()
      this.droneOsc = osc
      this.droneGain = gain
    } catch (e) {}
  }

  stopAmbientDrone() {
    if (this.droneOsc) {
      try {
        this.droneOsc.stop()
        this.droneOsc.disconnect()
      } catch (e) {}
      this.droneOsc = null
      this.droneGain = null
    }
  }

  playHeartbeat() {
    if (this.isMuted || !this.ctx) return
    try {
      const t = this.ctx.currentTime
      const osc = this.ctx.createOscillator()
      const gain = this.ctx.createGain()

      osc.type = 'sine'
      osc.frequency.setValueAtTime(65, t)
      osc.frequency.exponentialRampToValueAtTime(35, t + 0.18)

      gain.gain.setValueAtTime(0.3, t)
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.22)

      osc.connect(gain)
      gain.connect(this.ctx.destination)

      osc.start(t)
      osc.stop(t + 0.25)
    } catch (e) {}
  }

  playGlitch() {
    if (this.isMuted || !this.ctx) return
    try {
      const t = this.ctx.currentTime
      const osc = this.ctx.createOscillator()
      const gain = this.ctx.createGain()

      osc.type = 'sawtooth'
      osc.frequency.setValueAtTime(180, t)
      osc.frequency.setValueAtTime(320, t + 0.04)
      osc.frequency.setValueAtTime(90, t + 0.08)

      gain.gain.setValueAtTime(0.12, t)
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.12)

      osc.connect(gain)
      gain.connect(this.ctx.destination)

      osc.start(t)
      osc.stop(t + 0.15)
    } catch (e) {}
  }

  playWhoosh() {
    if (this.isMuted || !this.ctx) return
    try {
      const t = this.ctx.currentTime
      const bufferSize = this.ctx.sampleRate * 0.8
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate)
      const data = buffer.getChannelData(0)
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1
      }

      const noise = this.ctx.createBufferSource()
      noise.buffer = buffer

      const filter = this.ctx.createBiquadFilter()
      filter.type = 'bandpass'
      filter.frequency.setValueAtTime(250, t)
      filter.frequency.exponentialRampToValueAtTime(2400, t + 0.6)

      const gain = this.ctx.createGain()
      gain.gain.setValueAtTime(0.02, t)
      gain.gain.exponentialRampToValueAtTime(0.28, t + 0.4)
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.8)

      noise.connect(filter)
      filter.connect(gain)
      gain.connect(this.ctx.destination)

      noise.start(t)
      noise.stop(t + 0.8)
    } catch (e) {}
  }

  playChime() {
    if (this.isMuted || !this.ctx) return
    try {
      const t = this.ctx.currentTime
      ;[1046.5, 1318.51, 1567.98].forEach((freq, idx) => {
        const osc = this.ctx.createOscillator()
        const gain = this.ctx.createGain()
        osc.type = 'sine'
        osc.frequency.setValueAtTime(freq, t + idx * 0.08)

        gain.gain.setValueAtTime(0.15, t + idx * 0.08)
        gain.gain.exponentialRampToValueAtTime(0.001, t + idx * 0.08 + 0.7)

        osc.connect(gain)
        gain.connect(this.ctx.destination)

        osc.start(t + idx * 0.08)
        osc.stop(t + idx * 0.08 + 0.75)
      })
    } catch (e) {}
  }

  playCinematicBoom() {
    if (this.isMuted || !this.ctx) return
    try {
      const t = this.ctx.currentTime
      const osc = this.ctx.createOscillator()
      const gain = this.ctx.createGain()

      osc.type = 'sine'
      osc.frequency.setValueAtTime(140, t)
      osc.frequency.exponentialRampToValueAtTime(32, t + 1.2)

      gain.gain.setValueAtTime(0.45, t)
      gain.gain.exponentialRampToValueAtTime(0.001, t + 1.8)

      osc.connect(gain)
      gain.connect(this.ctx.destination)

      osc.start(t)
      osc.stop(t + 2.0)
    } catch (e) {}
  }

  cleanup() {
    this.stopAmbientDrone()
  }
}

const soundEngine = new CinematicSoundEngine()

/**
 * 5 Canonical Story Acts as specified in the script:
 */
const STORY_ACTS = [
  {
    id: 'act1',
    timeRange: '[0:00 - 0:05]',
    title: 'THE SILENCE BEFORE THE STORM',
    startSec: 0,
    endSec: 5,
    voiceover: 'For millions of workers... the modern job market has been a locked door.',
    theme: 'obsidian',
  },
  {
    id: 'act2',
    timeRange: '[0:05 - 0:12]',
    title: 'THE STRUGGLE',
    startSec: 5,
    endSec: 13,
    voiceover: 'Complicated forms. Endless paperwork. Language barriers. A system built for text... when what you really need... is to be heard.',
    theme: 'gritty-red',
  },
  {
    id: 'act3',
    timeRange: '[0:12 - 0:25]',
    title: 'THE AWAKENING & INNOVATION',
    startSec: 13,
    endSec: 25,
    voiceover: 'Until now.',
    theme: 'royal-burst',
  },
  {
    id: 'act4',
    timeRange: '[0:25 - 0:40]',
    title: 'THE SOLUTION (VOICEHIRE)',
    startSec: 25,
    endSec: 40,
    voiceover: 'Introducing VoiceHire. No resumes. No typing. No barriers. Just speak your name, your trade, your language... and let your voice open doors.',
    theme: 'voicehire-blue',
  },
  {
    id: 'act5',
    timeRange: '[0:40 - 0:46]',
    title: 'THE CLIMAX & LOGO REVEAL',
    startSec: 40,
    endSec: 46,
    voiceover: 'Your Voice. Real Jobs. Welcome to the future of work.',
    theme: 'climax-gold',
  },
]

export default function CinematicIntro({ isOpen = true, onClose }) {
  const navigate = useNavigate()
  const [currentTime, setCurrentTime] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)
  const [isMuted, setIsMuted] = useState(false)
  const [showSubtitles, setShowSubtitles] = useState(true)
  const [audioUnlocked, setAudioUnlocked] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)

  const containerRef = useRef(null)
  const speechRef = useRef(null)
  const currentActIndexRef = useRef(-1)

  // Identify current act based on currentTime
  const currentActIndex = STORY_ACTS.findIndex(
    (act) => currentTime >= act.startSec && currentTime < act.endSec
  )
  const activeAct = STORY_ACTS[currentActIndex !== -1 ? currentActIndex : STORY_ACTS.length - 1]

  // Play natural voiceover using SpeechSynthesis
  const speakCurrentAct = (act) => {
    if (isMuted) return
    if (!('speechSynthesis' in window)) return

    try {
      window.speechSynthesis.cancel()
      const utterance = new SpeechSynthesisUtterance(act.voiceover)
      utterance.rate = 0.92
      utterance.pitch = 0.88 // Deep cinematic tone

      // Pick natural voice if available
      const voices = window.speechSynthesis.getVoices()
      const englishVoice = voices.find(
        (v) => (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('David') || v.name.includes('Alex')) && v.lang.startsWith('en')
      ) || voices.find((v) => v.lang.startsWith('en'))
      if (englishVoice) {
        utterance.voice = englishVoice
      }

      window.speechSynthesis.speak(utterance)
      speechRef.current = utterance
    } catch (e) {}
  }

  // Audio & Voiceover Trigger upon act transition
  useEffect(() => {
    if (!isPlaying) return
    if (currentActIndex !== currentActIndexRef.current && currentActIndex !== -1) {
      currentActIndexRef.current = currentActIndex
      const act = STORY_ACTS[currentActIndex]

      if (audioUnlocked && !isMuted) {
        speakCurrentAct(act)

        // Trigger sound cues per act
        if (act.id === 'act1') {
          soundEngine.startAmbientDrone()
          soundEngine.playHeartbeat()
        } else if (act.id === 'act2') {
          soundEngine.playGlitch()
        } else if (act.id === 'act3') {
          soundEngine.playWhoosh()
        } else if (act.id === 'act4') {
          soundEngine.playChime()
        } else if (act.id === 'act5') {
          soundEngine.playCinematicBoom()
        }
      }
    }
  }, [currentActIndex, isPlaying, audioUnlocked, isMuted])

  // Periodic sounds inside acts
  useEffect(() => {
    if (!isPlaying || !audioUnlocked || isMuted) return

    // Act 1: periodic heartbeat
    if (activeAct.id === 'act1') {
      const beatInterval = setInterval(() => {
        soundEngine.playHeartbeat()
      }, 1600)
      return () => clearInterval(beatInterval)
    }

    // Act 2: frantic typing / glitch ticks
    if (activeAct.id === 'act2') {
      const glitchInterval = setInterval(() => {
        soundEngine.playGlitch()
      }, 1400)
      return () => clearInterval(glitchInterval)
    }
  }, [activeAct.id, isPlaying, audioUnlocked, isMuted])

  // Master Timeline Loop (0 to 46 seconds)
  useEffect(() => {
    if (!isOpen || !isPlaying) return

    const interval = setInterval(() => {
      setCurrentTime((prev) => {
        if (prev >= 46) {
          setIsPlaying(false)
          return 46
        }
        return Math.min(46, +(prev + 0.25).toFixed(2))
      })
    }, 250)

    return () => clearInterval(interval)
  }, [isOpen, isPlaying])

  // Automatically advance to Sign Up page once the cinematic story concludes
  useEffect(() => {
    if (currentTime >= 46) {
      const autoTimer = setTimeout(() => {
        soundEngine.cleanup()
        if ('speechSynthesis' in window) window.speechSynthesis.cancel()
        if (onClose) {
          onClose()
        } else {
          navigate('/register')
        }
      }, 3500)
      return () => clearTimeout(autoTimer)
    }
  }, [currentTime, onClose, navigate])

  // User unlocks sound via initial tap/click
  const handleUserInteraction = () => {
    if (!audioUnlocked) {
      soundEngine.init()
      setAudioUnlocked(true)
      soundEngine.startAmbientDrone()
      if (activeAct) {
        speakCurrentAct(activeAct)
      }
    }
  }

  // Handle Mute toggle
  const toggleMute = (e) => {
    e.stopPropagation()
    const nextMuted = !isMuted
    setIsMuted(nextMuted)
    soundEngine.setMuted(nextMuted)
    if (nextMuted && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel()
    } else if (!nextMuted && activeAct) {
      speakCurrentAct(activeAct)
    }
  }

  // Scrub / Jump to specific Act
  const jumpToAct = (act, e) => {
    if (e) e.stopPropagation()
    handleUserInteraction()
    setCurrentTime(act.startSec)
    setIsPlaying(true)
    currentActIndexRef.current = -1
  }

  // Replay Story
  const handleReplay = (e) => {
    if (e) e.stopPropagation()
    handleUserInteraction()
    setCurrentTime(0)
    currentActIndexRef.current = -1
    setIsPlaying(true)
  }

  // Fullscreen Toggle
  const toggleFullscreen = (e) => {
    e.stopPropagation()
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen?.()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen?.()
      setIsFullscreen(false)
    }
  }

  // Cleanup on unmount or close
  useEffect(() => {
    return () => {
      soundEngine.cleanup()
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel()
      }
    }
  }, [])

  if (!isOpen) return null

  const progressPercent = Math.min(100, (currentTime / 46) * 100)

  return (
    <div
      ref={containerRef}
      onClick={handleUserInteraction}
      className="fixed inset-0 z-50 bg-[#0B0F19] text-white flex flex-col justify-between overflow-hidden select-none font-sans"
    >
      {/* ===================================================================
          TOP CINEMATIC BAR: Timeline Header, Stage Indicator & Quick Controls
          =================================================================== */}
      <div className="relative z-30 flex items-center justify-between p-4 sm:p-6 bg-gradient-to-b from-black/80 via-black/40 to-transparent">
        {/* Left: Brand & Stage Badge */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#2563EB] to-[#1D4ED8] flex items-center justify-center shadow-lg shadow-blue-500/30">
            <Mic className="w-5 h-5 text-white stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm sm:text-base font-black tracking-tight text-white">
                Voice<span className="text-[#3B82F6]">Hire</span>
              </span>
              <span className="text-[10px] sm:text-xs font-black uppercase px-2 py-0.5 rounded-full bg-blue-500/20 text-[#60A5FA] border border-blue-500/30">
                Cinematic Story
              </span>
            </div>
            <p className="text-[11px] font-semibold text-slate-400">
              {activeAct.timeRange} — {activeAct.title}
            </p>
          </div>
        </div>

        {/* Center: Stage Pill Navigation */}
        <div className="hidden md:flex items-center gap-1.5 bg-white/[0.06] backdrop-blur-xl border border-white/10 p-1 rounded-2xl">
          {STORY_ACTS.map((act, idx) => {
            const isActActive = activeAct.id === act.id
            return (
              <button
                key={act.id}
                type="button"
                onClick={(e) => jumpToAct(act, e)}
                className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                  isActActive
                    ? 'bg-[#2563EB] text-white shadow-md shadow-blue-500/30 scale-105'
                    : 'text-slate-400 hover:text-white hover:bg-white/[0.06]'
                }`}
              >
                {idx + 1}. {act.title.split(' ')[0]}
              </button>
            )
          })}
        </div>

        {/* Right: Sound, Subtitles & Exit Controls */}
        <div className="flex items-center gap-2">
          {/* Audio Unlocked Pill / Prompt */}
          {!audioUnlocked && (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: [1, 1.05, 1], opacity: 1 }}
              transition={{ repeat: Infinity, duration: 1.6 }}
              className="px-3 py-1.5 rounded-xl bg-blue-600/90 text-white text-xs font-extrabold flex items-center gap-1.5 shadow-lg shadow-blue-500/40 cursor-pointer"
            >
              <Volume2 className="w-3.5 h-3.5 animate-bounce" />
              <span className="hidden sm:inline">Tap to Enable Sound</span>
            </motion.div>
          )}

          {/* Mute / Unmute Toggle */}
          <button
            type="button"
            onClick={toggleMute}
            className="p-2.5 rounded-xl bg-white/[0.08] hover:bg-white/[0.16] border border-white/10 text-white transition-all cursor-pointer"
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
          </button>

          {/* Subtitles CC Toggle */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              setShowSubtitles(!showSubtitles)
            }}
            className={`px-2.5 py-1.5 rounded-xl text-xs font-black border transition-all cursor-pointer ${
              showSubtitles
                ? 'bg-[#2563EB]/40 border-blue-400 text-blue-200'
                : 'bg-white/[0.08] border-white/10 text-slate-400'
            }`}
            title="Toggle Subtitles"
          >
            CC
          </button>

          {/* Fullscreen Toggle */}
          <button
            type="button"
            onClick={toggleFullscreen}
            className="hidden sm:flex p-2.5 rounded-xl bg-white/[0.08] hover:bg-white/[0.16] border border-white/10 text-white transition-all cursor-pointer"
            title="Toggle Fullscreen"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          {/* Close / Skip to Sign Up */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              soundEngine.cleanup()
              if ('speechSynthesis' in window) window.speechSynthesis.cancel()
              if (onClose) {
                onClose()
              } else {
                navigate('/register')
              }
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#2563EB]/80 hover:bg-[#2563EB] text-white font-black text-xs transition-all cursor-pointer shadow-md shadow-blue-500/20"
            title="Skip to Sign Up"
          >
            <span>Skip to Sign Up</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ===================================================================
          STAGE CANVAS: DYNAMIC VISUALS DRIVEN BY THE 5 STORY SCENES
          =================================================================== */}
      <div className="relative flex-1 flex items-center justify-center p-4 sm:p-8 overflow-hidden">
        <AnimatePresence mode="wait">
          {/* =================================================================
              ACT 1: [0:00 - 0:05] THE SILENCE BEFORE THE STORM
              Visual: Pitch-black screen. A single, rhythmic, neon-blue voice waveform
              pulses in the center, reacting to a distant sound like a heartbeat.
              ================================================================= */}
          {activeAct.id === 'act1' && (
            <motion.div
              key="scene-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
              className="w-full max-w-2xl flex flex-col items-center justify-center text-center space-y-8"
            >
              {/* Pulsing Concentric Heartbeat Rings */}
              <div className="relative flex items-center justify-center w-64 h-64 sm:w-80 sm:h-80">
                <motion.div
                  animate={{ scale: [1, 1.4, 1], opacity: [0.35, 0.05, 0.35] }}
                  transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
                  className="absolute inset-0 rounded-full border-2 border-[#3B82F6]/40 blur-sm"
                />
                <motion.div
                  animate={{ scale: [1, 1.25, 1], opacity: [0.5, 0.15, 0.5] }}
                  transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut', delay: 0.1 }}
                  className="absolute inset-6 rounded-full border border-[#60A5FA]/50"
                />

                {/* Central Neon Heartbeat Waveform */}
                <div className="relative z-10 flex items-center gap-2 p-6 rounded-3xl bg-black/60 border border-white/10 backdrop-blur-2xl shadow-[0_0_60px_rgba(59,130,246,0.35)]">
                  {[18, 36, 68, 92, 68, 36, 18].map((h, i) => (
                    <motion.span
                      key={i}
                      animate={{
                        height: [h * 0.35, h * 1.25, h * 0.35],
                        opacity: [0.6, 1, 0.6],
                      }}
                      transition={{
                        repeat: Infinity,
                        duration: 1.6,
                        delay: i * 0.08,
                        ease: 'easeInOut',
                      }}
                      className="w-2 sm:w-2.5 rounded-full bg-gradient-to-t from-[#1D4ED8] via-[#2563EB] to-[#60A5FA] shadow-[0_0_15px_#3B82F6]"
                      style={{ height: `${h}px` }}
                    />
                  ))}
                </div>
              </div>

              {/* Subdued Scene Caption */}
              <div className="space-y-2">
                <span className="text-xs font-black uppercase tracking-widest text-slate-500">
                  Act I • The Silence Before The Storm
                </span>
                <p className="text-sm font-semibold text-slate-400">
                  A locked door for millions of workers worldwide
                </p>
              </div>
            </motion.div>
          )}

          {/* =================================================================
              ACT 2: [0:05 - 0:12] THE STRUGGLE
              Visual: Fast-paced, gritty montage of traditional job boards—complex forms,
              endless text fields, tiny blinking cursors, and frustrated expressions.
              UI elements glitch and fade out with red error lines.
              ================================================================= */}
          {activeAct.id === 'act2' && (
            <motion.div
              key="scene-2"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 0.5 }}
              className="w-full max-w-3xl space-y-6"
            >
              {/* Glitch Overlay Banner */}
              <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-500/40 text-rose-300 flex items-center justify-between shadow-[0_0_40px_rgba(244,63,94,0.2)]">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="w-5 h-5 text-rose-400 animate-pulse" />
                  <span className="font-black text-xs sm:text-sm tracking-wide">
                    SYSTEM REJECTED: Resumes required in English (PDF only). 5+ Years experience.
                  </span>
                </div>
                <span className="text-xs font-mono font-bold text-rose-400">ERROR #403</span>
              </div>

              {/* Gritty Traditional Job Board Mockup with Red Error Glitches */}
              <div className="p-6 sm:p-8 rounded-3xl bg-[#121622] border-2 border-rose-500/30 relative overflow-hidden shadow-2xl">
                {/* Red Glitch Scanline */}
                <motion.div
                  animate={{ y: ['-100%', '300%'] }}
                  transition={{ repeat: Infinity, duration: 2.2, ease: 'linear' }}
                  className="absolute inset-x-0 h-16 bg-gradient-to-b from-transparent via-rose-500/10 to-transparent pointer-events-none"
                />

                <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-5">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-rose-500" />
                    <span className="w-3 h-3 rounded-full bg-amber-500" />
                    <span className="w-3 h-3 rounded-full bg-slate-600" />
                    <span className="text-xs font-mono text-slate-400 ml-2">JobPortal_Traditional_v1.html</span>
                  </div>
                  <span className="text-xs font-bold text-rose-400 flex items-center gap-1">
                    <Lock className="w-3.5 h-3.5" /> High Literacy Required
                  </span>
                </div>

                <div className="space-y-4 text-left">
                  {/* Intimidating Field 1 */}
                  <div>
                    <label className="block text-xs font-mono text-slate-400 mb-1">
                      Upload Curriculum Vitae / Resume (Max 2MB, English only) *
                    </label>
                    <div className="p-4 rounded-xl border border-dashed border-rose-500/40 bg-rose-950/20 text-center text-xs text-rose-300 font-mono">
                      ❌ "Error: Document format rejected. Please format in ATS-compliant syntax."
                    </div>
                  </div>

                  {/* Intimidating Field 2 */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono text-slate-400 mb-1">
                        12-Character Alphanumeric Password *
                      </label>
                      <input
                        disabled
                        value="••••••••••••"
                        className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-slate-700 text-slate-500 text-xs font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono text-slate-400 mb-1">
                        Professional Portfolio URL *
                      </label>
                      <input
                        disabled
                        value="https://..."
                        className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-slate-700 text-slate-500 text-xs font-mono"
                      />
                    </div>
                  </div>
                </div>

                {/* Glitch Strikethrough Badge */}
                <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-slate-400 font-semibold">
                  <span className="text-rose-400 font-bold">⚠️ Language Barrier: English text only</span>
                  <span className="text-slate-500 font-mono">Session Timeout in 00:23</span>
                </div>
              </div>
            </motion.div>
          )}

          {/* =================================================================
              ACT 3: [0:12 - 0:25] THE AWAKENING & INNOVATION
              Visual: Screen abruptly shifts. Dark background bursts into vibrant
              royal blue and clean liquid-glass gradients. A worker taps a glowing
              microphone button on a sleek mobile and web interface. Waveform surges.
              ================================================================= */}
          {activeAct.id === 'act3' && (
            <motion.div
              key="scene-3"
              initial={{ opacity: 0, scale: 0.88 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="w-full max-w-2xl flex flex-col items-center justify-center text-center space-y-6"
            >
              {/* Radial Energy Burst Atmosphere */}
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(37,99,235,0.45),_transparent_70%)] pointer-events-none" />

              {/* Title Surge: "Until Now." */}
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-4xl sm:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-[#60A5FA] to-[#3B82F6] tracking-tight uppercase"
              >
                Until Now.
              </motion.h2>

              {/* Worker Tapping Glowing Mic Button */}
              <div className="relative my-4 flex items-center justify-center">
                {/* Concentric Vibrant Shockwaves */}
                <motion.div
                  animate={{ scale: [1, 2.2], opacity: [0.8, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5, ease: 'easeOut' }}
                  className="absolute w-28 h-28 rounded-full border-4 border-[#3B82F6] blur-sm"
                />
                <motion.div
                  animate={{ scale: [1, 1.8], opacity: [0.6, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5, delay: 0.4, ease: 'easeOut' }}
                  className="absolute w-28 h-28 rounded-full bg-blue-500/20 blur-md"
                />

                {/* Central Glowing Mic Button */}
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  animate={{ scale: [1, 1.08, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="relative z-10 w-28 h-28 sm:w-32 sm:h-32 rounded-3xl bg-gradient-to-br from-[#2563EB] to-[#1D4ED8] flex items-center justify-center text-white shadow-[0_0_80px_rgba(37,99,235,0.85)] border-2 border-white/40 ring-8 ring-blue-500/30"
                >
                  <Mic className="w-14 h-14 stroke-[2.5]" />
                </motion.div>
              </div>

              {/* Active Surging Energy Waveform */}
              <div className="flex items-center gap-2 p-4 px-6 rounded-2xl bg-white/[0.08] backdrop-blur-xl border border-white/20 shadow-xl">
                <span className="text-xs font-black text-[#60A5FA] uppercase tracking-wider mr-2">
                  Voice Energy Online
                </span>
                {[20, 48, 80, 100, 75, 45, 95, 60, 30].map((h, i) => (
                  <motion.span
                    key={i}
                    animate={{
                      height: [h * 0.4, h, h * 0.4],
                      backgroundColor: ['#2563EB', '#60A5FA', '#2563EB'],
                    }}
                    transition={{
                      repeat: Infinity,
                      duration: 0.9,
                      delay: i * 0.07,
                      ease: 'easeInOut',
                    }}
                    className="w-2 rounded-full shadow-[0_0_12px_#3B82F6]"
                    style={{ height: `${h * 0.6}px` }}
                  />
                ))}
              </div>
            </motion.div>
          )}

          {/* =================================================================
              ACT 4: [0:25 - 0:40] THE SOLUTION (VOICEHIRE)
              Visual: Smooth cinematic panning shots of VoiceHire.
              A user speaks: "Find carpenter jobs near me."
              Instant, real-time voice matching ripples across the screen.
              3 simple registration fields auto-filling magically.
              ================================================================= */}
          {activeAct.id === 'act4' && (
            <motion.div
              key="scene-4"
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -25 }}
              transition={{ duration: 0.55 }}
              className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-12 gap-6 items-center"
            >
              {/* Left Column: Simulated Voice Command & Ripple */}
              <div className="md:col-span-6 space-y-4">
                <div className="p-5 rounded-3xl bg-[#151C2C]/90 backdrop-blur-xl border border-blue-500/30 shadow-2xl space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-[#2563EB] text-white flex items-center justify-center shadow-lg shadow-blue-500/40">
                      <Mic className="w-5 h-5 stroke-[2.5]" />
                    </div>
                    <div>
                      <span className="text-xs font-black uppercase text-[#60A5FA] tracking-wider block">
                        Spoken Voice Input
                      </span>
                      <p className="text-lg font-black text-white">
                        "Find carpenter jobs near me"
                      </p>
                    </div>
                  </div>

                  {/* Real-time Matching Ripple */}
                  <div className="p-3 rounded-2xl bg-blue-950/40 border border-blue-500/20 flex items-center justify-between text-xs font-bold text-blue-200">
                    <span className="flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-emerald-400" />
                      Semantic Voice AI: Matched Trade & GPS Location
                    </span>
                    <span className="text-emerald-400 font-extrabold">0.12s</span>
                  </div>
                </div>

                {/* Magic 3-Field Auto-Fill Registration Demo */}
                <div className="p-5 rounded-3xl bg-[#151C2C]/90 backdrop-blur-xl border border-white/10 shadow-xl space-y-3">
                  <div className="flex items-center justify-between text-xs font-black uppercase text-slate-400">
                    <span>1-Minute Voice Registration</span>
                    <span className="text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> No Password / No Email
                    </span>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white/[0.05] border border-blue-500/40 text-xs">
                      <User className="w-4 h-4 text-[#3B82F6]" />
                      <span className="text-slate-400">Name:</span>
                      <span className="font-extrabold text-white">Rahul Sharma</span>
                      <span className="ml-auto text-[10px] text-emerald-400 font-bold">✓ Captured</span>
                    </div>

                    <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white/[0.05] border border-blue-500/40 text-xs">
                      <Phone className="w-4 h-4 text-[#3B82F6]" />
                      <span className="text-slate-400">Phone:</span>
                      <span className="font-extrabold text-white">+91 98765 43210</span>
                      <span className="ml-auto text-[10px] text-emerald-400 font-bold">✓ Verified</span>
                    </div>

                    <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white/[0.05] border border-blue-500/40 text-xs">
                      <Globe className="w-4 h-4 text-[#3B82F6]" />
                      <span className="text-slate-400">Language:</span>
                      <span className="font-extrabold text-white">🇮🇳 Hindi (हिंदी)</span>
                      <span className="ml-auto text-[10px] text-emerald-400 font-bold">✓ Active</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Instant Match Verified Cards */}
              <div className="md:col-span-6 space-y-3">
                <p className="text-xs font-black uppercase tracking-wider text-slate-400">
                  Instant Verified Job Matches
                </p>

                {/* Match Card 1 */}
                <motion.div
                  initial={{ x: 30, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.15 }}
                  className="p-4 rounded-2xl bg-gradient-to-r from-[#151C2C] to-[#1E293B] border border-emerald-500/40 shadow-xl space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-white flex items-center gap-1.5">
                      🔨 Master Carpenter
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-black border border-emerald-500/40">
                      ✓ Verified Payout
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-300">
                    <span>TimberCraft Interiors • Whitefield</span>
                    <span className="font-black text-[#60A5FA]">₹1,400 / day</span>
                  </div>
                </motion.div>

                {/* Match Card 2 */}
                <motion.div
                  initial={{ x: 30, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="p-4 rounded-2xl bg-gradient-to-r from-[#151C2C] to-[#1E293B] border border-blue-500/40 shadow-xl space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-white flex items-center gap-1.5">
                      🚚 Commercial Driver
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-[10px] font-black border border-blue-500/40">
                      Instant WhatsApp Alert
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-300">
                    <span>CityLogistics Fleet • Koramangala</span>
                    <span className="font-black text-[#60A5FA]">₹1,250 / day</span>
                  </div>
                </motion.div>

                {/* Match Card 3 */}
                <motion.div
                  initial={{ x: 30, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.45 }}
                  className="p-4 rounded-2xl bg-gradient-to-r from-[#151C2C] to-[#1E293B] border border-white/10 shadow-xl space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-white flex items-center gap-1.5">
                      🏗️ General Skilled Worker
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-black border border-amber-500/40">
                      Direct Employer Call
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-300">
                    <span>Metro Infra Projects • Indiranagar</span>
                    <span className="font-black text-[#60A5FA]">₹1,100 / day</span>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}

          {/* =================================================================
              ACT 5: [0:40 - 0:46] THE CLIMAX & LOGO REVEAL
              Visual: Screen widens to reveal full desktop and mobile dashboard in
              dual theme perfection. The iconic VoiceHire mic logo pulses brightly.
              Super: "YOUR VOICE. REAL JOBS. BETTER FUTURE."
              ================================================================= */}
          {activeAct.id === 'act5' && (
            <motion.div
              key="scene-5"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7 }}
              className="w-full max-w-3xl flex flex-col items-center justify-center text-center space-y-6"
            >
              {/* Iconic VoiceHire Glowing Emblem */}
              <div className="relative">
                <motion.div
                  animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0.1, 0.5] }}
                  transition={{ repeat: Infinity, duration: 2.2 }}
                  className="absolute -inset-4 rounded-3xl bg-blue-500/30 blur-2xl pointer-events-none"
                />
                <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-gradient-to-br from-[#2563EB] to-[#1D4ED8] flex items-center justify-center text-white shadow-[0_0_60px_rgba(37,99,235,0.7)] border-2 border-white/30">
                  <Mic className="w-12 h-12 sm:w-14 sm:h-14 stroke-[2.5]" />
                </div>
              </div>

              {/* Super Text on Screen */}
              <div className="space-y-2">
                <h1 className="text-3xl sm:text-5xl font-black tracking-tight uppercase text-white">
                  YOUR VOICE.{' '}
                  <span className="text-[#3B82F6]">REAL JOBS.</span>{' '}
                  <span className="text-[#60A5FA]">BETTER FUTURE.</span>
                </h1>
                <p className="text-sm sm:text-lg font-semibold text-slate-300">
                  Welcome to the future of work. Simple, voice-first, barrier-free.
                </p>
              </div>

              {/* Interactive Direct CTAs */}
              <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    soundEngine.cleanup()
                    if ('speechSynthesis' in window) window.speechSynthesis.cancel()
                    if (onClose) {
                      onClose()
                    } else {
                      navigate('/register')
                    }
                  }}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] hover:from-[#1D4ED8] hover:to-[#1E40AF] text-white font-black text-sm sm:text-base shadow-xl shadow-blue-500/40 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Sparkles className="w-5 h-5 text-amber-300" />
                  <span>Continue to Sign Up</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    soundEngine.cleanup()
                    if ('speechSynthesis' in window) window.speechSynthesis.cancel()
                    navigate('/login')
                  }}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-white/[0.1] hover:bg-white/[0.18] border border-white/20 text-white font-extrabold text-sm active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Already registered? Sign In</span>
                </button>

                <button
                  type="button"
                  onClick={handleReplay}
                  className="w-full sm:w-auto p-3.5 rounded-2xl bg-white/[0.06] hover:bg-white/[0.12] text-slate-300 hover:text-white transition-all cursor-pointer flex items-center justify-center gap-1.5 text-xs font-bold"
                  title="Replay Story"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span className="sm:hidden">Replay</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ===================================================================
          BOTTOM CINEMATIC CONTROLS & SUBTITLE LETTERBOX
          =================================================================== */}
      <div className="relative z-30 p-4 sm:p-6 bg-gradient-to-t from-black via-black/85 to-transparent space-y-4">
        {/* Cinematic Subtitles Display */}
        {showSubtitles && (
          <div className="max-w-3xl mx-auto px-6 py-3 rounded-2xl bg-black/75 border border-white/10 backdrop-blur-xl text-center shadow-2xl">
            <p className="text-sm sm:text-base font-bold text-white tracking-wide leading-relaxed">
              "{activeAct.voiceover}"
            </p>
          </div>
        )}

        {/* Master Timeline Scrubber & Controls */}
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          {/* Play/Pause Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              handleUserInteraction()
              setIsPlaying(!isPlaying)
              if (isPlaying && 'speechSynthesis' in window) {
                window.speechSynthesis.cancel()
              } else if (!isPlaying && activeAct) {
                speakCurrentAct(activeAct)
              }
            }}
            className="w-10 h-10 rounded-xl bg-white/[0.1] hover:bg-[#2563EB] text-white flex items-center justify-center transition-all cursor-pointer shrink-0"
            title={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
          </button>

          {/* Time Display */}
          <span className="text-xs font-mono font-bold text-slate-400 w-16 shrink-0">
            0:{currentTime < 10 ? `0${Math.floor(currentTime)}` : Math.floor(currentTime)} / 0:46
          </span>

          {/* Scrub Track */}
          <div
            onClick={(e) => {
              e.stopPropagation()
              handleUserInteraction()
              const rect = e.currentTarget.getBoundingClientRect()
              const clickX = e.clientX - rect.left
              const ratio = Math.max(0, Math.min(1, clickX / rect.width))
              const newTime = +(ratio * 46).toFixed(2)
              setCurrentTime(newTime)
              currentActIndexRef.current = -1
            }}
            className="flex-1 h-2 rounded-full bg-white/[0.15] relative cursor-pointer group"
          >
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#2563EB] via-[#3B82F6] to-[#60A5FA] relative"
              style={{ width: `${progressPercent}%` }}
            >
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-white shadow-md shadow-blue-500 scale-0 group-hover:scale-100 transition-transform" />
            </div>
          </div>

          {/* Replay Button */}
          <button
            type="button"
            onClick={handleReplay}
            className="w-10 h-10 rounded-xl bg-white/[0.08] hover:bg-white/[0.15] text-slate-400 hover:text-white flex items-center justify-center transition-all cursor-pointer shrink-0"
            title="Restart Cinematic Intro"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
