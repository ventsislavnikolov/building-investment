# Building Investment

Next.js 16 MVP foundation for a Bulgarian real estate investment platform.

## Run

```bash
cp .env.example .env.local
pnpm dev
```

## Test (TDD baseline)

```bash
pnpm lint
pnpm test
pnpm test:e2e
pnpm build
```

## Environment

Required variables are documented in:

- `/Users/ventsislav.nikolov/Projects/ventsislavnikolov/building-investment/.env.example`

## Stack

- Next.js (App Router) + TypeScript
- Tailwind CSS 4
- Biome
- Jest + Testing Library
- Playwright

## Docs

- `/docs/architecture.md`
- `/docs/data-model.md`
- `/docs/database-schema.sql`
