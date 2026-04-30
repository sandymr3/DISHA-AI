'use client'

import { motion } from 'framer-motion'
import React from 'react'

interface AnimatedGaugeProps {
  score: number
  maxScore?: number
  size?: number
  strokeWidth?: number
  showLabel?: boolean
}

export function AnimatedGauge({
  score,
  maxScore = 100,
  size = 300,
  strokeWidth = 12,
  showLabel = true,
}: AnimatedGaugeProps) {
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const normalizedScore = Math.min(score / maxScore, 1)
  const offset = circumference * (1 - normalizedScore)

  // Determine color based on score
  const getColor = () => {
    if (score >= 75) return '#6366f1' // primary (indigo)
    if (score >= 55) return '#8b5cf6' // secondary (purple)
    return '#ef4444' // destructive (red)
  }

  // Determine band label
  const getBand = () => {
    if (score >= 75) return 'High'
    if (score >= 55) return 'Medium'
    return 'Low'
  }

  const color = getColor()

  return (
    <div className="flex flex-col items-center justify-center">
      <div style={{ width: size, height: size }} className="relative">
        {/* Background circle */}
        <svg width={size} height={size} className="absolute inset-0 -rotate-90 drop-shadow-lg">
          {/* Background track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.1)"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
          />

          {/* Animated progress circle */}
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeLinecap="round"
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{
              duration: 2,
              ease: 'easeInOut',
            }}
            filter="drop-shadow(0 0 20px rgba(99, 102, 241, 0.5))"
          />
        </svg>

        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 1.5 }}
            className="text-center"
          >
            <div className="text-6xl font-bold text-foreground">{score}</div>
            {showLabel && <div className="text-sm text-foreground/60 mt-2 uppercase tracking-wide">{getBand()} Profile</div>}
          </motion.div>
        </div>
      </div>

      {/* Band indicator */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 2 }}
        className="mt-8 text-center"
      >
        <p className="text-foreground/70 text-sm">Your Education Career Profile</p>
      </motion.div>
    </div>
  )
}

export default AnimatedGauge
