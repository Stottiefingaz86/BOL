import { DEFAULT_FINAL_QUESTIONS, DEFAULT_TASK_QUESTIONS, type Campaign } from '../types'

/**
 * Seed template. The first time the research tool runs with no campaigns, this is inserted
 * as the live campaign so `?research=live` works out of the box. Campaigns are otherwise
 * created and edited in /research.
 */
export const HOMEPAGE_FIRST_DEPOSIT: Campaign = {
  id: 'homepage-first-deposit',
  title: 'Homepage → first deposit → play',
  description:
    'A new visitor lands on the homepage, creates an account, deposits with Bitcoin, then finds and launches a specific game.',
  status: 'live',
  startPath: '/',
  estimatedMinutes: 8,
  tasks: [
    {
      id: 'first-impressions',
      instruction: 'Take a look around the homepage. Don’t click anything yet.',
      successCriteria: 'Tester can articulate sportsbook + casino.',
      complete: { type: 'manual' },
      questions: [
        ...DEFAULT_TASK_QUESTIONS,
        { id: 'purpose', label: 'What do you think this site is for?', type: 'text' },
      ],
    },
    {
      id: 'register',
      instruction: 'Create an account (or log in if you already have one).',
      successCriteria: 'Auth state becomes logged in; tester returns to homepage.',
      complete: { type: 'auth', loggedIn: true },
      questions: DEFAULT_TASK_QUESTIONS,
    },
    {
      id: 'deposit-bitcoin',
      instruction: 'Deposit $50 into your account using Bitcoin.',
      hint: 'It’s a demo — nothing is charged.',
      successCriteria: 'Deposit flow completes with method = bitcoin.',
      complete: { type: 'event', name: 'deposit:completed', match: { method: 'bitcoin' } },
      questions: DEFAULT_TASK_QUESTIONS,
    },
    {
      id: 'find-game',
      instruction: 'Find the slot game “Gemhalla Xtreme” and launch it.',
      successCriteria: 'game:launched with title Gemhalla Xtreme.',
      complete: { type: 'event', name: 'game:launched', match: { title: 'Gemhalla Xtreme' } },
      questions: [...DEFAULT_TASK_QUESTIONS, { id: 'expected', label: 'Where did you expect to find it?', type: 'text' }],
    },
    {
      id: 'find-vip',
      instruction: 'Find out what level you are in the loyalty / VIP programme.',
      successCriteria: 'Tester opens the VIP hub / drawer.',
      complete: { type: 'event', name: 'vip:opened' },
      questions: DEFAULT_TASK_QUESTIONS,
    },
  ],
  finalQuestions: DEFAULT_FINAL_QUESTIONS,
  outro: 'Thanks — that’s everything.',
  reward: { code: 'RESEARCH5', label: '$5 cash drop' },
  createdAt: '2026-09-18T00:00:00.000Z',
  updatedAt: '2026-09-18T00:00:00.000Z',
}

export const SEED_CAMPAIGNS: Campaign[] = [HOMEPAGE_FIRST_DEPOSIT]
