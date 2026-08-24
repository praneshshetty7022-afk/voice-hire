import React, { useState, useEffect } from 'react'
import { Volume2, VolumeX, Square } from 'lucide-react'

export const AudioButton = ({ 
  text, 
  lang = 'en-US', 
  label = 'Suno (Listen)', 
  size = 'medium', // 'small' | 'medium' | 'large'
  className = '' 
}) => {
  const [isPlaying, setIsPlaying] = useState(false)

  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel()
      }
    }
  }, [])

  const handleToggleSpeak = (e) => {
    e.stopPropagation()
    e.preventDefault()

    if (!('speechSynthesis' in window)) {
      alert('Audio narration is not supported on this browser.')
      return
    }

    if (isPlaying) {
      window.speechSynthesis.cancel()
      setIsPlaying(false)
      return
    }

    window.speechSynthesis.cancel()

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = lang
    utterance.rate = 0.95 // Slightly slower rate for clear understanding by low-literacy users
    utterance.pitch = 1.0

    utterance.onstart = () => setIsPlaying(true)
    utterance.onend = () => setIsPlaying(false)
    utterance.onerror = () => setIsPlaying(false)

    window.speechSynthesis.speak(utterance)
  }

  const sizeClasses = {
    small: 'px-3 py-1.5 text-sm gap-1.5 rounded-full',
    medium: 'px-4 py-2 text-base gap-2 rounded-2xl',
    large: 'px-6 py-3.5 text-xl gap-3 rounded-3xl font-extrabold shadow-lg',
  }

  return (
    <button
      type="button"
      onClick={handleToggleSpeak}
      className={`btn-audio flex items-center justify-center transition-all ${
        isPlaying ? 'bg-rose-500 text-white animate-pulse ring-4 ring-rose-300' : 'bg-amber-400 hover:bg-amber-500 text-slate-900 shadow-md hover:scale-105'
      } ${sizeClasses[size] || sizeClasses.medium} ${className}`}
      title="Tap to listen to audio"
      aria-label="Tap to listen to audio text"
    >
      {isPlaying ? (
        <>
          <Square className="w-5 h-5 fill-current animate-bounce" />
          <span>{label ? 'Stopping...' : 'Stop'}</span>
        </>
      ) : (
        <>
          <Volume2 className="w-6 h-6 animate-pulse text-slate-900" />
          <span className="font-bold">{label}</span>
        </>
      )}
    </button>
  )
}

export default AudioButton
