'use client'

import { useCallback, useEffect, useState, type ReactElement, type ReactNode } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import Image from 'next/image'
import {
  IconBrandSteam,
  IconBrandTelegram,
  IconBrandX,
  IconCheck,
  IconGift,
  IconMail,
  IconArrowRight,
  IconChevronDown,
  IconEye,
  IconEyeOff,
  IconInfoCircle,
  IconKey,
  IconX,
} from '@tabler/icons-react'
import { motion } from 'framer-motion'
import { Checkbox } from '@/components/ui/checkbox'
import { fireConfetti } from '@/lib/confetti'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { useAuthSession } from '@/hooks/use-auth-session'
import {
  AUTH_REQUEST_LOGIN_EVENT,
  AUTH_REQUEST_REGISTER_EVENT,
  consumePendingLogin,
  markOpenWalletAfterSignup,
} from '@/lib/auth-session'
import { cn } from '@/lib/utils'

export type AuthModalView = 'login' | 'createAccount' | 'createAccountConfirmation'

type AuthCountry = { iso: string; dial: string; label: string }

/** Dial-code list for the join form. Popular markets first, then A–Z. */
const AUTH_COUNTRY_OPTIONS: AuthCountry[] = [
  { iso: 'US', dial: '+1', label: 'United States' },
  { iso: 'CA', dial: '+1', label: 'Canada' },
  { iso: 'GB', dial: '+44', label: 'United Kingdom' },
  { iso: 'AU', dial: '+61', label: 'Australia' },
  { iso: 'MX', dial: '+52', label: 'Mexico' },
  { iso: 'BR', dial: '+55', label: 'Brazil' },
  { iso: 'AR', dial: '+54', label: 'Argentina' },
  { iso: 'AT', dial: '+43', label: 'Austria' },
  { iso: 'BE', dial: '+32', label: 'Belgium' },
  { iso: 'BO', dial: '+591', label: 'Bolivia' },
  { iso: 'BG', dial: '+359', label: 'Bulgaria' },
  { iso: 'CL', dial: '+56', label: 'Chile' },
  { iso: 'CN', dial: '+86', label: 'China' },
  { iso: 'CO', dial: '+57', label: 'Colombia' },
  { iso: 'CR', dial: '+506', label: 'Costa Rica' },
  { iso: 'HR', dial: '+385', label: 'Croatia' },
  { iso: 'CY', dial: '+357', label: 'Cyprus' },
  { iso: 'CZ', dial: '+420', label: 'Czechia' },
  { iso: 'DK', dial: '+45', label: 'Denmark' },
  { iso: 'DO', dial: '+1', label: 'Dominican Republic' },
  { iso: 'EC', dial: '+593', label: 'Ecuador' },
  { iso: 'EG', dial: '+20', label: 'Egypt' },
  { iso: 'SV', dial: '+503', label: 'El Salvador' },
  { iso: 'EE', dial: '+372', label: 'Estonia' },
  { iso: 'FI', dial: '+358', label: 'Finland' },
  { iso: 'FR', dial: '+33', label: 'France' },
  { iso: 'DE', dial: '+49', label: 'Germany' },
  { iso: 'GH', dial: '+233', label: 'Ghana' },
  { iso: 'GR', dial: '+30', label: 'Greece' },
  { iso: 'GT', dial: '+502', label: 'Guatemala' },
  { iso: 'HN', dial: '+504', label: 'Honduras' },
  { iso: 'HK', dial: '+852', label: 'Hong Kong' },
  { iso: 'HU', dial: '+36', label: 'Hungary' },
  { iso: 'IS', dial: '+354', label: 'Iceland' },
  { iso: 'IN', dial: '+91', label: 'India' },
  { iso: 'ID', dial: '+62', label: 'Indonesia' },
  { iso: 'IE', dial: '+353', label: 'Ireland' },
  { iso: 'IL', dial: '+972', label: 'Israel' },
  { iso: 'IT', dial: '+39', label: 'Italy' },
  { iso: 'JM', dial: '+1', label: 'Jamaica' },
  { iso: 'JP', dial: '+81', label: 'Japan' },
  { iso: 'KE', dial: '+254', label: 'Kenya' },
  { iso: 'KR', dial: '+82', label: 'South Korea' },
  { iso: 'LV', dial: '+371', label: 'Latvia' },
  { iso: 'LT', dial: '+370', label: 'Lithuania' },
  { iso: 'LU', dial: '+352', label: 'Luxembourg' },
  { iso: 'MY', dial: '+60', label: 'Malaysia' },
  { iso: 'MT', dial: '+356', label: 'Malta' },
  { iso: 'NL', dial: '+31', label: 'Netherlands' },
  { iso: 'NZ', dial: '+64', label: 'New Zealand' },
  { iso: 'NI', dial: '+505', label: 'Nicaragua' },
  { iso: 'NG', dial: '+234', label: 'Nigeria' },
  { iso: 'NO', dial: '+47', label: 'Norway' },
  { iso: 'PA', dial: '+507', label: 'Panama' },
  { iso: 'PY', dial: '+595', label: 'Paraguay' },
  { iso: 'PE', dial: '+51', label: 'Peru' },
  { iso: 'PH', dial: '+63', label: 'Philippines' },
  { iso: 'PL', dial: '+48', label: 'Poland' },
  { iso: 'PT', dial: '+351', label: 'Portugal' },
  { iso: 'PR', dial: '+1', label: 'Puerto Rico' },
  { iso: 'RO', dial: '+40', label: 'Romania' },
  { iso: 'SA', dial: '+966', label: 'Saudi Arabia' },
  { iso: 'RS', dial: '+381', label: 'Serbia' },
  { iso: 'SG', dial: '+65', label: 'Singapore' },
  { iso: 'SK', dial: '+421', label: 'Slovakia' },
  { iso: 'SI', dial: '+386', label: 'Slovenia' },
  { iso: 'ZA', dial: '+27', label: 'South Africa' },
  { iso: 'ES', dial: '+34', label: 'Spain' },
  { iso: 'SE', dial: '+46', label: 'Sweden' },
  { iso: 'CH', dial: '+41', label: 'Switzerland' },
  { iso: 'TW', dial: '+886', label: 'Taiwan' },
  { iso: 'TH', dial: '+66', label: 'Thailand' },
  { iso: 'TT', dial: '+1', label: 'Trinidad and Tobago' },
  { iso: 'TR', dial: '+90', label: 'Türkiye' },
  { iso: 'UA', dial: '+380', label: 'Ukraine' },
  { iso: 'AE', dial: '+971', label: 'United Arab Emirates' },
  { iso: 'UY', dial: '+598', label: 'Uruguay' },
  { iso: 'VE', dial: '+58', label: 'Venezuela' },
  { iso: 'VN', dial: '+84', label: 'Vietnam' },
]

