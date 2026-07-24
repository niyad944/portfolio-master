# Public Portfolio — Full Redesign

Replace `/p/:slug` (`src/pages/PublicPortfolio.tsx`) with a brand-new premium experience. Existing dashboard, auth, resume generator, and analyzer stay untouched. Data fetching from Supabase is preserved — only presentation is rebuilt.

## Design language

- Dark-first: deep navy → charcoal → black gradient base (`#05070d`, `#0b1020`, `#0f172a`) with electric blue / cyan / violet accents (`#3b82f6`, `#22d3ee`, `#8b5cf6`).
- Glassmorphism cards (`backdrop-blur`, translucent surfaces, soft inner highlight) + subtle neumorphic depth on stat/skill tiles.
- Animated aurora gradient + floating blurred blobs + soft particle layer behind hero and section transitions.
- Typography: **Space Grotesk** headings, **Inter** body (add to `index.css` font import; add tokens in `tailwind.config.ts`).
- New CSS tokens in `index.css` for the redesign: `--pf-bg`, `--pf-surface`, `--pf-accent-*`, gradient + glow utilities. No hardcoded colors in components.
- Optional light mode toggle via `data-theme="light"` on the portfolio root (scoped, doesn't touch app-wide dark theme).

## New file structure

```text
src/pages/PublicPortfolio.tsx            (rewritten shell + data fetch)
src/components/portfolio-v2/
  PortfolioShell.tsx                     (bg, particles, cursor glow, scroll progress)
  FloatingNav.tsx                        (glass nav + active section + theme + CTAs)
  HeroSection.tsx                        (avatar glow, gradient name, typing role)
  AboutSection.tsx                       (glass story card + animated stats + edu timeline)
  SkillsSection.tsx                      (circular indicators + radar + hover reveal)
  ProjectsSection.tsx                    (alternating tilt cards + modal)
  ExperienceTimeline.tsx                 (horizontal scroll timeline)
  CertificatesSection.tsx                (floating cards, SDG tags, scroll-in)
  AchievementsSection.tsx                (trophy cards w/ glow border + hover reveal)
  EducationSection.tsx                   (interactive timeline w/ logos + coursework)
  ResumeSection.tsx                      (browser-window preview + ATS/strength stats)
  AnalyticsSection.tsx                   (counters + charts using Recharts)
  AIInsightsSection.tsx                  (strengths / gaps / recs cards)
  ContactSection.tsx                     (glass form + socials + map placeholder)
  PortfolioFooter.tsx                    (animated logo + back-to-top + socials)
  primitives/
    GlassCard.tsx, MagneticButton.tsx, TiltCard.tsx, SectionHeading.tsx,
    AnimatedCounter.tsx, GradientText.tsx, Blob.tsx, Particles.tsx
```

Framer Motion (`framer-motion`) drives fade/slide/scale/stagger, magnetic buttons, tilt, and section transitions. Recharts (already installed) powers analytics + radar. `react-intersection-observer` triggers reveal animations. Add packages only if missing.

## Data + behavior

- Same Supabase queries as today (profile, projects, certificates, achievements, education, resume metadata). No schema changes.
- Sections render only when data exists — graceful empty handling, no placeholder noise.
- Public visibility flags from `PublicPortfolioSettings` are respected exactly as before.
- Contact form: client-side validation only (matches current behavior); success toast via existing `use-toast`.
- Portfolio Analytics + AI Insights sections read from existing tables if present; otherwise show a compact "coming soon" glass tile rather than being removed (keeps layout premium).

## Performance + a11y

- `React.lazy` + `Suspense` for below-the-fold sections (Projects, Certificates, Analytics, AI, Contact).
- Images use `loading="lazy"` + `decoding="async"`; hero avatar preloaded.
- `prefers-reduced-motion` disables blobs, tilt, magnetic, and parallax (respected via existing global rule + per-component guards).
- Semantic landmarks: single `<main>`, `<nav>`, `<section aria-labelledby>` per block, focus-visible rings using accent token.
- Keyboard: nav links + CTA buttons fully focusable; modal traps focus via existing shadcn `Dialog`.

## Out of scope

- Dashboard UI, auth flows, resume generator, analyzer logic — untouched.
- Database schema, edge functions, RLS — untouched.
- Public document view (`/p/:slug/document/:docId`) — keep current design; only the portfolio landing is rebuilt.

## Rollout

1. Add design tokens + fonts.
2. Build primitives (glass, tilt, magnetic, counter, particles, blob).
3. Build sections top-down (Hero → Footer), each wired to real data.
4. Swap `PublicPortfolio.tsx` to new shell; delete legacy inline JSX.
5. Verify build, then spot-check with a Playwright screenshot at desktop + mobile widths.
