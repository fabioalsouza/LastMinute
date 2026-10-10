---
name: Dynamic Opportunistic Modernism
colors:
  surface: '#fcf9f8'
  surface-dim: '#dcd9d9'
  surface-bright: '#fcf9f8'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f6f3f2'
  surface-container: '#f0eded'
  surface-container-high: '#eae7e7'
  surface-container-highest: '#e5e2e1'
  on-surface: '#1b1b1b'
  on-surface-variant: '#3e4947'
  inverse-surface: '#313030'
  inverse-on-surface: '#f3f0ef'
  outline: '#6e7977'
  outline-variant: '#bdc9c6'
  surface-tint: '#006a63'
  primary: '#005c55'
  on-primary: '#ffffff'
  primary-container: '#0f766e'
  on-primary-container: '#a3faef'
  inverse-primary: '#80d5cb'
  secondary: '#006c49'
  on-secondary: '#ffffff'
  secondary-container: '#6cf8bb'
  on-secondary-container: '#00714d'
  tertiary: '#734700'
  on-tertiary: '#ffffff'
  tertiary-container: '#945d00'
  on-tertiary-container: '#ffe6cc'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#9cf2e8'
  primary-fixed-dim: '#80d5cb'
  on-primary-fixed: '#00201d'
  on-primary-fixed-variant: '#00504a'
  secondary-fixed: '#6ffbbe'
  secondary-fixed-dim: '#4edea3'
  on-secondary-fixed: '#002113'
  on-secondary-fixed-variant: '#005236'
  tertiary-fixed: '#ffddb8'
  tertiary-fixed-dim: '#ffb95f'
  on-tertiary-fixed: '#2a1700'
  on-tertiary-fixed-variant: '#653e00'
  background: '#fcf9f8'
  on-background: '#1b1b1b'
  surface-variant: '#e5e2e1'
typography:
  display-hero:
    fontFamily: Inter
    fontSize: 40px
    fontWeight: '600'
    lineHeight: 48px
    letterSpacing: -0.025em
  display-hero-mobile:
    fontFamily: Inter
    fontSize: 30px
    fontWeight: '600'
    lineHeight: 36px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.015em
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.015em
  headline-sm:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: -0.01em
  title-md:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '500'
    lineHeight: 24px
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
    letterSpacing: 0em
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
    letterSpacing: 0em
  label-lg:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-md:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '500'
    lineHeight: 18px
    letterSpacing: 0.01em
  caption-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.02em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1.5rem
  gutter-mobile: 1rem
  margin: 3rem
  margin-mobile: 1.25rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.5rem
---

## Brand & Style

The design system establishes a high-trust, editorial-grade marketplace tailored for the Brazilian self-care and wellness sector (salões nobres, barbearias premium, clínicas estéticas, spas). Rather than evoking the clutter, frantic countdowns, and aggressive badges of generic bargain platforms, the visual tone mirrors an exclusive concierge service granting privileged access to prime booking windows.

The brand identity hinges on intentionality, punctuality, and understated luxury. 
- **Voice & Tone:** Refined, effortless, decisive, and respectful of personal time.
- **Logotype & Symbol:** Lowercase wordmark ("lastminute") paired with a minimal geometric flash-ring or open clock mark that symbolizes immediate availability without visual noise.
- **Design Style:** Modern Warm Minimalism with tactile, layered precision. Soft alabaster tones anchor crisp white cards, hairline slate borders, and deep teal focal points, preserving a high-end editorial feel that elevates partner salons while communicating compelling spontaneous value.

## Colors

The palette relies on high-contrast clarity and organic warmth to eliminate the visual fatigue common in promotional platforms.

