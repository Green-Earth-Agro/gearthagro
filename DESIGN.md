---
name: GreenEarth Agro
description: The official brand site for a Ghana-based agro-processing company built on forest-green authority and evidence-led structure.
colors:
  primary-a0: "oklch(27% 0.09 146)"
  primary-a10: "oklch(34% 0.094 146)"
  primary-a20: "oklch(43% 0.088 146)"
  primary-a30: "oklch(50% 0.092 131)"
  primary-a40: "oklch(66% 0.078 131)"
  primary-a50: "oklch(83% 0.05 131)"
  gold-a0: "oklch(53% 0.115 65)"
  gold-a10: "oklch(63% 0.128 66)"
  gold-a20: "oklch(79% 0.148 84)"
  gold-a30: "oklch(84% 0.13 86)"
  surface-a0: "oklch(99.5% 0.004 130)"
  surface-a10: "oklch(98.5% 0.007 130)"
  surface-a20: "oklch(95% 0.019 130)"
  surface-a30: "oklch(91% 0.02 107)"
  text-primary: "oklch(19% 0.042 146)"
  text-secondary: "oklch(27% 0.038 146)"
  text-muted: "oklch(44% 0.025 153)"
  text-on-dark: "oklch(92% 0.012 146)"
  heading-on-dark: "oklch(98% 0.008 146)"
  footer-bg: "oklch(16% 0.048 146)"
  footer-text: "oklch(80% 0.025 146)"
  success: "oklch(62% 0.17 151)"
  warning: "oklch(74% 0.15 80)"
  danger: "oklch(52% 0.2 22)"
  info: "oklch(56% 0.19 264)"
typography:
  display:
    fontFamily: "Barlow Condensed, system-ui, sans-serif"
    fontSize: "clamp(32px, 4vw, 48px)"
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: "-0.01em"
  title:
    fontFamily: "Manrope, system-ui, sans-serif"
    fontSize: "clamp(22px, 2.4vw, 28px)"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "normal"
  body:
    fontFamily: "Manrope, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.625
    letterSpacing: "normal"
  label:
    fontFamily: "Manrope, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "1.2px"
rounded:
  sm: "8px"
  lg: "18px"
  pill: "999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
  "2xl": "48px"
components:
  button-primary:
    backgroundColor: "{colors.gold-a20}"
    textColor: "{colors.primary-a0}"
    rounded: "{rounded.sm}"
    padding: "14px 24px"
  button-primary-hover:
    backgroundColor: "{colors.gold-a10}"
    textColor: "{colors.primary-a0}"
    rounded: "{rounded.sm}"
    padding: "14px 24px"
  button-outline:
    backgroundColor: "transparent"
    textColor: "{colors.text-on-dark}"
    rounded: "{rounded.sm}"
    padding: "14px 24px"
  card:
    backgroundColor: "{colors.surface-a0}"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.lg}"
    padding: "28px"
  chip:
    backgroundColor: "transparent"
    textColor: "{colors.text-on-dark}"
    rounded: "{rounded.pill}"
    padding: "12px 16px"
---

# Design System: GreenEarth Agro

## 1. Overview

**Creative North Star: "The Verdant Standard"**

GreenEarth Agro is a Ghana-based agro-processing company that competes internationally, and the design system carries that exact tension: global-grade industrial rigor rooted unmistakably in West African soil. The surface is built from deep forest greens and a warm cream-to-sage neutral family, with amber gold reserved for the moments that ask for action. Nothing here is decorative for its own sake. Structure is the message: clean hierarchy, deliberate pacing, and generous breathing room are how a B2B buyer or investor reads operational competence before they read a single claim.

The system is calm but never cold. Warmth comes from the landscape (the green is grown, not corporate) and from soft, green-tinted elevation rather than hard drop shadows. Type does the heavy lifting: a condensed display face for scale and authority, a humanist sans for trustworthy reading. The four-stream supply-chain story (own farming, smallholder sourcing, processing, biomass) is meant to be legible and prominent, never buried.

This system explicitly rejects generic SaaS/startup cream (white backgrounds, Inter, pale blue-green gradients, floating blobs), farm-kitsch (barn illustrations, rustic wood, tractor icons), cluttered enterprise-GIS toolbars, and dense dark-mode data walls. It is progressive without being sterile: scientific confidence and forward momentum, not minimalist chill.

**Key Characteristics:**
- Forest-green authority with a warm cream/sage neutral base
- Amber gold as a rare, high-intent accent (CTAs only)
- Condensed display type for scale, humanist sans for reading
- Soft, green-tinted elevation; flat at rest, lifts on interaction
- Evidence-led layout: structure communicates credibility
- Automatic light/dark theme via `prefers-color-scheme` and a manual `data-theme` override

## 2. Colors

A landscape-derived palette: deep cultivated greens, a warm earthen gold, and a cream-to-sage neutral family that inverts cleanly into a dark forest at night. Every neutral is tinted toward the brand green; pure gray and pure black are forbidden.

