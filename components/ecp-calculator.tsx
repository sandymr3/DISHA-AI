'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Slider } from '@/components/ui/slider'
import { Input } from '@/components/ui/input'
import { useRouter } from 'next/navigation'
import { useStudent } from '@/lib/student-context'
import { createStudent } from '@/lib/api'
import type { StudentProfile, IncomeBand, Country, ProgramType, IntakePeriod } from '@/lib/types'
import { ChevronLeft, ChevronRight, Zap, Loader2, Globe, GraduationCap, DollarSign, Users, Calendar } from 'lucide-react'

const COUNTRIES: { value: Country; label: string; flag: string }[] = [
  { value: 'USA', label: 'United States', flag: '🇺🇸' },
  { value: 'UK', label: 'United Kingdom', flag: '🇬🇧' },
  { value: 'Canada', label: 'Canada', flag: '🇨🇦' },
  { value: 'Germany', label: 'Germany', flag: '🇩🇪' },
  { value: 'Australia', label: 'Australia', flag: '🇦🇺' },
  { value: 'India', label: 'India', flag: '🇮🇳' },
]

const PROGRAMS: { value: ProgramType; label: string }[] = [
  { value: 'MS', label: 'MS (Master of Science)' },
  { value: 'MBA', label: 'MBA' },
  { value: 'MiM', label: 'MiM (Master in Management)' },
  { value: 'PhD', label: 'PhD' },
  { value: 'MArch', label: 'MArch (Architecture)' },
  { value: 'MPH', label: 'MPH (Public Health)' },
]

const INCOME_BANDS: { value: IncomeBand; label: string }[] = [
  { value: '<3L', label: 'Below ₹3 Lakhs' },
  { value: '3-8L', label: '₹3L – ₹8L' },
  { value: '8-20L', label: '₹8L – ₹20L' },
  { value: '20L+', label: 'Above ₹20L' },
]

const INTAKES: { value: IntakePeriod; label: string }[] = [
  { value: 'Jan2026', label: 'January 2026' },
  { value: 'Sep2026', label: 'September 2026' },
  { value: 'Jan2027', label: 'January 2027' },
]

const STEPS = [
  { id: 'name', title: "What's your name?", subtitle: 'We personalize everything for you', icon: Users },
  { id: 'country', title: 'Which country are you targeting?', subtitle: 'Select your dream destination', icon: Globe },
  { id: 'program', title: 'What program type?', subtitle: 'Choose your target program', icon: GraduationCap },
  { id: 'cgpa', title: "What's your current CGPA?", subtitle: 'On a scale of 4.0 to 10.0', icon: GraduationCap },
  { id: 'gre', title: 'Have you taken the GRE?', subtitle: 'Score helps improve your ECP', icon: GraduationCap },
  { id: 'income', title: "What's your family's annual income?", subtitle: 'This determines your funding band', icon: DollarSign },
  { id: 'coapplicant', title: 'Do you have a co-applicant?', subtitle: 'A co-applicant can boost your ECP by 12+ points', icon: Users },
  { id: 'intake', title: 'When is your target intake?', subtitle: 'Earlier intakes score higher on readiness', icon: Calendar },
]

