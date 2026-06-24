# Hackin' 4 Harden — Design Implementation Guide

> **Companion document to** `hackin4harden-brand-guide.html`.
> **Audience** — frontend engineers, UI designers, contractors, and anyone touching production surfaces.
> **Status** — internal. Treat every rule below as a law unless explicitly approved otherwise by the Brand & Strategy custodian.

This document is not a brand manifesto. The brand manifesto already exists. This is the **execution layer** — the rulebook that converts brand strategy into pixels, components, motion, and page structure. If the brand guide tells you _what_ the brand believes, this document tells you _exactly how_ to render that belief in the website.

When the two documents disagree, the brand guide wins on intent and this document wins on implementation. When this document is silent on a question, default to the most restrained, documentation-grade option available.

---

## Table of Contents

| #   | Section                         |
| --- | ------------------------------- |
| 01  | Design Philosophy               |
| 02  | Layout System Rules             |
| 03  | Typography Rules                |
| 04  | Color Implementation Rules      |
| 05  | Component Styling Rules         |
| 06  | Animation Rules                 |
| 07  | Section Construction Principles |
| 08  | Interaction Design Rules        |
| 09  | Responsive Design Laws          |
| 10  | Forbidden Design Mistakes       |
| 11  | Final UI Quality Standard       |

---

## 01 · Design Philosophy

The website must communicate, in the order a visitor experiences them, **competence → clarity → specificity → trust**. It must never lead with theatrics, decorative motion, or sales-led urgency.

### Five non-negotiable feelings the surface must produce

1. **Cybersecurity authority.** The visitor should feel they are reading a document made by practitioners who actually ship — not a marketing site styled to look "techy." Authority is earned through density, precision, and visible artifacts, not through hero animations.
2. **Premium SaaS trust.** Every element should look engineered: tight grid, disciplined spacing, deliberate typography, no template flourishes. Reference standard: Snyk, Wiz, HackerOne, Tenable — but quieter, warmer, and more documentation-coded.
3. **Futuristic but professional.** Modern feel comes from typography rhythm, restrained motion, and surface clarity — not neon, not glassmorphism, not gradient mesh tricks. The brand's "future" looks like a well-built defensive system, not a science-fiction movie poster.
4. **Educational confidence.** Pages should read like reference material a learner can actually use. Where copy explains, the layout supports the explanation; where it persuades, it does so with evidence, never adjectives.
5. **Enterprise-grade polish.** Every screen must hold up under the scrutiny of a CISO who is mid-evaluation. Anything that looks like a Wix template, a generic startup landing page, or a dashboard demo is unacceptable.

### One mental model for every design decision

> Ask before shipping any UI: _Would a senior practitioner pause on this and trust it more — or skip past it because it feels like marketing?_

If the answer is the second, redesign it.

---

## 02 · Layout System Rules

### Container widths

| Surface                                          | Max width              | Horizontal padding (mobile → desktop) |
| ------------------------------------------------ | ---------------------- | ------------------------------------- |
| **Marketing pages** (home, about, pricing, etc.) | `1280px` (`max-w-7xl`) | `1.25rem` → `2rem`                    |
| **Documentation / methodology**                  | `1080px`               | `1.25rem` → `2rem`                    |
| **Product / dashboard**                          | `1440px`               | `1rem` → `1.5rem`                     |
| **Forms (focused)**                              | `560px`                | `1.25rem` → `2rem`                    |

Use the shared `<Container>` primitive. Never set page-level `max-width` on raw `<div>` elements; always go through Container or Section. Do not nest two Containers.

### Vertical section spacing — the rhythm law

Every top-level section uses the `section-pad` utility:

```css
padding-top: clamp(4.5rem, 8vw, 8.75rem);
padding-bottom: clamp(4.5rem, 8vw, 8.75rem);
```

This produces:

- Mobile: ~72 px top + 72 px bottom
- Tablet: ~96 px
- Desktop: ~140 px

Do not override section padding with one-off `py-20`, `py-32`, etc. on individual sections without explicit reason. **Visual rhythm is achieved by section repetition, not section uniqueness.**

Inside a section:

- 56 px between section header and section body (desktop) / 32 px (mobile).
- 24 px between cards in a grid.
- 16 px between elements inside a card.

### The 12-column grid

- Default desktop grid: `grid-cols-12 gap-6 lg:gap-8`.
- Default hero split: **8 / 4** (content / supporting card). Not 6/6. Avoid perfect halves on hero compositions.
- Default explainer split: **7 / 5**.
- Default feature row: 3-up (`grid-cols-1 md:grid-cols-3`) or 4-up (`grid-cols-2 md:grid-cols-4`). Never 5-up at desktop — 5 columns of small cards reads as a directory listing, not a designed surface.

### Bento sections

Reserved for the _Capabilities_ and _Sub-brand_ sections. Rules:

