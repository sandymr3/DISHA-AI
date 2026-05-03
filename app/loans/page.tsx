'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function LoansPage() {
  const router = useRouter()
  // Redirect to dashboard loans tab
  useEffect(() => {
    router.replace('/dashboard?tab=loans')
  }, [router])
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <p className="text-white/30 text-sm">Redirecting to dashboard...</p>
    </div>
  )
}
