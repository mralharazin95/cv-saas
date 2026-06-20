# ResumeX — AI-Powered CV Builder (SaaS)

A modern, multilingual (English / العربية / Türkçe) résumé builder built with **Next.js 16**, **React 19**, **Prisma 7**, **NextAuth**, and **Tailwind CSS 4**.

## Features

- 🎨 Live CV builder with multiple templates and color themes
- 🌍 Full i18n with RTL support (Arabic) via `next-intl`
- 🔐 Email/password authentication (NextAuth + Prisma adapter)
- ✨ AI text-improvement helper for summaries & experience
- 🖨️ Print / export to PDF
- 🌗 Light & dark mode

## Tech Stack

| Layer       | Tech                                            |
| ----------- | ----------------------------------------------- |
| Framework   | Next.js 16 (App Router, Turbopack)              |
| UI          | React 19, Tailwind CSS 4, lucide-react          |
| State       | Zustand                                         |
| Auth        | NextAuth v4 (Credentials)                       |
| Database    | Prisma 7 + libSQL adapter (SQLite / Turso)      |
| i18n        | next-intl (en, ar, tr)                          |

## Getting Started

```bash
# 1. Install dependencies (also generates the Prisma client)
npm install

# 2. Create the local database
npx prisma db push

# 3. Run the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment Variables

Create a `.env` file (see `.env.example`):

```bash
# Local development — a file-based SQLite database
DATABASE_URL="file:./prisma/dev.db"

# Production — a Turso (libSQL) cloud database
# DATABASE_URL="libsql://your-db.turso.io"
# DATABASE_AUTH_TOKEN="your-turso-token"

NEXTAUTH_SECRET="change-me-to-a-long-random-string"
NEXTAUTH_URL="http://localhost:3000"
```

## Deployment (Vercel)

This app is deployed on Vercel. Because Vercel's filesystem is ephemeral, production uses a
[Turso](https://turso.tech) (libSQL) cloud database. Set the following environment variables in
the Vercel project:

- `DATABASE_URL` — your Turso database URL
- `DATABASE_AUTH_TOKEN` — your Turso auth token
- `NEXTAUTH_SECRET` — a long random secret
- `NEXTAUTH_URL` — your production URL

The `postinstall` script runs `prisma generate` automatically during the Vercel build.