- 6-column sub-grid.
- No two adjacent tiles share the same span (visual asymmetry is the point).
- 16 px tile gap on mobile, 20 px on desktop.
- Tile `border-radius` is uniform — pick `1rem` and never mix with smaller tiles.

### Visual breathing room

- 64 px minimum between any two unrelated elements.
- 24 px minimum between two related elements.
- 8 px snap baseline. Every margin and padding token is a multiple of 4. Never write a value like `padding: 18px`.

### Responsive behavior philosophy

- **Mobile-first**, always. Default Tailwind classes target 375 px.
- Layout collapses gracefully — single column at `< 768px`, two columns at `md` (`768px`), three at `lg` (`1024px`), full grid at `xl` (`1280px`).
- Content order on mobile must match reading order — no `order-` reshuffles that hide the most important content below decorative blocks.

---

## 03 · Typography Rules

Three families. Three jobs. No exceptions.

| Role                            | Family         | Tailwind class | Weights allowed |
| ------------------------------- | -------------- | -------------- | --------------- |
| **Display + headings**          | Space Grotesk  | `font-display` | 500, 600, 700   |
| **Body + UI text**              | Inter          | `font-sans`    | 400, 500, 600   |
| **Mono / labels / code / data** | JetBrains Mono | `font-mono`    | 500, 600, 700   |

### Heading font usage

- Every H1, H2, H3 uses `font-display`.
- Never set headings in Inter. Inter is for paragraphs, UI labels, and small print only.
- Never set headings in mono. Mono is for eyebrows, code, version strings, technical labels — not headings.

### Heading weights

- **H1 / display hero** — `font-bold` (700).
- **H2 / section** — `font-semibold` (600).
- **H3 / card / subsection** — `font-semibold` (600).
- **H4 / feature row title** — `font-medium` (500).

Do not mix three different weights inside a single section header. One headline, one weight.

### No mixed heading styles

A single H2 or H1 must use one font family, one weight, one tracking, one line-height. The only allowed in-headline accent is a **single coloured word** in `text-gold-400` or `text-green-500`. That word must remain in the same family and same weight as the rest of the headline. **Italic accents and serif accents are not used.**

### No decorative split heading words

- Do not break a single phrase across two lines for ornamental effect ("Hackin' / 4 / Harden" stacked decoratively in body text).
- The cover lockup is the only place stacked split words are allowed; they are part of the logo lockup, not a typographic device for heroes.
- Headlines should break naturally on word boundaries, controlled by `max-width` and `text-wrap: balance` — never forced with `<br>` for visual rhythm.

### Hierarchy scale

| Level                   | Size (mobile → desktop) | Line-height | Tracking |
| ----------------------- | ----------------------- | ----------- | -------- |
| Display 2XL (hero only) | 56 → 112 px             | 0.92        | -0.035em |
| H1 / display XL         | 44 → 80 px              | 0.96        | -0.030em |
| H2 / display LG         | 32 → 48 px              | 1.05        | -0.020em |
| H3                      | 22 → 28 px              | 1.15        | -0.015em |
| H4                      | 18 → 20 px              | 1.25        | -0.010em |
| Lead paragraph          | 18 → 20 px              | 1.55        | 0        |
| Body                    | 16 px                   | 1.65        | 0        |
| Body small              | 14 px                   | 1.6         | 0        |
| Eyebrow / mono label    | 12 px (uppercase)       | 1.4         | 0.22em   |
| Code / terminal         | 14 px                   | 1.55        | 0        |

### Readability standards

- **Body line-length:** maximum 64 characters per line on long-form content (`max-w-prose` or explicit `max-w-[64ch]`). Marketing copy may go to 72 characters.
- **Body color:** never the same as the heading color. Use `text-mesh-600` on cream surfaces, `text-cream-100/72` on navy surfaces.
- **Minimum body size on production:** 16 px. Captions and metadata may go to 12–13 px in mono only.
- Avoid `text-justify`. Always left-align body copy.

---

## 04 · Color Implementation Rules

The palette is extracted directly from the official mark. Treat every colour below as a load-bearing token — not a swatch a designer can substitute for personal preference.

### The five system colours

| Token                 | Tailwind                              | Hex       | Role                                                                            |
| --------------------- | ------------------------------------- | --------- | ------------------------------------------------------------------------------- |
| **Midnight Navy 900** | `bg-navy-900` / `text-navy-900`       | `#1B2A40` | Primary dark surface (heroes, footer, dark sections)                            |
| **Augusta Green 500** | `bg-green-500` / `text-green-500`     | `#2E7D3F` | Primary brand accent — primary CTAs, links, active state                        |
| **Masters Gold 400**  | `bg-gold-400` / `text-gold-400`       | `#C28A20` | Secondary brand accent — eyebrows, ceremonial moments, gold rule, monogram fill |
| **Flag Crimson 500**  | `bg-crimson-500` / `text-crimson-500` | `#C8362B` | Urgency only — error states, breach warnings, destructive actions               |
| **Cream 50**          | `bg-cream-50`                         | `#FAF6EC` | Primary light surface — page background on light pages                          |

