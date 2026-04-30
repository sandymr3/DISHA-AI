'use client'

import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { CheckCircle, Gauge, University, DollarSign, MessageCircle, TrendingUp } from 'lucide-react'

export default function FeaturesPage() {
  const router = useRouter()

  const features = [
    {
      icon: Gauge,
      title: 'ECP Calculator',
      description:
        'Advanced Education Career Profile assessment that evaluates your academic performance, experience, achievements, and more across 8 dimensions.',
      benefits: ['8-dimension assessment', 'Real-time scoring', 'Personalized recommendations', 'Instant results'],
      color: 'from-primary/20 to-primary/5',
      href: '/calculator',
    },
    {
      icon: University,
      title: 'University Matching',
      description:
        'Intelligent matching algorithm that recommends universities aligned with your ECP score, funding needs, and academic goals.',
      benefits: ['Smart recommendations', 'Funding filter', 'Detailed university info', 'Top global universities'],
      color: 'from-secondary/20 to-secondary/5',
      href: '/dashboard',
    },
    {
      icon: MessageCircle,
      title: 'AI Mentor',
      description:
        'Chat with our Gemini-powered AI mentor who understands your profile and provides personalized guidance for your education journey.',
      benefits: ['24/7 availability', 'Profile-aware advice', 'University insights', 'Instant answers'],
      color: 'from-accent/20 to-accent/5',
      href: '/dashboard',
    },
    {
      icon: DollarSign,
      title: 'Loan Marketplace',
      description:
        'Access to 5+ education loan providers with competitive rates, transparent terms, and flexible options tailored to students.',
      benefits: ['Multiple providers', 'Transparent terms', 'ECP-based unlocking', 'Easy comparison'],
      color: 'from-green-500/20 to-green-500/5',
      href: '/loans',
    },
    {
      icon: TrendingUp,
      title: 'ROI Simulator',
      description:
        '10-year financial projection tool that helps you understand loan repayment against your expected salary growth.',
      benefits: ['10-year projections', 'Custom parameters', 'Visual charts', 'Financial insights'],
      color: 'from-blue-500/20 to-blue-500/5',
      href: '/loans',
    },
  ]

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
            className="text-foreground/70 hover:text-foreground transition flex items-center gap-2 mb-4"
          >
            ← Back
          </button>
          <h1 className="text-4xl font-bold">Powerful Features</h1>
          <p className="text-foreground/70 mt-2">Everything you need for your international education journey</p>
        </div>
      </header>

      {/* Main content */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-12">
          {features.map((feature, index) => (
            <motion.div key={index} variants={itemVariants}>
              <Card className={`bg-gradient-to-br ${feature.color} border border-border/50 p-8 hover:border-primary/30 transition-all`}>
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  <div>
                    <div className="flex items-center gap-4 mb-4">
                      <feature.icon className="w-10 h-10 text-primary flex-shrink-0" />
                      <h2 className="text-2xl font-bold">{feature.title}</h2>
                    </div>
                    <p className="text-foreground/70 mb-6">{feature.description}</p>

                    <div className="space-y-2 mb-8">
                      {feature.benefits.map((benefit, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                          <span className="text-foreground/80">{benefit}</span>
                        </div>
                      ))}
                    </div>

                    <Button
                      onClick={() => router.push(feature.href)}
                      className="bg-primary hover:bg-primary/90 text-white"
                    >
                      Explore {feature.title}
                    </Button>
                  </div>

                  {/* Icon showcase */}
                  <div className="flex justify-center items-center">
                    <div className="relative w-64 h-64 flex items-center justify-center">
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full blur-2xl"></div>
                      <feature.icon className="w-32 h-32 text-primary/40 relative z-10" />
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Section */}
        <motion.div
          variants={itemVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mt-16 pt-12 border-t border-border"
        >
          <Card className="bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/30 p-12 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Start Your Journey?</h2>
            <p className="text-foreground/70 mb-8 max-w-2xl mx-auto">
              Take the first step by calculating your ECP score and discover universities that match your profile.
            </p>
            <Button
              size="lg"
              onClick={() => router.push('/calculator')}
              className="bg-primary hover:bg-primary/90 text-white gap-2 group"
            >
              Start ECP Calculator
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </Button>
          </Card>
        </motion.div>
      </main>
    </div>
  )
}
