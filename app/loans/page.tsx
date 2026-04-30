'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { LoanCard } from '@/components/loan-card'
import { ROISimulator } from '@/components/roi-simulator'
import { ECPResult } from '@/lib/types'
import { LOAN_OFFERS } from '@/lib/data'
import { DollarSign, TrendingUp } from 'lucide-react'

export default function LoansPage() {
  const router = useRouter()
  const [ecpResult, setEcpResult] = useState<ECPResult | null>(null)
  const [selectedLoan, setSelectedLoan] = useState<string | null>(null)

  useEffect(() => {
    try {
      const savedResult = sessionStorage.getItem('ecpResult')
      if (savedResult) {
        setEcpResult(JSON.parse(savedResult))
      }
    } catch (error) {
      console.error('[v0] Error loading ECP result:', error)
    }
  }, [])

  const isLoanUnlocked = (loan: typeof LOAN_OFFERS[0]) => {
    return !ecpResult || ecpResult.score >= loan.ecpRequirement
  }

  const unlockedLoans = LOAN_OFFERS.filter(isLoanUnlocked)
  const selectedLoanData = LOAN_OFFERS.find((l) => l.id === selectedLoan)

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/10">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-40 left-0 w-96 h-96 bg-secondary/5 rounded-full blur-3xl"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-border/50 backdrop-blur-sm sticky top-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Loans & Simulator</h1>
            <p className="text-foreground/60 text-sm">
              {ecpResult && `ECP Score: ${ecpResult.score}`}
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => router.back()}
            className="border-primary/30 hover:border-primary/50"
          >
            ← Back
          </Button>
        </div>
      </header>

      {/* Main content */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Tabs defaultValue="loans" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8 bg-muted/20 border border-border/30">
            <TabsTrigger value="loans" className="flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              Loan Marketplace
            </TabsTrigger>
            <TabsTrigger value="simulator" className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              ROI Simulator
            </TabsTrigger>
          </TabsList>

          {/* Loans Tab */}
          <TabsContent value="loans" className="space-y-8">
            {/* Info Card */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <Card className="bg-card border border-primary/20 p-6 bg-gradient-to-r from-primary/5 to-secondary/5">
                <h2 className="text-2xl font-bold mb-2">Education Loan Partners</h2>
                <p className="text-foreground/70">
                  {ecpResult && ecpResult.score >= 60
                    ? `Great news! Your ECP score of ${ecpResult.score} unlocks ${unlockedLoans.length} loan partners. Choose the best option for your financial needs.`
                    : 'Improve your ECP score to unlock loan offers from our trusted partners.'}
                </p>
              </Card>
            </motion.div>

            {/* Loans Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {LOAN_OFFERS.map((loan, index) => (
                <LoanCard
                  key={loan.id}
                  loan={loan}
                  isUnlocked={isLoanUnlocked(loan)}
                  index={index}
                  onSelect={() => setSelectedLoan(loan.id)}
                />
              ))}
            </div>

            {/* Selected Loan Details */}
            {selectedLoanData && isLoanUnlocked(selectedLoanData) && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Card className="bg-card border border-primary/30 p-8 bg-gradient-to-r from-primary/10 to-secondary/10">
                  <h3 className="text-2xl font-bold mb-6">{selectedLoanData.provider} - Complete Details</h3>

                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    {[
                      { label: 'Min Amount', value: `$${selectedLoanData.minAmount.toLocaleString()}` },
                      { label: 'Max Amount', value: `$${selectedLoanData.maxAmount.toLocaleString()}` },
                      { label: 'Interest Rate', value: `${selectedLoanData.interestRate}%` },
                      { label: 'Processing Fee', value: `${selectedLoanData.processingFee}%` },
                      { label: 'Tenure', value: `${selectedLoanData.tenure} years` },
                      { label: 'ECP Requirement', value: `Score ≥ ${selectedLoanData.ecpRequirement}` },
                    ].map((item, i) => (
                      <div key={i} className="bg-muted/30 rounded-lg p-4">
                        <p className="text-foreground/60 text-sm mb-1">{item.label}</p>
                        <p className="text-lg font-bold text-primary">{item.value}</p>
                      </div>
                    ))}
                  </div>

                  <div>
                    <h4 className="font-semibold mb-4">Key Features</h4>
                    <ul className="grid md:grid-cols-2 gap-3">
                      {selectedLoanData.features.map((feature, i) => (
                        <li key={i} className="flex items-start gap-2 bg-muted/20 rounded-lg p-3">
                          <span className="text-primary mt-1 text-lg">✓</span>
                          <span className="text-foreground/80">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Button className="mt-6 w-full bg-primary hover:bg-primary/90">
                    Apply for {selectedLoanData.provider}
                  </Button>
                </Card>

                {/* ROI Preview for Selected Loan */}
                <Card className="bg-card border border-border p-8 mt-8">
                  <h3 className="text-xl font-bold mb-6">EMI & ROI Projection for {selectedLoanData.provider}</h3>
                  <ROISimulator
                    loanAmount={selectedLoanData.maxAmount / 2} // Default to 50% of max
                    interestRate={selectedLoanData.interestRate}
                    tenure={selectedLoanData.tenure}
                  />
                </Card>
              </motion.div>
            )}
          </TabsContent>

          {/* ROI Simulator Tab */}
          <TabsContent value="simulator">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="bg-card border border-border p-8">
                <div className="mb-8">
                  <h2 className="text-3xl font-bold mb-2">ROI & Financial Simulator</h2>
                  <p className="text-foreground/70">
                    Model your loan repayment against your expected salary growth. Adjust the parameters to see how different scenarios affect your financial health.
                  </p>
                </div>

                <ROISimulator />
              </Card>
            </motion.div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