Plus: Mesh greys (`mesh-400`, `mesh-600`, `mesh-800`) for body text and dividers.

### Usage discipline

```
Surface ratio target across the site

55%  navy-900 / navy-800     (dark surfaces, hero, footer)
25%  cream-50 / cream-100    (light section alternates)
10%  green-500               (accents, CTAs, links)
 6%  gold-400                (ceremonial accent, eyebrows)
 3%  green-300 / sage         (status indicators)
 1%  crimson-500              (urgency only)
```

If you find yourself reaching for the gold for a fourth time on the same page, you have used too much. Drop it back.

### Primary dark backgrounds

- `bg-navy-900` is the brand's canonical dark surface. Hero, footer, and any "dark mode within a light page" section.
- `bg-navy-800` is for cards on a navy surface — one shade lighter than the page.
- `bg-navy-950` is for deepest contrast moments — final CTA before footer, brand cover surfaces.
- Never use pure black (`#000000`) anywhere. Pure black is harsh and unbranded.

### Primary light backgrounds

- `bg-cream-50` is the canonical light page background. **Pure white (`#FFFFFF`) is forbidden** for page-level backgrounds — it kills the brand's tournament-paper warmth.
- `bg-cream-100` is the alternating section on light pages.
- `bg-cream-200` is for inset cards / form backgrounds on cream surfaces.

### Accent colour rules

#### Augusta Green (the primary accent)

- Use for: primary CTAs, hyperlinks, focused inputs, active nav state, status pills (live/pass), quote marks in pull-quotes, the brand's structural rules.
- Do not use for body text. It is a colour the user must scan and notice — buried in copy, it loses meaning.
- Hover state: green-600 (deeper). Pressed: green-700.

#### Masters Gold (the ceremonial accent)

- Use for: eyebrows, monogram fill, accent words inside a navy-on-cream headline, certificate accents, "human-led" moments (instructor pages, founder bios, partner logos).
- Use sparingly — gold is the brand's emotional warmth. Overuse turns the surface into a holiday card.
- Never apply gold and crimson next to each other — the colours fight.

#### Flag Crimson (urgency only)

- Use **only** for: error states, destructive button confirmations, security breach warnings, form validation errors, "spots filling up" tournament urgency.
- Never decorative. Never on dividers. Never on hero accent words. Never on hover states for non-destructive actions.
- If you cannot articulate why this specific element warrants crimson, it does not warrant crimson.

### Muted support tones

- **Mesh 600** (`text-mesh-600`, `#4D453A`) — body text on cream.
- **Mesh 400** (`text-mesh-400`, `#8B8169`) — captions, metadata, mono labels on cream.
- **Cream 100/72** (i.e. `text-cream-100/72`) — body text on navy.
- **Cream 100/55** — captions on navy.

### Hover colours

| Base                         | Hover treatment                                              |
| ---------------------------- | ------------------------------------------------------------ |
| Primary CTA (`bg-green-500`) | `hover:bg-green-600`                                         |
| Gold CTA (`bg-gold-400`)     | `hover:bg-gold-300`                                          |
| Ghost button (border navy)   | `hover:bg-navy-900 hover:text-cream-50`                      |
| Text link (`text-green-500`) | `hover:underline` (do not change colour)                     |
| Nav link                     | `hover:text-green-500` (was `text-navy-800`)                 |
| Card                         | `hover:shadow-elev` + 2 px lift via `hover:-translate-y-0.5` |

Hover transitions: `transition-all duration-200 ease-out-soft`.

### Border colours

| Surface          | Border                                                        |
| ---------------- | ------------------------------------------------------------- |
| Cream surface    | `border-cream-200` (default), `border-cream-300` (emphasised) |
| Navy surface     | `border-navy-700` (default), `border-navy-600` (emphasised)   |
| Active / focused | `border-green-500`                                            |
| Error            | `border-crimson-500`                                          |

Never use `border-gray-200`, `border-slate-300`, etc. The brand has its own neutral scale; use it.

### Glow colours

Glow is **strictly rationed**. Three approved glow moments only:

1. **Cyan-free trace line** between sections — a 1 px gold-tinted hairline with `box-shadow: 0 0 18px rgba(194,138,32,0.4)`. Used as section transition device on long-form pages, never decoratively.
2. **Focus ring** on inputs / CTAs — `focus-visible:ring-2 focus-visible:ring-gold-400 focus-visible:ring-offset-2`. This is the only place gold "glows."
3. **Hero halo** — a single radial gold gradient behind the hero stat block. Implementation: `radial-gradient(circle, rgba(194,138,32,0.18), transparent 60%)`. Used once per page maximum.

Forbidden glow patterns:

- Glow on every card.
- Glow on body text.
- Glow on hover states.
- Animated pulsing glow loops.
- "Gamer" RGB cycling.

