'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Slider } from '@/components/ui/slider'
import { ECPFormData, ECPResult } from '@/lib/types'
import { getECPResult } from '@/lib/ecp-calculator'
import { ECP_QUESTIONS } from '@/lib/data'
import AnimatedGauge from './animated-gauge'
import { ChevronLeft, ChevronRight, Zap } from 'lucide-react'

interface ECPCalculatorProps {
  onComplete?: (result: ECPResult, formData: ECPFormData) => void
}

export function ECPCalculator({ onComplete }: ECPCalculatorProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState<ECPFormData>({
    q1: 5,
    q2: 50,
    q3: 0,
    q4: 0,
    q5: 0,
    q6: 0,
    q7: 60,
    q8: 0,
  })
  const [result, setResult] = useState<ECPResult | null>(null)
  const [isComplete, setIsComplete] = useState(false)

  const handleSliderChange = (value: number[]) => {
    const key = `q${(currentStep + 1) as keyof ECPFormData}`
    setFormData((prev) => ({
      ...prev,
      [key]: value[0],
    }))
  }

  const handleNext = () => {
    if (currentStep < ECP_QUESTIONS.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      // Calculate result
      const ecpResult = getECPResult(formData)
      setResult(ecpResult)
      setIsComplete(true)
      onComplete?.(ecpResult, formData)
    }
  }

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const currentQuestion = ECP_QUESTIONS[currentStep]
  const currentValue = formData[`q${(currentStep + 1) as keyof ECPFormData}`]
  const progress = ((currentStep + 1) / ECP_QUESTIONS.length) * 100

  if (isComplete && result) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl mx-auto"
      >
        <Card className="bg-card border border-border p-8 md:p-12 text-center">
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-3xl font-bold mb-8"
          >
            Your ECP Score
          </motion.h2>

          <div className="my-12">
            <AnimatedGauge score={result.score} maxScore={100} />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 2.2 }}
            className="space-y-6"
          >
            <div className="bg-primary/10 border border-primary/20 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-2 text-primary">Profile Band: {result.band}</h3>
              <p className="text-foreground/70">{result.recommendation}</p>
            </div>

            <div className="grid grid-cols-3 gap-4 pt-4">
              <div className="bg-muted/30 rounded-lg p-4">
                <p className="text-sm text-foreground/60 mb-1">Score</p>
                <p className="text-2xl font-bold text-primary">{result.score}</p>
              </div>
              <div className="bg-muted/30 rounded-lg p-4">
                <p className="text-sm text-foreground/60 mb-1">Profile</p>
                <p className="text-2xl font-bold text-secondary">{result.band}</p>
              </div>
              <div className="bg-muted/30 rounded-lg p-4">
                <p className="text-sm text-foreground/60 mb-1">Status</p>
                <p className="text-2xl font-bold text-accent">Complete</p>
              </div>
            </div>

            <div className="flex flex-col gap-3 pt-4">
              <Button
                size="lg"
                onClick={() => {
                  setIsComplete(false)
                  setCurrentStep(0)
                }}
                className="bg-primary hover:bg-primary/90"
              >
                Retake Assessment
              </Button>
              <Button
                size="lg"
                onClick={() => window.location.href = '/dashboard'}
                className="bg-secondary hover:bg-secondary/90 text-white"
              >
                View Matching Universities
              </Button>
            </div>
          </motion.div>
        </Card>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-2xl mx-auto"
    >
      <Card className="bg-card border border-border p-8 md:p-12">
        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-semibold">Question {currentStep + 1} of {ECP_QUESTIONS.length}</h3>
            <span className="text-sm text-foreground/60">{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-primary to-secondary rounded-full"
              initial={{ width: '0%' }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Question */}
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="space-y-8"
        >
          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-2">{currentQuestion.question}</h2>
            <p className="text-foreground/60">{currentQuestion.hint}</p>
          </div>

          {/* Slider */}
          <div className="space-y-6 py-8">
            <div className="bg-muted/20 rounded-lg p-6">
              <Slider
                value={[currentValue]}
                onValueChange={handleSliderChange}
                min={0}
                max={currentQuestion.scale}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between items-center mt-6">
                <span className="text-sm text-foreground/60">0</span>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className="text-center"
                >
                  <p className="text-5xl font-bold text-primary">{currentValue}</p>
                  <p className="text-xs text-foreground/60 mt-1">out of {currentQuestion.scale}</p>
                </motion.div>
                <span className="text-sm text-foreground/60">{currentQuestion.scale}</span>
              </div>
            </div>

            {/* Mini preview */}
            <div className="grid grid-cols-8 gap-2 p-4 bg-muted/10 rounded-lg">
              {Array.from({ length: 8 }).map((_, i) => {
                const key = `q${(i + 1) as keyof ECPFormData}`
                const value = formData[key]
                const maxValue = ECP_QUESTIONS[i].scale
                const isCurrent = i === currentStep

                return (
                  <motion.div
                    key={i}
                    className={`aspect-square rounded flex items-center justify-center text-xs font-bold transition-all ${
                      isCurrent
                        ? 'bg-primary text-white ring-2 ring-primary ring-offset-2 ring-offset-card'
                        : 'bg-muted/30 text-foreground/60 hover:bg-muted/50'
                    }`}
                  >
                    {Math.round((value / maxValue) * 10)}
                  </motion.div>
                )
              })}
            </div>
          </div>
        </motion.div>

        {/* Navigation */}
        <div className="flex gap-3 mt-8 pt-8 border-t border-border">
          <Button
            variant="outline"
            size="lg"
            onClick={handlePrev}
            disabled={currentStep === 0}
            className="gap-2"
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </Button>
          <Button variant="outline" size="lg" className="flex-1">
            Save
          </Button>
          <Button
            size="lg"
            onClick={handleNext}
            className="bg-primary hover:bg-primary/90 text-white gap-2 group"
          >
            {currentStep === ECP_QUESTIONS.length - 1 ? (
              <>
                Calculate Score
                <Zap className="w-4 h-4" />
              </>
            ) : (
              <>
                Next
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </Button>
        </div>
      </Card>
    </motion.div>
  )
}
