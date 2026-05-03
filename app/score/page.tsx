'use client'

import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { useStudent } from '@/lib/student-context'
import { useAuth } from '@/lib/auth-context'
import { AuthGuard } from '@/components/auth-guard'
import { AnimatedGauge } from '@/components/animated-gauge'
import { Button } from '@/components/ui/button'
import { ArrowRight, Download, TrendingUp, Lightbulb } from 'lucide-react'

function ScoreContent() {
  const router = useRouter()
  const { ecpResult, profile } = useStudent()
  const { user } = useAuth()

  if (!ecpResult || !profile) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-white/60">No ECP data found.</p>
          <Button onClick={() => router.push('/calculator')} className="bg-white text-black hover:bg-white/90">
            Take the Assessment
          </Button>
        </div>
      </div>
    )
  }

  const { score, tier, fundingBandLower, fundingBandUpper, subScores, improvementTips } = ecpResult
  const displayName = profile.name.split(' ')[0] || user?.displayName?.split(' ')[0] || 'There'

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-white/[0.02] blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto px-4 py-12 md:py-20">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <p className="text-white/40 text-sm uppercase tracking-[0.3em] mb-2">Your results are in</p>
          <h1 className="text-3xl md:text-4xl font-bold">
            {displayName}, here&apos;s your <span className="text-gradient-white">ECP Score</span>
          </h1>
        </motion.div>

        {/* Gauge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="flex justify-center mb-12"
        >
          <AnimatedGauge
            score={score}
            tier={tier}
            fundingBand={[fundingBandLower, fundingBandUpper]}
          />
        </motion.div>

        {/* Sub-scores */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.5 }}
          className="grid grid-cols-3 gap-3 mb-8"
        >
          {[
            { label: 'Academic', value: subScores.academic, max: 30 },
            { label: 'Financial', value: subScores.financial, max: 40 },
            { label: 'Loan Ready', value: subScores.loanReadiness, max: 30 },
          ].map((sub) => (
            <div key={sub.label} className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-4 text-center">
              <p className="text-xs text-white/40 mb-1">{sub.label}</p>
              <p className="text-2xl font-bold">{sub.value}<span className="text-sm text-white/30">/{sub.max}</span></p>
              <div className="w-full bg-white/5 rounded-full h-1 mt-2">
                <div
                  className="h-full bg-white/60 rounded-full transition-all duration-1000"
                  style={{ width: `${(sub.value / sub.max) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </motion.div>

        {/* Improvement tips */}
        {improvementTips && improvementTips.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.8 }}
            className="mb-8"
          >
            <div className="flex items-center gap-2 mb-3">
              <Lightbulb className="w-4 h-4 text-white/40" />
              <h3 className="text-sm font-medium text-white/60">Boost Your Score</h3>
            </div>
            <div className="space-y-2">
              {improvementTips.map((tip, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-white/[0.03] border border-white/[0.06]">
                  <span className="text-sm text-white/80">{tip.action}</span>
                  <span className="text-xs font-mono text-green-400/80 whitespace-nowrap ml-3">+{tip.potentialGain} pts</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 3.0 }}
          className="space-y-3"
        >
          <Button
            size="lg"
            onClick={() => router.push('/dashboard')}
            className="w-full bg-white text-black hover:bg-white/90 font-semibold gap-2 h-14 text-base"
          >
            See Your Matched Universities
            <ArrowRight className="w-5 h-5" />
          </Button>
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              onClick={() => router.push('/dashboard?tab=loans')}
              className="border-white/10 hover:border-white/25 text-white gap-2"
            >
              <TrendingUp className="w-4 h-4" /> View Loans
            </Button>
            <Button
              variant="outline"
              onClick={() => router.push('/dashboard?tab=passport')}
              className="border-white/10 hover:border-white/25 text-white gap-2"
            >
              <Download className="w-4 h-4" /> Funding Passport
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default function ScoreRevealPage() {
  return (
    <AuthGuard>
      <ScoreContent />
    </AuthGuard>
  )
}