- **Primary (`#0F766E` - Deep Teal):** The foundational brand color used for dominant calls-to-action, active segment controls, confirmed states, and interactive focal points. Conveys clinical precision and composure.
- **Secondary (`#10B981` - Emerald Green):** Used selectively for value-capture cues: discount tags, slot openings, and live status pills. It delivers visual optimism without clashing with the primary teal.
- **Tertiary (`#F59E0B` - Amber Warmth):** Reserved for immediate urgency states: expiring reservations, seats with fewer than 30 minutes to claim, and cancellation notifications.
- **Neutral (`#1C1C1C` - Carbon):** Deep carbon text delivers crisp legibility against `#F8F8F6` and pure white without the harsh contrast of pure black.
- **Canvas Base (`#F8F8F6` - Warm Alabaster):** Replaces clinical bright whites with an organic, editorial warmth that frames pure `#FFFFFF` cards.
- **Subtle Linework (`#E5E7EB` - Platinum):** 1px structural bounds that keep cards, dropdown menus, and list partitions sharp and orderly.

## Typography

Typography prioritizes functional hierarchy and immediate scanning speed. 

- **Primary Metrics:** Tabular figures (`font-variant-numeric: tabular-nums`) must be enabled across all price components, countdown clocks, and scheduling time slots to prevent jumping during live data refreshes.
- **Weights:** Restricted strictly to Medium (500) and Semi-Bold (600) for structural items, while Regular (400) drives secondary narrative descriptions. Bold (700) is avoided to preserve an understated luxury aesthetic.
- **Letter Spacing:** Headlines utilize subtle negative tracking (`-0.015em` to `-0.025em`) to tighten headings, while small badges and service tags carry slight positive tracking (`0.01em` to `0.02em`) for clarity at micro-sizes.

## Layout & Spacing

The system is configured around an 8pt base grid optimized for a standard 1920x1080 desktop canvas, with an internal max-width container of 1440px to ensure horizontal cohesion and comfortable reading lengths.

- **Desktop (1440px - 1920px+):** 12-column layout, 24px (`gutter: 1.5rem`) columns, with side canvas gutters expanding dynamically beyond the 1440px centralized frame.
- **Tablet (768px - 1024px):** 8-column layout, 20px gutters, 32px safe margins. Side-by-side card clusters collapse into dual-column grids.
- **Mobile (< 768px):** 4-column layout, 16px (`gutter-mobile: 1rem`), 20px (`margin-mobile: 1.25rem`) edge buffers. Search filters and booking bars switch from stacked layout to sticky, horizontal carousels or bottom-anchored sheets.
- **Rhythm:** Spacing between unassociated modules sits at `space-xl` (40px), grouped card content uses `space-md` (16px), and tightly coupled typographic groupings (e.g., salon title and rating) use `space-xs` (4px).

## Elevation & Depth

Visual hierarchy uses subtle borders paired with soft, low-contrast shadows. Surfaces feel tactile without looking heavy or layered.

- **Level 0 (Base Canvas):** `#F8F8F6` flat surface without elevation or drop shadow.
- **Level 1 (Cards, Venue Cards, Input Fields):** Surface `#FFFFFF`, bounded by a continuous 1px outline in `#E5E7EB`. Shadow: `0px 1px 3px rgba(0, 0, 0, 0.04), 0px 4px 12px rgba(0, 0, 0, 0.02)`.
- **Level 2 (Hovered Cards, Sticky Navigation, Bottom Sheets):** Surface `#FFFFFF`, 1px outline in `#E5E7EB`. Shadow: `0px 4px 16px rgba(15, 118, 110, 0.05), 0px 8px 24px rgba(0, 0, 0, 0.04)`.
- **Level 3 (Modal Dialogs, Booking Overlays, Confirmation Drawers):** Surface `#FFFFFF`, with no border. Shadow: `0px 12px 32px rgba(28, 28, 28, 0.08), 0px 24px 60px rgba(0, 0, 0, 0.06)`. Backdrops employ `rgba(28, 28, 28, 0.4)` paired with `backdrop-filter: blur(4px)`.

## Shapes

