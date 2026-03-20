# CLAUDE.md — Portfolio 2026

This file provides context and guidance for Claude Code when working in this repository.

---

## Project Overview

**Futuristic Portfolio 2026** — Personal portfolio website for Paulo Alexandre (UX/Product Designer).
Built with React + Vite + TypeScript + Tailwind CSS v4 + shadcn/ui (Radix UI) + Motion (Framer Motion).

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 + React Router 7 |
| Build tool | Vite 6 |
| Language | TypeScript |
| Styling | Tailwind CSS v4, CSS variables, custom themes |
| UI primitives | Radix UI (via shadcn/ui pattern) |
| Animation | Motion (Framer Motion v12) |
| Icons | Lucide React, MUI Icons |
| Forms | React Hook Form |
| Drag & Drop | React DnD |

---

## Project Structure

```
src/
├── app/
│   ├── App.tsx                  # Root app component
│   ├── routes.ts                # React Router route definitions
│   └── components/
│       ├── HomePage.tsx         # Main landing page
│       ├── CaseStudyPage.tsx    # Dynamic case study route (/case-study/:slug)
│       ├── ResumePage.tsx       # Resume page (/resume)
│       ├── NotFoundPage.tsx     # 404 page
│       ├── HeroSection.tsx
│       ├── SelectedWorks.tsx
│       ├── ImmersiveGallery.tsx
│       ├── ContactSection.tsx
│       ├── EditorialAbout.tsx
│       ├── ImpactSection.tsx
│       ├── ProcessSection.tsx
│       ├── TestimonialsSection.tsx
│       ├── MarqueeStrip.tsx
│       ├── FloatingNav.tsx
│       ├── MenuOverlay.tsx
│       ├── VideoShowcase.tsx
│       ├── FullScreenMoment.tsx
│       ├── BeforeAfterSlider.tsx
│       ├── SectionDivider.tsx
│       ├── CustomCursor.tsx
│       ├── figma/               # Figma-exported components
│       └── ui/                  # shadcn/ui primitives (accordion, button, dialog, etc.)
├── imports/
│   └── pasted_text/             # Source content (case studies, resume markdown files)
├── assets/                      # Static assets (images, videos, fonts)
└── styles/
    ├── index.css
    ├── tailwind.css
    ├── theme.css                # CSS custom properties / design tokens
    └── fonts.css
```

---

## Routes

| Path | Component |
|---|---|
| `/` | `HomePage` |
| `/case-study/:slug` | `CaseStudyPage` |
| `/resume` | `ResumePage` |
| `*` | `NotFoundPage` |

---

## Development Commands

```bash
npm install       # install dependencies
npm run dev       # start dev server (Vite)
npm run build     # production build
```

---

## Conventions

- Components live in `src/app/components/`. One component per file, named exports preferred.
- UI primitives (shadcn/ui pattern) live in `src/app/components/ui/` — do not modify these unless necessary.
- Figma-exported components live in `src/app/components/figma/` — treat as design-generated code.
- Styling uses Tailwind utility classes + CSS variables defined in `src/styles/theme.css`.
- Animations use the `motion` package (import from `"motion/react"`).
- Content (case studies, resume copy) lives as markdown in `src/imports/pasted_text/`.

---

## Custom Rules & Agents

- Rules: `.claude/rules/`
- Agents: `.claude/agents/`
