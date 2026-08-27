'use client'

import { createPortal } from 'react-dom'
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import Image from 'next/image'
import {
  IconCheck,
  IconChevronDown,
  IconEye,
  IconEyeOff,
  IconInfoCircle,
  IconKey,
  IconLock,
  IconShield,
  IconX,
} from '@tabler/icons-react'
import { Checkbox } from '@/components/ui/checkbox'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { useAuthSession } from '@/hooks/use-auth-session'
import {
  AUTH_REQUEST_LOGIN_EVENT,
  AUTH_REQUEST_REGISTER_EVENT,
  consumePendingLogin,
} from '@/lib/auth-session'
import { cn } from '@/lib/utils'

export type AuthModalView = 'login' | 'createAccount' | 'createAccountConfirmation'

const AUTH_COUNTRY_OPTIONS = [
  { iso: 'US', dial: '+1', label: 'United States' },
  { iso: 'CA', dial: '+1', label: 'Canada' },
] as const

const fieldClass =
  'h-11 w-full rounded-lg border border-white/12 bg-[#1a1a1a] px-3 text-sm text-white placeholder:text-white/35 focus:outline-none focus:ring-2 focus:ring-white/15 focus:border-white/22 [&:-webkit-autofill]:shadow-[inset_0_0_0px_1000px_#1a1a1a] [&:-webkit-autofill]:[-webkit-text-fill-color:#ffffff]'
const selectTriggerClass =
  'h-11 w-full rounded-lg border border-white/12 bg-[#1a1a1a] px-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-white/15 focus:border-white/22 flex items-center justify-between'
const fieldsClass = 'space-y-3'
const primaryBtnClass =
  'w-full h-12 rounded-lg font-semibold text-white bg-gradient-to-r from-[#ee3536] to-[#c42a2a] hover:opacity-95 shadow-md shadow-black/20 disabled:opacity-40 disabled:cursor-not-allowed transition-opacity'

