'use client'

import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { LoanOffer } from '@/lib/types'
import { Clock, Shield, Zap } from 'lucide-react'

interface LoanCardProps {
  loan: LoanOffer
  index?: number
  onSelect?: () => void
}

export function LoanCard({ loan, index = 0, onSelect }: LoanCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      onClick={onSelect}
      className="cursor-pointer h-full"
    >
      <Card className="bg-black border border-white/[0.08] p-5 h-full flex flex-col group hover:border-white/20 transition-all duration-300 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold" style={{ backgroundColor: loan.color + '20', color: loan.color }}>
              {loan.logo}
            </div>
            <div>
              <h3 className="font-bold text-sm">{loan.lender}</h3>
              <p className="text-[10px] text-white/30">{loan.usp}</p>
            </div>
          </div>
          <Badge className={`${loan.collateralRequired ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 'bg-green-500/10 text-green-400 border-green-500/20'} text-[10px]`}>
            {loan.collateralRequired ? 'Collateral' : 'No Collateral'}
          </Badge>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-2 mb-4 flex-1">
          <div className="bg-white/[0.03] rounded-lg p-3">
            <p className="text-[10px] text-white/30 mb-0.5">Interest Rate</p>
            <p className="text-lg font-bold">{loan.interestRateMin}%<span className="text-xs text-white/30"> – {loan.interestRateMax}%</span></p>
          </div>
          <div className="bg-white/[0.03] rounded-lg p-3">
            <p className="text-[10px] text-white/30 mb-0.5">Max Amount</p>
            <p className="text-lg font-bold">₹{loan.maxAmountLakh}L</p>
          </div>
        </div>

        {/* Details row */}
        <div className="flex items-center gap-4 text-[11px] text-white/40 pt-3 border-t border-white/5">
          <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{loan.processingDays}d processing</span>
          <span className="flex items-center gap-1"><Shield className="w-3 h-3" />{loan.moratoriumMonths}mo moratorium</span>
          <span className="flex items-center gap-1"><Zap className="w-3 h-3" />{loan.repaymentYears}yr repay</span>
        </div>
      </Card>
    </motion.div>
  )
}
