'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { SidebarInset } from '@/components/ui/sidebar'
import { Button } from '@/components/ui/button'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import {
  getPromoOfferBySlug,
  type PromoOfferDetail,
} from '@/lib/promo-offers'
import { cn } from '@/lib/utils'

/** Same large-screen column as SiteFooter — keeps banner, body, footer on one axis */
const PAGE_COLUMN =
  'mx-auto w-full min-w-0 max-w-full px-3 md:px-6 2xl:max-w-[1600px] min-[1920px]:max-w-[1720px] min-[2200px]:max-w-[1840px]'

/** Figma CMS image slot — pass `src` from CMS when wired. */
function CmsImageSlot({
  className,
  square = false,
  src,
  alt = '',
}: {
  className?: string
  square?: boolean
  src?: string
  alt?: string
}) {
  if (!square && src) {
    // Natural 1920×352 scale — full column width, no crop, never wider than parent
    return (
      <div
        className={cn(
          'relative w-full min-w-0 max-w-full overflow-hidden rounded-[10px] border border-[var(--ds-border)] bg-[var(--ds-surface-muted,#eee)]',
          className
        )}
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- CMS banner; avoid Next Image intrinsic min-width blowout on mobile */}
        <img
          src={src}
          alt={alt}
          width={1920}
          height={352}
          className="block h-auto w-full max-w-full"
          decoding="async"
          fetchPriority="high"
        />
      </div>
    )
  }

  return (
    <div
      className={cn(
        'relative w-full min-w-0 max-w-full overflow-hidden rounded-[10px] border border-[var(--ds-border)] bg-[var(--ds-surface-muted,#eee)]',
        square ? 'aspect-square max-w-[400px]' : 'aspect-[1920/352]',
        className
      )}
    >
      {src ? (
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover object-center"
          sizes={square ? '400px' : '100vw'}
          priority={!square}
          unoptimized
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center">
          <Image
            src="/promotions/image-placeholder.svg"
            alt=""
            width={82}
            height={82}
            className="size-[82px] opacity-80"
            unoptimized
          />
        </div>
      )}
    </div>
  )
}

function PromoDetailContent({ offer }: { offer: PromoOfferDetail }) {
  const router = useRouter()

  return (
    <div className="flex w-full flex-col gap-6">
      <nav
        aria-label="Breadcrumb"
        className="flex flex-wrap items-center gap-2.5 text-sm font-medium leading-5"
      >
        <button
          type="button"
          onClick={() => router.push('/promotions')}
          className="cursor-pointer rounded-lg text-[var(--ds-fg-muted)] underline-offset-2 transition-colors hover:text-[var(--ds-fg)] hover:underline"
        >
          All Promotions
        </button>
        <span aria-hidden className="text-[var(--ds-fg-muted)]">
          /
        </span>
        <span className="text-[var(--ds-fg)]">{offer.title}</span>
      </nav>

      <section className="flex flex-col gap-4">
        <h1 className="text-[32px] font-semibold leading-10 text-[var(--ds-fg)] md:text-[36px]">
          {offer.heroTitle}
        </h1>
        <p className="text-base leading-6 text-[var(--ds-fg-muted)]">{offer.intro}</p>
        <div>
          <Button className="h-auto rounded-lg bg-[var(--ds-primary,#ee3536)] px-6 py-2.5 text-sm font-medium text-white hover:bg-[var(--ds-primary,#ee3536)]/90">
            {offer.ctaLabel}
          </Button>
        </div>
      </section>

      {offer.sections.map((section) => (
        <section key={section.heading} className="flex flex-col gap-4">
          <h2 className="text-[28px] font-semibold leading-9 text-[var(--ds-fg)] md:text-[30px]">
            {section.heading}
          </h2>
          <p className="text-base leading-6 text-[var(--ds-fg-muted)]">{section.body}</p>
        </section>
      ))}

      <CmsImageSlot square />

      <Accordion
        type="single"
        collapsible
        className="w-full overflow-hidden rounded-[10px] border border-[var(--ds-border)] bg-[var(--ds-surface-raised)] shadow-[0_0_8px_rgba(0,0,0,0.06)]"
      >
        <AccordionItem value="terms" className="border-0 px-4">
          <AccordionTrigger
            value="terms"
            className="py-4 text-left text-xl font-semibold leading-7 text-[var(--ds-fg)] hover:no-underline [&>svg]:text-[var(--ds-fg-muted)]"
          >
            Terms and Conditions
          </AccordionTrigger>
          <AccordionContent value="terms">
            <ol className="list-decimal space-y-0 pl-5 text-sm leading-5 text-[var(--ds-fg-muted)]">
              {offer.terms.map((term) => (
                <li key={term} className="mb-0">
                  {term}
                </li>
              ))}
            </ol>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}

export function PromoDetailPage({ slug }: { slug: string }) {
  const router = useRouter()
  const offer = getPromoOfferBySlug(slug)

  if (!offer) {
    return (
      <SidebarInset
        className="min-w-0 overflow-x-hidden bg-[var(--ds-page-bg)] text-[var(--ds-fg)]"
        style={{ width: 'auto', flex: '1 1 0%', minWidth: 0, maxWidth: '100%' }}
      >
        <div className={cn(PAGE_COLUMN, 'flex flex-col gap-4 py-10')}>
          <h1 className="text-2xl font-semibold text-[var(--ds-fg)]">Promotion not found</h1>
          <p className="text-[var(--ds-fg-muted)]">
            This offer may have ended or the link is incorrect.
          </p>
          <button
            type="button"
            onClick={() => router.push('/promotions')}
            className="w-fit cursor-pointer text-sm font-medium text-[var(--ds-primary)] hover:underline"
          >
            Back to Promos
          </button>
        </div>
      </SidebarInset>
    )
  }

  return (
    <SidebarInset
      className="min-w-0 overflow-x-hidden bg-[var(--ds-page-bg)] text-[var(--ds-fg)]"
      style={{ width: 'auto', flex: '1 1 0%', minWidth: 0, maxWidth: '100%' }}
    >
      <div className={cn(PAGE_COLUMN, 'flex flex-col gap-6 pb-10 pt-6')}>
        <CmsImageSlot src={offer.bannerImage} alt={offer.title} />
        <PromoDetailContent offer={offer} />
      </div>
    </SidebarInset>
  )
}
