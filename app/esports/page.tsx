import { redirect } from 'next/navigation'

/** Former re-export of the archived sports football page — route to sports home. */
export default function EsportsPage() {
  redirect('/sports')
}
