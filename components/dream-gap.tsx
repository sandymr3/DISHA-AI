'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useStudent } from '@/lib/student-context'
import { getDreamGap } from '@/lib/api'
import type { MatchedUniversity, DreamGapResult } from '@/lib/types'
import { Target, Loader2, ArrowRight, Lightbulb } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface DreamGapProps {
  universities?: MatchedUniversity[]
}

export function DreamGap({ universities = [] }: DreamGapProps) {
  const { studentId, ecpResult } = useStudent()
  const [selectedId, setSelectedId] = useState('')
  const [result, setResult] = useState<DreamGapResult | null>(null)
  const [loading, setLoading] = useState(false)

  const handleAnalyze = async () => {
    if (!studentId || !selectedId) return
    setLoading(true)
    try {
      const res = await getDreamGap(studentId, selectedId)
      setResult(res)
    } catch { /* ignore */ }
    setLoading(false)
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold mb-1">Dream Gap Analyser</h2>
        <p className="text-sm text-white/40">Can&apos;t afford your dream school? We&apos;ll find the path.</p>
      </div>

      <Card className="bg-black border border-white/[0.08] p-6">
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <Select value={selectedId} onValueChange={setSelectedId}>
            <SelectTrigger className="flex-1 bg-white/[0.03] border-white/[0.08] text-white">
              <SelectValue placeholder="Select your dream university" />
            </SelectTrigger>
            <SelectContent className="bg-black border-white/10">
              {universities.map(u => (
                <SelectItem key={u.id} value={u.id} className="text-white hover:bg-white/10">
                  {u.name} — {u.programName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={handleAnalyze} disabled={!selectedId || loading} className="bg-white text-black hover:bg-white/90 gap-2">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Target className="w-4 h-4" />}
            Analyze Gap
          </Button>
        </div>

        {result && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            {/* Gap visualization */}
            <div className="grid grid-cols-3 gap-3 items-center">
              <div className="bg-white/[0.03] rounded-xl p-4 text-center">
                <p className="text-[10px] text-white/30 mb-1">Total Cost</p>
                <p className="text-2xl font-bold">₹{result.dreamUniversityTotalCostLakh}L</p>
              </div>
              <div className="flex items-center justify-center">
                <div className="text-center">
                  <div className={`text-3xl font-bold ${result.gapLakh > 0 ? 'text-red-400' : 'text-green-400'}`}>
                    {result.gapLakh > 0 ? `-₹${result.gapLakh}L` : '✓ Covered'}
                  </div>
                  <p className="text-[10px] text-white/30 mt-1">Funding Gap</p>
                </div>
              </div>
              <div className="bg-white/[0.03] rounded-xl p-4 text-center">
                <p className="text-[10px] text-white/30 mb-1">Your Band</p>
                <p className="text-2xl font-bold">₹{result.studentFundingUpperLakh}L</p>
              </div>
            </div>

            {/* Progress bar */}
            <div>
              <div className="flex justify-between text-xs text-white/30 mb-1">
                <span>₹0L</span>
                <span>₹{result.dreamUniversityTotalCostLakh}L</span>
              </div>
              <div className="w-full bg-white/5 rounded-full h-3 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-1000"
                  style={{
                    width: `${Math.min(100, (result.studentFundingUpperLakh / result.dreamUniversityTotalCostLakh) * 100)}%`,
                    background: result.gapLakh > 0 ? 'linear-gradient(90deg, #22c55e, #f59e0b)' : '#22c55e'
                  }}
                />
              </div>
            </div>

            {/* Paths to close */}
            {result.pathsToCloseGap && result.pathsToCloseGap.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Lightbulb className="w-4 h-4 text-white/40" />
                  <h4 className="text-sm font-semibold">Paths to Close the Gap</h4>
                </div>
                <div className="space-y-2">
                  {result.pathsToCloseGap.map((path, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-white/[0.03] border border-white/[0.06]">
                      <div className="flex items-center gap-3">
                        <ArrowRight className="w-3 h-3 text-white/20 shrink-0" />
                        <span className="text-sm text-white/80">{path.action}</span>
                      </div>
                      <div className="flex items-center gap-2 shrink-0 ml-3">
                        <span className="text-xs font-mono text-green-400/80">+₹{path.potentialUnlockLakh}L</span>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                          path.effort === 'Low' ? 'bg-green-500/10 text-green-400' :
                          path.effort === 'Medium' ? 'bg-amber-500/10 text-amber-400' : 'bg-red-500/10 text-red-400'
                        }`}>{path.effort}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </Card>
    </div>
  )
}