/** Round flag — real flag artwork (flagcdn) cropped to a circle, not an emoji. */
function Flag({ iso, className }: { iso: string; className?: string }) {
  const code = iso.toLowerCase()
  return (
    <span
      className={cn(
        'relative inline-block size-5 shrink-0 overflow-hidden rounded-full ring-1 ring-white/15',
        className
      )}
      aria-hidden
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`https://flagcdn.com/w80/${code}.png`}
        srcSet={`https://flagcdn.com/w80/${code}.png 1x, https://flagcdn.com/w160/${code}.png 2x`}
        alt=""
        width={80}
        height={60}
        loading="lazy"
        draggable={false}
        className="absolute inset-0 h-full w-full object-cover"
      />
    </span>
  )
}

function MetamaskIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <path fill="#E2761B" d="M21.5 3 13.3 9.1l1.5-3.6z" />
      <path fill="#E4761B" d="M2.5 3l8.1 6.2-1.4-3.7zM18.6 16.6l-2.2 3.4 4.7 1.3 1.3-4.6zM1.6 16.7l1.3 4.6 4.7-1.3-2.2-3.4z" />
      <path fill="#E4761B" d="M7.3 10.6 6 12.6l4.6.2-.1-5zM16.7 10.6l-3.3-2.9-.1 5.1 4.6-.2zM7.6 20l2.8-1.4-2.4-1.9zM13.6 18.6l2.8 1.4-.4-3.3z" />
      <path fill="#D7C1B3" d="M16.4 20l-2.8-1.4.2 1.8v.8zM7.6 20l2.6 1.2v-.8l.2-1.8z" />
      <path fill="#233447" d="M10.3 15.5l-2.3-.7 1.6-.8zM13.7 15.5l.7-1.5 1.7.8z" />
      <path fill="#CD6116" d="M7.6 20l.4-3.4-2.6.1zM16 16.6l.4 3.4 2.2-3.3zM18 12.6l-4.6.2.4 2.7.7-1.5 1.7.8zM8 14.8l1.6-.8.7 1.5.4-2.7-4.6-.2z" />
      <path fill="#E4751F" d="M6 12.6l2 3.9-.1-1.7zM16.1 14.8l-.1 1.7 2-3.9zM10.6 12.8l-.4 2.7.5 2.8.1-3.7zM13.4 12.8l-.2 1.8.1 3.7.5-2.8z" />
      <path fill="#F6851B" d="M13.7 15.5l-.5 2.8.4.3 2.4-1.9.1-1.7zM8 14.8l.1 1.7 2.4 1.9.4-.3-.5-2.8z" />
      <path fill="#C0AD9E" d="M13.8 21.2v-.8l-.2-.2h-3.2l-.2.2v.8L7.6 20l.9.8 1.9 1.3h3.2l1.9-1.3.9-.8z" />
      <path fill="#161616" d="M13.6 18.6l-.4-.3h-2.4l-.4.3-.2 1.8.2-.2h3.2l.2.2z" />
      <path fill="#763D16" d="M21.8 9.5l.7-3.4L21.5 3l-8.2 6.1 3.2 2.7 4.5 1.3 1-1.2-.4-.3.7-.6-.5-.4.7-.5zM1.5 6.1l.7 3.4-.4.3.7.5-.5.4.7.6-.4.3 1 1.2 4.5-1.3 3.2-2.7L2.5 3z" />
      <path fill="#F6851B" d="M21 13.1l-4.5-1.3 1.3 2-2 3.9 2.6-.1h3.9zM7.3 11.8l-4.5 1.3-1.5 4.5h3.9l2.6.1-2-3.9zM13.4 12.8l.3-4.9 1.3-3.4H9.2l1.3 3.4.3 4.9.1 1.5v3.8h2.4v-3.8z" />
    </svg>
  )
}

function SolanaIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <defs>
        <linearGradient id="sol-g" x1="4" y1="20" x2="20" y2="4" gradientUnits="userSpaceOnUse">
          <stop stopColor="#9945FF" />
          <stop offset="1" stopColor="#14F195" />
        </linearGradient>
      </defs>
      <path
        fill="url(#sol-g)"
        d="M6.7 15.6a.6.6 0 0 1 .4-.2h14.3c.3 0 .4.3.2.5l-2.8 2.9a.6.6 0 0 1-.4.2H4.1c-.3 0-.4-.3-.2-.5zM6.7 5.2A.6.6 0 0 1 7.1 5h14.3c.3 0 .4.3.2.5l-2.8 2.9a.6.6 0 0 1-.4.2H4.1c-.3 0-.4-.3-.2-.5zM18.8 10.4a.6.6 0 0 0-.4-.2H4.1c-.3 0-.4.3-.2.5l2.8 2.9c.1.1.3.2.4.2h14.3c.3 0 .4-.3.2-.5z"
      />
    </svg>
  )
}

type SocialProvider = {
  id: string
  label: string
  Icon: (props: { className?: string }) => ReactElement
}

const SOCIAL_PROVIDERS: SocialProvider[] = [
  { id: 'steam', label: 'Steam', Icon: ({ className }) => <IconBrandSteam className={cn(className, 'text-white')} /> },
  { id: 'metamask', label: 'Metamask', Icon: MetamaskIcon },
  { id: 'google', label: 'Google', Icon: ({ className }) => <GoogleIcon className={className} /> },
  { id: 'telegram', label: 'Telegram', Icon: ({ className }) => <IconBrandTelegram className={cn(className, 'text-[#29A9EB]')} /> },
  { id: 'x', label: 'X', Icon: ({ className }) => <IconBrandX className={cn(className, 'text-white')} /> },
  { id: 'solana', label: 'Solana', Icon: SolanaIcon },
]

const LOGIN_PROVIDERS: SocialProvider[] = [
  ...SOCIAL_PROVIDERS,
  { id: 'passkey', label: 'Passkey', Icon: ({ className }) => <IconKey className={cn(className, 'text-white')} /> },
]

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.4h6.5a5.5 5.5 0 0 1-2.4 3.6v3h3.9c2.3-2.1 3.5-5.2 3.5-8.7z" />
      <path fill="#34A853" d="M12 24c3.2 0 6-1.1 8-2.9l-3.9-3a7.2 7.2 0 0 1-10.7-3.8H1.3v3.1A12 12 0 0 0 12 24z" />
      <path fill="#FBBC05" d="M5.4 14.3a7.2 7.2 0 0 1 0-4.6V6.6H1.3a12 12 0 0 0 0 10.8z" />
      <path fill="#EA4335" d="M12 4.8c1.8 0 3.4.6 4.6 1.8l3.5-3.5A12 12 0 0 0 1.3 6.6l4.1 3.1A7.2 7.2 0 0 1 12 4.8z" />
    </svg>
  )
}

const fieldClass =
  'h-12 w-full rounded-lg border border-white/[0.08] bg-[#262626] px-3.5 text-sm text-white placeholder:text-white/30 transition-colors focus:border-[#ee3536]/60 focus:outline-none focus:ring-2 focus:ring-[#ee3536]/20 [&:-webkit-autofill]:shadow-[inset_0_0_0px_1000px_#262626] [&:-webkit-autofill]:[-webkit-text-fill-color:#ffffff]'
const selectTriggerClass =
  'h-12 rounded-lg border border-white/[0.08] bg-[#262626] px-3 text-sm text-white transition-colors hover:border-white/15 focus:border-[#ee3536]/60 focus:outline-none focus:ring-2 focus:ring-[#ee3536]/20 flex items-center justify-between'
const labelClass = 'mb-2 block text-[13px] font-medium text-white/80'
const primaryBtnClass =
  'h-12 w-full rounded-lg bg-[#ee3536] text-sm font-semibold text-white shadow-[0_8px_24px_-8px_rgba(238,53,54,0.6)] transition-all hover:bg-[#ff4647] disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none'
const checkboxClass =
  'mt-0.5 size-5 shrink-0 rounded-[5px] border-white/25 bg-[#262626] data-[state=checked]:border-[#ee3536] data-[state=checked]:bg-[#ee3536]'

function Field({ label, children, error }: { label: string; children: ReactNode; error?: string }) {
  return (
    <div>
      <label className={labelClass}>{label}</label>
      {children}
      {error ? <p className="mt-1.5 text-xs text-[#ee3536]">{error}</p> : null}
    </div>
  )
}

function PasswordToggle({ visible, onToggle }: { visible: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/35 transition-colors hover:text-white/70"
      aria-label={visible ? 'Hide password' : 'Show password'}
    >
      {visible ? <IconEyeOff className="size-[18px]" /> : <IconEye className="size-[18px]" />}
    </button>
  )
}

