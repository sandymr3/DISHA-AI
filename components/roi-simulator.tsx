'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts'
import { useStudent } from '@/lib/student-context'
import { calculateROI } from '@/lib/api'
import type { MatchedUniversity, ROIResult } from '@/lib/types'
import { TrendingUp, Loader2 } from 'lucide-react'

interface ROISimulatorProps {
  universities?: MatchedUniversity[]
}

export function ROISimulator({ universities = [] }: ROISimulatorProps) {
  const { studentId } = useStudent()
  const [selectedUniId, setSelectedUniId] = useState('')
  const [result, setResult] = useState<ROIResult | null>(null)
  const [loading, setLoading] = useState(false)

  const handleCalculate = async () => {
    if (!studentId || !selectedUniId) return
    setLoading(true)
    try {
      const res = await calculateROI({ studentId, universityId: selectedUniId })
      setResult(res)
    } catch { /* ignore */ }
    setLoading(false)
  }

  const selectedUni = universities.find(u => u.id === selectedUniId)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold mb-1">ROI Simulator</h2>
        <p className="text-sm text-white/40">10-year financial projection: Is this degree worth it?</p>
      </div>

      <Card className="bg-black border border-white/[0.08] p-6">
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <Select value={selectedUniId} onValueChange={setSelectedUniId}>
            <SelectTrigger className="flex-1 bg-white/[0.03] border-white/[0.08] text-white">
              <SelectValue placeholder="Select a university" />
            </SelectTrigger>
            <SelectContent className="bg-black border-white/10">
              {universities.map(u => (
                <SelectItem key={u.id} value={u.id} className="text-white hover:bg-white/10">
                  {u.name} — {u.programName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={handleCalculate} disabled={!selectedUniId || loading} className="bg-white text-black hover:bg-white/90 gap-2">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <TrendingUp className="w-4 h-4" />}
            Calculate ROI
          </Button>
        </div>

        {result && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            {/* Chart */}
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={result.data}>
                  <defs>
                    <linearGradient id="withDegree" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ffffff" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#ffffff" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="withoutDegree" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#666666" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#666666" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="year" stroke="rgba(255,255,255,0.2)" tick={{ fontSize: 11 }} label={{ value: 'Year', position: 'insideBottom', offset: -5, fill: 'rgba(255,255,255,0.3)', fontSize: 11 }} />
                  <YAxis stroke="rgba(255,255,255,0.2)" tick={{ fontSize: 11 }} label={{ value: 'Cumulative (₹L)', angle: -90, position: 'insideLeft', fill: 'rgba(255,255,255,0.3)', fontSize: 11 }} />
                  <Tooltip contentStyle={{ backgroundColor: '#111', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', fontSize: '12px' }} labelStyle={{ color: 'rgba(255,255,255,0.5)' }} />
                  {result.breakEvenYear && (
                    <ReferenceLine x={result.breakEvenYear} stroke="rgba(255,255,255,0.3)" strokeDasharray="4 4" label={{ value: `Break-even Yr ${result.breakEvenYear}`, position: 'top', fill: 'rgba(255,255,255,0.5)', fontSize: 11 }} />
                  )}
                  <Area type="monotone" dataKey="withoutDegree" stroke="#555" fill="url(#withoutDegree)" strokeWidth={2} name="Without Degree" />
                  <Area type="monotone" dataKey="withDegree" stroke="#fff" fill="url(#withDegree)" strokeWidth={2} name="With Degree" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Summary */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-white/[0.03] rounded-lg p-4 text-center">
                <p className="text-[10px] text-white/30 mb-1">Break-Even Year</p>
                <p className="text-2xl font-bold">{result.breakEvenYear ?? '—'}</p>
              </div>
              <div className="bg-white/[0.03] rounded-lg p-4 text-center">
                <p className="text-[10px] text-white/30 mb-1">10-Year Net Gain</p>
                <p className={`text-2xl font-bold ${result.tenYearGain > 0 ? 'text-green-400' : 'text-red-400'}`}>₹{result.tenYearGain}L</p>
              </div>
              <div className="bg-white/[0.03] rounded-lg p-4 text-center">
                <p className="text-[10px] text-white/30 mb-1">University</p>
                <p className="text-sm font-semibold truncate">{selectedUni?.name || '—'}</p>
              </div>
            </div>
          </motion.div>
        )}
      </Card>
    </div>
  )
}
