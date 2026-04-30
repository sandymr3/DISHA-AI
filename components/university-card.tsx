'use client'

import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { University } from '@/lib/types'
import { BookOpen, Globe, TrendingUp } from 'lucide-react'

interface UniversityCardProps {
  university: University
  index?: number
  onClick?: () => void
}

export function UniversityCard({ university, index = 0, onClick }: UniversityCardProps) {
  const getFundingColor = () => {
    switch (university.fundingAvailable) {
      case 'Full':
        return 'bg-green-500/20 text-green-400 border-green-500/30'
      case 'Partial':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
      default:
        return 'bg-red-500/20 text-red-400 border-red-500/30'
    }
  }

  const getRankingColor = () => {
    if (university.ranking <= 10) return 'text-primary'
    if (university.ranking <= 30) return 'text-secondary'
    return 'text-accent'
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      onClick={onClick}
      className="h-full cursor-pointer"
    >
      <Card className="bg-card border border-border/50 hover:border-primary/30 p-6 h-full flex flex-col group hover:shadow-lg hover:shadow-primary/10 transition-all duration-300 transform hover:scale-105">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-bold mb-1 group-hover:text-primary transition-colors">{university.name}</h3>
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-foreground/60" />
              <span className="text-sm text-foreground/60">{university.country}</span>
            </div>
          </div>
          <div className={`text-2xl font-bold ${getRankingColor()}`}>#{university.ranking}</div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-muted/20 rounded-lg p-3">
            <p className="text-xs text-foreground/60 mb-1">Avg Fees/Year</p>
            <p className="text-sm font-semibold">${university.avgFees.toLocaleString()}</p>
          </div>
          <div className="bg-muted/20 rounded-lg p-3">
            <p className="text-xs text-foreground/60 mb-1">Cutoff CGPA</p>
            <p className="text-sm font-semibold">{university.cutoffCGPA.toFixed(1)}</p>
          </div>
          <div className="bg-muted/20 rounded-lg p-3">
            <p className="text-xs text-foreground/60 mb-1">Cutoff ECP</p>
            <p className="text-sm font-semibold">{university.cutoffECP}</p>
          </div>
          <div className="bg-muted/20 rounded-lg p-3">
            <p className="text-xs text-foreground/60 mb-1">Program</p>
            <p className="text-sm font-semibold truncate">{university.program}</p>
          </div>
        </div>

        {/* Funding Badge */}
        <div className="mb-4">
          <Badge className={`${getFundingColor()} border`}>
            {university.fundingAvailable} Funding
          </Badge>
        </div>

        {/* Footer */}
        <div className="mt-auto pt-4 border-t border-border/30">
          <Button
            size="sm"
            variant="outline"
            className="w-full border-primary/30 hover:border-primary/50 hover:bg-primary/5 group"
          >
            <BookOpen className="w-4 h-4 mr-2" />
            View Details
          </Button>
        </div>
      </Card>
    </motion.div>
  )
}