### Text contrast logic

- All text must clear WCAG AA at minimum (4.5:1 for body, 3:1 for large text).
- Primary CTAs and hero text targeted at AAA (7:1).
- When in doubt, run the colour combination through a contrast checker before committing.

---

## 05 · Component Styling Rules

Every component listed below must be implemented as a single reusable JSX component under `src/components/ui/` or `src/components/sections/`. Do not duplicate component styling inline.

### Buttons

Every button on the site is one of five variants:

| Variant           | Use                                                                   | Class composition                                                                              |
| ----------------- | --------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| **Primary**       | The single most important action on a screen (Register, Submit, Book) | `bg-green-500 text-cream-50 hover:bg-green-600`                                                |
| **Gold**          | Ceremonial / human-led actions (Donate, Sponsor, Contact Founders)    | `bg-gold-400 text-navy-900 hover:bg-gold-300`                                                  |
| **Ghost (dark)**  | Secondary action on cream surfaces                                    | `border border-navy-900 bg-transparent text-navy-900 hover:bg-navy-900 hover:text-cream-50`    |
| **Ghost (light)** | Secondary action on navy surfaces                                     | `border border-cream-50/30 bg-transparent text-cream-50 hover:bg-cream-50 hover:text-navy-900` |
| **Link**          | Inline text actions ("Read methodology →")                            | `text-green-500 underline-offset-4 hover:underline`                                            |

Universal button rules:

- Shape: `rounded-full`. No square or rounded-square buttons anywhere on the marketing site.
- Typography: `font-mono font-semibold uppercase tracking-[0.18em] text-xs`.
- Sizes: `sm` (h-9 px-4), `md` (h-11 px-6), `lg` (h-12 px-7).
- Icons inside buttons: 16 px, stroke 1.5, on the right side, with 8 px gap. Use `lucide-react` only.
- One primary button per section. If you find yourself adding a second primary, you have a hierarchy problem — fix the layout, not the button.

### Cards

Three approved card patterns:

#### 1. Standard card (cream surface)

```
bg-white  border border-cream-200  rounded-xl  p-8
top-rule:  3 px green-500, inset 32 px from edges
hover:     translate-y-[-2px]  shadow-elev  duration-250
```

#### 2. Dark card (navy surface)

```
bg-navy-800  border border-navy-700  rounded-xl  p-8
top-rule:  gradient green→transparent  3 px
hover:     border-navy-600  duration-250
```

#### 3. Finding / severity card (cream surface, security-coded)

```
bg-cream-50  border border-cream-200  rounded-xl  p-6
left-rule: 4 px crimson (critical) / gold (high) / green (info)
status pill in upper right
```

Universal card rules:

- All cards have a 1 px border. Never zero.
- All cards have a top accent rule of 2–3 px. Never zero. The accent rule is the brand's structural mark.
- Shadows are subtle (`shadow-elev`) and only appear on hover.
- Corner radius: `rounded-xl` (`0.875rem`). Never `rounded-3xl`, never `rounded-md`. The system has one card radius.

### Forms

| Element                | Rule                                                                                                    |
| ---------------------- | ------------------------------------------------------------------------------------------------------- |
| **Input**              | `h-11 rounded-md border border-cream-200 bg-cream-50 px-4 text-base text-navy-900 placeholder-mesh-400` |
| **Input focus**        | `focus:border-green-500 focus:ring-2 focus:ring-green-500/30 outline-none`                              |
| **Input error**        | `border-crimson-500 ring-1 ring-crimson-500/30` + crimson helper text below                             |
| **Label**              | `font-mono text-xs font-semibold uppercase tracking-[0.22em] text-gold-500 mb-2`                        |
| **Helper text**        | `text-sm text-mesh-500 mt-1.5`                                                                          |
| **Submit button**      | Always Primary or Gold variant. Never Ghost or Link inside a form.                                      |
| **Form spacing**       | 24 px between fields. 32 px between field groups.                                                       |
| **Required indicator** | A small green-500 asterisk to the right of the label. Never red.                                        |

Forms must validate inline (after blur), not just on submit. Submission state must show a loading spinner inside the submit button — the button does not disappear during submission.

### Section titles

Every section title block follows this exact structure:

```
1. Eyebrow   — mono · 12 px · uppercase · 0.22em · gold-400 · with leading 40-px hairline
2. Title     — Space Grotesk 600/700 · clamp(32-64px) · navy-900 (or cream-50 on dark) · max-w-[64ch]
3. Lead      — Inter 400 · 18-20 px · mesh-600 (or cream-100/70 on dark) · max-w-[64ch]
                                         ↓
                                  56 px to body
```

Never skip the eyebrow. Never put the title above the eyebrow.

### Counters / stat numerals

