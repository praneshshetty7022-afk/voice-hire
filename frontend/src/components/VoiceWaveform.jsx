import React from 'react'

/**
 * VoiceWaveform Component
 * 
 * Decorative audio waveform displayed beside the main microphone.
 * - When voiceState is 'LISTENING': Animates dynamic audio bars with varied heights and royal-blue/cyan glows.
 * - When voiceState is 'IDLE': Returns to a calm, tranquil resting state with minimal 4-6px bars.
 * - When voiceState is 'PROCESSING': Shows a gentle rhythmic wave.
 * - Supports 'left' and 'right' orientation beside the microphone orb.
 */
export default function VoiceWaveform({ voiceState = 'IDLE', side = 'left', className = '' }) {
  const isListening = voiceState === 'LISTENING'
  const isProcessing = voiceState === 'PROCESSING'
  const isSuccess = voiceState === 'SUCCESS'
  const isError = voiceState === 'ERROR'

  // Height multiplier & animation speed configuration for each bar (left vs right mirror symmetry)
  const barConfigs = side === 'left' ? [
    { delay: '0.0s', activeMin: 10, activeMax: 26, idleH: 4 },
    { delay: '0.15s', activeMin: 14, activeMax: 38, idleH: 6 },
    { delay: '0.3s', activeMin: 18, activeMax: 48, idleH: 8 },
    { delay: '0.1s', activeMin: 12, activeMax: 34, idleH: 6 },
    { delay: '0.25s', activeMin: 16, activeMax: 44, idleH: 7 },
    { delay: '0.05s', activeMin: 20, activeMax: 52, idleH: 9 },
  ] : [
    { delay: '0.05s', activeMin: 20, activeMax: 52, idleH: 9 },
    { delay: '0.25s', activeMin: 16, activeMax: 44, idleH: 7 },
    { delay: '0.1s', activeMin: 12, activeMax: 34, idleH: 6 },
    { delay: '0.3s', activeMin: 18, activeMax: 48, idleH: 8 },
    { delay: '0.15s', activeMin: 14, activeMax: 38, idleH: 6 },
    { delay: '0.0s', activeMin: 10, activeMax: 26, idleH: 4 },
  ]

  return (
    <div
      aria-hidden="true"
      className={`hidden sm:flex items-center gap-1.5 h-16 px-2 select-none pointer-events-none transition-opacity duration-500 ${
        isListening ? 'opacity-100' : 'opacity-70 hover:opacity-90'
      } ${className}`}
    >
      {barConfigs.map((bar, idx) => {
        let barColor = 'bg-slate-300'
        let animClass = ''

        if (isListening) {
          barColor = 'bg-gradient-to-t from-blue-600 via-sky-500 to-indigo-500 shadow-[0_0_12px_rgba(37,99,235,0.4)]'
          animClass = `waveform-bar-active waveform-bar-${(idx % 6) + 1}`
        } else if (isProcessing) {
          barColor = 'bg-gradient-to-t from-sky-400 to-blue-500'
          animClass = 'animate-pulse'
        } else if (isSuccess) {
          barColor = 'bg-emerald-500'
        } else if (isError) {
          barColor = 'bg-rose-400'
        } else {
          // IDLE: Calm, subtle light blue / slate resting tint
          barColor = 'bg-gradient-to-t from-blue-200/90 to-indigo-200/70'
        }

        return (
          <span
            key={idx}
            style={{
              height: isListening ? undefined : `${bar.idleH}px`,
              animationDelay: bar.delay,
            }}
            className={`w-1.5 rounded-full transition-all duration-300 ${barColor} ${animClass}`}
          />
        )
      })}
    </div>
  )
}
