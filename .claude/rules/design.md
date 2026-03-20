# design.md — Design System Reference

This document is the single source of truth for the visual language, design tokens, and UI conventions used in **Portfolio 2026** (palexandre.com). Always reference this file before adding or modifying any UI.

---

## Aesthetic & Mood

- **Dark, premium, editorial** — near-black background, warm off-white text, electric lime accent
- **Futuristic but typographically grounded** — oversized display type contrasted with tight mono labels
- **Motion-forward** — parallax, spring physics, scroll-driven reveals; never static
- **Grain + glass** — subtle film grain overlay and frosted-glass cards with low-opacity borders
- **Custom cursor** on desktop (pointer: fine) — native cursor is hidden site-wide above 1024px

---

## Color Tokens

All colors are defined as CSS custom properties in `src/styles/index.css` and `src/styles/theme.css`.

### Core palette

| Token | Value | Usage |
|---|---|---|
| `--c-bg` | `#0a0a0b` | Page background |
| `--c-fg` | `#e8e6e3` | Primary text (warm off-white) |
| `--c-fg-muted` | `#8a8a96` | Secondary / supporting text |
| `--c-fg-dim` | `#6b6b76` | Placeholder, inactive states |
| `--c-fg-ghost` | `#3a3a42` | Decorative / ghost text |
| `--c-accent` | `#c4ff00` | Electric lime — primary accent |
| `--c-accent-muted` | `rgba(196,255,0,0.5)` | Accent at 50% opacity |
| `--c-accent-ghost` | `rgba(196,255,0,0.08)` | Accent hover glow / fills |
| `--c-border` | `rgba(255,255,255,0.06)` | Default subtle border |
| `--c-border-hover` | `rgba(196,255,0,0.15)` | Border on hover |

### shadcn/ui semantic tokens (theme.css)

| Token | Value |
|---|---|
| `--background` | `#0a0a0b` |
| `--foreground` | `#e8e6e3` |
| `--card` | `#111113` |
| `--secondary` | `#1a1a1e` |
| `--muted` | `#1a1a1e` |
| `--muted-foreground` | `#6b6b76` |
| `--accent` | `#c4ff00` |
| `--border` | `rgba(255,255,255,0.08)` |
| `--destructive` | `#ff3333` |
| `--radius` | `0.625rem` |

### Usage rules

- Use `--c-accent` / `bg-[#c4ff00]` only for key interactive moments, CTAs, and active indicators — never as a background color for large areas.
- Borders should almost always use `--c-border` (white/6%) or `border-white/[0.06]`. On hover transition to `--c-border-hover` (lime/15%).
- Glass cards: `bg-white/[0.02] backdrop-blur-sm border border-white/[0.06]`

---

## Typography

### Font families

| Variable | Font | Weights | Role |
|---|---|---|---|
| `--font-display` | **Syne** | 400–800 | Headlines, display, oversized type |
| `--font-body` | **Space Grotesk** | 300–700 | Body copy, UI text |
| `--font-mono` | **JetBrains Mono** | 300–500 | Labels, buttons, captions, code |
| `--font-serif` | **Instrument Serif** | italic | Editorial accent moments only |

Loaded via Google Fonts in `src/styles/fonts.css`.

### Typographic scale

| Token | Value | Notes |
|---|---|---|
| `--type-mega` | `clamp(3.5rem, 12vw, 11rem)` | Hero-scale oversized text |
| `--type-display` | `clamp(2.8rem, 8vw, 8rem)` | Section hero headlines |
| `--type-headline` | `clamp(2rem, 5vw, 4.5rem)` | h1 default |
| `--type-title` | `clamp(1.6rem, 3.2vw, 3rem)` | h2 default |
| `--type-body-lg` | `clamp(1.05rem, 1.4vw, 1.35rem)` | Lead / intro paragraphs |
| `--type-body` | `0.9375rem` | Default body (15px) |
| `--type-caption` | `0.8125rem` | Captions, footnotes |
| `--type-label` | `0.625rem` | Mono labels (uppercase) |
| `--type-micro` | `0.5625rem` | Smallest mono labels |

**Minimum font size enforced: 0.6875rem (11px)** — utility classes below this are overridden.

### Type utility classes

| Class | Description |
|---|---|
| `.type-mega` | Syne 800, mega scale, line-height 0.85, tracking -0.045em |
| `.type-display` | Syne 800, display scale, line-height 0.9, tracking -0.035em |
| `.type-headline` | Syne 800, headline scale |
| `.type-title` | Syne 700, title scale |
| `.type-body-lg` | Space Grotesk 300, large body, line-height 1.75 |
| `.type-body` | Space Grotesk, 15px, line-height 1.75 |
| `.type-label` | JetBrains Mono, uppercase, letter-spacing 0.5em |
| `.type-label-sm` | JetBrains Mono micro, uppercase, letter-spacing 0.5em |
| `.type-serif` | Instrument Serif italic — editorial accent only |
| `.type-stroke` | Outlined text, white/20% stroke, transparent fill |
| `.type-stroke-accent` | Outlined text, lime/25% stroke, transparent fill |