- Family: Space Grotesk, weight 700, `font-variant-numeric: tabular-nums`.
- Size: `clamp(48px, 6vw, 96px)`.
- Color: `text-green-500` on cream, `text-gold-400` on navy.
- Below the numeral: a small mono caption in `text-mesh-400 / text-cream-100/55`, 11–12 px, uppercase, 0.22em tracking.
- Always include a unit or qualifier ("Years", "Players", "Raised since 2015") — never a naked number.

### Nav links

- Inactive: `text-navy-800 text-sm font-medium`.
- Hover: `text-green-500` with 200 ms colour transition. **No underline on hover.**
- Active page: `text-green-500` plus a 2 px green underline anchored to the link bottom (a 1 px green border with `border-b-2 pb-1`).
- Mobile nav: full-screen overlay, navy-900 background, links stacked, gold accent rule.
- Sticky header: opaque cream-50 with backdrop blur after `scrollY > 16`.

### Footer blocks

The footer is structured as four columns at desktop, collapsing to one column on mobile.

| Block                    | Content                                  |
| ------------------------ | ---------------------------------------- |
| Brand block (col 1–2)    | Lockup, brand description, social row    |
| Site links (col 3)       | Mirror of primary nav                    |
| Connect (col 4)          | Social, contact email, address           |
| Bottom rule (full width) | © year · privacy · terms · accessibility |

Footer rules:

- Background: `bg-navy-900`. Always.
- Text: `text-cream-100`. Body opacity: 70%.
- Eyebrow column titles in `text-gold-400` (mono, 11 px, 0.22em).
- 80 px top + bottom padding desktop, 64 px mobile.
- Copyright row separated by a 1 px `border-cream-50/10` rule.

### Timeline elements

- Vertical layout on mobile, horizontal at `lg`.
- Each step: number in mono uppercase + headline + 1–2 line description.
- Connecting line: 1 px gold hairline with subtle gradient — never a dashed line, never multi-coloured.
- Step indicator: 8 px green-500 dot with 12 px outer ring of `green-500/30`.
- Active state: dot becomes 12 px and the ring becomes 16 px. No animation loop.

### Tags / badges

| Type                         | Style                                                             |
| ---------------------------- | ----------------------------------------------------------------- |
| **Status — pass / live**     | `bg-green-500/12 text-green-700 border border-green-500/24`       |
| **Status — pending**         | `bg-gold-400/14 text-gold-600 border border-gold-400/30`          |
| **Status — failed / urgent** | `bg-crimson-500/10 text-crimson-500 border border-crimson-500/30` |
| **Category / track**         | `bg-navy-900 text-cream-50 border border-navy-700`                |
| **Mono numeric**             | `bg-cream-100 text-navy-900 border border-cream-200`              |

Badge typography: mono, 10–11 px, uppercase, 0.20em tracking, `font-semibold`. Always.

---

## 06 · Animation Rules

Motion in this brand is documentary, not theatrical. Every animation should ask the question _"is this helping the reader understand or trust this moment more?"_ If the answer is no, remove it.

### Library

- All motion goes through `motion/react` (the Motion library, formerly Framer Motion).
- Wrappers: `<FadeIn>`, `<Stagger>`, `<StaggerItem>` in `src/components/motion/`.
- Variants live in `src/constants/motion.js`. Components do not redefine easing or duration locally.

### Easing

- Default ease: `cubic-bezier(0.22, 1, 0.36, 1)` (the `outSoft` token).
- Never `easeInOut` for entry animations.
- Never `spring` with bouncy stiffness for marketing surfaces. (Springs are allowed in product/dashboard for affordances.)

### Duration ceiling

| Type             | Duration    |
| ---------------- | ----------- |
| Reveal on scroll | 0.5 – 0.7 s |
| Hover            | 0.2 s       |
| Modal / sheet    | 0.3 s       |
| Page transition  | 0.4 s       |

If an animation feels slow, it is. Never exceed 0.8 s for any single motion.

### Viewport reveal standards

- Sections fade-in + up on viewport entry, **once per session** (`viewport={{ once: true, amount: 0.35 }}`).
- Y offset: 24 px max. Never 100 px.
- Opacity: 0 → 1.
- No rotation, no skew, no scale > 1.04.

### Hover motion

- Cards: 2 px lift + shadow appearance. Nothing else.
- Buttons: colour transition only. No scale.
- Links: underline reveal in 200 ms. Colour does not change on hover.
- Images: 1.04 scale max, 600 ms, with overflow hidden on the wrapper.

### Stagger timing

- Stagger delay between siblings: 0.06 – 0.10 s.
- Maximum stagger sequence: 8 items. Beyond that, the reader has stopped paying attention; cut to a single fade.

### Glow activation timing

Glows do not animate. They appear with the surface and stay static. The only exception is the focus ring — which fades in/out over 150 ms with the focus state.

### Forbidden motion patterns

