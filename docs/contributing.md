# Contributing

## Local setup
1. Copy `.env.example` to `.env.local` and fill in Supabase/Prisma values.
2. `npm install`
3. `npx prisma migrate dev` (once Phase 1 lands)
4. `npm run dev`

## Branching
- `main` is always deployable.
- One short-lived branch per roadmap phase or fix: `phase-N-short-description` or
  `fix/short-description`.
- Open a PR into `main` even when working solo, squash-merge, delete the branch after merge.
- Keep branches to a day or two of work; split oversized phases into multiple PRs.

## Commits
- Present-tense, descriptive: `Add alumni admin CRUD`, not `added stuff`.

## Before opening a PR
- `npm run lint` passes
- `npx tsc --noEmit` passes
- Screenshot attached for any UI change
