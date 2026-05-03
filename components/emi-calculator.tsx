'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Slider } from '@/components/ui/slider'
import { calculateEMI } from '@/lib/api'
import type { EMIResult } from '@/lib/types'
import { Calculator } from 'lucide-react'

interface EMICalculatorProps {
  fundingBand: [number, number]
}

export function EMICalculator({ fundingBand }: EMICalculatorProps) {
  const [loanAmount, setLoanAmount] = useState(Math.round((fundingBand[0] + fundingBand[1]) / 2))
  const [rate, setRate] = useState(10.5)
  const [years, setYears] = useState(12)
  const [result, setResult] = useState<EMIResult | null>(null)
  const [loading, setLoading] = useState(false)

  const compute = async (amount: number, r: number, y: number) => {
    setLoading(true)
    try {
      const res = await calculateEMI({ loanAmountLakh: amount, annualRatePercent: r, repaymentYears: y })
      setResult(res)
    } catch { /* ignore */ }
    setLoading(false)
  }

  const handleAmountChange = (v: number[]) => { setLoanAmount(v[0]); compute(v[0], rate, years) }
  const handleRateChange = (v: number[]) => { setRate(v[0]); compute(loanAmount, v[0], years) }
  const handleYearsChange = (v: number[]) => { setYears(v[0]); compute(loanAmount, rate, v[0]) }

  // Initial compute
  if (!result && !loading) compute(loanAmount, rate, years)

  return (
    <Card className="bg-black border border-white/[0.08] p-6">
      <div className="flex items-center gap-2 mb-6">
        <Calculator className="w-5 h-5 text-white/40" />
        <h3 className="font-bold">EMI Calculator</h3>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-6">
        <div>
          <div className="flex justify-between text-xs mb-2">
            <span className="text-white/40">Loan Amount</span>
            <span className="font-mono font-bold">₹{loanAmount}L</span>
          </div>
          <Slider value={[loanAmount]} onValueChange={handleAmountChange} min={fundingBand[0]} max={fundingBand[1]} step={1} />
        </div>
        <div>
          <div className="flex justify-between text-xs mb-2">
            <span className="text-white/40">Interest Rate</span>
            <span className="font-mono font-bold">{rate}%</span>
          </div>
          <Slider value={[rate]} onValueChange={handleRateChange} min={8} max={14} step={0.1} />
        </div>
        <div>
          <div className="flex justify-between text-xs mb-2">
            <span className="text-white/40">Tenure</span>
            <span className="font-mono font-bold">{years} yrs</span>
          </div>
          <Slider value={[years]} onValueChange={handleYearsChange} min={5} max={15} step={1} />
        </div>
      </div>

      {result && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-3 gap-3">
          <div className="bg-white/[0.03] rounded-lg p-4 text-center">
            <p className="text-[10px] text-white/30 mb-1">Monthly EMI</p>
            <p className="text-xl font-bold">₹{result.monthlyEMI?.toLocaleString()}</p>
          </div>
          <div className="bg-white/[0.03] rounded-lg p-4 text-center">
            <p className="text-[10px] text-white/30 mb-1">Total Interest</p>
            <p className="text-xl font-bold">₹{Math.round((result.totalInterest || 0) / 100000)}L</p>
          </div>
          <div className="bg-white/[0.03] rounded-lg p-4 text-center">
            <p className="text-[10px] text-white/30 mb-1">Total Payment</p>
            <p className="text-xl font-bold">₹{Math.round((result.totalPayment || 0) / 100000)}L</p>
          </div>
        </motion.div>
      )}
    </Card>
  )
}