- Marquee scrollers (no horizontally scrolling logo strips).
- Parallax backgrounds.
- Cursor followers.
- Confetti.
- Looping / infinite hover effects.
- Type-on / typewriter effects, except once on the hero headline as a single moment.
- Motion that triggers on scroll velocity (e.g. "shake on fast scroll").
- Bouncy springs on marketing pages.
- Auto-playing video heroes longer than 8 seconds.

### Reduced-motion respect

Every motion must respect `prefers-reduced-motion: reduce`. Use the `usePrefersReducedMotion` hook. When reduce is set:

- Disable all reveal animations (set `initial = animate`).
- Disable hover lifts.
- Keep focus indicators (they are accessibility, not animation).

---

## 07 · Section Construction Principles

A section is a **unit of meaning** with a job. Every section ships as one component, fully responsive, named for its purpose (`Hero`, `LoopExplainer`, `CapabilitiesGrid`, `OutcomesStats`).

### Trust-first ordering

The first 800 vertical pixels of any landing page must establish trust before they ask for anything. Order:

1. Brand mark + nav (with primary CTA visible but not loud)
2. Hero with eyebrow → headline → 1-line sub → primary + secondary CTA
3. Trust strip — institutional logos, framework alignment, or named partners — within the first viewport on desktop

Never put pricing, signup forms, or fear-based copy in the first viewport. The user has not earned the right to be asked yet — and you have not earned the right to ask.

### Visual hierarchy inside a section

Every section must have a clear **primary element** (headline, hero card, central image) and **supporting elements**. Do not build sections where every card is the same size and the same weight — the reader has nowhere for their eye to land.

Hierarchy tools:

- Size differential — primary element 2× the surrounding elements minimum.
- Weight differential — primary in 600/700, supporting in 400/500.
- Color differential — primary in navy-900, supporting in mesh-600.
- Position — primary on the left in LTR reading flow.

### Conversion flow

Across the homepage, the conversion arc must climb monotonically:

```
Hero          (CTA visible, not pushy)
↓
Trust         (logos, frameworks, partner names)
↓
Mechanic      (the brand's signature explanation — The Loop)
↓
For Whom      (audience tiles routing to deep pages)
↓
Capabilities  (named deliverables, not bullet fluff)
↓
Proof         (methodology excerpt, redacted artifact)
↓
Outcomes      (stats, testimonials)
↓
FAQ           (technical answers, not marketing)
↓
Final CTA     (a single dense moment with primary + secondary)
↓
Footer
```

Sections may be reordered for purpose-built pages, but the arc — _trust → understand → believe → act_ — never changes.

### Alternating section rhythm

Light → Dark → Light → Dark across the page. Two consecutive sections of the same surface kill rhythm. Use:

- `bg-cream-50` for the light section
- `bg-navy-900` for the dark section
- Optional intermediate: `bg-cream-100` for a "muted light" pause

Forbidden: three consecutive sections of identical background.

### Content density control

| Section type         | Word count target        |
| -------------------- | ------------------------ |
| Hero                 | < 50 words total         |
| Mechanic / explainer | 80–150 words             |
| Card grid            | 25–40 words per card max |
| FAQ answer           | 1–3 sentences per answer |
| Testimonial          | 1 sentence + name + role |
| Final CTA            | < 30 words               |

If a section exceeds these targets, the section is doing two jobs at once and must be split.

### Section transitions

- Sections meet on a flat boundary by default — no diagonal cuts, no wave dividers, no SVG curves.
- Where a transitional moment is needed (e.g. between a story page and a product page), use the trace-line motif: a 1 px gold gradient hairline anchored 64 px below the section.
- Hero sections may bleed background image into the next section, but only once per page.

---

## 08 · Interaction Design Rules

### Hover states

Every interactive element has a defined hover state. No element is hover-silent.

- Cards: 2 px lift, shadow appearance, border darkens by one mesh step.
- Buttons: see Component rules.
- Links: 200 ms underline reveal.
- Images in cards: 1.04 scale on the image, container stays still.

Touch-only devices: hover states fall back to `:active` styling for 150 ms post-tap.

### Click feedback

Every clickable element provides immediate feedback within 100 ms:

- Buttons: subtle scale-down `scale-[0.98]` while pressed.
- Cards as links: brief inner shadow on press.
- Form submit: spinner inside the button + button text becomes "Sending…" — never disappear or replace the button.

### Form focus states

- Visible green ring (`ring-2 ring-green-500/30`) and border colour change on focus.
- Focus ring respects `focus-visible` (keyboard-only). Mouse focus does not show a ring on pointer-clicked buttons.
- Tab order matches reading order. Modal forms trap focus.

### Card active states

- Cards that are clickable: cursor `pointer`, full hover treatment, on click navigate or expand.
- Cards that are _not_ clickable: cursor default, no hover lift. Do not give static cards the same hover as clickable ones — it confuses the reader.

### Scroll behaviour

