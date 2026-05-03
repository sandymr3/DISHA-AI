'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import type { ECPTier } from '@/lib/types'

interface AnimatedGaugeProps {
  score: number
  tier: ECPTier
  fundingBand?: [number, number]
  size?: number
}

export function AnimatedGauge({ score, tier, fundingBand, size = 280 }: AnimatedGaugeProps) {
  const [displayScore, setDisplayScore] = useState(0)
  const strokeWidth = 8
  const radius = (size - strokeWidth * 2) / 2
  const circumference = 2 * Math.PI * radius
  const normalizedScore = Math.min(score / 100, 1)
  const offset = circumference * (1 - normalizedScore)

  const tierColor = tier === 'Green' ? '#22c55e' : tier === 'Amber' ? '#f59e0b' : '#ef4444'

  // Counter animation
  useEffect(() => {
    let current = 0
    const step = Math.max(1, Math.floor(score / 60))
    const interval = setInterval(() => {
      current += step
      if (current >= score) {
        current = score
        clearInterval(interval)
      }
      setDisplayScore(current)
    }, 30)
    return () => clearInterval(interval)
  }, [score])

  return (
    <div className="flex flex-col items-center justify-center">
      <div style={{ width: size, height: size }} className="relative">
        <svg width={size} height={size} className="absolute inset-0 -rotate-90">
          {/* Background track */}
          <circle
            cx={size / 2} cy={size / 2} r={radius}
            fill="none" stroke="rgba(255,255,255,0.06)"
            strokeWidth={strokeWidth}
          />
          {/* Animated arc */}
          <motion.circle
            cx={size / 2} cy={size / 2} r={radius}
            fill="none" stroke="url(#gaugeGrad)"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeLinecap="round"
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 2.2, ease: [0.16, 1, 0.3, 1] }}
            style={{ filter: `drop-shadow(0 0 12px ${tierColor}40)` }}
          />
          <defs>
            <linearGradient id="gaugeGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="100%" stopColor={tierColor} />
            </linearGradient>
          </defs>
        </svg>

        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="text-center"
          >
            <div className="text-7xl font-bold score-glow">{displayScore}</div>
            <div className="text-xs text-white/40 mt-1 uppercase tracking-[0.2em]">ECP Score</div>
          </motion.div>
        </div>

        {/* Outer ring pulse */}
        <motion.div
          className="absolute inset-0 rounded-full border border-white/5"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.5, delay: 0.5 }}
        />
      </div>

      {/* Tier badge */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.0 }}
        className="mt-6 flex items-center gap-2"
      >
        <div className={`w-2 h-2 rounded-full`} style={{ backgroundColor: tierColor }} />
        <span className="text-sm font-medium" style={{ color: tierColor }}>
          {tier} Tier
        </span>
      </motion.div>

      {/* Funding band */}
      {fundingBand && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.3 }}
          className="mt-4 text-center"
        >
          <p className="text-xs text-white/40 uppercase tracking-wider mb-1">Funding Band</p>
          <p className="text-2xl font-bold text-gradient-white">
            ₹{fundingBand[0]}L – ₹{fundingBand[1]}L
          </p>
        </motion.div>
      )}
    </div>
  )
}

export default AnimatedGauge
