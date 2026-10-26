import React from 'react'

/**
 * AnimatedBackground Component
 * 
 * Supports both:
 * - Dark Mode: Deep Obsidian Canvas (#0B0F19) with glowing royal/neon blue aura
 * - Light Mode: Slate Light Ice White (#F8FAFC) with soft blue ambient tints
 */
export default function AnimatedBackground() {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none overflow-hidden z-0 bg-[#F8FAFC] dark:bg-[#0B0F19] transition-colors duration-300"
    >
      {/* 1. Base Mesh Gradient Shift */}
      <div className="absolute inset-0 opacity-40 dark:opacity-60 bg-ambient-mesh-light dark:bg-ambient-mesh-dark" />

      {/* 2. Ambient Soft Glowing Orbs */}
      <div className="absolute -top-32 -left-32 w-[600px] h-[600px] rounded-full bg-blue-500/15 dark:bg-blue-600/20 blur-[130px] animate-pulse" />
      <div className="absolute top-1/4 -right-40 w-[650px] h-[650px] rounded-full bg-indigo-400/15 dark:bg-indigo-600/20 blur-[140px]" />
      <div className="absolute top-2/3 left-1/4 w-[550px] h-[550px] rounded-full bg-sky-400/10 dark:bg-sky-500/15 blur-[120px]" />

      {/* 3. Flowing Curved SVG Wave Ribbons */}
      <div className="absolute top-12 left-0 right-0 h-[480px] overflow-hidden opacity-30 dark:opacity-40">
        <svg
          className="w-full h-full"
          viewBox="0 0 1440 480"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="curveGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#2563EB" stopOpacity="0.45" />
              <stop offset="50%" stopColor="#3B82F6" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#60A5FA" stopOpacity="0.2" />
            </linearGradient>
            <linearGradient id="curveGrad2" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#1E40AF" stopOpacity="0.35" />
              <stop offset="60%" stopColor="#3B82F6" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#93C5FD" stopOpacity="0.15" />
            </linearGradient>
          </defs>

          <path
            d="M-100 180 C 240 60, 480 320, 800 160 C 1100 20, 1340 280, 1560 140"
            stroke="url(#curveGrad1)"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <path
            d="M-80 240 C 320 120, 560 380, 920 200 C 1220 50, 1380 310, 1600 190"
            stroke="url(#curveGrad2)"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeDasharray="10 8"
          />
        </svg>
      </div>

      {/* 4. Subtle Floating Translucent Bubbles */}
      <div className="hidden sm:block absolute top-[20%] left-[12%] w-10 h-10 rounded-full border border-blue-400/25 bg-blue-400/5 animate-float-slow" />
      <div className="hidden sm:block absolute top-[45%] right-[14%] w-14 h-14 rounded-full border border-sky-400/20 bg-sky-400/5 animate-float-slow" style={{ animationDelay: '2s' }} />
      <div className="hidden sm:block absolute top-[70%] left-[22%] w-8 h-8 rounded-full border border-indigo-400/20 bg-indigo-400/5 animate-float-slow" style={{ animationDelay: '3.5s' }} />
    </div>
  )
}
