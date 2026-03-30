# SkillBridge Frontend

Next.js 15 + Tailwind CSS frontend for the SkillBridge tutoring platform.

## Quick Start

```bash
npm install
npm run dev        # http://localhost:3000
```

## Environment

Create `.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:5000
```

## Project Structure

```
src/
  app/
    page.tsx                   ← Homepage
    login/page.tsx             ← Login
    register/page.tsx          ← Register (student or tutor)
    tutors/page.tsx            ← Browse tutors
    tutors/[id]/page.tsx       ← Tutor detail + booking
    dashboard/                 ← Student dashboard
      page.tsx                 ← Overview
      bookings/page.tsx        ← My bookings
      profile/page.tsx         ← Edit profile
    tutor/                     ← Tutor dashboard
      dashboard/page.tsx       ← Stats + session management
      profile/page.tsx         ← Setup/edit tutor profile
    admin/                     ← Admin panel
      page.tsx                 ← Stats overview
      users/page.tsx           ← User management
      bookings/page.tsx        ← All bookings
      categories/page.tsx      ← Category management
  components/
    layout/Navbar.tsx
    layout/Footer.tsx
    ui/index.tsx               ← Shared UI components
    tutor/FeaturedTutors.tsx
  lib/
    api.ts                     ← All API calls (axios)
    auth-client.ts             ← better-auth client
    utils.ts                   ← Helpers
  types/index.ts               ← TypeScript types
```

## Deploy to Vercel

```bash
npm install -g vercel
vercel
# Set NEXT_PUBLIC_API_URL to your deployed backend URL
```

## Deploy Backend to Railway / Render

1. Push backend to GitHub
2. Connect repo on Railway.app or Render.com
3. Set env vars: DATABASE_URL, APP_URL=https://your-frontend.vercel.app

## Admin Account

Seed an admin directly in the DB:
```sql
UPDATE "user" SET role = 'admin' WHERE email = 'your@email.com';
```
