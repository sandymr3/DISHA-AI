'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { UniversityCard } from '@/components/university-card'
import { AIMentorChat } from '@/components/ai-mentor-chat'
import { LoanCard } from '@/components/loan-card'
import { EMICalculator } from '@/components/emi-calculator'
import { ROISimulator } from '@/components/roi-simulator'
import { FundingPassport } from '@/components/funding-passport'
import { DreamGap } from '@/components/dream-gap'
import { ECPSimulator } from '@/components/ecp-simulator'
import { DynamicSearchBar } from '@/components/search-bar'
import { useStudent } from '@/lib/student-context'
import { matchUniversities, getLoanOffers } from '@/lib/api'
import type { MatchedUniversity, LoanOffer } from '@/lib/types'
import { GraduationCap, DollarSign, TrendingUp, MessageCircle, X, Sparkles, Download, Target, SlidersHorizontal } from 'lucide-react'

function DashboardContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { studentId, profile, ecpResult } = useStudent()
  const [universities, setUniversities] = useState<MatchedUniversity[]>([])
  const [loanOffers, setLoanOffers] = useState<LoanOffer[]>([])
  const [loansUnlocked, setLoansUnlocked] = useState(false)
  const [showChat, setShowChat] = useState(false)
  const [loading, setLoading] = useState(true)
  const [selectedUni, setSelectedUni] = useState<MatchedUniversity | null>(null)
  const defaultTab = searchParams.get('tab') || 'universities'

  useEffect(() => {
    if (!studentId) return
    setLoading(true)
    Promise.all([
      matchUniversities(studentId).catch(() => []),
      getLoanOffers(studentId).catch(() => ({ offers: [], unlocked: false, ecpScore: 0 })),
    ]).then(([unis, loansData]) => {
      setUniversities((unis as MatchedUniversity[]) || [])
      const ld = loansData as { offers: LoanOffer[]; unlocked: boolean }
      setLoanOffers(ld.offers || [])
      setLoansUnlocked(ld.unlocked ?? (ecpResult?.score ?? 0) >= 60)
      setLoading(false)
    })
  }, [studentId, ecpResult])

  if (!studentId || !ecpResult || !profile) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Card className="bg-black border border-white/10 p-8 text-center max-w-md">
          <h2 className="text-2xl font-bold mb-3">Complete Your Assessment</h2>
          <p className="text-white/50 mb-6 text-sm">Calculate your ECP score to unlock your personalized dashboard.</p>
          <Button onClick={() => router.push('/calculator')} className="bg-white text-black hover:bg-white/90 font-semibold">
            Get My ECP Score
          </Button>
        </Card>
      </div>
    )
  }

  const safeUniversities = universities || []

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-white/[0.06] bg-black/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button onClick={() => router.push('/')} className="text-xl font-bold text-gradient-white">DISHA AI</button>
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08]">
              <div className={`w-2 h-2 rounded-full ${ecpResult.tier === 'Green' ? 'bg-green-400' : ecpResult.tier === 'Amber' ? 'bg-amber-400' : 'bg-red-400'}`} />
              <span className="text-xs font-mono text-white/60">ECP {ecpResult.score}</span>
              <span className="text-[10px] text-white/30">₹{ecpResult.fundingBandLower}L–₹{ecpResult.fundingBandUpper}L</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-white/40 hidden md:block">Hi, {profile.name.split(' ')[0]}</span>
            <Button size="icon" onClick={() => setShowChat(!showChat)} className={`${showChat ? 'bg-white text-black' : 'bg-white/10 text-white hover:bg-white/20'} transition-all`}>
              {showChat ? <X className="w-4 h-4" /> : <MessageCircle className="w-4 h-4" />}
            </Button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Main Content */}
        <main className={`flex-1 transition-all duration-300 ${showChat ? 'mr-0 lg:mr-[380px]' : ''}`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Tabs defaultValue={defaultTab} className="w-full">
              <TabsList className="grid w-full grid-cols-6 mb-8 bg-white/[0.03] border border-white/[0.06] h-auto p-1 rounded-xl">
                {[
                  { value: 'universities', icon: GraduationCap, label: 'Universities' },
                  { value: 'loans', icon: DollarSign, label: 'Loans' },
                  { value: 'roi', icon: TrendingUp, label: 'ROI' },
                  { value: 'passport', icon: Download, label: 'Passport' },
                  { value: 'dreamgap', icon: Target, label: 'Dream Gap' },
                  { value: 'simulator', icon: SlidersHorizontal, label: 'Simulator' },
                ].map((tab) => (
                  <TabsTrigger key={tab.value} value={tab.value} className="flex items-center gap-1.5 text-xs data-[state=active]:bg-white data-[state=active]:text-black py-2.5 rounded-lg">
                    <tab.icon className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">{tab.label}</span>
                  </TabsTrigger>
                ))}
              </TabsList>

              {/* Universities Tab */}
              <TabsContent value="universities" className="space-y-6">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h2 className="text-xl font-bold">Matched Universities</h2>
                    <p className="text-sm text-white/40">Ranked by funding fit, ROI, and admission probability</p>
                  </div>
                  <span className="text-xs text-white/30 font-mono">{safeUniversities.length} matches</span>
                </div>

                <div className="pb-4">
                  <DynamicSearchBar onSelect={(uni) => {
                    // Prepend new generated university to top of the list if it doesn't exist
                    setUniversities(prev => {
                      if (prev.find(u => u.id === uni.id)) return prev;
                      return [uni, ...prev];
                    });
                    setSelectedUni(uni);
                  }} />
                </div>

                {loading ? (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <div key={i} className="h-64 rounded-xl bg-white/[0.02] border border-white/[0.06] animate-pulse" />
                    ))}
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {safeUniversities.map((uni, i) => (
                      <UniversityCard key={uni.id} university={uni} index={i} onClick={() => setSelectedUni(uni)} />
                    ))}
                  </div>
                )}
                {selectedUni && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                    <Card className="bg-black border border-white/10 p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-lg font-bold">{selectedUni.name}</h3>
                          <p className="text-sm text-white/40">{selectedUni.programName} · {selectedUni.country}</p>
                        </div>
                        <Button size="sm" variant="ghost" onClick={() => setSelectedUni(null)} className="text-white/40 hover:text-white"><X className="w-4 h-4" /></Button>
                      </div>
                      <div className="grid grid-cols-4 gap-3">
                        {[
                          { label: 'Total Cost', value: `₹${Math.round(selectedUni.totalCostINR / 100000)}L` },
                          { label: 'Coverage', value: `${selectedUni.coveragePercent}%` },
                          { label: 'ROI', value: `${selectedUni.roiYears} yrs` },
                          { label: 'Post-Grad Salary', value: `$${selectedUni.postStudySalaryUSD?.toLocaleString()}` },
                        ].map((s) => (
                          <div key={s.label} className="bg-white/[0.03] rounded-lg p-3 text-center">
                            <p className="text-[10px] text-white/30 mb-1">{s.label}</p>
                            <p className="text-sm font-semibold">{s.value}</p>
                          </div>
                        ))}
                      </div>
                    </Card>
                  </motion.div>
                )}
              </TabsContent>

              {/* Loans Tab */}
              <TabsContent value="loans" className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold">Loan Marketplace</h2>
                  <p className="text-sm text-white/40">
                    {loansUnlocked ? `${loanOffers.length} offers unlocked for your profile` : 'Improve your ECP to 60+ to unlock loan offers'}
                  </p>
                </div>
                {!loansUnlocked && (
                  <Card className="bg-white/[0.02] border border-white/[0.08] p-8 text-center">
                    <div className="text-4xl mb-3">🔒</div>
                    <h3 className="text-lg font-bold mb-2">Loan Marketplace Locked</h3>
                    <p className="text-sm text-white/40 mb-4">Your ECP score needs to be 60 or above to unlock loan offers.</p>
                    <Button variant="outline" className="border-white/10 text-white" onClick={() => {}}>Improve My Score</Button>
                  </Card>
                )}
                {loansUnlocked && (
                  <>
                    <div className="grid md:grid-cols-3 gap-4">
                      {loanOffers.map((offer, i) => (
                        <LoanCard key={offer.id} loan={offer} index={i} />
                      ))}
                    </div>
                    <EMICalculator fundingBand={[ecpResult.fundingBandLower, ecpResult.fundingBandUpper]} />
                  </>
                )}
              </TabsContent>

              {/* ROI Tab */}
              <TabsContent value="roi">
                <ROISimulator universities={universities} />
              </TabsContent>

              {/* Passport Tab */}
              <TabsContent value="passport">
                <FundingPassport />
              </TabsContent>

              {/* Dream Gap Tab */}
              <TabsContent value="dreamgap">
                <DreamGap universities={universities} />
              </TabsContent>

              {/* Simulator Tab */}
              <TabsContent value="simulator">
                <ECPSimulator />
              </TabsContent>
            </Tabs>
          </div>
        </main>

        {/* Chat Sidebar */}
        {showChat && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="fixed right-0 top-[57px] bottom-0 w-full lg:w-[380px] z-30 bg-black border-l border-white/[0.06]"
          >
            <AIMentorChat onClose={() => setShowChat(false)} />
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black flex items-center justify-center text-white/40">Loading Dashboard...</div>}>
      <DashboardContent />
    </Suspense>
  )
}
