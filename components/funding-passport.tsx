'use client'

import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useStudent } from '@/lib/student-context'
import { getFundingPassport } from '@/lib/api'
import type { FundingPassport as FPType } from '@/lib/types'
import { Download, Loader2, Share2 } from 'lucide-react'

export function FundingPassport() {
  const { studentId, ecpResult } = useStudent()
  const [data, setData] = useState<FPType | null>(null)
  const [loading, setLoading] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!studentId) return
    setLoading(true)
    getFundingPassport(studentId).then(setData).catch(() => {}).finally(() => setLoading(false))
  }, [studentId])

  const handleDownload = async () => {
    if (!cardRef.current) return
    try {
      const html2canvas = (await import('html2canvas')).default
      const canvas = await html2canvas(cardRef.current, { backgroundColor: '#000', scale: 2 })
      const link = document.createElement('a')
      link.download = 'DISHA-Funding-Passport.png'
      link.href = canvas.toDataURL()
      link.click()
    } catch { /* ignore */ }
  }

  if (loading) {
    return <div className="flex items-center justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-white/30" /></div>
  }

  if (!data || !ecpResult) {
    return (
      <Card className="bg-black border border-white/[0.08] p-8 text-center">
        <p className="text-white/40">Complete your ECP assessment to generate your Funding Passport.</p>
      </Card>
    )
  }

  const tierColor = data.tier === 'Green' ? '#22c55e' : data.tier === 'Amber' ? '#f59e0b' : '#ef4444'

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold mb-1">Funding Passport</h2>
        <p className="text-sm text-white/40">Your financial identity card — download and share</p>
      </div>

      {/* The Card */}
      <div className="flex justify-center">
        <div ref={cardRef} className="w-full max-w-md">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6 }}>
            <Card className="bg-black border border-white/[0.12] p-8 relative overflow-hidden">
              {/* Decorative elements */}
              <div className="absolute top-0 left-0 right-0 h-1" style={{ background: `linear-gradient(90deg, transparent, ${tierColor}, transparent)` }} />
              <div className="absolute top-4 right-4 w-20 h-20 rounded-full opacity-5" style={{ background: tierColor }} />

              {/* Header */}
              <div className="flex items-center justify-between mb-8">
                <div>
                  <p className="text-[10px] text-white/30 uppercase tracking-[0.3em]">DISHA AI</p>
                  <h3 className="text-lg font-bold mt-1">Funding Passport</h3>
                </div>
                <div className="px-3 py-1 rounded-full text-xs font-semibold" style={{ backgroundColor: tierColor + '15', color: tierColor, border: `1px solid ${tierColor}30` }}>
                  {data.nbfcTier}
                </div>
              </div>

              {/* Name */}
              <p className="text-sm text-white/40 mb-1">Issued to</p>
              <p className="text-xl font-bold mb-6">{data.name}</p>

              {/* ECP Score */}
              <div className="text-center mb-6 py-6 bg-white/[0.02] rounded-xl border border-white/[0.06]">
                <p className="text-6xl font-bold" style={{ color: tierColor }}>{data.ecpScore}</p>
                <p className="text-xs text-white/30 mt-1 uppercase tracking-wider">ECP Score — {data.tier} Tier</p>
              </div>

              {/* Funding Band */}
              <div className="text-center mb-6">
                <p className="text-xs text-white/30 mb-1">Funding Band</p>
                <p className="text-2xl font-bold text-gradient-white">₹{data.fundingBandLower}L – ₹{data.fundingBandUpper}L</p>
              </div>

              {/* Top Universities */}
              {data.topTwoUniversities && data.topTwoUniversities.length > 0 && (
                <div className="space-y-2 mb-6">
                  <p className="text-xs text-white/30">Top Matches</p>
                  {data.topTwoUniversities.map((uni, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-white/[0.03] border border-white/[0.06]">
                      <div>
                        <p className="text-sm font-medium">{uni.name}</p>
                        <p className="text-[10px] text-white/30">{uni.program}</p>
                      </div>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                        uni.fundingStatus === 'Within Band' ? 'badge-within-band' : 'badge-stretch-goal'
                      }`}>{uni.fundingStatus}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Footer */}
              <div className="text-center pt-4 border-t border-white/[0.06]">
                <p className="text-[10px] text-white/20">Generated {new Date(data.generatedAt).toLocaleDateString()} · disha.ai</p>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-center gap-3">
        <Button onClick={handleDownload} className="bg-white text-black hover:bg-white/90 gap-2">
          <Download className="w-4 h-4" /> Download PNG
        </Button>
        <Button variant="outline" className="border-white/10 text-white gap-2" onClick={() => navigator.clipboard.writeText(data.shareUrl)}>
          <Share2 className="w-4 h-4" /> Copy Share Link
        </Button>
      </div>
    </div>
  )
}