/** Divider + full-width "Other … Options" menu pinned to the bottom of the form. */
function OtherOptionsMenu({
  heading,
  label,
  open,
  onOpenChange,
  options,
  onSelect,
}: {
  heading: string
  label: string
  open: boolean
  onOpenChange: (open: boolean) => void
  options: SocialProvider[]
  onSelect: (id: string) => void
}) {
  return (
    <div className="mt-auto pt-6">
      <div className="relative mb-4">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-white/[0.08]" />
        </div>
        <div className="relative flex justify-center">
          <span className="bg-[#1c1c1c] px-3 text-xs text-white/40">{heading}</span>
        </div>
      </div>
      <Popover modal open={open} onOpenChange={onOpenChange}>
        <PopoverTrigger asChild>
          <button
            type="button"
            className="flex h-12 w-full items-center gap-3 rounded-lg border border-white/[0.08] bg-[#262626] px-3.5 text-sm font-medium text-white transition-colors hover:border-white/15 hover:bg-[#2b2b2b]"
          >
            <span className="flex items-center">
              {options.map((prov, i) => (
                <span
                  key={prov.id}
                  className={cn(
                    'flex size-6 items-center justify-center rounded-full bg-[#333] ring-2 ring-[#262626]',
                    i > 0 && '-ml-1.5'
                  )}
                  style={{ zIndex: options.length - i }}
                >
                  <prov.Icon className="size-3.5" />
                </span>
              ))}
            </span>
            <span className="flex-1 text-left">{label}</span>
            <IconChevronDown
              className={cn('size-[18px] text-white/45 transition-transform', open && 'rotate-180')}
            />
          </button>
        </PopoverTrigger>
        <PopoverContent
          align="start"
          side="top"
          sideOffset={6}
          data-auth-modal-popover=""
          className="w-[var(--radix-popover-trigger-width)] rounded-lg border border-white/10 bg-[#262626] p-1.5 text-white shadow-2xl ring-1 ring-black/40"
        >
          <div className="grid grid-cols-2 gap-1">
            {options.map((prov) => (
              <button
                key={prov.id}
                type="button"
                onClick={() => onSelect(prov.id)}
                className="flex items-center gap-3 rounded-md px-3 py-2.5 text-left text-sm font-medium text-white transition-colors hover:bg-white/[0.07]"
              >
                <span className="flex size-8 items-center justify-center rounded-full bg-white/[0.06]">
                  <prov.Icon className="size-4" />
                </span>
                {prov.label}
              </button>
            ))}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}

function BrandPanel() {
  return (
    <div className="relative hidden w-[46%] shrink-0 overflow-hidden bg-[#ea3534] lg:block">
      {/* flat brand red with a soft light burst where the artwork begins */}
      <div className="absolute inset-0 bg-[linear-gradient(180deg,#f03b3c_0%,#e62c2d_50%,#c9191d_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_28%_at_50%_58%,rgba(255,150,140,0.55),transparent_100%)]" />
      {/* characters: all three in frame, fading up into the red */}
      <div
        className="absolute inset-x-0 bottom-0 aspect-[556/454] w-full"
        style={{
          maskImage: 'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.6) 22%, black 45%)',
          WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.6) 22%, black 45%)',
        }}
      >
        <Image
          src="/auth/welcome-offer-woman.png"
          alt=""
          fill
          className="object-cover object-[50%_100%]"
          sizes="520px"
          priority
        />
      </div>
      {/* legibility band behind the legal text */}
      <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/85 via-black/45 to-transparent" />

      <div className="relative z-10 flex h-full flex-col items-center px-9 pb-5 pt-7 text-center">
        <Image
          src="/logos/BetOnline/lettermark/white.svg"
          alt="BetOnline"
          width={169}
          height={128}
          className="h-8 w-auto object-contain"
          unoptimized
        />

        <div className="mt-9 flex flex-col items-center">
          <span className="inline-block rounded-sm bg-black px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-white">
            New players get
          </span>
          <h2 className="mt-4 text-[46px] font-black uppercase leading-[0.9] tracking-tight text-white">
            $250 in Free
            <br />
            Sports Bets
          </h2>
          <div className="mt-4 flex w-full max-w-[220px] items-center gap-3">
            <span className="h-px flex-1 bg-white/40" />
            <span className="text-[11px] font-bold uppercase tracking-[0.28em] text-white/90">Plus</span>
            <span className="h-px flex-1 bg-white/40" />
          </div>
          <p className="mt-3 text-[26px] font-black uppercase leading-none tracking-tight text-white">
            100 Free Spins
          </p>
          <p className="mt-1.5 text-[11px] font-bold uppercase tracking-[0.28em] text-white/85">in the casino</p>
          <p className="mt-5 max-w-[250px] text-[12px] leading-relaxed text-white/85">
            Make your first deposit and claim 10 free spins a day for 10 days.
          </p>
        </div>

        <p className="mt-auto max-w-[330px] text-[10.5px] leading-relaxed text-white/75">
          By accessing the site, I attest that I am at least 18 years old and have read the{' '}
          <span className="underline underline-offset-2">Terms and Conditions</span>.
        </p>
      </div>
    </div>
  )
}

