'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { UniversityCard } from '@/components/university-card'
import { AIMentorChat } from '@/components/ai-mentor-chat'
import { ECPResult, ECPFormData, StudentProfile } from '@/lib/types'
import { UNIVERSITIES } from '@/lib/data'
import { filterUniversitiesByECP } from '@/lib/ecp-calculator'
import { Filter, MessageCircle, X } from 'lucide-react'

export default function DashboardPage() {
  const router = useRouter()
  const [ecpResult, setEcpResult] = useState<ECPResult | null>(null)
  const [formData, setFormData] = useState<ECPFormData | null>(null)
  const [filteredUniversities, setFilteredUniversities] = useState(UNIVERSITIES)
  const [studentProfile, setStudentProfile] = useState<StudentProfile | null>(null)
  const [showChat, setShowChat] = useState(false)
  const [fundingFilterEnabled, setFundingFilterEnabled] = useState(false)

  // Load data from session storage
  useEffect(() => {
    try {
      const savedResult = sessionStorage.getItem('ecpResult')
      const savedFormData = sessionStorage.getItem('formData')

      if (savedResult) {
        const result = JSON.parse(savedResult)
        setEcpResult(result)

        // Filter universities by ECP score
        const matched = filterUniversitiesByECP(UNIVERSITIES, result.score)
        setFilteredUniversities(matched)

        // Create student profile
        const profile: StudentProfile = {
          name: 'John Doe',
          email: 'student@example.com',
          cgpa: 3.5,
          incomeLevel: 'Medium',
          targetCountry: 'USA',
          targetProgram: 'Computer Science',
          ecpResult: result,
        }
        setStudentProfile(profile)
      }

      if (savedFormData) {
        setFormData(JSON.parse(savedFormData))
      }
    } catch (error) {
      console.error('[v0] Error loading data:', error)
    }
  }, [])

  const handleFundingFilter = (enabled: boolean) => {
    setFundingFilterEnabled(enabled)
    if (ecpResult) {
      let universities = filterUniversitiesByECP(UNIVERSITIES, ecpResult.score)
      if (enabled) {
        universities = universities.filter((uni) => uni.fundingAvailable !== 'Limited')
      }
      setFilteredUniversities(universities)
    }
  }

  if (!ecpResult) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/10 flex items-center justify-center">
        <Card className="bg-card border border-border p-8 text-center max-w-md">
          <h2 className="text-2xl font-bold mb-4">No ECP Data</h2>
          <p className="text-foreground/70 mb-6">Please complete the ECP calculator first.</p>
          <Button onClick={() => router.push('/calculator')} className="bg-primary hover:bg-primary/90">
            Go to Calculator
          </Button>
        </Card>
      </div>
    )
  }

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
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <p className="text-foreground/60 text-sm">
              Your ECP Score: <span className="text-primary font-semibold">{ecpResult.score}</span>
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => router.push('/calculator')}
              className="border-primary/30 hover:border-primary/50"
            >
              Retake Test
            </Button>
            <Button
              size="icon"
              onClick={() => setShowChat(!showChat)}
              className="bg-primary hover:bg-primary/90 relative"
            >
              {showChat ? <X className="w-5 h-5" /> : <MessageCircle className="w-5 h-5" />}
            </Button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Info section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <Card className="bg-card border border-primary/20 p-6 bg-gradient-to-r from-primary/5 to-secondary/5">
            <h2 className="text-2xl font-bold mb-2">Profile Assessment: {ecpResult.band}</h2>
            <p className="text-foreground/70">{ecpResult.recommendation}</p>
          </Card>
        </motion.div>

        {/* Filter section */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8 flex gap-4 items-center flex-wrap"
        >
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-foreground/60" />
            <span className="font-semibold">Filters:</span>
          </div>
          <Button
            size="sm"
            variant={fundingFilterEnabled ? 'default' : 'outline'}
            onClick={() => handleFundingFilter(!fundingFilterEnabled)}
            className={
              fundingFilterEnabled ? 'bg-primary hover:bg-primary/90' : 'border-primary/30 hover:border-primary/50'
            }
          >
            {fundingFilterEnabled ? '✓' : ''} Funding Available
          </Button>
          <span className="text-sm text-foreground/60 ml-auto">
            Showing {filteredUniversities.length} universities
          </span>
        </motion.div>

        {/* Universities Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUniversities.length > 0 ? (
            filteredUniversities.map((university, index) => (
              <UniversityCard key={university.id} university={university} index={index} />
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="col-span-full"
            >
              <Card className="bg-card border border-border p-12 text-center">
                <p className="text-foreground/70 mb-4">No universities found matching your criteria.</p>
                <Button
                  variant="outline"
                  onClick={() => handleFundingFilter(false)}
                  className="border-primary/30 hover:border-primary/50"
                >
                  Clear Filters
                </Button>
              </Card>
            </motion.div>
          )}
        </div>

        {/* CTA to Loans */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 pt-12 border-t border-border"
        >
          <Card className="bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/30 p-12 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Fund Your Education?</h2>
            <p className="text-foreground/70 mb-8 max-w-2xl mx-auto">
              Explore education loan options and run financial projections to understand your investment.
            </p>
            <Button
              size="lg"
              onClick={() => router.push('/loans')}
              className="bg-secondary hover:bg-secondary/90 text-white gap-2 group"
            >
              Explore Loans & ROI
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </Button>
          </Card>
        </motion.div>
      </main>

      {/* Chat panel */}
      {showChat && (
        <div className="fixed bottom-0 right-0 w-full md:w-96 h-96 md:h-full md:max-h-screen z-50 p-4 md:p-0 md:border-l md:border-border/50 bg-background">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="h-full"
          >
            <AIMentorChat
              studentProfile={studentProfile || undefined}
              ecpResult={ecpResult}
              onClose={() => setShowChat(false)}
            />
          </motion.div>
        </div>
      )}
    </div>
  )
}
