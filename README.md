# Goutham K Suresh — Portfolio (`goutham.sh`)

A terminal/hacker-aesthetic personal portfolio for **Goutham K Suresh** — Cloud & DevOps Engineer.
Built as a fully-dynamic, CMS-driven single-page app with a JSON-backed admin panel, AI chat assistant, visitor analytics, and an interactive in-browser terminal easter egg.

---

## Table of contents

1. [Tech stack](#tech-stack)
2. [Architecture](#architecture)
3. [Features](#features)
4. [Project layout](#project-layout)
5. [Database schema](#database-schema)
6. [Edge functions](#edge-functions)
7. [Authentication & roles](#authentication--roles)
8. [Environment variables](#environment-variables)
9. [Running locally](#running-locally)
10. [Deploying to other platforms](#deploying-to-other-platforms)
11. [Security notes](#security-notes)
12. [SEO](#seo)

---

## Tech stack

### Languages
- **TypeScript 5** — all application code (`.ts` / `.tsx`)
- **TSX/JSX** — React components
- **SQL (PostgreSQL dialect)** — migrations + RLS policies in `supabase/migrations/`
- **CSS** (Tailwind utility classes + a small set of custom tokens in `src/index.css`)
- **HTML5** — `index.html` shell (the only static HTML; everything else is rendered by React)

### Frontend framework & build
- **React 18.3** (function components + hooks only — no class components)
- **Vite 5** with `@vitejs/plugin-react-swc` (SWC compiler, no Babel)
- **react-router-dom 6** for client-side routing
- **TanStack Query v5** (`@tanstack/react-query`) for server-state caching of CMS data
- **react-hook-form** + **zod** + `@hookform/resolvers` for forms + validation in the admin panel

### Styling & UI primitives
- **Tailwind CSS v3** (`tailwind.config.ts`) with semantic design tokens defined in `src/index.css` (HSL CSS variables — `--primary`, `--background`, `--terminal-green`, `--terminal-cyan`, `--terminal-red`, `--terminal-yellow`, etc.)
- **shadcn/ui** components built on **Radix UI** primitives (Accordion, Dialog, Dropdown, Popover, Tabs, Toast, Tooltip, etc. — see `src/components/ui/`)
- **lucide-react** for icons
- **class-variance-authority** + **tailwind-merge** + **clsx** for variant management
- **tailwindcss-animate** + **@tailwindcss/typography**
- **sonner** for toast notifications
- **cmdk** for the ⌘K command palette
- **next-themes** for theme handling
- Fonts: **JetBrains Mono** (monospace / display) + **Inter** (body), loaded from Google Fonts in `index.html`

### Data, charts & misc UI
- **recharts** — charts (used in admin dashboard)
- **embla-carousel-react** — carousels
- **react-day-picker** + **date-fns** — date inputs
- **react-resizable-panels**, **vaul** (drawer), **input-otp**
- **react-markdown** — renders AI chat assistant replies

### Analytics
- **posthog-js** — client SDK
- **`posthog-config`** edge function — exposes the public PostHog key/host so they don't have to be baked into the client bundle

### Backend (Supabase)
- **PostgreSQL 15** (Supabase)
- **PostgREST** Data API (auto-generated REST + the `supabase-js` client)
- **Supabase Auth** — email/password (Google OAuth scaffolded)
- **Supabase Storage** — `resumes` bucket (public) holding `resume.pdf`
- **Supabase Edge Functions** — Deno runtime, TypeScript
- **Supabase Realtime** — `portfolio_content` is broadcast on the `supabase_realtime` publication

### AI
- **OpenAI-compatible API** — used by the `portfolio-chat` edge function. Configurable via `AI_API_KEY`, `AI_BASE_URL`, and `AI_MODEL` Supabase secrets. Works with OpenAI, Google AI, OpenRouter, or any OpenAI-compatible provider.

### Testing & tooling
- **Vitest 3** + **@testing-library/react** + **jsdom** + **@testing-library/jest-dom** (config in `vitest.config.ts`, setup in `src/test/setup.ts`)
- **ESLint 9** (flat config in `eslint.config.js`) with `typescript-eslint`, `eslint-plugin-react-hooks`, `eslint-plugin-react-refresh`
- **PostCSS 8** + **Autoprefixer**

---

## Architecture

```text
┌─────────────────────────────────────────────────────────────────┐
│  Browser (React 18 SPA, built by Vite, served as static files)  │
│                                                                 │
│   • Public site  (/, /recommendations, /not-found)              │
│   • Admin panel  (/goth/*)  — auth-gated, role = 'admin'        │
│   • ⌘K command palette · interactive terminal easter egg        │
│   • PostHog page-views & events                                 │
└──────────────┬──────────────────────────────────────────────────┘
               │  HTTPS  (supabase-js)
               ▼
┌─────────────────────────────────────────────────────────────────┐
│  Supabase                                                       │
│  ┌──────────────┐  ┌──────────────┐  ┌────────────────────────┐ │
│  │ PostgreSQL   │  │ Auth         │  │ Storage                │ │
│  │ + RLS        │  │ (JWT)        │  │ bucket: resumes        │ │
│  └─────┬────────┘  └──────────────┘  └────────────────────────┘ │
│        │                                                        │
│  ┌─────▼────────────────────────────────────────────────────┐   │
│  │  Edge Functions (Deno)                                   │   │
│  │   • posthog-config   → exposes PostHog public key/host   │   │
│  │   • track-visit      → bumps visitor_counts via RPC      │   │
│  │   • portfolio-chat   → AI chat (OpenAI-compatible API)   │   │
│  │   • claim-first-admin→ one-shot bootstrap admin role     │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

**Data flow for portfolio content** (the most important pattern):
1. All site content lives in the `portfolio_content` table as JSONB rows keyed by `section` (`identity`, `heroSequence`, `experience`, `projects`, `skills`, `credentials`, `availability`, …).
2. `src/lib/portfolioStore.ts` exposes `usePortfolioSection(section)` — a TanStack Query hook that fetches a section, falls back to the static seed in `src/data/portfolio.ts` if missing, and subscribes to realtime `postgres_changes` so admin edits propagate live to all open tabs.
3. The admin panel (`/goth/*`) reads & writes rows through the same table. Writes are gated by RLS using `private.has_role(auth.uid(), 'admin')`.

---

## Features

- **Animated hero** — typed terminal sequence, network-particle canvas background, sound toggle (audible only for `whoami` commands).
- **Dynamic CMS** — every section (Hero, About, Experience, Projects, Skills, Credentials, Availability, Contact) is editable in `/goth/*` with no redeploy.
- **AI chat widget** — ask questions about the portfolio; answers stream from an OpenAI-compatible API via the `portfolio-chat` edge function.
- **Interactive terminal easter egg** (footer) — `help`, `whoami`, `ls`, `skills`, `neofetch`, `matrix`, `sudo hire goutham`, …
- **Visitor counter** — server-incremented via `track-visit` edge function; persisted in `visitor_counts`.
- **Resume download** — pulled from the public `resumes` storage bucket, hidden automatically if the file is absent.
- **Recommendations page** (`/recommendations`) — curated outbound links managed in the admin panel.
- **⌘K command palette** — quick navigation.
- **Admin panel** at `/goth` (deliberately not `/admin`) — Identity, Hero, Experience, Projects, Skills, Education, Certifications, Languages, Availability, Resume upload, Recommendations, Users.
- **PostHog** product analytics with public key fetched from an edge function (key never bundled).
- **SEO** — `index.html` head tags, `public/robots.txt`, `public/sitemap.xml`, JSON-LD `Person` schema in `src/components/JsonLd.tsx`.
- **Realtime sync** — admin edits propagate to all open visitor tabs without reload.

---

## Project layout

```text
.
├── index.html                  # Static head: title, meta, JSON-LD, fonts
├── public/
│   ├── robots.txt
│   └── sitemap.xml
├── src/
│   ├── main.tsx                # React entry, QueryClient + Router providers
│   ├── App.tsx                 # Route table
│   ├── index.css               # Tailwind layers + design tokens (HSL vars)
│   ├── data/portfolio.ts       # Seed/fallback portfolio data
│   ├── lib/
│   │   ├── portfolioStore.ts   # TanStack Query + Realtime CMS hook
│   │   ├── posthog.ts          # PostHog bootstrap (key fetched from edge fn)
│   │   └── utils.ts
│   ├── hooks/                  # useAuth, useReveal, useTilt, useTypewriter, ...
│   ├── integrations/supabase/  # Auto-generated client.ts + types.ts
│   ├── components/
│   │   ├── Nav.tsx, Footer.tsx, ScrollProgress.tsx, JsonLd.tsx
│   │   ├── CommandPalette.tsx, TerminalEasterEgg.tsx
│   │   ├── VisitorCounter.tsx, AiChatWidget.tsx
│   │   ├── TerminalWindow.tsx, TiltCard.tsx, NetworkParticles.tsx, ...
│   │   ├── sections/           # Hero, About, Experience, Projects, Skills, ...
│   │   ├── admin/              # Admin shell, RequireAdmin, SectionEditor, ...
│   │   └── ui/                 # shadcn/ui primitives (50+ components)
│   ├── pages/
│   │   ├── Index.tsx           # Public landing page
│   │   ├── Recommendations.tsx
│   │   ├── NotFound.tsx
│   │   └── admin/              # /goth/* admin pages
│   └── test/                   # Vitest setup + sample test
├── supabase/
│   ├── config.toml             # project_id + per-function config
│   ├── migrations/             # SQL migrations (history of schema changes)
│   └── functions/              # Deno edge functions
│       ├── posthog-config/index.ts
│       ├── track-visit/index.ts
│       ├── portfolio-chat/index.ts
│       └── claim-first-admin/index.ts
├── tailwind.config.ts
├── vite.config.ts
├── vitest.config.ts
├── tsconfig*.json
└── package.json
```

---

## Database schema

All tables live in the `public` schema. RLS is enabled on every table. The `has_role` helper lives in the `private` schema and is invoked from policies; the mirror `public.has_role` exists for legacy policies but `EXECUTE` is revoked from `anon` and `authenticated`.

| Table | Purpose | Read | Write |
| --- | --- | --- | --- |
| `portfolio_content` | JSONB blobs of all CMS sections, keyed by `section` | `anon`, `authenticated` (all) | admin only |
| `recommendations` | Outbound link list for `/recommendations` | `anon`, `authenticated` (all) | admin only |
| `user_roles` | Maps `user_id` → `app_role` (`admin` / `moderator` / `user`) | own row or admin | admin only |
| `visitor_counts` | Single-row counter (incremented via RPC from edge fn) | `anon`, `authenticated` | edge function only |

### Helper functions
- `public.has_role(uuid, app_role)` — SECURITY DEFINER, read-only on `user_roles`. Used in RLS.
- `private.has_role(uuid, app_role)` — same, schema-scoped; not exposed via the Data API.
- `public.claim_first_admin()` — one-shot bootstrap: first authed user can claim `admin` if no admin exists. Called by the `claim-first-admin` edge function.
- `public.increment_visitor_count()` — atomic `UPDATE … RETURNING count`. Called by `track-visit`.
- `public.touch_portfolio_content()` — trigger to stamp `updated_at` / `updated_by` on writes.

### Enum
- `public.app_role` — `('admin', 'moderator', 'user')`

### Realtime
- `portfolio_content` is added to the `supabase_realtime` publication so the client receives live `postgres_changes` events.

### Storage
- Bucket `resumes` (public). Holds `resume.pdf`. The Hero button HEADs the public URL on mount and hides itself if the file is missing.

---

## Edge functions

All deploy from `supabase/functions/*` and run on Deno.

| Function | Path | Auth | Purpose |
| --- | --- | --- | --- |
| `posthog-config` | `GET /functions/v1/posthog-config` | public | Returns `{ apiKey, host }` from server secrets so the client can `posthog.init` without bundling the key. |
| `track-visit` | `POST /functions/v1/track-visit` | public | Calls `increment_visitor_count` RPC with the service role and returns the new count. |
| `portfolio-chat` | `POST /functions/v1/portfolio-chat` | public | Streams chat completions from an OpenAI-compatible API using `AI_API_KEY`. Grounded in `portfolio_content` for context. |
| `claim-first-admin` | `POST /functions/v1/claim-first-admin` | authenticated | Calls `claim_first_admin()` — succeeds for the very first user, fails forever after. Used to bootstrap the admin user. |

Each function uses the standard CORS preamble (`OPTIONS` → return CORS headers) and validates input with zod where applicable.

---

## Authentication & roles

- **Auth**: Supabase email/password. Login form at `/goth/login`. Sign-up is not exposed publicly (this is a single-owner portfolio).
- **Roles**: stored in `user_roles` — never on a `profiles` table — to prevent privilege escalation.
- **Bootstrap flow**:
  1. Owner signs up via the Supabase Auth UI (or via the admin panel after enabling temporarily).
  2. Calls `POST /functions/v1/claim-first-admin` — backed by `claim_first_admin()` which inserts an `admin` row in `user_roles` only if **no admin currently exists**.
  3. From then on, only existing admins can grant the role to others.
- **`RequireAdmin`** (`src/components/admin/RequireAdmin.tsx`) gates every `/goth/*` route by checking `has_role(uid, 'admin')` via a TanStack Query against `user_roles`.

---

## Environment variables

The frontend reads the following from Vite at build time (they live in `.env`, which is gitignored):

| Var | Used for |
| --- | --- |
| `VITE_SUPABASE_URL` | Supabase project URL |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Public anon key (safe in client) |
| `VITE_SUPABASE_PROJECT_ID` | Used to construct edge-function URLs |

Edge functions read from **Supabase secrets** (never bundled into the frontend):

| Secret | Used by | Notes |
| --- | --- | --- |
| `SUPABASE_URL` | all | auto-provided by Supabase |
| `SUPABASE_ANON_KEY` | all | auto-provided by Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | `track-visit`, `claim-first-admin` | auto-provided by Supabase |
| `AI_API_KEY` | `portfolio-chat` | Your AI provider API key (OpenAI, Google, etc.) |
| `AI_BASE_URL` | `portfolio-chat` | Optional — defaults to `https://api.openai.com/v1` |
| `AI_MODEL` | `portfolio-chat` | Optional — defaults to `gpt-4o-mini` |
| `POSTHOG_API_KEY` | `posthog-config` | PostHog project public key |
| `POSTHOG_HOST` | `posthog-config` | e.g. `https://us.i.posthog.com` |

---

## Running locally

Prerequisites: **Node 20+** and **npm**.

```bash
git clone <your-repo-url>
cd <repo>
npm install
npm run dev          # Vite dev server on http://localhost:8080
```

Other scripts:

```bash
npm run build        # production build → dist/
npm run preview      # serve the built bundle locally
npm run lint         # ESLint
npm run test         # Vitest run-once
npm run test:watch   # Vitest watch mode
```

> The dev server connects to whatever Supabase project the `.env` points at. To run a fully local stack, use `supabase start`.

---

## Deploying to other platforms

This is a standard Vite SPA — `npm run build` outputs a static `dist/` folder. Any static host works.

### Vercel
```bash
npm i -g vercel
vercel
```
Set the env vars in the Vercel dashboard. Add a rewrite so client-side routes resolve:
```json
// vercel.json
{ "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }] }
```

### Netlify
```bash
npm i -g netlify-cli
netlify deploy --build
```
```toml
# netlify.toml
[build]
  command = "npm run build"
  publish = "dist"
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### Cloudflare Pages
- Connect GitHub repo in the Cloudflare dashboard.
- Build command: `npm run build`. Output: `dist`.
- Add a `_redirects` file in `public/`:
  ```
  /*  /index.html  200
  ```

### GitHub Pages
- Build with `npm run build`.
- Publish `dist/` via `actions/upload-pages-artifact` + `actions/deploy-pages`.
- Set Vite `base` in `vite.config.ts` to `/<repo-name>/`.
- Add a `404.html` that is a copy of `index.html` for SPA routing.

### Self-hosted (Docker + nginx)
```dockerfile
# Dockerfile
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:1.27-alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
```
```nginx
# nginx.conf — SPA fallback
server {
  listen 80;
  root /usr/share/nginx/html;
  location / { try_files $uri $uri/ /index.html; }
}
```

### Render / Railway / Fly.io
- Build command: `npm run build`
- Publish directory / static root: `dist`
- Add SPA fallback to `index.html`
- Set the three `VITE_*` env vars in the dashboard

> **Edge functions are NOT bundled with the frontend.** They live in your Supabase project and are called over HTTPS. Migrating the frontend hosting does not affect the backend.

---

## Security notes

- All tables have **RLS enabled**. Reads on `portfolio_content` / `recommendations` / `visitor_counts` are intentionally public; everything else is admin-gated.
- Admin role is stored in `user_roles` (separate table) — never on profiles — to prevent privilege-escalation via column updates.
- `EXECUTE` on every `SECURITY DEFINER` function is **revoked** from `anon` and `authenticated`. They remain callable from RLS policies and from edge functions using the service role.
- Storage bucket `resumes` is public **by design** (CV is meant to be downloaded). Don't store private files in it.
- `SUPABASE_SERVICE_ROLE_KEY`, `AI_API_KEY`, `POSTHOG_API_KEY` are only ever used inside edge functions — never bundled.
- Admin panel is mounted at `/goth` (not `/admin`) purely as security-by-obscurity. Real access control is RLS + `RequireAdmin`.

---

## SEO

- `index.html` ships title, meta description, Open Graph + Twitter Card tags, theme color, and a JSON-LD `Person` schema (rendered dynamically by `src/components/JsonLd.tsx` from the live `identity` section).
- `public/robots.txt` allows all major bots.
- `public/sitemap.xml` lists `/` and `/recommendations`.
- All images use `alt` text; semantic HTML throughout; single `<h1>` on the landing page.
- `<meta name="robots" content="index, follow, max-image-preview:large" />`.

---

## Suggested GitHub repository "About" blurb

> Terminal-aesthetic personal portfolio for Goutham K Suresh — Cloud & DevOps Engineer. React 18 + Vite + TypeScript + Tailwind + shadcn/ui on the frontend; Supabase Postgres (RLS), Auth, Storage, and Deno Edge Functions on the backend; PostHog analytics; AI chat via OpenAI-compatible API. Fully dynamic CMS-driven sections, admin panel at /goth, interactive in-browser terminal easter egg, ⌘K command palette, and live visitor counter.

**Suggested topics/tags:**
`react` · `typescript` · `vite` · `tailwindcss` · `shadcn-ui` · `radix-ui` · `supabase` · `postgresql` · `rls` · `deno` · `edge-functions` · `posthog` · `portfolio` · `devops` · `cloud-engineering` · `tanstack-query` · `react-router`

---

## License

Personal portfolio — all rights reserved unless otherwise noted. Code patterns are free to learn from and adapt.
