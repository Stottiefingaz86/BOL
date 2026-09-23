import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

/** Returns the caller's IP so the research overlay can de-duplicate participants. */
export async function GET(request: Request) {
  const fwd = request.headers.get('x-forwarded-for')
  const ip =
    (fwd ? fwd.split(',')[0]?.trim() : null) ||
    request.headers.get('x-real-ip') ||
    request.headers.get('cf-connecting-ip') ||
    null
  return NextResponse.json({ ip }, { headers: { 'Cache-Control': 'no-store' } })
}
