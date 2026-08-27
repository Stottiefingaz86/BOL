'use client'

import { useRouter } from 'next/navigation'
import { IconBrandX, IconRefresh, IconLifebuoy } from '@tabler/icons-react'

export default function LiveBettingPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Red top bar */}
      <div className="w-full h-1.5" style={{ backgroundColor: '#ee3536' }} />

      <div className="flex-1 flex flex-col md:flex-row items-center justify-center px-6 md:px-16 lg:px-24 py-12 md:py-0 gap-8 md:gap-16 max-w-7xl mx-auto w-full">
        {/* Left content */}
        <div className="flex-1 flex flex-col gap-6 max-w-xl">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#1a1a1a] leading-tight">
            Brand A Will Be Back Soon
          </h1>

          <p className="text-base md:text-lg text-[#333] leading-relaxed">
            We&apos;re busy updating brand-a.example with technology and features to enhance your experience.
          </p>

          <p className="text-base md:text-lg text-[#333] leading-relaxed font-semibold">
            We apologize for any inconvenience, and we greatly appreciate your patience.
          </p>

          <p className="text-base md:text-lg text-[#333] leading-relaxed font-semibold">
            Thank you for being a loyal Brand A Customer.
          </p>

          {/* Refresh button */}
          <div className="mt-2">
            <button
              onClick={() => router.push('/sports/football')}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-white font-medium text-sm transition-all hover:opacity-90 active:scale-[0.98] cursor-pointer"
              style={{ backgroundColor: '#ee3536' }}
            >
              <IconRefresh className="w-4 h-4" />
              Refresh
            </button>
          </div>

          {/* Follow us */}
          <div className="flex items-center gap-3 mt-2">
            <span className="text-sm text-[#666]">Follow us on X for live updates:</span>
            <a
              href="https://x.com/Brand A_AG"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-[#ee3536] hover:text-[#cc2d2e] transition-colors text-sm font-medium"
            >
              <IconBrandX className="w-5 h-5 text-[#1a1a1a]" />
              @Brand A_AG
            </a>
          </div>

          {/* Need help box */}
          <div className="mt-2 border border-[#e5e5e5] rounded-lg p-4 flex items-center gap-3">
            <IconLifebuoy className="w-5 h-5 text-[#ee3536] flex-shrink-0" />
            <span className="text-sm text-[#333]">
              <span className="font-semibold">Need help?</span>{' '}
              Go to the{' '}
              <a
                href="https://www.betonline.ag/help-center"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#ee3536] hover:text-[#cc2d2e] transition-colors font-medium"
              >
                Help Center
              </a>
            </span>
          </div>
        </div>

        {/* Right illustration */}
        <div className="flex-[1.4] flex items-center justify-center w-full">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/maintence_page/Group 3.svg"
            alt="Maintenance illustration"
            className="w-full h-auto max-w-none"
          />
        </div>
      </div>
    </div>
  )
}