export function ECPCalculator() {
  const router = useRouter()
  const { setStudent } = useStudent()
  const [step, setStep] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [name, setName] = useState('')
  const [country, setCountry] = useState<Country | ''>('')
  const [program, setProgram] = useState<ProgramType | ''>('')
  const [cgpa, setCgpa] = useState(7.5)
  const [hasTakenGRE, setHasTakenGRE] = useState<boolean | null>(null)
  const [greScore, setGreScore] = useState(310)
  const [income, setIncome] = useState<IncomeBand | ''>('')
  const [hasCoApplicant, setHasCoApplicant] = useState<boolean | null>(null)
  const [coApplicantIncome, setCoApplicantIncome] = useState<IncomeBand | ''>('')
  const [intake, setIntake] = useState<IntakePeriod | ''>('')

  const progress = ((step + 1) / STEPS.length) * 100

  const canProceed = (): boolean => {
    switch (step) {
      case 0: return name.trim().length >= 2
      case 1: return country !== ''
      case 2: return program !== ''
      case 3: return cgpa >= 4.0 && cgpa <= 10.0
      case 4: return hasTakenGRE !== null
      case 5: return income !== ''
      case 6: return hasCoApplicant !== null && (!hasCoApplicant || coApplicantIncome !== '')
      case 7: return intake !== ''
      default: return false
    }
  }

  const handleSubmit = async () => {
    if (!canProceed()) return
    setIsSubmitting(true)
    setError(null)

    const profile: StudentProfile = {
      name: name.trim(),
      cgpa,
      greScore: hasTakenGRE ? greScore : 0,
      familyIncome: income as IncomeBand,
      hasCoApplicant: hasCoApplicant || false,
      coApplicantIncome: hasCoApplicant ? (coApplicantIncome as IncomeBand) : undefined,
      targetCountry: country as Country,
      targetProgram: program as ProgramType,
      intake: intake as IntakePeriod,
    }

    try {
      const result = await createStudent(profile)
      setStudent(result.studentId, profile, result.ecpResult)
      router.push('/score')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to calculate ECP score')
      setIsSubmitting(false)
    }
  }

  const handleNext = () => {
    if (step < STEPS.length - 1) {
      setStep(step + 1)
    } else {
      handleSubmit()
    }
  }

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <div className="space-y-4">
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your first name"
              className="bg-black border-white/10 text-white text-lg h-14 focus:border-white/40 placeholder:text-white/30"
              autoFocus
              onKeyDown={(e) => e.key === 'Enter' && canProceed() && handleNext()}
            />
          </div>
        )
      case 1:
        return (
          <div className="grid grid-cols-2 gap-3">
            {COUNTRIES.map((c) => (
              <button
                key={c.value}
                onClick={() => setCountry(c.value)}
                className={`p-4 rounded-xl border text-left transition-all ${
                  country === c.value
                    ? 'border-white bg-white/10 glow-white-sm'
                    : 'border-white/10 hover:border-white/25 hover:bg-white/5'
                }`}
              >
                <span className="text-2xl">{c.flag}</span>
                <p className="text-sm mt-2 font-medium">{c.label}</p>
              </button>
            ))}
          </div>
        )
      case 2:
        return (
          <div className="grid grid-cols-2 gap-3">
            {PROGRAMS.map((p) => (
              <button
                key={p.value}
                onClick={() => setProgram(p.value)}
                className={`p-4 rounded-xl border text-left transition-all ${
                  program === p.value
                    ? 'border-white bg-white/10 glow-white-sm'
                    : 'border-white/10 hover:border-white/25 hover:bg-white/5'
                }`}
              >
                <p className="text-sm font-medium">{p.label}</p>
              </button>
            ))}
          </div>
        )
      case 3:
        return (
          <div className="space-y-8 py-4">
            <div className="text-center">
              <span className="text-6xl font-bold text-gradient-white">{cgpa.toFixed(1)}</span>
              <p className="text-white/40 text-sm mt-2">out of 10.0</p>
            </div>
            <Slider
              value={[cgpa]}
              onValueChange={([v]) => setCgpa(Math.round(v * 10) / 10)}
              min={4.0}
              max={10.0}
              step={0.1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-white/40">
              <span>4.0</span><span>10.0</span>
            </div>
          </div>
        )
      case 4:
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setHasTakenGRE(true)}
                className={`p-5 rounded-xl border text-center transition-all ${
                  hasTakenGRE === true ? 'border-white bg-white/10 glow-white-sm' : 'border-white/10 hover:border-white/25'
                }`}
              >
                <p className="font-medium">Yes, I have</p>
              </button>
              <button
                onClick={() => { setHasTakenGRE(false); setGreScore(0) }}
                className={`p-5 rounded-xl border text-center transition-all ${
                  hasTakenGRE === false ? 'border-white bg-white/10 glow-white-sm' : 'border-white/10 hover:border-white/25'
                }`}
              >
                <p className="font-medium">Not yet</p>
              </button>
            </div>
            {hasTakenGRE && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4 pt-4">
                <div className="text-center">
                  <span className="text-5xl font-bold text-gradient-white">{greScore}</span>
                  <p className="text-white/40 text-sm mt-1">GRE Score</p>
                </div>
                <Slider value={[greScore]} onValueChange={([v]) => setGreScore(Math.round(v))} min={260} max={340} step={1} />
                <div className="flex justify-between text-xs text-white/40"><span>260</span><span>340</span></div>
              </motion.div>
            )}
          </div>
        )
      case 5:
        return (
          <div className="space-y-3">
            {INCOME_BANDS.map((band) => (
              <button
                key={band.value}
                onClick={() => setIncome(band.value)}
                className={`w-full p-4 rounded-xl border text-left transition-all ${
                  income === band.value ? 'border-white bg-white/10 glow-white-sm' : 'border-white/10 hover:border-white/25'
                }`}
              >
                <p className="font-medium">{band.label}</p>
              </button>
            ))}
          </div>
        )
      case 6:
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setHasCoApplicant(true)}
                className={`p-5 rounded-xl border text-center transition-all ${
                  hasCoApplicant === true ? 'border-white bg-white/10 glow-white-sm' : 'border-white/10 hover:border-white/25'
                }`}
              >
                <p className="font-medium">Yes</p>
                <p className="text-xs text-white/40 mt-1">Parent / Sibling</p>
              </button>
              <button
                onClick={() => { setHasCoApplicant(false); setCoApplicantIncome('') }}
                className={`p-5 rounded-xl border text-center transition-all ${
                  hasCoApplicant === false ? 'border-white bg-white/10 glow-white-sm' : 'border-white/10 hover:border-white/25'
                }`}
              >
                <p className="font-medium">No</p>
              </button>
            </div>
            {hasCoApplicant && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-3 pt-2">
                <p className="text-sm text-white/60">Co-applicant&apos;s annual income:</p>
                {INCOME_BANDS.map((band) => (
                  <button
                    key={band.value}
                    onClick={() => setCoApplicantIncome(band.value)}
                    className={`w-full p-3 rounded-xl border text-left text-sm transition-all ${
                      coApplicantIncome === band.value ? 'border-white bg-white/10' : 'border-white/10 hover:border-white/25'
                    }`}
                  >
                    {band.label}
                  </button>
                ))}
              </motion.div>
            )}
          </div>
        )
      case 7:
        return (
          <div className="space-y-3">
            {INTAKES.map((i) => (
              <button
                key={i.value}
                onClick={() => setIntake(i.value)}
                className={`w-full p-4 rounded-xl border text-left transition-all ${
                  intake === i.value ? 'border-white bg-white/10 glow-white-sm' : 'border-white/10 hover:border-white/25'
                }`}
              >
                <p className="font-medium">{i.label}</p>
              </button>
            ))}
          </div>
        )
      default:
        return null
    }
  }

  const StepIcon = STEPS[step].icon

  return (
    <div className="max-w-xl mx-auto">
      <Card className="bg-black border border-white/10 p-6 md:p-10 relative overflow-hidden">
        {/* Subtle top glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />

        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center gap-2 text-white/60">
              <StepIcon className="w-4 h-4" />
              <span className="text-xs font-medium">Step {step + 1} of {STEPS.length}</span>
            </div>
            <span className="text-xs text-white/40 font-mono">{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-white/5 rounded-full h-1 overflow-hidden">
            <motion.div
              className="h-full bg-white rounded-full"
              initial={{ width: '0%' }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
            />
          </div>
        </div>

        {/* Question */}
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <div>
              <h2 className="text-2xl md:text-3xl font-bold mb-1">{STEPS[step].title}</h2>
              <p className="text-white/50 text-sm">{STEPS[step].subtitle}</p>
            </div>
            <div className="min-h-[200px]">{renderStep()}</div>
          </motion.div>
        </AnimatePresence>

        {/* Error */}
        {error && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
            {error}
          </motion.div>
        )}

        {/* Navigation */}
        <div className="flex gap-3 mt-8 pt-6 border-t border-white/5">
          <Button
            variant="outline"
            onClick={() => setStep(Math.max(0, step - 1))}
            disabled={step === 0}
            className="border-white/10 hover:border-white/25 hover:bg-white/5 text-white gap-1"
          >
            <ChevronLeft className="w-4 h-4" /> Back
          </Button>
          <Button
            onClick={handleNext}
            disabled={!canProceed() || isSubmitting}
            className="flex-1 bg-white text-black hover:bg-white/90 font-semibold gap-2"
          >
            {isSubmitting ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Calculating...</>
            ) : step === STEPS.length - 1 ? (
              <><Zap className="w-4 h-4" /> Calculate My ECP Score</>
            ) : (
              <>Next <ChevronRight className="w-4 h-4" /></>
            )}
          </Button>
        </div>
      </Card>
    </div>
  )
}