- `scroll-behavior: smooth` globally on `html`.
- Anchor links offset by header height — implement via `scroll-margin-top: 96px` on every section with an `id`.
- Sticky elements respect a 16 px scroll trigger (header opacity flip, etc.).
- Never hijack scroll. No "scroll-jacked" parallax, no scroll-lock between sections.

### Keyboard navigation

- Every interactive element is reachable via `Tab` in document order.
- `Esc` closes modals and overlays.
- Skip-link to `#main` is the first focusable element on every page.
- Visible focus on all interactive elements. Outline-none is forbidden without a replacement focus indicator.

---

## 09 · Responsive Design Laws

### Desktop (≥ 1280 px)

- Container max 1280 px (`max-w-7xl`).
- Full 12-column grids; asymmetric splits (8/4, 7/5).
- Section padding 120 – 140 px top/bottom.
- Display 2XL / XL headlines at full size.
- Multi-column footer.
- All hover states fully active.

### Tablet (768 – 1279 px)

- Container respects `padding-inline: 1.5rem`.
- 12-column grid still in use; some 4-up rows collapse to 2-up.
- Section padding 96 px top/bottom.
- Display headlines drop one tier (XL not 2XL).
- Footer collapses to 2-column.
- Sidebar nav becomes a slide-in sheet.

### Mobile (≤ 767 px)

- Single-column layout, always.
- Section padding 72 px top/bottom.
- Display headlines at lower bounds of clamp().
- Card grids stack vertically with 16 px gap.
- Buttons full-width when there is a single primary action; auto-width when paired.
- Mobile nav as a full-screen sheet, not a hamburger dropdown.
- Hero supporting card stacks below hero copy (never on top).
- Tap targets: 44 px minimum (`h-11 min-w-[44px]`).
- No hover-only affordances. Anything that requires hover to discover must have an alternative tap state.

### Universal responsive rules

- Touch-friendly spacing: 16 px between any two tap targets minimum.
- Text never shrinks below 16 px on mobile.
- Images use `next/image` with `sizes` properly declared.
- No fixed pixel widths on content containers — always relative or clamp().
- Test at 320 px (iPhone SE), 375 px, 768 px, 1024 px, 1280 px, 1440 px, 1920 px.

---

## 10 · Forbidden Design Mistakes

The following are not stylistic preferences. They are violations of brand integrity. Do not ship any of them.

### Typography mistakes

