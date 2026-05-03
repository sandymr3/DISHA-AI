'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ArrowRight, Gauge, GraduationCap, DollarSign, TrendingUp, MessageCircle, Download } from 'lucide-react'
import { motion } from 'framer-motion'

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { duration: 0.7, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } }),
}

const STATS = [
  { value: '13.3L+', label: 'Indian Students Abroad' },
  { value: '30%', label: 'Annual Loan Growth' },
  { value: '₹54L', label: 'Avg. Education Cost' },
  { value: '3 min', label: 'ECP Score Time' },
]

const FEATURES = [
  { icon: Gauge, title: 'ECP Score', desc: 'Your fundability metric — know what you can borrow before you pick a university' },
  { icon: GraduationCap, title: 'Smart Matching', desc: 'Universities ranked by funding fit, ROI, and admission probability — not just rankings' },
  { icon: DollarSign, title: 'Loan Marketplace', desc: 'Unlock NBFC offers from Avanse, InCred, HDFC — rates personalized to your profile' },
  { icon: TrendingUp, title: 'ROI Simulator', desc: '10-year projection showing exactly when your degree investment pays off' },
  { icon: MessageCircle, title: 'AI Mentor', desc: 'Gemini-powered advisor that knows your ECP, funding band, and dream universities' },
  { icon: Download, title: 'Funding Passport', desc: 'Shareable card with your financial identity — Spotify Wrapped for education finance' },
]

