'use client'

import { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { AnimatedGauge } from '@/components/animated-gauge'
import { useStudent } from '@/lib/student-context'
import { simulateECP } from '@/lib/api'
import type { StudentProfile, ECPResult, IncomeBand, Country, ProgramType, IntakePeriod } from '@/lib/types'
import { SlidersHorizontal, ArrowUp } from 'lucide-react'

export function ECPSimulator() {
  const { profile, ecpResult } = useStudent()
  const [simResult, setSimResult] = useState<ECPResult | null>(null)
  const [loading, setLoading] = useState(false)

  const [cgpa, setCgpa] = useState(profile?.cgpa || 7.0)
  const [greScore, setGreScore] = useState(profile?.greScore || 0)
  const [hasCoApplicant, setHasCoApplicant] = useState(profile?.hasCoApplicant || false)
  const [coApplicantIncome, setCoApplicantIncome] = useState<IncomeBand>(profile?.coApplicantIncome || '3-8L')

  const simulate = useCallback(async (overrides: Partial<StudentProfile>) => {
    if (!profile) return
    setLoading(true)
    try {
      const simProfile: StudentProfile = { ...profile, ...overrides }
      const res = await simulateECP(simProfile)
      setSimResult(res)
    } catch { /* ignore */ }
    setLoading(false)
  }, [profile])

  if (!profile || !ecpResult) {
    return (
      <Card className="bg-black border border-white/[0.08] p-8 text-center">
        <p className="text-white/40">Complete your ECP assessment first to use the simulator.</p>
      </Card>
    )
  }

  const currentScore = ecpResult.score
  const simScore = simResult?.score || currentScore
  const delta = simScore - currentScore

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold mb-1">ECP Score Simulator</h2>
        <p className="text-sm text-white/40">&quot;What if&quot; — see how changes affect your fundability</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Controls */}
        <Card className="bg-black border border-white/[0.08] p-6 space-y-6">
          <div className="flex items-center gap-2 mb-2">
            <SlidersHorizontal className="w-4 h-4 text-white/40" />
            <h3 className="font-semibold text-sm">Adjust Parameters</h3>
          </div>

          {/* CGPA */}
          <div>
            <div className="flex justify-between text-xs mb-2">
              <span className="text-white/40">CGPA</span>
              <span className="font-mono">{cgpa.toFixed(1)} <span className="text-white/20">(was {profile.cgpa.toFixed(1)})</span></span>
            </div>
            <Slider value={[cgpa]} onValueChange={([v]) => { setCgpa(Math.round(v*10)/10); simulate({ cgpa: Math.round(v*10)/10, greScore, hasCoApplicant, coApplicantIncome: hasCoApplicant ? coApplicantIncome : undefined }) }} min={4} max={10} step={0.1} />
          </div>

          {/* GRE */}
          <div>
            <div className="flex justify-between text-xs mb-2">
              <span className="text-white/40">GRE Score</span>
              <span className="font-mono">{greScore || 'Not taken'} <span className="text-white/20">(was {profile.greScore || 'None'})</span></span>
            </div>
            <Slider value={[greScore]} onValueChange={([v]) => { setGreScore(Math.round(v)); simulate({ cgpa, greScore: Math.round(v), hasCoApplicant, coApplicantIncome: hasCoApplicant ? coApplicantIncome : undefined }) }} min={0} max={340} step={1} />
          </div>

          {/* Co-applicant */}
          <div className="flex items-center justify-between">
            <span className="text-xs text-white/40">Add Co-applicant</span>
            <Switch checked={hasCoApplicant} onCheckedChange={(v) => { setHasCoApplicant(v); simulate({ cgpa, greScore, hasCoApplicant: v, coApplicantIncome: v ? coApplicantIncome : undefined }) }} />
          </div>

          {hasCoApplicant && (
            <div>
              <span className="text-xs text-white/40 block mb-2">Co-applicant Income</span>
              <Select value={coApplicantIncome} onValueChange={(v: IncomeBand) => { setCoApplicantIncome(v); simulate({ cgpa, greScore, hasCoApplicant: true, coApplicantIncome: v }) }}>
                <SelectTrigger className="bg-white/[0.03] border-white/[0.08] text-white text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-black border-white/10">
                  {(['<3L','3-8L','8-20L','20L+'] as IncomeBand[]).map(b => (
                    <SelectItem key={b} value={b} className="text-white hover:bg-white/10">{b}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </Card>

        {/* Result */}
        <Card className="bg-black border border-white/[0.08] p-6 flex flex-col items-center justify-center">
          <AnimatedGauge
            score={simScore}
            tier={simResult?.tier || ecpResult.tier}
            fundingBand={simResult ? [simResult.fundingBandLower, simResult.fundingBandUpper] : [ecpResult.fundingBandLower, ecpResult.fundingBandUpper]}
            size={220}
          />
          {delta !== 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={`mt-4 flex items-center gap-1 text-sm font-semibold ${delta > 0 ? 'text-green-400' : 'text-red-400'}`}>
              <ArrowUp className={`w-4 h-4 ${delta < 0 ? 'rotate-180' : ''}`} />
              {delta > 0 ? '+' : ''}{delta} from current score
            </motion.div>
          )}
        </Card>
      </div>
    </div>
  )
}