### Primary
- **Deep Forest** (`oklch(27% 0.09 146)`, `primary-a0`): the darkest brand green. Always-dark section backgrounds (hero, contact), and the text color that sits on gold CTAs.
- **Cultivated Green** (`oklch(34% 0.094 146)`, `primary-a10`): the workhorse brand color. Headings, the logotype, links, and section eyebrows on light surfaces.
- **Field Green** (`oklch(43–50% ~0.09 ~140)`, `primary-a20`/`a30`): mid-tone accents, icon strokes, checkmarks.
- **Sage Light** (`oklch(66–83% ~0.06 131)`, `primary-a40`/`a50`): image fallback gradients and soft fills.

### Secondary
- **Slate** (`oklch(13–64% 0.02–0.06 264)`, `secondary-a0..a50`): a cool neutral ramp held in reserve for UI chrome that must read as non-brand. Used sparingly.

### Tertiary
- **Earthen Gold** (`oklch(79% 0.148 84)`, `gold-a20`): the single action color. Primary buttons, the gold underline on nav hover, the small uppercase eyebrows. Its scarcity is the point.
- **Amber Deep** (`oklch(53–63% ~0.12 65)`, `gold-a0`/`a10`): button hover state and gold text/labels that need contrast on light backgrounds.

### Neutral
- **Cream / Sage Surfaces** (`oklch(80–99.5% 0.004–0.034 ~120)`, `surface-a0..a50`): the light-mode background family. `a0` is near-white cards, `a20` is the page wash, `a30` is the standard border/divider. In dark mode these tokens invert to a deep forest ramp (`oklch(14–58% … 146)`).
- **Ink Greens** (`text-primary oklch(19% 0.042 146)`, `text-secondary oklch(27% 0.038 146)`, `text-muted oklch(44% 0.025 153)`): body and supporting text, all tinted green, never neutral gray.
- **On-Dark Text** (`text-on-dark oklch(92% 0.012 146)`, `heading-on-dark oklch(98% 0.008 146)`): the only text colors permitted on always-dark-green sections.
- **Footer Forest** (`footer-bg oklch(16% 0.048 146)`, `footer-text oklch(80% 0.025 146)`): the footer's fixed dark-green band, independent of theme.

### State
- **Success** `oklch(62% 0.17 151)`, **Warning** `oklch(74% 0.15 80)`, **Danger** `oklch(52% 0.2 22)`, **Info** `oklch(56% 0.19 264)`. Each has a0/a10/a20 steps. Used only for genuine status, never decoration.

### Named Rules
**The One Action Color Rule.** Amber gold is for things you click: primary buttons, nav-hover underlines, and short uppercase eyebrows. It never fills a panel, never tints a background, never becomes decoration. If gold is doing anything other than signaling action or labeling a section, remove it.

**The Tinted Neutral Rule.** Every neutral leans green (chroma 0.004–0.05 around hue 130–155). `#000` and `#fff` are forbidden. A gray that reads as truly neutral is a bug.

**The On-Dark Rule.** On the always-dark-green sections (hero, contact, footer), text uses only `text-on-dark` / `heading-on-dark`. Never drop a light-surface text token onto a dark green panel.

## 3. Typography

**Display Font:** Barlow Condensed (with `system-ui, sans-serif`)
**Body Font:** Manrope (with `system-ui, sans-serif`)
**Mono Font:** `ui-monospace` (reserved; rarely surfaced)

**Character:** Barlow Condensed brings vertical, industrial authority to large type without shouting; it reads as engineered and confident. Manrope keeps body copy humanist, warm, and highly legible, the trustworthy voice that carries evidence. The condensed-display / humanist-body pairing is the core of the brand voice.

### Hierarchy
- **Display** (Barlow Condensed, 700, `clamp(32px, 4vw, 48px)`, line-height 1.1, tracking -0.01em): page titles and section H2s. Applied automatically to `h1, h2` in base CSS.
- **Title** (Manrope, 700, `clamp(22px, 2.4vw, 28px)`, line-height ~1.2): subsection and card headings (`h3`+ use the sans family by design).
- **Body** (Manrope, 400, `1rem`–`1.125rem`, line-height 1.625): paragraphs. Cap reading measure at 65–75ch.
- **Label / Eyebrow** (Manrope, 700, `0.875rem`, letter-spacing ~1.2px, UPPERCASE): the small gold section eyebrows ("Contact", "Legal") and metadata.

### Named Rules
**The Condensed-Heading Rule.** `h1` and `h2` are always Barlow Condensed; `h3` and below are always Manrope. This split is the typographic signature. Never set a body paragraph in the condensed face or a hero in the humanist sans.

**The Eyebrow Rule.** Section eyebrows are short, uppercase, gold, letter-spaced ~1.2px, and sit directly above their heading. They label; they never form sentences.

## 4. Elevation

The system is flat at rest and lifts only in response to interaction. Depth is conveyed primarily through tonal surface layering (the `surface-a0..a50` ramp) and secondarily through soft, green-tinted shadows. Shadows are warm and diffuse (tinted with `rgba(42, 58, 42, …)`), never the hard neutral-black drop shadows of a 2014 app.