export default function LandingPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-black overflow-hidden relative">
      {/* Noise overlay */}
      <div className="noise-overlay fixed inset-0 pointer-events-none" />

      {/* Subtle gradient orbs */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-200px] left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full bg-white/[0.015] blur-[150px]" />
        <div className="absolute bottom-[-300px] right-[-200px] w-[600px] h-[600px] rounded-full bg-white/[0.01] blur-[120px]" />
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-white/[0.04]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="text-xl font-bold text-gradient-white tracking-tight">
            DISHA AI
          </motion.div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
            <Button
              size="sm"
              onClick={() => router.push('/calculator')}
              className="bg-white text-black hover:bg-white/90 text-xs font-semibold gap-1.5"
            >
              Get My ECP Score <ArrowRight className="w-3 h-3" />
            </Button>
          </motion.div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20 md:pt-36 md:pb-28">
        <div className="text-center">
          <motion.p
            custom={0} variants={fadeUp} initial="hidden" animate="visible"
            className="text-xs uppercase tracking-[0.4em] text-white/30 mb-6"
          >
            Fund First. Dream Second.
          </motion.p>
          <motion.h1
            custom={1} variants={fadeUp} initial="hidden" animate="visible"
            className="text-4xl sm:text-5xl md:text-7xl font-bold leading-[1.1] tracking-tight mb-6"
          >
            Know What You Can
            <br />
            <span className="text-gradient-white">Borrow</span> in 3 Minutes.
            <br />
            <span className="text-white/40">Then Pick Your University.</span>
          </motion.h1>
          <motion.p
            custom={2} variants={fadeUp} initial="hidden" animate="visible"
            className="text-base md:text-lg text-white/40 max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            DISHA uses your CGPA, family income, and loan readiness to calculate your
            Education Credit Profile — then matches you with universities you can actually afford.
          </motion.p>
          <motion.div custom={3} variants={fadeUp} initial="hidden" animate="visible" className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              size="lg"
              onClick={() => router.push('/calculator')}
              className="bg-white text-black hover:bg-white/90 font-semibold gap-2 h-14 px-8 text-base group"
            >
              Get My ECP Score
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
              className="border-white/10 hover:border-white/25 text-white h-14 px-8 text-base hover:bg-white/5"
            >
              See How It Works
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="relative z-10 border-y border-white/[0.04]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-0 md:divide-x md:divide-white/[0.06]">
            {STATS.map((stat, i) => (
              <motion.div
                key={stat.label}
                custom={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
                className="text-center md:px-8"
              >
                <p className="text-2xl md:text-3xl font-bold text-gradient-white">{stat.value}</p>
                <p className="text-xs text-white/30 mt-1">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* The Problem */}
      <section className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
        <motion.div
          custom={0} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-xs uppercase tracking-[0.3em] text-white/20 mb-3">The Problem</p>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Students pick universities first.
            <br />
            <span className="text-white/30">Then scramble for loans they can&apos;t get.</span>
          </h2>
          <p className="text-white/40 max-w-xl mx-auto">
            67% of education loan rejections happen because students apply to programs
            outside their financial band. DISHA flips the process — fund first, dream second.
          </p>
        </motion.div>

        {/* Before / After */}
        <div className="grid md:grid-cols-2 gap-6">
          <motion.div custom={1} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6"
          >
            <p className="text-xs text-red-400/60 uppercase tracking-wider mb-4">Without DISHA</p>
            <div className="space-y-3">
              {['Research 50+ universities randomly', 'Apply for loans blindly', 'Get rejected — wasted ₹5K+ in fees', 'Start over with lower dreams'].map((step, i) => (
                <div key={i} className="flex items-center gap-3 text-sm text-white/40">
                  <span className="w-6 h-6 rounded-full bg-red-500/10 text-red-400 flex items-center justify-center text-xs shrink-0">{i + 1}</span>
                  {step}
                </div>
              ))}
            </div>
          </motion.div>
          <motion.div custom={2} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="bg-white/[0.02] border border-white/[0.08] rounded-2xl p-6 glow-white-sm"
          >
            <p className="text-xs text-green-400/60 uppercase tracking-wider mb-4">With DISHA</p>
            <div className="space-y-3">
              {['3-min ECP assessment → Know your funding band', 'AI matches universities within your band', 'Unlock personalized loan offers from NBFCs', 'Apply with confidence — 90%+ approval rate'].map((step, i) => (
                <div key={i} className="flex items-center gap-3 text-sm text-white/70">
                  <span className="w-6 h-6 rounded-full bg-green-500/10 text-green-400 flex items-center justify-center text-xs shrink-0">✓</span>
                  {step}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
        <motion.div custom={0} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-16">
          <p className="text-xs uppercase tracking-[0.3em] text-white/20 mb-3">Platform</p>
          <h2 className="text-3xl md:text-4xl font-bold">Everything in One Place</h2>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {FEATURES.map((feature, i) => (
            <motion.div
              key={feature.title}
              custom={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
              className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-6 group hover:border-white/15 transition-all duration-300 hover:bg-white/[0.03]"
            >
              <feature.icon className="w-8 h-8 text-white/20 mb-4 group-hover:text-white/50 transition-colors" />
              <h3 className="font-bold mb-1">{feature.title}</h3>
              <p className="text-sm text-white/40 leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
        <motion.div
          custom={0} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
          className="text-center bg-white/[0.02] border border-white/[0.08] rounded-2xl p-12 md:p-16 relative overflow-hidden"
        >
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Know Your<br /><span className="text-gradient-white">Real Financial Standing?</span>
          </h2>
          <p className="text-white/40 mb-8 max-w-lg mx-auto">
            8 questions. 3 minutes. Your entire education funding picture — clear as day.
          </p>
          <Button
            size="lg"
            onClick={() => router.push('/calculator')}
            className="bg-white text-black hover:bg-white/90 font-semibold gap-2 h-14 px-10 text-base group"
          >
            Start My ECP Assessment
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/[0.04]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-white/20">© 2026 DISHA AI — TensorX. All rights reserved.</p>
          <div className="flex gap-6 text-xs text-white/20">
            <a href="#features" className="hover:text-white/50 transition-colors">Features</a>
            <a href="/calculator" className="hover:text-white/50 transition-colors">Calculator</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
