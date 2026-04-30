'use client'

import { useState } from 'react'
import { ECPCalculator } from '@/components/ecp-calculator'
import { ECPResult, ECPFormData } from '@/lib/types'
import { useRouter } from 'next/navigation'

export default function CalculatorPage() {
  const router = useRouter()
  const [ecpResult, setEcpResult] = useState<ECPResult | null>(null)
  const [formData, setFormData] = useState<ECPFormData | null>(null)

  const handleComplete = (result: ECPResult, data: ECPFormData) => {
    setEcpResult(result)
    setFormData(data)
    // Store in session storage for next page
    sessionStorage.setItem('ecpResult', JSON.stringify(result))
    sessionStorage.setItem('formData', JSON.stringify(data))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/10">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-40 left-0 w-96 h-96 bg-secondary/5 rounded-full blur-3xl"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-border/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={() => router.back()}
            className="text-foreground/70 hover:text-foreground transition flex items-center gap-2"
          >
            ← Back
          </button>
        </div>
      </header>

      {/* Main content */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Calculate Your <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">ECP Score</span>
          </h1>
          <p className="text-foreground/70 max-w-2xl mx-auto">
            Answer 8 quick questions about your academic profile, experience, and achievements to get your personalized Education Career Profile score.
          </p>
        </div>

        <ECPCalculator onComplete={handleComplete} />
      </main>
    </div>
  )
}