The interface balances sharp editorial discipline with warm, approachable curves. A roundedness index of `2` anchors baseline interactive elements at 8px (`0.5rem`), matching the spacing scale.

- **Form Controls & Micro-Badges:** Standard inputs, buttons, and alert notices use 8px (`0.5rem`) corner radiuses.
- **Card Containers & Visual Tiles:** Listing blocks, appointment summaries, and map view toggles use 16px (`1rem` / `rounded-lg`).
- **Interactive Floating Panels & Modal Sheets:** Use 24px (`1.5rem` / `rounded-xl`) to soften large canvas interruptions.
- **Pill Exceptions:** Filter categories (e.g., "Barbearia", "Cabelo", "Massagem"), slot availability tags, and discount badges strictly use full pills (`rounded-full` / 9999px) to maintain a distinct, tag-like visual appearance.

## Components

### Buttons
- **Primary CTA:** Background `#0F766E`, text `#FFFFFF`, 8px radius, height 48px, horizontal padding 24px, font `label-lg`. Hover: `#115E59`. Active: `#134E4A`.
- **Secondary / Ghost:** Transparent background, border 1px solid `#E5E7EB`, text `#1C1C1C`. Hover: Background `#F8F8F6`, border `#D1D5DB`.
- **Urgent Booking Trigger:** Background `#10B981`, text `#FFFFFF`, designed for final confirmation steps where slot security is guaranteed. Hover: `#059669`.

### Chips & Filter Pills
- **Inactive Filter:** Background `#FFFFFF`, border 1px solid `#E5E7EB`, text `#6B7280`, 9999px radius, height 36px, font `label-md`.
- **Active Filter:** Background `#0F766E`, border 1px solid `#0F766E`, text `#FFFFFF`.
- **Discount Chip:** Background `rgba(16, 185, 129, 0.12)`, border 1px solid `rgba(16, 185, 129, 0.25)`, text `#0F766E`, font `caption-sm` with tabular tracking.

### Cards (Venue & Slot Cards)
- Background `#FFFFFF`, 1px border `#E5E7EB`, 16px radius, internal padding 16px.
- **Image Frame:** Fixed aspect ratio 16:10, 10px radius, subtle inner border overlay (`inset 0 0 0 1px rgba(0,0,0,0.05)`).
- **Slot Cluster:** Horizontal rail of available times directly inside the card: 8px rounded pill buttons displaying time (`14:30`) and discount (`-30%`).

### Form Inputs & Search Bar
- **Base Input:** Height 48px, 8px radius, border 1px solid `#E5E7EB`, surface `#FFFFFF`, text `#1C1C1C`, placeholder `#9CA3AF`.
- **Focused State:** Border 1px solid `#0F766E`, box-shadow `0 0 0 3px rgba(15, 118, 110, 0.15)`. No default browser outlines.
- **Unified Desktop Search Bar:** A segmented 3-part pill: Service Type | Neighborhood / CEP | Date & Time, unified within an elevated Level 1 shell with a primary teal submit icon button.

### Lists & Tables
- Divided by hairline borders (`1px solid #E5E7EB`). Row hover state adopts `#F8F8F6` with 8px inner margin bleed.
- Metadata (ratings, street addresses, walk times) sits strictly at `#6B7280` in `body-md` or `caption-sm`.

### Checkboxes & Radios
- 20x20px dimension, 4px radius for checkboxes, full circle for radios.
- Unchecked: 1.5px border `#D1D5DB`, background `#FFFFFF`. Checked: Solid `#0F766E` with sharp white tick icon.

### Specialized Component: Urgency Countdown Micro-Banner
- Surface `rgba(245, 158, 11, 0.1)`, border 1px solid `rgba(245, 158, 11, 0.25)`, text `#B45309`, 8px radius.
- Contains linear clock icon + dynamic countdown ("Segurando esta vaga por 04:59") to maintain transaction flow without full-page alarmist interruptions.