function BrandPanel() {
  return (
    <div className="relative hidden min-h-[560px] w-[42%] overflow-hidden bg-[#141414] lg:block">
      <Image
        src="/banners/new_home.png"
        alt=""
        fill
        className="object-cover object-center opacity-90"
        sizes="420px"
        priority
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/55 to-black/25" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,rgba(238,53,54,0.28),transparent_55%)]" />
      <div className="relative z-10 flex h-full flex-col justify-between p-8">
        <div className="flex flex-1 flex-col items-center justify-center text-center">
          <Image
            src="/banners/beton.png"
            alt="Brand A"
            width={320}
            height={100}
            className="h-20 w-auto object-contain sm:h-24"
            unoptimized
          />
          <p className="mt-5 max-w-[260px] text-sm leading-relaxed text-white/75">
            Join millions of players. Faster payouts, bigger bonuses, VIP rewards.
          </p>
        </div>
        <p className="text-center text-[11px] leading-relaxed text-white/45">
          By accessing the site, I attest that I am at least 18 years old and have read the Terms and
          Conditions.
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
    countryIso: 'US' as 'US' | 'CA',
    phone: '',
    dob: '',
  })
  const [createAccountAlias, setCreateAccountAlias] = useState('')
  const [createAccountTouched, setCreateAccountTouched] = useState(false)
  const [createAccountPasswordVisible, setCreateAccountPasswordVisible] = useState(false)
  const [loginForm, setLoginForm] = useState({ identifier: '', password: '', keepLoggedIn: false })
  const [loginPasswordVisible, setLoginPasswordVisible] = useState(false)
  const [createAccountDob, setCreateAccountDob] = useState({ day: '', month: '', year: '' })

  const authCountryTriggerRef = useRef<HTMLButtonElement>(null)
  const authCountryListRef = useRef<HTMLDivElement>(null)
  const [authCountryMenuOpen, setAuthCountryMenuOpen] = useState(false)
  const [authCountryMenuRect, setAuthCountryMenuRect] = useState<{
    top: number
    left: number
    width: number
  } | null>(null)

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
    dob: createAccountForm.dob.trim().length > 0 ? '' : 'Please add your date of birth',
  }
  const createAccountDobDayNum = Number(createAccountDob.day)
  const createAccountDobMonthNum = Number(createAccountDob.month)
  const createAccountDobYearNum = Number(createAccountDob.year)
  const currentYear = new Date().getFullYear()
  const isCreateAccountDobValid =
    createAccountDob.day.length === 2 &&
    createAccountDob.month.length === 2 &&
    createAccountDob.year.length === 4 &&
    createAccountDobDayNum >= 1 &&
    createAccountDobDayNum <= 31 &&
    createAccountDobMonthNum >= 1 &&
    createAccountDobMonthNum <= 12 &&
    createAccountDobYearNum >= 1900 &&
    createAccountDobYearNum <= currentYear
  createAccountErrors.dob = isCreateAccountDobValid ? '' : 'Please add a valid date of birth'
  const isCreateAccountStepValid = Object.values(createAccountErrors).every((value) => value === '')
  const canSubmitLogin = loginForm.identifier.trim().length > 0 && loginForm.password.trim().length >= 6
  const selectedAuthCountry =
    AUTH_COUNTRY_OPTIONS.find((o) => o.iso === createAccountForm.countryIso) ?? AUTH_COUNTRY_OPTIONS[0]

  const updateAuthCountryMenuRect = useCallback(() => {
    const el = authCountryTriggerRef.current
    if (!el) return
    const r = el.getBoundingClientRect()
    setAuthCountryMenuRect({ top: r.bottom + 4, left: r.left, width: Math.max(r.width, 200) })
  }, [])

  useLayoutEffect(() => {
    if (!authCountryMenuOpen) {
      setAuthCountryMenuRect(null)
      return
    }
    updateAuthCountryMenuRect()
    window.addEventListener('resize', updateAuthCountryMenuRect)
    window.addEventListener('scroll', updateAuthCountryMenuRect, true)
    return () => {
      window.removeEventListener('resize', updateAuthCountryMenuRect)
      window.removeEventListener('scroll', updateAuthCountryMenuRect, true)
    }
  }, [authCountryMenuOpen, updateAuthCountryMenuRect])

  useEffect(() => {
    if (!authCountryMenuOpen) return
    const onPointerDown = (e: MouseEvent) => {
      const t = e.target as Node
      if (authCountryTriggerRef.current?.contains(t)) return
      if (authCountryListRef.current?.contains(t)) return
      setAuthCountryMenuOpen(false)
    }
    document.addEventListener('mousedown', onPointerDown)
    return () => document.removeEventListener('mousedown', onPointerDown)
  }, [authCountryMenuOpen])

  useEffect(() => {
    if (!open) {
      setAuthCountryMenuOpen(false)
      return
    }
    // Sync DOB string when parts change
    if (isCreateAccountDobValid) {
      setCreateAccountForm((prev) => ({
        ...prev,
        dob: `${createAccountDob.year}-${createAccountDob.month}-${createAccountDob.day}`,
      }))
    }
  }, [open, createAccountDob, isCreateAccountDobValid])

  const resetCreateAccount = () => {
    setCreateAccountTouched(false)
    setCreateAccountPasswordVisible(false)
    setCreateAccountDob({ day: '', month: '', year: '' })
    setCreateAccountAlias('')
    setCreateAccountForm({
      email: '',
      password: '',
      countryIso: 'US',
      phone: '',
      dob: '',
    })
  }

  const finishLogin = useCallback(() => {
    setLoggedIn(true)
    setOpen(false)
    setView('login')
  }, [setLoggedIn])

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
          className="fixed inset-0 bg-black/70 backdrop-blur-md"
          style={{ pointerEvents: 'auto' }}
        />
        <Dialog.Content
          data-auth-modal-content=""
          className={cn(
            'fixed left-1/2 top-1/2 flex w-[min(920px,calc(100vw-1.5rem))] max-h-[min(90dvh,720px)] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-2xl border border-white/10 bg-[#262626] text-white shadow-2xl outline-none'
          )}
          style={{ pointerEvents: 'auto' }}
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          <Dialog.Title className="sr-only">
            {view === 'login' ? 'Log in' : view === 'createAccount' ? 'Create account' : 'Confirm email'}
          </Dialog.Title>
          <Dialog.Description className="sr-only">
            Sign in or create a Brand A account
          </Dialog.Description>

          <BrandPanel />

          <div className="flex min-h-0 min-w-0 flex-1 flex-col">
            <div className="flex shrink-0 items-center justify-between gap-3 border-b border-white/10 px-5 py-4">
              {view === 'createAccountConfirmation' ? (
                <h2 className="text-base font-bold text-white">Confirm your email</h2>
              ) : (
                <div className="flex gap-5">
                  <button
                    type="button"
                    onClick={() => setView('login')}
                    className={cn(
                      'relative pb-1 text-sm font-semibold transition-colors',
                      view === 'login' ? 'text-white' : 'text-white/45 hover:text-white/70'
                    )}
                  >
                    Login
                    {view === 'login' ? (
                      <span className="absolute inset-x-0 -bottom-px h-0.5 rounded-full bg-[#ee3536]" />
                    ) : null}
                  </button>
                  <button
                    type="button"
                    onClick={() => setView('createAccount')}
                    className={cn(
                      'relative pb-1 text-sm font-semibold transition-colors',
                      view === 'createAccount' ? 'text-white' : 'text-white/45 hover:text-white/70'
                    )}
                  >
                    Register
                    {view === 'createAccount' ? (
                      <span className="absolute inset-x-0 -bottom-px h-0.5 rounded-full bg-[#ee3536]" />
                    ) : null}
                  </button>
                </div>
              )}
              <Dialog.Close asChild>
                <button
                  type="button"
                  className="flex size-8 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white/70 transition-colors hover:bg-white/10 hover:text-white"
                  aria-label="Close"
                >
                  <IconX className="size-4" />
                </button>
              </Dialog.Close>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-5">
              {view === 'login' ? (
                <div className="mx-auto w-full max-w-md space-y-4">
                  <div>
                    <h3 className="text-xl font-bold text-white">Welcome back</h3>
                    <p className="mt-1 text-xs text-white/50">Sign in to pick up where you left off.</p>
                  </div>
                  <div className={fieldsClass}>
                    <input
                      value={loginForm.identifier}
                      onChange={(e) => setLoginForm((prev) => ({ ...prev, identifier: e.target.value }))}
                      placeholder="Email or account number"
                      autoComplete="username"
                      className={fieldClass}
                      aria-label="Email or account number"
                    />
                    <div className="relative">
                      <input
                        type={loginPasswordVisible ? 'text' : 'password'}
                        value={loginForm.password}
                        onChange={(e) => setLoginForm((prev) => ({ ...prev, password: e.target.value }))}
                        placeholder="Password"
                        autoComplete="current-password"
                        className={`${fieldClass} pr-10`}
                        aria-label="Password"
                      />
                      <button
                        type="button"
                        onClick={() => setLoginPasswordVisible((prev) => !prev)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70"
                        aria-label={loginPasswordVisible ? 'Hide password' : 'Show password'}
                      >
                        {loginPasswordVisible ? <IconEyeOff className="h-4 w-4" /> : <IconEye className="h-4 w-4" />}
                      </button>
                    </div>
                    <div className="flex items-center justify-between pt-0.5">
                      <label className="flex cursor-pointer items-center gap-2">
                        <Checkbox
                          checked={loginForm.keepLoggedIn}
                          onCheckedChange={(checked) =>
                            setLoginForm((prev) => ({ ...prev, keepLoggedIn: checked === true }))
                          }
                          className="h-5 w-5 rounded-[4px] border-white/25 bg-[#1a1a1a] data-[state=checked]:border-[#ee3536] data-[state=checked]:bg-[#ee3536]"
                        />
                        <span className="text-sm text-white/70">Keep me logged in</span>
                        <Popover>
                          <PopoverTrigger asChild>
                            <button type="button" className="text-white/40 hover:text-white/65">
                              <IconInfoCircle className="h-4 w-4" />
                            </button>
                          </PopoverTrigger>
                          <PopoverContent
                            align="center"
                            side="top"
                            className="z-[100010] w-[300px] border border-white/10 bg-[#2a2a2a] p-4 text-white/90 shadow-xl"
                          >
                            <p className="text-sm leading-relaxed">
                              Choosing{' '}
                              <span className="font-semibold text-white">&quot;Keep me logged in&quot;</span> reduces
                              how often you&apos;re asked to sign in on this device.
                            </p>
                          </PopoverContent>
                        </Popover>
                      </label>
                      <button type="button" className="text-xs font-semibold text-[#ee3536] hover:text-[#ff5a5a]">
                        Forgot password?
                      </button>
                    </div>
                  </div>

                  <button type="button" disabled={!canSubmitLogin} className={primaryBtnClass} onClick={finishLogin}>
                    Log in
                  </button>

                  <div className="relative py-1">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-white/10" />
                    </div>
                    <div className="relative flex justify-center">
                      <span className="bg-[#262626] px-3 text-[11px] font-medium uppercase tracking-wide text-white/40">
                        Or
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="flex h-11 w-full items-center justify-center gap-2 rounded-lg border border-white/12 bg-[#1a1a1a] text-sm font-medium text-white/90 hover:bg-white/5"
                    onClick={() => void handleLoginWithPasskey()}
                  >
                    <IconKey className="h-4 w-4" aria-hidden />
                    Sign in with passkey
                  </button>

                  <div className="text-center">
                    <button
                      type="button"
                      className="text-xs font-medium text-white/55 hover:text-white/80"
                      onClick={() => setView('createAccount')}
                    >
                      Don&apos;t have an account?{' '}
                      <span className="font-semibold text-[#ee3536]">Create one</span>
                    </button>
                  </div>
                </div>
              ) : view === 'createAccount' ? (
                <div className="mx-auto w-full max-w-md space-y-4">
                  <div>
                    <h3 className="text-xl font-bold text-white">Create an Account</h3>
                    <p className="mt-1 text-xs text-white/50">Join Brand A in seconds and unlock welcome bonuses.</p>
                  </div>
                  <div className={fieldsClass}>
                    <input
                      type="email"
                      value={createAccountForm.email}
                      onChange={(e) => setCreateAccountForm((prev) => ({ ...prev, email: e.target.value }))}
                      placeholder="Email address"
                      autoComplete="email"
                      className={fieldClass}
                      aria-label="Email address"
                    />
                    {createAccountTouched && createAccountErrors.email ? (
                      <p className="text-xs text-[#ee3536]">{createAccountErrors.email}</p>
                    ) : null}
                    <div className="relative">
                      <input
                        type={createAccountPasswordVisible ? 'text' : 'password'}
                        value={createAccountForm.password}
                        onChange={(e) => setCreateAccountForm((prev) => ({ ...prev, password: e.target.value }))}
                        placeholder="Create password"
                        autoComplete="new-password"
                        className={`${fieldClass} pr-10`}
                        aria-label="Create password"
                      />
                      <button
                        type="button"
                        onClick={() => setCreateAccountPasswordVisible((prev) => !prev)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70"
                        aria-label={createAccountPasswordVisible ? 'Hide password' : 'Show password'}
                      >
                        {createAccountPasswordVisible ? (
                          <IconEyeOff className="h-4 w-4" />
                        ) : (
                          <IconEye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                    {createAccountTouched && createAccountErrors.password ? (
                      <p className="text-xs text-[#ee3536]">{createAccountErrors.password}</p>
                    ) : null}
                    <div className="grid grid-cols-[auto_1fr] gap-2">
                      <button
                        ref={authCountryTriggerRef}
                        type="button"
                        onClick={() => setAuthCountryMenuOpen((o) => !o)}
                        aria-expanded={authCountryMenuOpen}
                        aria-haspopup="listbox"
                        title={selectedAuthCountry.label}
                        className={cn(selectTriggerClass, 'h-11 min-w-[3.25rem] shrink-0 gap-2 px-3')}
                        aria-label={`Dial code ${selectedAuthCountry.dial}, ${selectedAuthCountry.label}`}
                      >
                        <span className="text-sm font-semibold tabular-nums text-white">
                          {selectedAuthCountry.dial}
                        </span>
                        <IconChevronDown
                          className={cn(
                            'h-4 w-4 shrink-0 text-white/45 transition-transform',
                            authCountryMenuOpen && 'rotate-180'
                          )}
                        />
                      </button>
                      {authCountryMenuOpen && authCountryMenuRect && typeof document !== 'undefined'
                        ? createPortal(
                            <div
                              ref={authCountryListRef}
                              role="listbox"
                              aria-label="Select country"
                              className="fixed z-[100010] overflow-hidden rounded-lg border border-white/10 bg-[#2a2a2a] py-1 shadow-xl ring-1 ring-black/40"
                              style={{
                                top: authCountryMenuRect.top,
                                left: authCountryMenuRect.left,
                                minWidth: authCountryMenuRect.width,
                              }}
                            >
                              {AUTH_COUNTRY_OPTIONS.map((opt) => (
                                <button
                                  key={opt.iso}
                                  type="button"
                                  role="option"
                                  aria-selected={createAccountForm.countryIso === opt.iso}
                                  className={cn(
                                    'flex w-full px-3 py-2.5 text-left text-sm text-white hover:bg-white/10',
                                    createAccountForm.countryIso === opt.iso && 'bg-white/5'
                                  )}
                                  onClick={() => {
                                    setCreateAccountForm((prev) => ({ ...prev, countryIso: opt.iso }))
                                    setAuthCountryMenuOpen(false)
                                  }}
                                >
                                  {opt.label}
                                </button>
                              ))}
                            </div>,
                            document.body
                          )
                        : null}
                      <input
                        type="tel"
                        value={createAccountForm.phone}
                        onChange={(e) => setCreateAccountForm((prev) => ({ ...prev, phone: e.target.value }))}
                        placeholder="Mobile number"
                        autoComplete="tel"
                        className={fieldClass}
                        aria-label="Mobile number"
                      />
                    </div>
                    {createAccountTouched && createAccountErrors.phone ? (
                      <p className="text-xs text-[#ee3536]">{createAccountErrors.phone}</p>
                    ) : null}
                    <div className="grid grid-cols-3 gap-2">
                      <div className="relative">
                        <select
                          value={createAccountDob.day}
                          onChange={(e) => setCreateAccountDob((prev) => ({ ...prev, day: e.target.value }))}
                          className={`${fieldClass} appearance-none pr-8 text-white/80`}
                          aria-label="Day of birth"
                        >
                          <option value="">DD</option>
                          {Array.from({ length: 31 }, (_, i) => String(i + 1).padStart(2, '0')).map((d) => (
                            <option key={d} value={d}>
                              {d}
                            </option>
                          ))}
                        </select>
                        <IconChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
                      </div>
                      <div className="relative">
                        <select
                          value={createAccountDob.month}
                          onChange={(e) => setCreateAccountDob((prev) => ({ ...prev, month: e.target.value }))}
                          className={`${fieldClass} appearance-none pr-8 text-white/80`}
                          aria-label="Month of birth"
                        >
                          <option value="">MM</option>
                          {Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0')).map((m) => (
                            <option key={m} value={m}>
                              {m}
                            </option>
                          ))}
                        </select>
                        <IconChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
                      </div>
                      <div className="relative">
                        <select
                          value={createAccountDob.year}
                          onChange={(e) => setCreateAccountDob((prev) => ({ ...prev, year: e.target.value }))}
                          className={`${fieldClass} appearance-none pr-8 text-white/80`}
                          aria-label="Year of birth"
                        >
                          <option value="">YYYY</option>
                          {Array.from({ length: 100 }, (_, i) => currentYear - 18 - i).map((y) => (
                            <option key={y} value={String(y)}>
                              {y}
                            </option>
                          ))}
                        </select>
                        <IconChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
                      </div>
                    </div>
                    {createAccountTouched && createAccountErrors.dob ? (
                      <p className="text-xs text-[#ee3536]">{createAccountErrors.dob}</p>
                    ) : null}
                  </div>

                  <label className="flex cursor-pointer items-start gap-2.5 px-0.5">
                    <Checkbox
                      defaultChecked
                      className="mt-0.5 h-4 w-4 rounded-[4px] border-white/25 bg-[#1a1a1a] data-[state=checked]:border-[#ee3536] data-[state=checked]:bg-[#ee3536]"
                    />
                    <span className="text-xs leading-relaxed text-white/55">
                      I acknowledge that I am over the age of 18 and agree to the{' '}
                      <span className="text-[#ee3536]">Terms and Conditions</span>.
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

                  <div className="text-center">
                    <button
                      type="button"
                      className="text-xs font-medium text-white/55 hover:text-white/80"
                      onClick={() => setView('login')}
                    >
                      Already have an account? <span className="font-semibold text-[#ee3536]">Log in</span>
                    </button>
                  </div>

                  <div className="border-t border-white/10 pt-4">
                    <div className="flex flex-col items-center gap-2">
                      <div className="flex items-center gap-3 text-white/45">
                        <div className="flex items-center gap-1.5">
                          <IconShield className="h-3.5 w-3.5 text-emerald-400/90" />
                          <span className="text-xs font-medium">Safe &amp; secure</span>
                        </div>
                        <div className="h-3.5 w-px bg-white/15" />
                        <div className="flex items-center gap-1.5">
                          <IconLock className="h-3.5 w-3.5 text-[#ee3536]/80" />
                          <span className="text-xs font-medium">Trusted</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="mx-auto w-full max-w-md space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 flex-1 rounded-full bg-[#ee3536]" />
                    <div className="h-1.5 flex-1 rounded-full bg-[#ee3536]" />
                  </div>
                  <div className="text-xs text-white/45">Step 2 of 2: Verify your email</div>
                  <div className="rounded-xl border border-white/10 bg-[#1f1f1f] px-4 py-4">
                    <div className="flex items-center gap-2">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-600">
                        <IconCheck className="h-3.5 w-3.5 text-white" />
                      </span>
                      <p className="text-sm font-semibold text-white">Account created</p>
                    </div>
                    <p className="mt-2 text-sm leading-relaxed text-white/65">
                      We sent an activation email to{' '}
                      <span className="font-medium text-white">{createAccountForm.email || 'your email'}</span>. Open
                      it to activate your account and start betting.
                    </p>
                    <div className="mt-4 space-y-1.5">
                      <label className="text-xs font-medium text-white/50">Alias / nickname (optional)</label>
                      <input
                        value={createAccountAlias}
                        onChange={(e) => setCreateAccountAlias(e.target.value)}
                        placeholder="How should we display your name?"
                        className={fieldClass}
                      />
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      resetCreateAccount()
                      finishLogin()
                    }}
                    className={primaryBtnClass}
                  >
                    Done
                  </button>
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