- ❌ Mixing Inter and Space Grotesk in the same headline.
- ❌ Setting body copy in mono.
- ❌ Setting headings in mono.
- ❌ Two different heading weights inside one section.
- ❌ Using italic accent words in headlines (we don't use italic).
- ❌ Underlining body copy (only links underline, on hover).
- ❌ Centring long-form body copy.
- ❌ Body copy below 16 px on production.
- ❌ Decorative letter-spacing on display headlines (more than -0.04em or +0.05em).

### Colour mistakes

- ❌ Pure white (`#FFFFFF`) page backgrounds.
- ❌ Pure black (`#000000`) anywhere.
- ❌ Any colour outside the documented palette — including grayscale Tailwind defaults (`text-gray-500`, `border-slate-300`).
- ❌ Crimson used decoratively or on dividers.
- ❌ Gold and crimson placed adjacent to each other.
- ❌ Three accent colours stacked in one component.
- ❌ Hero gradients with more than two stops.
- ❌ Cyan, purple, or pink anywhere in the marketing site.
- ❌ Stock corporate blue (`#0066CC` family).

### Spacing mistakes

- ❌ Section padding under 64 px on mobile or 96 px on desktop.
- ❌ Cards touching each other (gap < 16 px).
- ❌ Headlines that touch the edge of their container.
- ❌ Inconsistent vertical rhythm — sections of differing padding values inside the same page.
- ❌ Padding values not on the 4 px grid (e.g. `padding: 18px`).

### Component mistakes

- ❌ Square buttons. The brand has one button shape — pill (`rounded-full`).
- ❌ Multiple primary CTAs in the same section.
- ❌ Cards without borders.
- ❌ Cards without a top accent rule.
- ❌ Forms without labels (placeholder-only forms are forbidden).
- ❌ Icons inside buttons that are not from the lucide-react library.
- ❌ Drop shadows that are not the shared `shadow-elev` token.
- ❌ Random border radii — the system has `rounded-full`, `rounded-xl`, `rounded-2xl`. That is the entire allowed set.
- ❌ Static lifeless cards — every card has at minimum a hover lift and a top accent rule.
- ❌ Mismatched shadows — never combine `shadow-2xl` with `shadow-md` on different cards in the same section.

### Animation mistakes

- ❌ Bouncy springs on marketing surfaces.
- ❌ Hero animations longer than 0.8 s.
- ❌ Looping infinite animations (other than the optional brand pulse-dot in footer).
- ❌ Auto-playing audio.
- ❌ Auto-playing video with sound.
- ❌ Confetti, sparkles, particle effects.
- ❌ Cursor-follower elements.
- ❌ Scroll-jacked sequences.
- ❌ Any animation that triggers a layout shift.

### Section / page mistakes

- ❌ Three consecutive sections with identical background colour.
- ❌ Sections without a heading.
- ❌ Sections without a primary CTA on conversion-led pages.
- ❌ Two consecutive testimonial sections without a content section between them.
- ❌ Heroes without a CTA.
- ❌ Final CTA section that points the user to two equally-weighted destinations (always one primary, one secondary).
- ❌ Overcrowded sections — more than 6 cards in a single grid without grouping.
- ❌ Generic "feature with icon and three lines of text" rows that don't name a deliverable.

### Brand-feel mistakes

- ❌ Anything that reads like a Wix template.
- ❌ Anything that reads like a YC startup landing page from 2018.
- ❌ Anything that reads like a generic SaaS hero with a SaaS UI screenshot.
- ❌ Cliché security iconography — padlocks, hooded figures, binary rain.
- ❌ Stock photography of "team huddled around a monitor" or "businessman in suit looking thoughtful."
- ❌ Excessive use of gradients to create visual interest — the brand earns interest from typography and discipline, not from gradients.

---

## 11 · Final UI Quality Standard

A page is shippable when, and only when, all of the following are true.

### The five-point ship check

1. **A senior practitioner would trust it.** Open the page next to Snyk, Wiz, and HackerOne. If the visitor's eye treats our page as belonging in that company, ship. If it looks one tier below, do not ship.
2. **Every interactive element has a defined state.** Hover, focus, active, disabled, loading. No silent elements.
3. **Every section has a primary element.** No "everything is the same size" sections.
4. **Every claim has an artifact behind it.** Statistics link to context. Testimonials have names. "Trusted by" logos correspond to real partners.
5. **Every motion is justified.** If you cannot defend why an animation exists in one sentence, remove it.

### The four-feeling reading

A first-time visitor scrolling the homepage in 30 seconds — without reading a word — must come away with the following four feelings, in this order. If they don't, the page is not done.

| Order | Feeling                      | Source on the page                                       |
| ----- | ---------------------------- | -------------------------------------------------------- |
| 1     | "This is serious."           | Hero typography, palette restraint, no theatrics         |
| 2     | "I understand what this is." | The Loop / mechanic section + capability cards           |
| 3     | "Other people trust them."   | Logos, named partners, testimonials, framework alignment |
| 4     | "I should engage."           | Final CTA, clear primary, no friction                    |

### The non-negotiable polish criteria

- All images use `next/image` with explicit width/height or `fill` + sizes.
- All icons from `lucide-react`, never raw SVGs of logos or padlocks.
- All headings respect the type scale.
- All colours come from the palette.
- All motion goes through the shared wrappers.
- All forms validate before submit and show field-level errors.
- All pages have a meaningful `<title>` and `<meta description>`.
- All routes have a `loading.jsx` and `error.jsx` boundary.
- All responsive breakpoints have been tested in the browser, not assumed.
- No `console.log` in production. `console.error` only for caught failures.
- Lighthouse: Performance 90+, Accessibility 95+, Best Practices 95+, SEO 95+ minimum.
- WCAG: AA on every text/background pair, AAA on hero and primary CTA pairs.

### The cinematic / enterprise / conversion-ready bar

A finished page should feel:

- **Cinematic** — pacing, rhythm, restraint. Like a director trusted the audience.
- **Enterprise-grade** — polished enough that a CISO scrolling on her phone between meetings would forward it to a colleague.
- **Conversion-ready** — every primary action is one tap away from anywhere on the page.
- **Quiet** — confident, never loud. The brand has authority because it doesn't need to shout.
- **Cybersecurity-coded** — without the clichés. Authority shown through documentation density, methodology, and named principals — never through neon, hoods, or fearmongering.

---

## Appendix · Token Quick Reference

```
Surfaces    bg-cream-50  bg-cream-100  bg-navy-900  bg-navy-800  bg-navy-950
Text        text-navy-900  text-cream-50  text-mesh-600  text-cream-100/72
Accents     text-green-500  text-gold-400  text-crimson-500
Borders     border-cream-200  border-navy-700  border-green-500
Radii       rounded-full  rounded-xl  rounded-2xl
Shadows     shadow-elev  shadow-glow
Easing      ease-out-soft  duration-200  duration-500
Fonts       font-display  font-sans  font-mono
Type scale  text-display-2xl  text-display-xl  text-display-lg
Spacing     section-pad  gap-6  gap-8
```

---

## Custodianship

This document is owned by the Brand & Strategy custodian. Material updates require version increment, changelog entry, and review of dependent components. PRs that violate the rules above must be flagged in code review and corrected before merge — exceptions require written sign-off.

> **Final principle:** _Restraint is the brand's most expensive asset. The site looks expensive because it refuses to look busy._

_— End of design implementation guide._