### Shadow Vocabulary
- **Card rest** (`box-shadow: 0 16px 30px rgba(42, 58, 42, 0.07)`): default resting elevation for cards.
- **Image rest** (`box-shadow: 0 18px 36px rgba(42, 58, 42, 0.10)`): framed imagery.
- **Card hover** (`box-shadow: 0 24px 40px rgba(42, 58, 42, 0.12)`): paired with `translateY(-4px)` on `.agro-card-lift`.
- **Button hover** (`box-shadow: 0 14px 28px rgba(80, 58, 10, 0.14)`): warm amber-tinted lift under gold buttons, paired with `translateY(-1px)`.

### Named Rules
**The Lift-on-Intent Rule.** Surfaces are flat at rest. Elevation increases only on hover/focus, always accompanied by a small upward translate (`-1px` buttons, `-4px` cards). Static heavy shadows are forbidden.

**The Green-Shadow Rule.** Shadows are tinted toward the brand (greenish `rgba(42, 58, 42, …)`, or warm `rgba(80, 58, 10, …)` under gold). A neutral-black shadow is a bug.

## 5. Components

### Buttons
- **Shape:** gently rounded (`8px`, `rounded.sm`). Buttons are weighty (font-weight 800, 15px) and padded `14px 24px`.
- **Primary (`.btn-gold`):** Earthen Gold background (`gold-a20`), Deep Forest text (`primary-a0`). The single most prominent action.
- **Hover / Focus:** background deepens to `gold-a10`, `translateY(-1px)`, amber-tinted shadow; `:active` scales to 0.97. Transitions use the ease-out curve (~160–180ms).
- **Outline (`.btn-outline-white`):** transparent with a translucent white border and inverse text, for use on dark sections; hover fills with a faint white wash.
- **Icon (`.btn-icon`):** square, `8px` radius, `primary-a10` icon color, surface wash on hover.

### Chips
- **Style (`.agro-proof-chip`):** pill (`999px`), translucent white fill (`rgba(255,255,255,0.08)`) and border (`0.18`), `text-on-dark`, weight 700. Used as proof points on dark sections.
- **Size:** minimum height 44px (touch target), padding `12px 16px`.

### Cards / Containers
- **Corner Style:** `18px` (`rounded.lg`), the signature radius.
- **Background:** `surface-a0` (near-white cards on the `surface-a20` page wash).
- **Shadow Strategy:** Card-rest at rest, Card-hover on hover via `.agro-card-lift` (see Elevation).
- **Border:** `1px solid surface-a30`.
- **Internal Padding:** `20px` mobile, `28px` (`spacing.lg`+) desktop.

### Navigation
- **Style (`.agro-nav-link`):** `text-secondary` links, weight 600, that shift to `primary-a10` on hover with an animated gold underline (`gold-a10`) growing from the left.
- **Default / Hover / Active:** underline scales from 0.35→1 and fades in on hover/focus-visible; color shifts to Cultivated Green.
- **Shell:** sticky, `surface` background with `backdrop-filter: saturate(140%) blur(14px)` and a `surface-a30` bottom border.
- **Mobile:** hamburger toggles a full-width stacked menu; each row is a 44px+ touch target with a `surface-a30` divider.

### Theme Toggle (signature)
The site supports automatic dark mode via `@media (prefers-color-scheme: dark)` plus a manual `data-theme="light|dark"` override on `:root`. All color tokens are defined for both modes; components must read tokens (never hard-coded values) so they invert correctly.

## 6. Do's and Don'ts

### Do:
- **Do** use the `agro-*` design tokens for every color, never literal hex/oklch in components.
- **Do** keep amber gold for actions and eyebrows only (The One Action Color Rule).
- **Do** set `h1`/`h2` in Barlow Condensed and everything smaller in Manrope.
- **Do** tint every neutral toward the brand green; cream and sage, never flat gray.
- **Do** keep surfaces flat at rest and lift them on hover/focus with a small translate and a green-tinted shadow.
- **Do** prove claims with specifics (tonnage, farmer count, regions, capacity) placed near every headline.
- **Do** use `text-on-dark` / `heading-on-dark` on the hero, contact, and footer bands.
- **Do** respect `prefers-reduced-motion` (reveals and transitions collapse to instant) and meet WCAG 2.1 AA contrast.

### Don't:
- **Don't** ship generic SaaS/startup cream: white backgrounds, Inter, pale blue-green gradients, or floating blob shapes.
- **Don't** use farm-kitsch (barn illustrations, rustic wood textures, tractor icons, "down-home" styling) that undercuts industrial scale.
- **Don't** build cluttered, toolbar-heavy enterprise-GIS layouts or dense dark-mode data walls with no breathing room.
- **Don't** use `#000` or `#fff`, or any untinted gray text.
- **Don't** let gold fill a background or become decoration.
- **Don't** use `border-left`/`border-right` greater than 1px as a colored accent stripe; use full borders, tints, or leading numbers/icons.
- **Don't** apply hard neutral-black drop shadows; shadows are soft and green/amber-tinted.
- **Don't** use em dashes in copy; use commas, colons, semicolons, periods, or parentheses.