### Letter-spacing presets

| Token | Value | Use |
|---|---|---|
| `--track-tight` | `-0.045em` | Mega / display headlines |
| `--track-display` | `-0.035em` | h1, h2 |
| `--track-normal` | `-0.01em` | Body copy |
| `--track-wide` | `0.12em` | Subtle caps labels |
| `--track-wider` | `0.3em` | Buttons |
| `--track-widest` | `0.5em` | Labels (type-label) |

### Line-height presets

| Token | Value |
|---|---|
| `--lead-tight` | `0.85` |
| `--lead-display` | `0.9` |
| `--lead-normal` | `1.5` |
| `--lead-relaxed` | `1.75` |
| `--lead-loose` | `2` |

### Heading element defaults

```
h1  → Syne 800, --type-headline, line-height 0.9, tracking -0.035em
h2  → Syne 700, --type-title, line-height 1.0, tracking -0.03em
h3  → Syne 600, text-lg, line-height 1.15, tracking -0.02em
h4  → Space Grotesk 500, text-base, line-height 1.3
label → JetBrains Mono 400, 0.6875rem, uppercase, tracking 0.5em
button → JetBrains Mono 400, 0.6875rem, uppercase, tracking 0.3em
```

---

## Spacing System

8px base unit with generous vertical rhythm.

| Token | Value | Use |
|---|---|---|
| `--space-xs` | `0.5rem` (8px) | Tight gaps |
| `--space-sm` | `1rem` (16px) | Inner component spacing |
| `--space-md` | `2rem` (32px) | Component-level gaps |
| `--space-lg` | `4rem` (64px) | Section sub-elements |
| `--space-xl` | `6rem` (96px) | Section padding (mobile) |
| `--space-2xl` | `10rem` (160px) | Section padding (default) |
| `--space-3xl` | `16rem` (256px) | Major section separators |

### Gutters

| Token | Value |
|---|---|
| `--gutter` | `clamp(1.5rem, 4vw, 3rem)` |
| `--gutter-wide` | `clamp(2rem, 6vw, 5rem)` |

Mobile (≤480px): gutter=1.25rem, gutter-wide=1.5rem.

### Layout utilities

| Class | Description |
|---|---|
| `.section-pad` | Applies horizontal gutter-wide padding |
| `.section-gap` | Applies vertical space-2xl (space-lg on mobile) |

### Max content widths

| Token | Value | Use |
|---|---|---|
| `--max-prose` | `38rem` | Readable prose blocks |
| `--max-content` | `72rem` | Standard content container |
| `--max-wide` | `90rem` | Full-width sections |

---

## Border Radius

| Token | Value |
|---|---|
| `--radius-sm` | `0.25rem` |
| `--radius-md` | `0.4375rem` |
| `--radius-lg` | `0.625rem` (default) |
| `--radius-xl` | `0.875rem` |

Cards and glass panels generally use `rounded-lg` (--radius-lg) or `rounded-xl`.

---

## Motion & Animation

### Standard easing

```ts
const EASE = [0.25, 0.46, 0.45, 0.94] // Custom ease-out — used throughout
```

Use `ease: [0.25, 0.46, 0.45, 0.94]` as the default for all transitions.

### Spring config

```ts
{ stiffness: 50, damping: 20 }  // Parallax / mouse-follow springs
```

### Common animation patterns

| Pattern | Implementation |
|---|---|
| Fade + blur in | `initial: { opacity:0, filter:"blur(10px)" }` → `animate: { opacity:1, filter:"blur(0px)" }` |
| Slide up reveal | `initial: { opacity:0, y:24 }` → `animate: { opacity:1, y:0 }` |
| Scale in | `initial: { opacity:0, scale:0.8 }` → `animate: { opacity:1, scale:1 }` |
| Scroll parallax | `useScroll` + `useTransform` + `useSpring` |
| Mouse parallax | `useMotionValue` (normalized -0.5→0.5) + `useTransform` + `useSpring` |

### Duration guidelines

- Micro interactions (hover, button): `0.2–0.3s`
- Component reveals: `0.6–1.0s`
- Hero/page entrances: `1.0–1.5s` with staggered delays
- Menu overlay open/close: `0.35s` with EASE

### Accessibility

`@media (prefers-reduced-motion: reduce)` collapses all animation durations to `0.01ms`. All motion is respecting this. Do not use `!important` to override it.

#### WCAG 2.1/2.2 Level AA Contrast

All text must meet **WCAG 2.1/2.2 Level AA** minimum contrast ratios:

