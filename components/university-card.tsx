'use client'

import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { MatchedUniversity } from '@/lib/types'
import { MapPin, TrendingUp, DollarSign } from 'lucide-react'

interface UniversityCardProps {
  university: MatchedUniversity
  index?: number
  onClick?: () => void
}

export function UniversityCard({ university, index = 0, onClick }: UniversityCardProps) {
  const costLakh = Math.round(university.totalCostINR / 100000)
  const admitPct = Math.round((university.admitProbabilityForStudent || 0) * 100)

  const badgeClass =
    university.fundingStatus === 'Within Band' ? 'badge-within-band' :
    university.fundingStatus === 'Stretch Goal' ? 'badge-stretch-goal' : 'badge-out-of-range'

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      onClick={onClick}
      className="cursor-pointer h-full"
    >
      <Card className="bg-black border border-white/[0.08] p-5 h-full flex flex-col group hover:border-white/20 transition-all duration-300 hover:bg-white/[0.02] relative overflow-hidden">
        {/* Top accent line */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

        {/* Header */}
        <div className="mb-4">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="text-base font-bold group-hover:text-white transition-colors leading-tight">{university.name}</h3>
            <Badge className={`${badgeClass} text-[10px] px-2 py-0.5 whitespace-nowrap shrink-0`}>
              {university.fundingStatus}
            </Badge>
          </div>
          <div className="flex items-center gap-3 text-xs text-white/40">
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3" />{university.country}
            </span>
            <span>{university.programName}</span>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2 mb-4 flex-1">
          <div className="bg-white/[0.03] rounded-lg p-2.5">
            <p className="text-[10px] text-white/30 mb-0.5">Total Cost</p>
            <p className="text-sm font-semibold">₹{costLakh}L</p>
          </div>
          <div className="bg-white/[0.03] rounded-lg p-2.5">
            <p className="text-[10px] text-white/30 mb-0.5">Coverage</p>
            <p className="text-sm font-semibold">{university.coveragePercent}%</p>
          </div>
          <div className="bg-white/[0.03] rounded-lg p-2.5">
            <p className="text-[10px] text-white/30 mb-0.5">Admit</p>
            <p className="text-sm font-semibold">{admitPct}%</p>
          </div>
        </div>

        {/* Admit probability bar */}
        <div className="mb-3">
          <div className="w-full bg-white/5 rounded-full h-1.5">
            <motion.div
              className="h-full rounded-full"
              style={{ backgroundColor: admitPct >= 60 ? '#22c55e' : admitPct >= 40 ? '#f59e0b' : '#ef4444' }}
              initial={{ width: 0 }}
              animate={{ width: `${admitPct}%` }}
              transition={{ duration: 1, delay: index * 0.1 + 0.5 }}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between text-xs text-white/30 pt-2 border-t border-white/5">
          <span className="flex items-center gap-1"><TrendingUp className="w-3 h-3" /> ROI: {university.roiYears}yr</span>
          <span className="flex items-center gap-1"><DollarSign className="w-3 h-3" /> ${university.postStudySalaryUSD?.toLocaleString()}/yr</span>
        </div>
      </Card>
    </motion.div>
  )
}
