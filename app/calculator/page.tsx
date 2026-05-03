'use client'

import { Navbar } from '@/components/navbar'
import { ECPCalculator } from '@/components/ecp-calculator'
import { AuthGuard } from '@/components/auth-guard'

export default function CalculatorPage() {
  return (
    <AuthGuard>
      <div className="min-h-screen bg-black">
        <Navbar title="ECP Calculator" />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              Calculate Your <span className="text-gradient-white">ECP Score</span>
            </h1>
            <p className="text-white/50 max-w-md mx-auto">
              Answer 8 questions. Get your fundability score in under 3 minutes.
            </p>
          </div>
          <ECPCalculator />
        </main>
      </div>
    </AuthGuard>
  )
}
