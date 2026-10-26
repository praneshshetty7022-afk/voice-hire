import React from 'react'

/**
 * AnimatedBackground Component
 * 
 * Visual Style:
 * - Clean white and light-blue base with royal-blue accents
 * - Smooth animated blue-to-lavender ambient mesh gradients
 * - Floating translucent glass bubbles with slow, varied drifting movement
 * - Flowing curved SVG ribbon lines behind the hero section
 * - Subtle glowing ambient particles
 * 
 * Mobile Optimization:
 * - Hides heavy particles and reduces bubble count on small screens
 * - Respects prefers-reduced-motion media query
 */
export default function AnimatedBackground() {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none overflow-hidden z-0 bg-[#f8fafc]"
    >
      {/* 1. Base Mesh Gradient with Smooth Animated Blue-to-Lavender Shifts */}
      <div className="absolute inset-0 opacity-80 animated-mesh-bg" />

      {/* 2. Ambient Soft Glowing Orbs (Deep Layer) */}
      <div className="absolute -top-32 -left-32 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-blue-400/20 via-sky-300/15 to-transparent blur-[120px] animate-ambient-drift-1" />
      <div className="absolute top-1/4 -right-40 w-[650px] h-[650px] rounded-full bg-gradient-to-bl from-indigo-300/20 via-lavender-300/15 to-blue-200/10 blur-[130px] animate-ambient-drift-2" />
      <div className="absolute top-2/3 left-1/4 w-[550px] h-[550px] rounded-full bg-gradient-to-tr from-sky-300/15 via-blue-200/10 to-transparent blur-[110px] animate-ambient-drift-3" />

      {/* 3. Flowing Curved SVG Wave Ribbons (Behind Hero Section) */}
      <div className="absolute top-12 left-0 right-0 h-[480px] overflow-hidden opacity-35 sm:opacity-45">
        <svg
          className="w-full h-full preserve-3d"
          viewBox="0 0 1440 480"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="curveGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#2563eb" stopOpacity="0.4" />
              <stop offset="50%" stopColor="#818cf8" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.2" />
            </linearGradient>
            <linearGradient id="curveGrad2" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#6366f1" stopOpacity="0.3" />
              <stop offset="60%" stopColor="#38bdf8" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#93c5fd" stopOpacity="0.15" />
            </linearGradient>
            <linearGradient id="curveGrad3" x1="0%" y1="50%" x2="100%" y2="50%">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.25" />
              <stop offset="50%" stopColor="#a78bfa" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#60a5fa" stopOpacity="0.1" />
            </linearGradient>
          </defs>

          {/* Primary Flowing Curved Line */}
          <path
            d="M-100 180 C 240 60, 480 320, 800 160 C 1100 20, 1340 280, 1560 140"
            stroke="url(#curveGrad1)"
            strokeWidth="2.5"
            strokeLinecap="round"
            className="animate-flowing-curve-1"
          />

          {/* Secondary Counter-Curved Line */}
          <path
            d="M-80 280 C 300 380, 620 120, 960 260 C 1220 370, 1400 180, 1580 230"
            stroke="url(#curveGrad2)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray="6 4"
            className="animate-flowing-curve-2"
          />

          {/* Tertiary Subtle Echo Ribbon */}
          <path
            d="M-50 100 C 380 220, 720 40, 1080 200 C 1320 310, 1480 120, 1600 170"
            stroke="url(#curveGrad3)"
            strokeWidth="1.5"
            strokeLinecap="round"
            className="animate-flowing-curve-3"
          />
        </svg>
      </div>

      {/* 4. Floating Translucent Glass Bubbles */}
      <div className="absolute inset-0">
        {/* Bubble 1: Large Soft Violet/Sky Bubble (Top Right) */}
        <div className="bubble bubble-1 w-44 h-44 sm:w-56 sm:h-56 top-[10%] right-[8%] animate-float-bubble-1" />

        {/* Bubble 2: Medium Royal/Lavender Bubble (Top Left Hero) */}
        <div className="bubble bubble-2 w-32 h-32 sm:w-40 sm:h-40 top-[22%] left-[6%] animate-float-bubble-2" />

        {/* Bubble 3: Gentle Cyan/Blue Bubble (Center Right) */}
        <div className="bubble bubble-3 w-28 h-28 sm:w-36 sm:h-36 top-[48%] right-[14%] animate-float-bubble-3" />

        {/* Bubble 4: Soft Indigo Floating Orb (Bottom Left) */}
        <div className="bubble bubble-4 w-36 h-36 sm:w-48 sm:h-48 top-[65%] left-[8%] animate-float-bubble-4" />

        {/* Bubble 5: Small Crisp Bubble (Center Left, Desktop Only) */}
        <div className="hidden sm:block bubble bubble-5 w-20 h-20 top-[38%] left-[22%] animate-float-bubble-5" />

        {/* Bubble 6: Micro Floating Pearl (Bottom Right, Desktop Only) */}
        <div className="hidden sm:block bubble bubble-6 w-16 h-16 top-[78%] right-[25%] animate-float-bubble-6" />

        {/* Bubble 7: Wide Soft Halo Bubble (Top Center, Desktop Only) */}
        <div className="hidden md:block bubble bubble-7 w-52 h-52 -top-10 left-[45%] animate-float-bubble-7" />
      </div>

      {/* 5. Subtle Glowing Drifting Particles (Desktop only for light performance) */}
      <div className="hidden sm:block absolute inset-0">
        <span className="particle particle-1 top-[18%] left-[28%]" />
        <span className="particle particle-2 top-[32%] right-[22%]" />
        <span className="particle particle-3 top-[55%] left-[16%]" />
        <span className="particle particle-4 top-[72%] right-[32%]" />
        <span className="particle particle-5 top-[85%] left-[42%]" />
        <span className="particle particle-6 top-[28%] right-[42%]" />
      </div>

      {/* 6. Subtle Light Noise Vignette for Organic Depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/30 via-transparent to-white/40 pointer-events-none" />
    </div>
  )
}
