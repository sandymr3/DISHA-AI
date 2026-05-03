'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { getAllUniversities } from '@/lib/api'
import type { MatchedUniversity } from '@/lib/types'
import { Loader2, Globe, GraduationCap } from 'lucide-react'

export function UniversityDatabase() {
  const [data, setData] = useState<MatchedUniversity[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getAllUniversities().then(setData).catch(console.error).finally(() => setLoading(false))
  }, [])

  if (loading) {
    return <div className="flex items-center justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-white/30" /></div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold mb-1">Master University Database</h2>
        <p className="text-sm text-white/40">Raw Data Extracted from Official Sources</p>
      </div>
      <div className="grid gap-4">
        {data.map(uni => (
          <Card key={uni.id} className="bg-black border border-white/[0.08] p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <GraduationCap className="w-4 h-4 text-indigo-400" />
                <h3 className="font-bold text-lg">{uni.name}</h3>
              </div>
              <p className="text-sm text-white/40 mb-2">{uni.programName} · {uni.country}</p>
              <div className="flex flex-wrap gap-2 text-xs">
                <span className="px-2 py-1 rounded bg-white/5 border border-white/10">Cost: ₹{(uni.totalCostINR / 100000).toFixed(1)}L</span>
                <span className="px-2 py-1 rounded bg-white/5 border border-white/10">ROI: {uni.roiYears}y</span>
                {uni.postStudySalaryUSD && (
                  <span className="px-2 py-1 rounded bg-white/5 border border-white/10">Salary: ${uni.postStudySalaryUSD.toLocaleString()}</span>
                )}
              </div>
            </div>
            {uni.scrapedAt && (
              <div className="text-xs text-white/30 flex items-center gap-1.5 flex-shrink-0">
                <Globe className="w-3 h-3" />
                Valid Data (Scraped)
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  )
}