# CloudTrim

> **Live site: https://cloudtrim-sa.vercel.app**
>
> - Interactive demo: https://cloudtrim-sa.vercel.app/demo
> - Sign-up walkthrough: https://cloudtrim-sa.vercel.app/start
> - Arabic version: https://cloudtrim-sa.vercel.app/ar

Landing page (`/`) and interactive MVP demo (`/demo`) in one Next.js app, built for VentureX 2026.

The demo runs on seeded data for a fictional Saudi SME (`lib/data.ts`), so it never depends on a live cloud account.

## Run locally

```bash
npm install
npm run dev   # http://localhost:3000
```

## Deploy to Vercel

1. Push this folder to a GitHub repository.
2. In Vercel: Add New > Project > import the repository. No settings needed.
3. Optional environment variables (see `.env.example`):
   - `ANTHROPIC_API_KEY` for live AI explanations (otherwise built-in Arabic text is used).
   - `TELEGRAM_BOT_TOKEN` and `TELEGRAM_CHAT_ID` to send a real Telegram alert from the demo.

## Edit

- Team name: `TEAM_NAME` in `lib/data.ts`.
- Demo company, spend, and findings: `lib/data.ts`.
