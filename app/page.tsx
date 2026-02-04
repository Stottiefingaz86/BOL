'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function HomePage() {
  const router = useRouter()

  useEffect(() => {
    router.push('/casino')
  }, [router])

  return (
    <div className="h-screen w-screen bg-[#0a0a0a] flex items-center justify-center">
      <div className="text-white">Redirecting to casino...</div>
    </div>
  )
}
