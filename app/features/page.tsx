'use client'

import { useRouter } from 'next/navigation'
import { Navbar } from '@/components/navbar'
import { Button } from '@/components/ui/button'
import { ArrowRight, Gauge, GraduationCap, DollarSign, TrendingUp, MessageCircle, Download } from 'lucide-react'
import { motion } from 'framer-motion'

const features = [
  { icon: Gauge, title: 'ECP Calculator', desc: 'Calculate your Education Credit Profile — your fundability score based on academics, income, and loan readiness.' },
  { icon: GraduationCap, title: 'University Matching', desc: 'AI-powered matching based on your funding band, not just rankings. See which universities you can actually afford.' },
  { icon: DollarSign, title: 'Loan Marketplace', desc: 'Unlock personalized loan offers from Avanse, InCred, HDFC Credila — rates matched to your ECP score.' },
  { icon: TrendingUp, title: 'ROI Simulator', desc: '10-year financial projection comparing your salary growth with and without an international degree.' },
  { icon: MessageCircle, title: 'AI Mentor', desc: 'Gemini-powered advisor that knows your ECP score, funding band, and matched universities.' },
  { icon: Download, title: 'Funding Passport', desc: 'Your financial identity card — download and share with loan providers and university offices.' },
]

export default function FeaturesPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-black">
      <Navbar title="Features" />
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-3">Platform Features</h1>
          <p className="text-white/40 max-w-xl mx-auto">Everything you need to navigate your international education funding journey.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-6 group hover:border-white/15 transition-all"
            >
              <f.icon className="w-8 h-8 text-white/20 mb-4 group-hover:text-white/50 transition-colors" />
              <h3 className="font-bold mb-2">{f.title}</h3>
              <p className="text-sm text-white/40 leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-16">
          <Button size="lg" onClick={() => router.push('/calculator')} className="bg-white text-black hover:bg-white/90 font-semibold gap-2 h-14 px-8">
            Get Started <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </main>
    </div>
  )
}
