'use client'

import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { LoanOffer } from '@/lib/types'
import { Lock, Unlock, TrendingUp, FileText } from 'lucide-react'

interface LoanCardProps {
  loan: LoanOffer
  isUnlocked: boolean
  index?: number
  onSelect?: () => void
}

export function LoanCard({ loan, isUnlocked, index = 0, onSelect }: LoanCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      onClick={onSelect}
      className="h-full cursor-pointer"
    >
      <Card className={`bg-card border p-6 h-full flex flex-col group relative overflow-hidden transition-all ${
        isUnlocked
          ? 'border-primary/50 hover:border-primary/80 hover:shadow-lg hover:shadow-primary/20'
          : 'border-border/30 opacity-70 hover:opacity-85'
      }`}>
        {/* Lock overlay */}
        {!isUnlocked && (
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-40 rounded">
            <Lock className="w-8 h-8 text-foreground/40" />
          </div>
        )}

        {/* Status badge */}
        <div className="absolute top-4 right-4">
          {isUnlocked ? (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200 }}
            >
              <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                <Unlock className="w-3 h-3 mr-1" />
                Unlocked
              </Badge>
            </motion.div>
          ) : (
            <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
              <Lock className="w-3 h-3 mr-1" />
              Locked
            </Badge>
          )}
        </div>

        {/* Header */}
        <div className="mb-6">
          <h3 className="text-xl font-bold mb-2">{loan.provider}</h3>
          <p className="text-sm text-foreground/60">Education Loan Provider</p>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-3 mb-6 flex-1">
          <div className="bg-muted/20 rounded-lg p-3">
            <p className="text-xs text-foreground/60 mb-1">Interest Rate</p>
            <p className="text-lg font-semibold text-primary">{loan.interestRate.toFixed(1)}%</p>
          </div>
          <div className="bg-muted/20 rounded-lg p-3">
            <p className="text-xs text-foreground/60 mb-1">Tenure</p>
            <p className="text-lg font-semibold">{loan.tenure} Years</p>
          </div>
          <div className="bg-muted/20 rounded-lg p-3">
            <p className="text-xs text-foreground/60 mb-1">Loan Amount</p>
            <p className="text-sm font-semibold">${loan.maxAmount.toLocaleString()}</p>
          </div>
          <div className="bg-muted/20 rounded-lg p-3">
            <p className="text-xs text-foreground/60 mb-1">Processing Fee</p>
            <p className="text-lg font-semibold">{loan.processingFee}%</p>
          </div>
        </div>

        {/* Features */}
        <div className="mb-6 space-y-2">
          {loan.features.slice(0, 3).map((feature, i) => (
            <div key={i} className="flex items-start gap-2 text-sm">
              <span className="text-primary mt-1">•</span>
              <span className="text-foreground/80">{feature}</span>
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <Button
          onClick={(e) => {
            e.stopPropagation()
            onSelect?.()
          }}
          disabled={!isUnlocked}
          className={`w-full gap-2 ${
            isUnlocked ? 'bg-primary hover:bg-primary/90' : 'bg-muted/30 hover:bg-muted/40 cursor-not-allowed'
          }`}
        >
          {isUnlocked ? (
            <>
              <FileText className="w-4 h-4" />
              View Details
            </>
          ) : (
            <>
              <Lock className="w-4 h-4" />
              Unlock at ECP ≥ {loan.ecpRequirement}
            </>
          )}
        </Button>
      </Card>
    </motion.div>
  )
}
