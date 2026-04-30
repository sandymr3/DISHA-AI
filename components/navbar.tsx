'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Gauge, University, DollarSign, Home } from 'lucide-react'

interface NavbarProps {
  title?: string
  showHome?: boolean
}

export function Navbar({ title, showHome = true }: NavbarProps) {
  const router = useRouter()

  const navItems = [
    { icon: Home, label: 'Home', href: '/', show: showHome },
    { icon: Gauge, label: 'Calculator', href: '/calculator', show: true },
    { icon: University, label: 'Universities', href: '/dashboard', show: true },
    { icon: DollarSign, label: 'Loans', href: '/loans', show: true },
  ]

  return (
    <header className="relative z-10 border-b border-border/50 backdrop-blur-sm sticky top-0 bg-background/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              DISHA AI
            </h1>
            {title && <p className="text-foreground/60 text-sm">{title}</p>}
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex gap-2">
            {navItems
              .filter((item) => item.show)
              .map((item) => (
                <Button
                  key={item.href}
                  variant="ghost"
                  size="sm"
                  onClick={() => router.push(item.href)}
                  className="gap-2 hover:bg-primary/10"
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </Button>
              ))}
          </nav>

          {/* Mobile Navigation */}
          <div className="md:hidden flex gap-2">
            {navItems
              .filter((item) => item.show)
              .slice(0, 3)
              .map((item) => (
                <Button
                  key={item.href}
                  size="icon"
                  variant="ghost"
                  onClick={() => router.push(item.href)}
                  title={item.label}
                  className="hover:bg-primary/10"
                >
                  <item.icon className="w-4 h-4" />
                </Button>
              ))}
          </div>
        </div>
      </div>
    </header>
  )
}
