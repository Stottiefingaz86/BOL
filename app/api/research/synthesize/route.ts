import { NextResponse } from 'next/server'
import OpenAI from 'openai'

export const dynamic = 'force-dynamic'
export const maxDuration = 60

/**
 * LLM synthesis of a research campaign's results.
 * Body: { campaign, sessions, results } (shapes from components/research/types.ts).
 * Returns a structured report: summary, verdict, per-task findings with quotes, recommendations.
 */
export async function POST(request: Request) {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: 'OPENAI_API_KEY is not set. Add it to .env.local (and Vercel) to enable AI synthesis.' }, { status: 503 })
  }

  let body: { campaign: Campaign; sessions: Session[]; results: TaskResult[] }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }
  const { campaign, sessions, results } = body
  if (!campaign || !Array.isArray(sessions) || !Array.isArray(results)) {
    return NextResponse.json({ error: 'campaign, sessions and results are required' }, { status: 400 })
  }
  if (results.length === 0) {
    return NextResponse.json({ error: 'No task results to synthesise yet.' }, { status: 400 })
  }

  const openai = new OpenAI({ apiKey })
  const model = process.env.OPENAI_RESEARCH_MODEL || 'gpt-4o-mini'

  const completion = await openai.chat.completions.create({
    model,
    temperature: 0.3,
    response_format: { type: 'json_object' },
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: buildUserPrompt(campaign, sessions, results) },
    ],
  })

  const raw = completion.choices[0]?.message?.content ?? '{}'
  let report: unknown
  try {
    report = JSON.parse(raw)
  } catch {
    return NextResponse.json({ error: 'Model returned malformed JSON' }, { status: 502 })
  }
  return NextResponse.json({
    report,
    meta: { model, generatedAt: new Date().toISOString(), sessions: sessions.length, results: results.length },
  })
}

// ─── Prompting ────────────────────────────────────────────────

const SYSTEM_PROMPT = `You are a senior UX researcher writing up an unmoderated usability study for a sportsbook / online casino product team.
Participants are labelled with a short persona (player type, age band, location, monthly deposit band). Where findings differ by persona (e.g. casino vs sports players, high vs low depositors), call that out explicitly.
You are given the study script (tasks + questions) and the raw data: per-participant task outcomes, timings, ease ratings, free-text and voice-transcribed answers, and the pages each participant visited.

Write a rigorous, plain-English synthesis. Be specific and evidence-led: cite participant quotes verbatim (short), quantify where possible (e.g. "3 of 5 gave up"), and distinguish strong patterns from single-participant anecdotes. Do not invent data. If the sample is small, say so and temper confidence accordingly.

Respond ONLY with JSON matching this shape:
{
  "headline": string,                       // one sentence: the single most important takeaway
  "verdict": "pass" | "pass_with_issues" | "fail" | "inconclusive",
  "verdictReason": string,                  // 1–2 sentences
  "summary": string,                        // 1–3 short paragraphs, executive summary
  "metrics": { "participants": number, "completionRate": number, "avgEase": number | null, "medianMinutes": number | null },
  "taskFindings": [
    {
      "taskId": string,
      "instruction": string,
      "severity": "none" | "low" | "medium" | "high" | "critical",
      "whatHappened": string,               // 1–3 sentences, quantified
      "whyItMatters": string,               // impact on the user / business
      "quotes": string[],                   // up to 3 short verbatim quotes, attributed like "— P2"
      "recommendation": string
    }
  ],
  "themes": [ { "title": string, "detail": string, "evidence": string[] } ],   // cross-task patterns, 2–5
  "positives": string[],                    // what worked well
  "recommendations": [ { "priority": "now" | "next" | "later", "action": string, "rationale": string } ],
  "openQuestions": string[],                // what this study could not answer / what to test next
  "confidence": "low" | "medium" | "high",
  "confidenceReason": string
}`

interface Question { id: string; label: string; type: string }
interface Task { id: string; instruction: string; questions: Question[]; successCriteria?: string }
interface Campaign { id: string; title: string; description: string; tasks: Task[]; finalQuestions: Question[] }
interface Session {
  id: string
  tester: { name: string; profile?: { plays?: string | null; age?: string | null; location?: string; monthlyDeposit?: string | null; favourite?: string; hobbies?: string } | null }
  status: string
  startedAt: string
  finishedAt: string | null
  device: { isMobile: boolean; viewport: string }
  overallRating: number | null
  overallComments: string
  finalAnswers: Record<string, unknown>
}
interface TaskResult {
  sessionId: string
  taskId: string
  taskIndex: number
  outcome: string
  detectedAutomatically: boolean
  durationMs: number
  easeRating: number | null
  answers: Record<string, unknown>
  pathsVisited: string[]
}

function buildUserPrompt(campaign: Campaign, sessions: Session[], results: TaskResult[]) {
  // Anonymise participants as P1..Pn and strip audio URLs (keep transcripts).
  const pid = new Map(sessions.map((s, i) => [s.id, `P${i + 1}`]))
  const qLabel = (task: Task | undefined, key: string) =>
    task?.questions.find((q) => q.id === key)?.label ?? campaign.finalQuestions.find((q) => q.id === key)?.label ?? key

  const cleanAnswers = (task: Task | undefined, answers: Record<string, unknown>) =>
    Object.entries(answers ?? {})
      .filter(([k]) => !k.endsWith(':audio'))
      .map(([k, v]) => `${qLabel(task, k)}: ${typeof v === 'string' ? JSON.stringify(v) : String(v)}`)
      .join(' | ')

  const script = campaign.tasks
    .map((t, i) => `  ${i + 1}. [${t.id}] ${t.instruction}${t.successCriteria ? ` (success: ${t.successCriteria})` : ''}\n     questions: ${t.questions.map((q) => `${q.label} (${q.type})`).join('; ')}`)
    .join('\n')

  const participants = sessions
    .map((s) => {
      const rows = results
        .filter((r) => r.sessionId === s.id)
        .sort((a, b) => a.taskIndex - b.taskIndex)
        .map((r) => {
          const task = campaign.tasks.find((t) => t.id === r.taskId)
          return `    - task ${r.taskIndex + 1} [${r.taskId}] ${r.outcome}${r.detectedAutomatically ? ' (auto-detected)' : ''}, ${Math.round(r.durationMs / 1000)}s, ease ${r.easeRating ?? 'n/a'}; pages: ${r.pathsVisited.join(' → ') || '-'}; answers: ${cleanAnswers(task, r.answers) || '-'}`
        })
        .join('\n')
      const dur = s.finishedAt ? Math.round((new Date(s.finishedAt).getTime() - new Date(s.startedAt).getTime()) / 60000) : null
      const pr = s.tester.profile
      const persona = pr ? [pr.plays && `${pr.plays} player`, pr.age, pr.location, pr.monthlyDeposit && `deposits ${pr.monthlyDeposit}/mo`, pr.favourite && `likes ${pr.favourite}`].filter(Boolean).join(', ') : ''
      return `  ${pid.get(s.id)}${persona ? ` (${persona})` : ''} · ${s.device.isMobile ? 'mobile' : 'desktop'} ${s.device.viewport} · ${s.status}${dur !== null ? ` · ${dur} min` : ''}\n${rows}\n    - final: overall ${s.overallRating ?? 'n/a'}; ${cleanAnswers(undefined, s.finalAnswers) || s.overallComments || '-'}`
    })
    .join('\n\n')

  return `STUDY: ${campaign.title}
${campaign.description}

SCRIPT
${script}

DATA (${sessions.length} participants, ${results.length} task results)
${participants}

Write the JSON report now.`
}
