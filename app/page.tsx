'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ArrowRight, Zap, Gauge, University, TrendingUp } from 'lucide-react'
import { motion } from 'framer-motion'

export default function LandingPage() {
  const router = useRouter()

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8 },
    },
  }

  const features = [
    {
      icon: Gauge,
      title: 'ECP Calculator',
      description: 'Calculate your Education Career Profile with precision using AI-powered assessment',
    },
    {
      icon: University,
      title: 'University Matching',
      description: 'Get matched with universities aligned to your profile and aspirations',
    },
    {
      icon: Zap,
      title: 'AI Mentor',
      description: 'Chat with our AI-powered mentor for personalized guidance and insights',
    },
    {
      icon: TrendingUp,
      title: 'ROI Simulator',
      description: '10-year financial projection to understand your investment returns',
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/10 overflow-hidden">
      {/* Background gradient effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-40 left-0 w-96 h-96 bg-secondary/10 rounded-full blur-3xl"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 backdrop-blur-sm border-b border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
          >
            DISHA AI
          </motion.div>
          <motion.nav
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="hidden md:flex gap-8"
          >
            <a href="/features" className="text-foreground/70 hover:text-foreground transition">
              Features
            </a>
            <a href="#howitworks" className="text-foreground/70 hover:text-foreground transition">
              How It Works
            </a>
          </motion.nav>
        </div>
      </header>

      {/* Hero Section */}
      <motion.section
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32"
      >
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div variants={itemVariants} className="space-y-6">
            <h1 className="text-5xl md:text-6xl font-bold leading-tight text-balance">
              Your Path to{' '}
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Global Education
              </span>
            </h1>
            <p className="text-xl text-foreground/70 leading-relaxed text-balance">
              DISHA AI uses advanced algorithms to assess your profile, match you with ideal universities, and guide your international education journey with AI-powered mentorship.
            </p>
            <div className="flex gap-4 pt-4">
              <Button
                size="lg"
                onClick={() => router.push('/calculator')}
                className="bg-primary hover:bg-primary/90 text-white gap-2 group"
              >
                Get Started
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-primary/30 hover:border-primary/50 hover:bg-primary/5"
              >
                Learn More
              </Button>
            </div>
          </motion.div>

          {/* Hero Illustration */}
          <motion.div
            variants={itemVariants}
            className="relative h-96 md:h-full flex items-center justify-center"
          >
            <div className="relative w-full h-full max-w-md">
              <div className="absolute inset-0 bg-gradient-to-br from-primary to-secondary rounded-2xl opacity-20 blur-3xl"></div>
              <div className="relative bg-card border border-border rounded-2xl p-8 space-y-4">
                <div className="h-4 bg-primary/20 rounded w-3/4"></div>
                <div className="h-4 bg-secondary/20 rounded w-1/2"></div>
                <div className="space-y-3 pt-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex gap-2">
                      <div className="w-8 h-8 rounded bg-primary/10"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-2 bg-muted rounded w-full"></div>
                        <div className="h-2 bg-muted/50 rounded w-4/5"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Features Section */}
      <motion.section
        id="features"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20"
      >
        <motion.div variants={itemVariants} className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Powerful Features</h2>
          <p className="text-foreground/70 max-w-2xl mx-auto text-lg">
            Everything you need to succeed in your international education journey
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="group bg-card border border-border/50 hover:border-primary/30 rounded-xl p-6 transition-all hover:shadow-xl hover:shadow-primary/10"
            >
              <feature.icon className="w-12 h-12 text-primary mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-foreground/60 text-sm">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20"
      >
        <motion.div
          variants={itemVariants}
          className="bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/30 rounded-2xl p-12 text-center"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Transform Your Education Path?</h2>
          <p className="text-foreground/70 mb-8 text-lg">
            Calculate your ECP score and discover universities that match your profile
          </p>
          <Button
            size="lg"
            onClick={() => router.push('/calculator')}
            className="bg-primary hover:bg-primary/90 text-white gap-2 group"
          >
            Start ECP Calculator
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </motion.div>
      </motion.section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-border/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center text-foreground/50 text-sm">
          <p>&copy; 2024 DISHA AI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
