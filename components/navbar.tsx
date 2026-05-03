'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { useStudent } from '@/lib/student-context'
import { Gauge, GraduationCap, LayoutDashboard, Menu, X } from 'lucide-react'
import { useState } from 'react'

interface NavbarProps {
  title?: string
}

export function Navbar({ title }: NavbarProps) {
  const router = useRouter()
  const { ecpResult, profile, studentId } = useStudent()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40 border-b border-white/[0.06] bg-black/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button onClick={() => router.push('/')} className="text-xl font-bold text-gradient-white tracking-tight">
              DISHA AI
            </button>
            {title && <span className="text-sm text-white/30 hidden sm:block">/ {title}</span>}
          </div>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            <Button variant="ghost" size="sm" onClick={() => router.push('/calculator')} className="text-white/50 hover:text-white hover:bg-white/5 gap-1.5 text-xs">
              <Gauge className="w-3.5 h-3.5" /> Calculator
            </Button>
            {studentId && (
              <Button variant="ghost" size="sm" onClick={() => router.push('/dashboard')} className="text-white/50 hover:text-white hover:bg-white/5 gap-1.5 text-xs">
                <LayoutDashboard className="w-3.5 h-3.5" /> Dashboard
              </Button>
            )}
            {ecpResult && (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] ml-2">
                <div className={`w-1.5 h-1.5 rounded-full ${ecpResult.tier === 'Green' ? 'bg-green-400' : ecpResult.tier === 'Amber' ? 'bg-amber-400' : 'bg-red-400'}`} />
                <span className="text-xs font-mono text-white/50">ECP {ecpResult.score}</span>
              </div>
            )}
          </nav>

          {/* Mobile menu button */}
          <Button size="icon" variant="ghost" onClick={() => setMenuOpen(!menuOpen)} className="md:hidden text-white/50 hover:text-white">
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden pt-3 pb-2 space-y-1 border-t border-white/[0.06] mt-3">
            <Button variant="ghost" size="sm" onClick={() => { router.push('/calculator'); setMenuOpen(false) }} className="w-full justify-start text-white/50 hover:text-white">
              Calculator
            </Button>
            {studentId && (
              <Button variant="ghost" size="sm" onClick={() => { router.push('/dashboard'); setMenuOpen(false) }} className="w-full justify-start text-white/50 hover:text-white">
                Dashboard
              </Button>
            )}
          </div>
        )}
      </div>
    </header>
  )
}
