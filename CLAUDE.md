# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

O.S.P. Portal (opensourceforall.com) is the organizational hub for OpenSourcePatents. Five sections: Civic Arm, Mission, Services, Patents, Your Voice Matters. Admin panel for full CRUD. Deploys to Vercel.

## Tech Stack

- **Next.js 14** (App Router) — JavaScript only, no TypeScript
- **Supabase** — Auth (email/password, magic link, OAuth), Postgres DB with RLS, Storage (logos, patents buckets)
- **Styling** — CSS variables + inline styles. Dark hacker aesthetic. JetBrains Mono + IBM Plex Sans.
- **No UI libraries** — all custom components

## Commands

```bash
npm run dev      # Dev server at localhost:3000
npm run build    # Production build
npm run start    # Production server
```

## Architecture

### Database
- Schema at `sql/schema.sql` — run in Supabase SQL Editor
- `is_admin()` SECURITY DEFINER function used by all RLS policies
- Never query profiles inside profiles RLS policies (causes infinite recursion)
- Auto-create profile trigger on auth.users insert

### Supabase Clients
- `lib/supabase-browser.js` — client-side (use in 'use client' components)
- `lib/supabase-server.js` — server-side (use in Server Components, Route Handlers)
- `middleware.js` — refreshes Supabase auth session on every request

### Auth
- `components/AuthProvider.js` — React context providing user, profile, isAdmin, signOut
- `app/login/page.js` — login/signup/magic link + OAuth buttons
- `app/auth/callback/route.js` — OAuth callback handler
- Google + GitHub OAuth buttons present but require provider config in Supabase dashboard

### Shared Components
- `components/PageShell.js` — standard page wrapper (grid bg + nav + title)
- `components/Nav.js` — nav bar, admin link only visible to admins
- `components/GridBackground.js` — animated scanning grid
- `components/CivicCard.js` — project cards for civic arm
- `components/LampSpotlight.js` — warm amber desk lamp effect (Voice section signature)
- `components/AdminGuard.js` — blocks non-admin access
- `components/AdminTable.js` — reusable CRUD table
- `components/AdminFormModal.js` — dynamic form modal
- `components/ImageUpload.js` — upload to Supabase Storage

### Routes
- `/` — Hub landing with centered logo, section nav
- `/civic` — Civic projects from `civic_projects` table
- `/mission` — Content from `site_content` table (section='mission')
- `/services` — From `services` table
- `/patents` — ITAR wall then patent portfolio from `patents` table
- `/voice` — Lamp spotlight, submission form, public board with upvotes
- `/admin` — Tabbed CRUD for all tables (admin role required)
- `/login` — Auth page

### Design
- CSS variables in `app/globals.css` (--bg-void, --bg-surface, --accent-blue, etc.)
- All animations defined in globals.css (fade-up, glow-pulse, grid-scan, lamp-flicker)
- Each civic project has a unique brand color
- Voice section uses warm amber lamp spotlight as signature visual