| Text type | Minimum ratio |
|---|---|
| Normal text (< 18px / < 14px bold) | **4.5 : 1** |
| Large text (≥ 18px regular / ≥ 14px bold) | **3 : 1** |
| UI components & graphical objects | **3 : 1** |

**Approved pairings on `#0a0a0b` background:**

| Foreground | Approx. ratio | Status |
| --- | --- | --- |
| `--c-fg` `#e8e6e3` | ~18 : 1 | ✓ Pass |
| `--c-fg-muted` `#8a8a96` | ~4.6 : 1 | ✓ Pass (normal) |
| `--c-fg-dim` `#6b6b76` | ~3.1 : 1 | ✓ Pass (large only) |
| `--c-accent` `#c4ff00` | ~13 : 1 | ✓ Pass |
| `--c-fg-ghost` `#3a3a42` | ~1.8 : 1 | ✗ Decorative only — never use for readable text |

**Rules:**

- Never use `--c-fg-ghost` (`#3a3a42`) or lower for any text that conveys meaning — decorative/oversized stroke labels only.
- `--c-fg-dim` (`#6b6b76`) may only be used for large text (≥ 18px) or bold text (≥ 14px bold) — not for normal body copy.
- `--c-fg-muted` (`#8a8a96`) is the minimum for body/caption text.
- The lime accent `#c4ff00` on dark `#0a0a0b` passes at ~13:1 — safe for all uses.
- When placing text on semi-transparent overlays or glass cards, verify contrast against the actual rendered background, not just `--c-bg`.

---

## Special Visual Elements

### Grain overlay

A fixed, pointer-events-none SVG fractalNoise overlay at opacity `0.018` renders over the entire page for film grain texture. Class: `.grain-overlay`. Applied once in the root layout.

### Custom cursor

Desktop only (`min-width: 1024px` + `pointer: fine`). Native cursor is hidden (`cursor: none !important`). Implemented in `CustomCursor.tsx`.

### Scrollbar

Thin 3px scrollbar. Track: `--c-bg`. Thumb: `rgba(196,255,0,0.12)` → hover `rgba(196,255,0,0.25)`.

### Text selection

`background: rgba(196,255,0,0.15)` — lime tinted selection color.

### Focus styles

`outline: 1.5px solid rgba(196,255,0,0.6)` with 3px offset. On-brand and accessible.

### Editorial divider

```css
.editorial-rule  /* 1px gradient line: lime-ghost → border → transparent */
```

### Oversized section labels

```css
.oversized-label  /* clamp(3.5rem, 14vw, 18rem), transparent, white/3% stroke — decorative */
```

### Glass card pattern

```
bg-white/[0.02] backdrop-blur-sm border border-white/[0.06] rounded-lg
```

### Stroke text

```
.type-stroke         /* white/20% stroke, transparent fill */
.type-stroke-accent  /* lime/25% stroke, transparent fill */
```

---

## Component Conventions

### Buttons

- Font: JetBrains Mono 400, uppercase, tracking 0.3em
- Primary CTA: `bg-[#c4ff00] text-[#0a0a0b]`
- Ghost/outline: `border border-white/[0.06]`, hover → lime border
- No border-radius above `rounded-full` for pill or `rounded-lg` for standard

### Navigation (FloatingNav)

- Fixed position, scroll-aware opacity/blur
- Logo left / nav items center / CTA right
- Hamburger animates to × (animated spans, not icon swap)
- Uses `AnimatePresence` for menu overlay mount/unmount

### Tags / Chips

- Mono font, small, `rounded-full` pill shape
- `bg-white/[0.04] border border-white/[0.06]` at rest
- Accent variant: `bg-[#c4ff00]/10 border border-[#c4ff00]/20 text-[#c4ff00]`

### Cards (work/case study)

- Dark card background `#111113`
- Subtle border `border-white/[0.06]`
- Hover: scale up slightly + border lightens toward lime

---

## Responsive Breakpoints

| Label | Breakpoint |
|---|---|
| Mobile | ≤ 480px |
| Tablet | 481px – 1023px |
| Desktop | ≥ 1024px |

Custom cursor and floating UI fragments are desktop-only (`hidden lg:block`).

---

## Do's and Don'ts

**Do:**
- Use `--c-accent` (`#c4ff00`) sparingly — it is the single brand accent
- Use Syne for all display/headline type
- Use JetBrains Mono for all labels, buttons, captions
- Animate with `motion/react` — do not use raw CSS `@keyframes` for interactive motion
- Honor `prefers-reduced-motion`
- Keep borders subtle: white/6% default, lime/15% on hover

**Don't:**
- Do not use white or light backgrounds — this is a dark-only design
- Do not add color beyond the established palette without discussion
- Do not use `cursor: auto` or override the cursor hiding logic on desktop
- Do not use serif (Instrument Serif) for body copy — it is an editorial accent only
- Do not use tight line-heights on body copy — use `--lead-relaxed` (1.75) minimum
- Do not skip motion entrance animations on new sections/components