export function AuthModal() {
  const { setLoggedIn } = useAuthSession()
  const [open, setOpen] = useState(false)
  const [view, setView] = useState<AuthModalView>('login')

  const [createAccountForm, setCreateAccountForm] = useState({
    email: '',
    password: '',
    countryIso: 'US',
    phone: '',
  })
  const [createAccountReferral, setCreateAccountReferral] = useState('')
  const [createAccountReferralOpen, setCreateAccountReferralOpen] = useState(false)
  const [createAccountTerms, setCreateAccountTerms] = useState(false)
  const [createAccountTouched, setCreateAccountTouched] = useState(false)
  const [createAccountPasswordVisible, setCreateAccountPasswordVisible] = useState(false)
  const [loginForm, setLoginForm] = useState({ identifier: '', password: '', keepLoggedIn: false })
  const [loginPasswordVisible, setLoginPasswordVisible] = useState(false)
  const [authCountryQuery, setAuthCountryQuery] = useState('')

  const [authCountryMenuOpen, setAuthCountryMenuOpen] = useState(false)
  const [socialMenuOpen, setSocialMenuOpen] = useState(false)

  const openModal = useCallback((next: AuthModalView = 'login') => {
    setView(next)
    setOpen(true)
  }, [])

  useEffect(() => {
    document.documentElement.dataset.authLoginBridge = 'true'
    if (consumePendingLogin()) openModal('login')

    const onLogin = () => openModal('login')
    const onRegister = () => openModal('createAccount')
    window.addEventListener(AUTH_REQUEST_LOGIN_EVENT, onLogin)
    window.addEventListener(AUTH_REQUEST_REGISTER_EVENT, onRegister)
    return () => {
      delete document.documentElement.dataset.authLoginBridge
      window.removeEventListener(AUTH_REQUEST_LOGIN_EVENT, onLogin)
      window.removeEventListener(AUTH_REQUEST_REGISTER_EVENT, onRegister)
    }
  }, [openModal])

  const createAccountErrors = {
    email: /\S+@\S+\.\S+/.test(createAccountForm.email.trim()) ? '' : 'Please enter a valid email',
    password: createAccountForm.password.trim().length >= 6 ? '' : 'Use at least 6 characters',
    phone: createAccountForm.phone.trim().length >= 7 ? '' : 'Please enter a valid phone number',
  }
  const isCreateAccountStepValid =
    Object.values(createAccountErrors).every((value) => value === '') && createAccountTerms
  const canSubmitLogin = loginForm.identifier.trim().length > 0 && loginForm.password.trim().length >= 6
  const selectedAuthCountry =
    AUTH_COUNTRY_OPTIONS.find((o) => o.iso === createAccountForm.countryIso) ?? AUTH_COUNTRY_OPTIONS[0]
  const filteredAuthCountries = (() => {
    const q = authCountryQuery.trim().toLowerCase()
    if (!q) return AUTH_COUNTRY_OPTIONS
    return AUTH_COUNTRY_OPTIONS.filter(
      (o) => o.label.toLowerCase().includes(q) || o.dial.includes(q) || o.iso.toLowerCase() === q
    )
  })()

  useEffect(() => {
    if (!open) {
      setAuthCountryMenuOpen(false)
      setSocialMenuOpen(false)
    }
  }, [open])

  useEffect(() => {
    if (!authCountryMenuOpen) setAuthCountryQuery('')
  }, [authCountryMenuOpen])

  // Celebrate: two side cannons + a centre pop when the account is created
  useEffect(() => {
    if (!open || view !== 'createAccountConfirmation') return
    const colors = ['#ee3536', '#ffffff', '#ffb3b3', '#ff7a7a']
    const timers = [
      window.setTimeout(() => {
        fireConfetti({ particleCount: 90, angle: 60, spread: 60, startVelocity: 55, origin: { x: 0.12, y: 0.65 }, colors, ticks: 220 })
        fireConfetti({ particleCount: 90, angle: 120, spread: 60, startVelocity: 55, origin: { x: 0.88, y: 0.65 }, colors, ticks: 220 })
      }, 120),
      window.setTimeout(() => {
        fireConfetti({ particleCount: 120, spread: 100, startVelocity: 40, gravity: 0.9, scalar: 1.05, origin: { x: 0.5, y: 0.45 }, colors, ticks: 240 })
      }, 420),
    ]
    return () => timers.forEach(clearTimeout)
  }, [open, view])

  const resetCreateAccount = () => {
    setCreateAccountTouched(false)
    setCreateAccountPasswordVisible(false)
    setCreateAccountReferral('')
    setCreateAccountReferralOpen(false)
    setCreateAccountTerms(false)
    setCreateAccountForm({
      email: '',
      password: '',
      countryIso: 'US',
      phone: '',
    })
  }

  const finishLogin = useCallback(() => {
    setLoggedIn(true)
    setOpen(false)
    setView('login')
  }, [setLoggedIn])

  /** First signup only — stay on current page and open normal wallet deposit UI. */
  const finishSignup = useCallback(() => {
    markOpenWalletAfterSignup()
    finishLogin()
  }, [finishLogin])

  const handleLoginWithPasskey = useCallback(async () => {
    if (
      typeof window !== 'undefined' &&
      typeof PublicKeyCredential !== 'undefined' &&
      typeof navigator.credentials?.get === 'function'
    ) {
      try {
        const challenge = new Uint8Array(32)
        crypto.getRandomValues(challenge)
        const rpId = window.location.hostname.replace(/^www\./, '')
        const credential = await navigator.credentials.get({
          publicKey: {
            challenge,
            rpId,
            timeout: 60_000,
            userVerification: 'preferred',
            allowCredentials: [],
          },
        })
        if (credential) {
          finishLogin()
          return
        }
      } catch {
        // fall through — demo still allows finish
      }
    }
    finishLogin()
  }, [finishLogin])

  const tabs = (
    <div className="flex gap-6">
      {(
        [
          ['login', 'Login'],
          ['createAccount', 'Register'],
        ] as const
      ).map(([id, label]) => {
        const active = view === id
        return (
          <button
            key={id}
            type="button"
            onClick={() => setView(id)}
            className={cn(
              'relative pb-3 text-[15px] font-semibold transition-colors',
              active ? 'text-white' : 'text-white/45 hover:text-white/75'
            )}
          >
            {label}
            {active ? <span className="absolute inset-x-0 bottom-0 h-0.5 rounded-full bg-[#ee3536]" /> : null}
          </button>
        )
      })}
    </div>
  )

  return (
    <Dialog.Root
      open={open}
      onOpenChange={(next) => {
        setOpen(next)
        if (!next) {
          setAuthCountryMenuOpen(false)
          if (view === 'createAccountConfirmation') {
            resetCreateAccount()
            setView('login')
          }
        }
      }}
    >
      <Dialog.Portal container={typeof document !== 'undefined' ? document.body : undefined}>
        <Dialog.Overlay
          data-auth-modal-overlay=""
          className="fixed inset-0 bg-black/75 backdrop-blur-md"
          style={{ pointerEvents: 'auto' }}
        />
        <Dialog.Content
          data-auth-modal-content=""
          className="fixed left-1/2 top-1/2 flex h-[min(92dvh,760px)] w-[min(1040px,calc(100vw-1.5rem))] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-2xl bg-[#1c1c1c] text-white shadow-2xl outline-none ring-1 ring-white/10"
          style={{ pointerEvents: 'auto' }}
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          <Dialog.Title className="sr-only">
            {view === 'login' ? 'Log in' : view === 'createAccount' ? 'Create account' : 'Account created'}
          </Dialog.Title>
          <Dialog.Description className="sr-only">Sign in or create a Brand A account</Dialog.Description>

          <BrandPanel />

          <div className="flex min-h-0 min-w-0 flex-1 flex-col">
            <div className="flex shrink-0 items-start justify-between gap-3 border-b border-white/[0.08] px-7 pt-6 sm:px-9">
              {view === 'createAccountConfirmation' ? (
                <h2 className="pb-3 text-[15px] font-semibold text-white">You&apos;re in</h2>
              ) : (
                tabs
              )}
              <Dialog.Close asChild>
                <button
                  type="button"
                  className="-mt-1 flex size-8 items-center justify-center rounded-full bg-white/[0.07] text-white/70 transition-colors hover:bg-white/15 hover:text-white"
                  aria-label="Close"
                >
                  <IconX className="size-4" />
                </button>
              </Dialog.Close>
            </div>

            <div className="flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain px-7 pb-7 pt-7 sm:px-9">
              {view === 'login' ? (
                <>
                  <h3 className="text-[22px] font-bold tracking-tight text-white">Welcome back</h3>
                  <div className="mt-6 space-y-5">
                    <Field label="Email or Account Number">
                      <input
                        value={loginForm.identifier}
                        onChange={(e) => setLoginForm((prev) => ({ ...prev, identifier: e.target.value }))}
                        autoComplete="username"
                        className={fieldClass}
                        aria-label="Email or account number"
                      />
                    </Field>
                    <Field label="Password">
                      <div className="relative">
                        <input
                          type={loginPasswordVisible ? 'text' : 'password'}
                          value={loginForm.password}
                          onChange={(e) => setLoginForm((prev) => ({ ...prev, password: e.target.value }))}
                          autoComplete="current-password"
                          className={cn(fieldClass, 'pr-11')}
                          aria-label="Password"
                        />
                        <PasswordToggle
                          visible={loginPasswordVisible}
                          onToggle={() => setLoginPasswordVisible((v) => !v)}
                        />
                      </div>
                    </Field>
                    <div className="flex items-center justify-between">
                      <label className="flex cursor-pointer items-center gap-2.5">
                        <Checkbox
                          checked={loginForm.keepLoggedIn}
                          onCheckedChange={(checked) =>
                            setLoginForm((prev) => ({ ...prev, keepLoggedIn: checked === true }))
                          }
                          className={cn(checkboxClass, 'mt-0')}
                        />
                        <span className="text-sm text-white/70">Keep me logged in</span>
                        <Popover>
                          <PopoverTrigger asChild>
                            <button type="button" className="text-white/35 hover:text-white/65" aria-label="About keep me logged in">
                              <IconInfoCircle className="size-4" />
                            </button>
                          </PopoverTrigger>
                          <PopoverContent
                            align="center"
                            side="top"
                            data-auth-modal-popover=""
                            className="w-[300px] border border-white/10 bg-[#262626] p-4 text-white/90 shadow-xl"
                          >
                            <p className="text-sm leading-relaxed">
                              Choosing <span className="font-semibold text-white">&quot;Keep me logged in&quot;</span>{' '}
                              reduces how often you&apos;re asked to sign in on this device.
                            </p>
                          </PopoverContent>
                        </Popover>
                      </label>
                      <button type="button" className="text-[13px] font-medium text-[#ff5a5a] hover:text-white">
                        Forgot password?
                      </button>
                    </div>
                    <button type="button" disabled={!canSubmitLogin} className={primaryBtnClass} onClick={finishLogin}>
                      Log in
                    </button>
                  </div>

                  <OtherOptionsMenu
                    heading="Or sign in with"
                    label="Other Sign In Options"
                    open={socialMenuOpen}
                    onOpenChange={setSocialMenuOpen}
                    options={LOGIN_PROVIDERS}
                    onSelect={(id) => {
                      setSocialMenuOpen(false)
                      if (id === 'passkey') void handleLoginWithPasskey()
                      else finishLogin()
                    }}
                  />
                </>
              ) : view === 'createAccount' ? (
                <>
                  <h3 className="text-[22px] font-bold tracking-tight text-white">Create an Account</h3>
                  <div className="mt-6 space-y-5">
                    <Field label="Email Address" error={createAccountTouched ? createAccountErrors.email : undefined}>
                      <input
                        type="email"
                        value={createAccountForm.email}
                        onChange={(e) => setCreateAccountForm((prev) => ({ ...prev, email: e.target.value }))}
                        autoComplete="email"
                        className={fieldClass}
                        aria-label="Email address"
                      />
                    </Field>
                    <Field label="Password" error={createAccountTouched ? createAccountErrors.password : undefined}>
                      <div className="relative">
                        <input
                          type={createAccountPasswordVisible ? 'text' : 'password'}
                          value={createAccountForm.password}
                          onChange={(e) => setCreateAccountForm((prev) => ({ ...prev, password: e.target.value }))}
                          autoComplete="new-password"
                          className={cn(fieldClass, 'pr-11')}
                          aria-label="Create password"
                        />
                        <PasswordToggle
                          visible={createAccountPasswordVisible}
                          onToggle={() => setCreateAccountPasswordVisible((v) => !v)}
                        />
                      </div>
                    </Field>
                    <Field label="Mobile Number" error={createAccountTouched ? createAccountErrors.phone : undefined}>
                      <div className="flex gap-2">
                        <Popover modal open={authCountryMenuOpen} onOpenChange={setAuthCountryMenuOpen}>
                          <PopoverTrigger asChild>
                            <button
                              type="button"
                              aria-haspopup="listbox"
                              title={selectedAuthCountry.label}
                              className={cn(selectTriggerClass, 'shrink-0 gap-2')}
                              aria-label={`Dial code ${selectedAuthCountry.dial}, ${selectedAuthCountry.label}`}
                            >
                              <Flag iso={selectedAuthCountry.iso} />
                              <span className="text-sm font-semibold tabular-nums text-white">
                                {selectedAuthCountry.dial}
                              </span>
                              <IconChevronDown
                                className={cn(
                                  'size-4 shrink-0 text-white/45 transition-transform',
                                  authCountryMenuOpen && 'rotate-180'
                                )}
                              />
                            </button>
                          </PopoverTrigger>
                          <PopoverContent
                            align="start"
                            sideOffset={4}
                            data-auth-modal-popover=""
                            role="listbox"
                            aria-label="Select country"
                            className="w-[300px] overflow-hidden rounded-lg border border-white/10 bg-[#262626] p-0 py-1 text-white shadow-2xl ring-1 ring-black/40"
                          >
                            <div className="px-2 pb-1 pt-1">
                              <input
                                value={authCountryQuery}
                                onChange={(e) => setAuthCountryQuery(e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter' && filteredAuthCountries[0]) {
                                    e.preventDefault()
                                    setCreateAccountForm((prev) => ({ ...prev, countryIso: filteredAuthCountries[0].iso }))
                                    setAuthCountryMenuOpen(false)
                                  }
                                }}
                                placeholder="Search country or code"
                                aria-label="Search country"
                                className="h-9 w-full rounded-md border border-white/10 bg-[#1c1c1c] px-2.5 text-sm text-white placeholder:text-white/35 focus:outline-none focus:ring-2 focus:ring-white/15"
                              />
                            </div>
                            <div className="max-h-64 overflow-y-auto overscroll-contain">
                              {filteredAuthCountries.length === 0 && (
                                <p className="px-3 py-3 text-sm text-white/40">No matches</p>
                              )}
                              {filteredAuthCountries.map((opt) => (
                                <button
                                  key={opt.iso}
                                  type="button"
                                  role="option"
                                  aria-selected={createAccountForm.countryIso === opt.iso}
                                  className={cn(
                                    'flex w-full items-center gap-2.5 px-3 py-2 text-left text-sm text-white hover:bg-white/10',
                                    createAccountForm.countryIso === opt.iso && 'bg-white/5'
                                  )}
                                  onClick={() => {
                                    setCreateAccountForm((prev) => ({ ...prev, countryIso: opt.iso }))
                                    setAuthCountryMenuOpen(false)
                                  }}
                                >
                                  <Flag iso={opt.iso} />
                                  <span className="flex-1 truncate">{opt.label}</span>
                                  <span className="tabular-nums text-white/45">{opt.dial}</span>
                                </button>
                              ))}
                            </div>
                          </PopoverContent>
                        </Popover>
                        <input
                          type="tel"
                          value={createAccountForm.phone}
                          onChange={(e) => setCreateAccountForm((prev) => ({ ...prev, phone: e.target.value }))}
                          autoComplete="tel"
                          className={fieldClass}
                          aria-label="Mobile number"
                        />
                      </div>
                    </Field>

                    <div>
                      <button
                        type="button"
                        onClick={() => setCreateAccountReferralOpen((o) => !o)}
                        aria-expanded={createAccountReferralOpen}
                        className="flex w-full items-center justify-between border-b border-white/[0.08] pb-2.5 text-[13px] font-medium text-white/80 transition-colors hover:text-white"
                      >
                        <span>
                          Referral Code <span className="font-normal italic text-white/45">(optional)</span>
                        </span>
                        <IconChevronDown
                          className={cn(
                            'size-4 text-white/45 transition-transform',
                            createAccountReferralOpen && 'rotate-180'
                          )}
                        />
                      </button>
                      {createAccountReferralOpen ? (
                        <input
                          value={createAccountReferral}
                          onChange={(e) => setCreateAccountReferral(e.target.value.toUpperCase())}
                          placeholder="Enter code"
                          className={cn(fieldClass, 'mt-3 uppercase tracking-wider placeholder:normal-case placeholder:tracking-normal')}
                          aria-label="Referral code"
                          autoFocus
                        />
                      ) : null}
                    </div>

                    <label className="flex cursor-pointer items-start gap-3">
                      <Checkbox
                        checked={createAccountTerms}
                        onCheckedChange={(checked) => setCreateAccountTerms(checked === true)}
                        className={checkboxClass}
                      />
                      <span className="text-[13px] leading-relaxed text-white/65">
                        I acknowledge that I am over the age of 18 and agree to the{' '}
                        <span className="font-medium text-[#ff5a5a]">Terms and Conditions</span>
                      </span>
                    </label>

                    <button
                      type="button"
                      onClick={() => {
                        setCreateAccountTouched(true)
                        if (!isCreateAccountStepValid) return
                        setView('createAccountConfirmation')
                      }}
                      disabled={!isCreateAccountStepValid}
                      className={primaryBtnClass}
                    >
                      Create Account
                    </button>
                  </div>

                  <OtherOptionsMenu
                    heading="Or sign up with"
                    label="Other Sign Up Options"
                    open={socialMenuOpen}
                    onOpenChange={setSocialMenuOpen}
                    options={SOCIAL_PROVIDERS}
                    onSelect={() => {
                      setSocialMenuOpen(false)
                      resetCreateAccount()
                      finishSignup()
                    }}
                  />
                </>
              ) : (
                <div className="flex flex-1 flex-col items-center justify-center py-2 text-center">
                  <motion.div
                    initial={{ scale: 0.4, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: 'spring', stiffness: 320, damping: 18, delay: 0.05 }}
                    className="relative"
                  >
                    <span className="absolute inset-0 -m-4 rounded-full bg-[#ee3536]/25 blur-2xl" />
                    <span className="absolute inset-0 -m-2 animate-ping rounded-full bg-[#ee3536]/30 [animation-duration:1.6s] [animation-iteration-count:3]" />
                    <span className="relative flex size-20 items-center justify-center rounded-full bg-gradient-to-br from-[#ff5758] to-[#c81e1f] shadow-[0_12px_40px_-10px_rgba(238,53,54,0.9)]">
                      <motion.span
                        initial={{ scale: 0, rotate: -30 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 16, delay: 0.25 }}
                      >
                        <IconCheck className="size-10 text-white" stroke={3} />
                      </motion.span>
                    </span>
                  </motion.div>

                  <motion.div
                    initial={{ y: 12, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.35 }}
                    className="mt-7"
                  >
                    <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#ff5a5a]">Welcome to the club</p>
                    <h3 className="mt-2 text-[30px] font-black leading-tight tracking-tight text-white">
                      Your account has
                      <br />
                      been created!
                    </h3>
                  </motion.div>

                  <motion.div
                    initial={{ y: 12, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.45, duration: 0.35 }}
                    className="relative mt-7 w-full overflow-hidden rounded-xl border border-white/[0.08] bg-[#262626] p-3.5 text-left"
                  >
                    <div className="pointer-events-none absolute -left-8 -top-10 size-32 rounded-full bg-[#ee3536]/20 blur-2xl" />
                    <div className="relative flex items-start gap-3">
                      <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-white/[0.06] ring-1 ring-white/[0.08]">
                        <IconGift className="size-5 text-[#ff5a5a]" stroke={1.75} />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/45">Welcome offer</p>
                        <p className="mt-1 text-[13px] font-bold leading-snug text-white">
                          $250 in Free Sports Bets <span className="font-normal text-white/45">+</span> 100 Free Spins
                        </p>
                        <p className="mt-1 text-[11px] leading-snug text-white/60">
                          Applied automatically to your first deposit.
                        </p>
                      </div>
                    </div>
                  </motion.div>

                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6, duration: 0.3 }}
                    className="mt-4 flex items-center justify-center gap-1.5 text-xs text-white/50"
                  >
                    <IconMail className="size-3.5" />
                    Activation link sent to{' '}
                    <span className="font-medium text-white/80">{createAccountForm.email || 'your email'}</span>
                  </motion.p>

                  <motion.button
                    initial={{ y: 12, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.55, duration: 0.35 }}
                    type="button"
                    onClick={() => {
                      resetCreateAccount()
                      finishSignup()
                    }}
                    className={cn(primaryBtnClass, 'mt-7 flex items-center justify-center gap-2 text-[15px]')}
                  >
                    Let&apos;s Go
                    <IconArrowRight className="size-[18px]" />
                  </motion.button>
                </div>
              )}
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

export default AuthModal
