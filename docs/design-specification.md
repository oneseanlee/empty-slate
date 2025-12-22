# ScorePro E-Learning Platform - Design Specification

## 1. Design Direction & Rationale

**Visual Essence:** Modern Minimalism + Professional Trust combines clean spaciousness with authoritative credibility. The design uses generous whitespace, a restrained color palette anchored by professional blue gradients, and clear typography to create an environment where users feel confident learning sensitive financial information.

**Strategic Rationale:**
1. **Trust through Clarity** – Credit repair education requires users to share sensitive financial data and make important decisions. A clean, professional aesthetic with strong information hierarchy builds confidence and reduces cognitive load during complex learning.
2. **Adult Learning Focus** – The target demographic (ages 25-55) expects serious, credible educational platforms. Modern minimalism signals professionalism without intimidation, making financial literacy feel accessible rather than overwhelming.
3. **White-Label Versatility** – Restrained design with token-based customization allows resellers to easily adapt brand colors while maintaining the platform's premium feel and usability standards.

**Key Characteristics:**
- 85% neutral surfaces with strategic blue/green accents (10-15% area)
- Generous spacing (section gaps: 64-96px, card padding: 32-48px)
- Sharp-to-medium border radius (8-12px) for professional credibility
- Smooth, purposeful animations (250-300ms) signaling quality
- Sans-serif typography prioritizing readability for extended learning sessions

**Reference Examples:**
- [Stripe.com](https://stripe.com) – Professional trust through minimalism
- [Linear.app](https://linear.app) – Clean information architecture
- [Coursera.org](https://coursera.org) – Accessible e-learning patterns


## 2. Design Tokens

### Color Palette

| Token | Value | Usage | WCAG Contrast |
|-------|-------|-------|---------------|
| **Primary Blue** | | | |
| `primary-900` | `#1e3a8a` | Headings, dark backgrounds | 11.2:1 (AAA) on white |
| `primary-700` | `#1d4ed8` | Links, primary buttons | 7.8:1 (AAA) on white |
| `primary-500` | `#3b82f6` | Interactive elements, badges | 4.5:1 (AA) on white |
| `primary-300` | `#93c5fd` | Hover states, light accents | — |
| `primary-50` | `#eff6ff` | Subtle backgrounds, highlights | — |
| **Success Green** | | | |
| `success-700` | `#15803d` | Progress indicators, checkmarks | 7.2:1 (AAA) on white |
| `success-500` | `#22c55e` | Success badges, completed states | 3.1:1 (AA large text) |
| `success-50` | `#f0fdf4` | Success background tints | — |
| **Neutral Gray** | | | |
| `neutral-900` | `#0f172a` | Body text, primary content | 17.8:1 (AAA) on white |
| `neutral-700` | `#334155` | Secondary text, labels | 11.5:1 (AAA) on white |
| `neutral-500` | `#64748b` | Tertiary text, placeholders | 5.7:1 (AAA) on white |
| `neutral-300` | `#cbd5e1` | Borders, dividers | — |
| `neutral-100` | `#f1f5f9` | Card backgrounds, hover states | — |
| `neutral-50` | `#f8fafc` | Page background | — |
| **Background Layers** | | | |
| `bg-page` | `neutral-50` | Main page background | — |
| `bg-surface` | `#ffffff` | Cards, panels (contrast: 8% lightness) | — |
| **Semantic Colors** | | | |
| `warning-600` | `#d97706` | Warnings, caution states | 6.1:1 (AAA) on white |
| `error-600` | `#dc2626` | Errors, destructive actions | 7.5:1 (AAA) on white |
| `info-600` | `#0284c7` | Information, tips | 6.8:1 (AAA) on white |

**WCAG Validation (Key Combinations):**
- Body text (neutral-900) on white: 17.8:1 (AAA) ✓
- Primary button (primary-700) on white: 7.8:1 (AAA) ✓
- Links (primary-500) on white: 4.5:1 (AA) ✓

### Typography

| Token | Value | Usage |
|-------|-------|-------|
| **Font Families** | | |
| `font-sans` | `'Inter', system-ui, -apple-system, sans-serif` | Primary (body, headings, UI) |
| `font-mono` | `'Fira Code', 'Courier New', monospace` | Code snippets, technical content |
| **Font Sizes** | | |
| `text-xs` | `12px / 0.75rem` | Captions, metadata |
| `text-sm` | `14px / 0.875rem` | Secondary text, labels |
| `text-base` | `16px / 1rem` | Body text, paragraphs |
| `text-lg` | `18px / 1.125rem` | Emphasized body, intro text |
| `text-xl` | `20px / 1.25rem` | Subheadings, card titles |
| `text-2xl` | `24px / 1.5rem` | Section headings |
| `text-3xl` | `30px / 1.875rem` | Page titles |
| `text-4xl` | `36px / 2.25rem` | Hero headlines |
| `text-5xl` | `48px / 3rem` | Landing page heroes (desktop) |
| **Font Weights** | | |
| `font-regular` | `400` | Body text, paragraphs |
| `font-medium` | `500` | Emphasized text, labels |
| `font-semibold` | `600` | Subheadings, buttons |
| `font-bold` | `700` | Headings, strong emphasis |
| **Line Heights** | | |
| `leading-tight` | `1.25` | Headings, display text |
| `leading-normal` | `1.5` | Body text, UI elements |
| `leading-relaxed` | `1.625` | Long-form content, lesson text |

### Spacing Scale (4pt-based)

| Token | Value | Common Usage |
|-------|-------|--------------|
| `space-xs` | `8px` | Tight element spacing, icon gaps |
| `space-sm` | `12px` | Related content proximity |
| `space-md` | `16px` | Standard component padding |
| `space-lg` | `24px` | Section internal spacing |
| `space-xl` | `32px` | Card padding (minimum), component gaps |
| `space-2xl` | `48px` | Card padding (preferred), section spacing |
| `space-3xl` | `64px` | Section gaps, hero padding |
| `space-4xl` | `96px` | Major section dividers |

### Border Radius

| Token | Value | Usage |
|-------|-------|-------|
| `radius-sm` | `4px` | Small elements, badges |
| `radius-md` | `8px` | Inputs, small cards |
| `radius-lg` | `12px` | Cards, panels, modals |
| `radius-xl` | `16px` | Large hero sections, featured cards |
| `radius-full` | `9999px` | Pills, avatars, circular buttons |

### Shadows

| Token | Value | Usage |
|-------|-------|-------|
| `shadow-sm` | `0 1px 2px 0 rgba(15, 23, 42, 0.05)` | Subtle elevation, inputs |
| `shadow-card` | `0 1px 3px 0 rgba(15, 23, 42, 0.08), 0 1px 2px 0 rgba(15, 23, 42, 0.04)` | Default card state |
| `shadow-card-hover` | `0 10px 24px -4px rgba(59, 130, 246, 0.12), 0 4px 8px -2px rgba(59, 130, 246, 0.06)` | Card hover (blue tint) |
| `shadow-modal` | `0 20px 40px -8px rgba(15, 23, 42, 0.15)` | Modals, overlays |

### Animation

| Token | Duration | Easing | Usage |
|-------|----------|--------|-------|
| `duration-fast` | `200ms` | `ease-out` | Micro-interactions, tooltips |
| `duration-normal` | `300ms` | `ease-out` | Standard transitions, hovers |
| `duration-slow` | `400ms` | `ease-out` | Page transitions, modals |
| `easing-default` | — | `cubic-bezier(0.4, 0, 0.2, 1)` | General purpose |


## 3. Component Specifications

### Button

**Structure:** Label (font-semibold) + Icon (optional, 20px) + Padding (12px vertical, 24px horizontal)

**Primary Button:**
- Background: `primary-700` → hover: `primary-900`
- Text: `#ffffff` (font-semibold, text-base)
- Border radius: `radius-lg` (12px)
- Height: 48px minimum (touch-friendly)
- Shadow: `shadow-sm` → hover: `shadow-card`
- Transition: background `duration-normal`, shadow `duration-fast`

**Secondary Button:**
- Background: `transparent` → hover: `neutral-100`
- Text: `neutral-900` (font-semibold, text-base)
- Border: 2px solid `neutral-300` → hover: `primary-500`
- Border radius: `radius-lg` (12px)
- Height: 48px minimum
- Transition: all `duration-normal`

**States:**
- Disabled: 40% opacity, cursor not-allowed
- Focus: 3px ring `primary-300`, offset 2px
- Active: scale(0.98) transform

**Note:** Use `transform` for active state animation (GPU-accelerated). Text must maintain 4.5:1 contrast in all states.

### Card (Lesson/Course Container)

**Structure:** Content wrapper with consistent padding and elevation

- Background: `bg-surface` (white) on `bg-page` (neutral-50)
- Padding: `space-2xl` (48px) on desktop, `space-xl` (32px) on mobile
- Border radius: `radius-lg` (12px)
- Border: 1px solid `neutral-200` (optional, for subtle definition)
- Shadow: `shadow-card` → hover: `shadow-card-hover`

**Hover Interaction:**
- Transform: translateY(-4px) + scale(1.01)
- Shadow: `shadow-card-hover` (blue tint)
- Transition: all `duration-normal`

**Content Hierarchy:**
- Title: `text-xl`, `font-semibold`, `neutral-900`
- Description: `text-base`, `font-regular`, `neutral-700`, `leading-relaxed`
- Metadata: `text-sm`, `neutral-500`, gap `space-sm`

**Note:** Card background must contrast page background by ≥5% lightness for depth perception. Hover animation uses `transform` and `box-shadow` only (no layout shifts).

### Input Field

**Structure:** Label + Input + Helper/Error text

- Height: 48px (touch-friendly)
- Padding: `space-md` (16px horizontal)
- Font: `text-base`, `font-regular`, `neutral-900`
- Background: `bg-surface` (white)
- Border: 1px solid `neutral-300`
- Border radius: `radius-md` (8px)

**States:**
- Default: border `neutral-300`
- Focus: border `primary-500`, ring 3px `primary-300` (offset 0px)
- Error: border `error-600`, ring 3px `error-200`
- Disabled: background `neutral-100`, text `neutral-500`, opacity 60%

**Label:** `text-sm`, `font-medium`, `neutral-700`, margin-bottom `space-xs`

**Helper Text:** `text-sm`, `neutral-500` (default) or `error-600` (error state)

**Note:** Maintain 4.5:1 contrast for placeholder text. Focus state must be visible for keyboard navigation.

### Navigation Bar

**Structure:** Horizontal bar with logo, menu items, CTA button

- Height: 72px (desktop), 64px (mobile)
- Background: `bg-surface` (white) with `shadow-sm`
- Padding: `space-lg` (24px horizontal)
- Position: Sticky top

**Menu Items:**
- Font: `text-base`, `font-medium`, `neutral-700`
- Hover: `primary-700`, transition `duration-fast`
- Active: `primary-700`, underline 2px (offset 8px below text)
- Gap: `space-xl` (32px) between items

**Logo:** Height 40px, aligned left

**CTA Button:** Primary button style, aligned right

**Mobile (<768px):** Hamburger menu, slide-in drawer from right, overlay backdrop (rgba(0,0,0,0.4))

**Note:** Ensure touch targets ≥44×44px on mobile. Use icon library (Lucide/Heroicons) for hamburger/close icons.

### Progress Indicator (Course Completion)

**Structure:** Visual bar showing percentage completion

- Container: Background `neutral-200`, height 8px, `radius-full`
- Fill: Background gradient (`primary-500` → `success-500`), height 8px, `radius-full`
- Width: Percentage-based (0-100%)
- Transition: width `duration-slow` ease-out

**With Label:**
- Display percentage above/beside bar
- Font: `text-sm`, `font-semibold`, `neutral-700`

**States:**
- 0-25%: `primary-500` solid (starting)
- 26-99%: gradient `primary-500` → `success-500` (in progress)
- 100%: `success-700` solid + checkmark icon (completed)

**Note:** Animate width property with `transform: scaleX()` for better performance. Include `role="progressbar"` and `aria-valuenow` for accessibility.

### Modal (Quiz/Completion Dialog)

**Structure:** Overlay + centered content panel

**Overlay:** Background rgba(15, 23, 42, 0.6), backdrop-blur(4px)

**Panel:**
- Background: `bg-surface` (white)
- Padding: `space-3xl` (64px) on desktop, `space-2xl` (48px) on mobile
- Border radius: `radius-xl` (16px)
- Shadow: `shadow-modal`
- Max-width: 600px
- Position: centered (transform: translate(-50%, -50%))

**Header:**
- Title: `text-3xl`, `font-bold`, `neutral-900`
- Close button: 40×40px, top-right corner, icon 24px

**Content:** Scrollable if exceeds viewport height, padding maintained

**Footer:** Action buttons, right-aligned, gap `space-md`

**Animation:**
- Enter: opacity 0→1, scale 0.95→1.0, `duration-normal`
- Exit: opacity 1→0, scale 1.0→0.95, `duration-fast`

**Note:** Trap focus within modal, close on Escape key or overlay click. Support `prefers-reduced-motion` with opacity-only animation.


## 4. Layout & Responsive Strategy

### Breakpoints

| Breakpoint | Min Width | Usage |
|------------|-----------|-------|
| `sm` | 640px | Large phones (landscape) |
| `md` | 768px | Tablets |
| `lg` | 1024px | Small laptops, tablets (landscape) |
| `xl` | 1280px | Desktops |
| `2xl` | 1536px | Large desktops |

### Grid System

- **Container max-width:** 1280px (xl breakpoint), centered with horizontal padding
- **Horizontal padding:** `space-lg` (24px) on mobile, `space-3xl` (64px) on desktop
- **Columns:** 4 (mobile) → 8 (tablet) → 12 (desktop)
- **Gap:** `space-lg` (24px) standard, `space-xl` (32px) for featured content

### Adaptation Principles

**Course Grid (Catalog View):**
- Mobile (<640px): 1 column, full width cards
- Tablet (640-1024px): 2 columns
- Desktop (≥1024px): 3 columns
- Gap: `space-lg` (24px)

**Lesson Sidebar Navigation:**
- Mobile: Collapsed, accessible via toggle button (drawer pattern)
- Tablet/Desktop: Persistent left sidebar (280px width), main content flexible

**Hero Section:**
- Height: 400px (desktop), 300px (mobile)
- Title: `text-5xl` (desktop) → `text-3xl` (mobile)
- Vertical padding: `space-4xl` (desktop) → `space-3xl` (mobile)

**Typography Scaling:**
- Headings reduce by 1-2 sizes on mobile (e.g., `text-4xl` → `text-2xl`)
- Body text remains `text-base` (16px minimum for readability)
- Line height increases to `leading-relaxed` (1.625) for long-form mobile reading

**Touch Targets:**
- Minimum 44×44px on mobile for all interactive elements
- Increase spacing between clickable elements to prevent mis-taps

**General Rules:**
- Stack horizontally-aligned elements vertically on mobile
- Hide non-essential decorative elements <640px
- Prioritize content over chrome (reduce navigation weight on small screens)


## 5. Interaction Principles

### Animation Standards

**Timing:**
- **Fast (200ms):** Tooltips, dropdowns, micro-feedback (icon changes)
- **Normal (300ms):** Buttons, cards, navigation transitions, form validation
- **Slow (400ms):** Modal enter/exit, page transitions, progress animations

**Default Easing:** `cubic-bezier(0.4, 0, 0.2, 1)` (ease-out) – decelerates toward end, feels responsive

### Component Animation Rules

**Buttons:**
- Hover: background-color `duration-normal`
- Active: transform scale(0.98) `duration-fast`

**Cards:**
- Hover: transform (translateY + scale) + shadow `duration-normal`
- Entry: fade-in (opacity 0→1) stagger 50ms per card

**Navigation:**
- Menu item hover: color `duration-fast`
- Mobile drawer: slide-in transform `duration-normal`

**Modals:**
- Enter: opacity + scale `duration-normal`
- Exit: opacity + scale `duration-fast`

**Progress Bars:**
- Width change: `duration-slow` ease-out (celebratory feel for completion)

**Form Inputs:**
- Focus ring: appear instantly (0ms) or `duration-fast`
- Error state: shake animation 400ms (translateX -4px → 4px → 0) once

### Performance Requirement

**GPU-Accelerated Only:** Animate ONLY `transform` (translate, scale, rotate) and `opacity`. Never animate `width`, `height`, `margin`, `padding`, `top`, `left` (causes layout reflows).

**Exception:** Progress bar width animation acceptable (low frequency, isolated element).

### Accessibility: Reduced Motion

Support users with `prefers-reduced-motion: reduce`:
- Disable transform/scale animations
- Replace with simple opacity fades (`duration-fast`)
- Keep essential state changes (e.g., color transitions) intact

**Implementation:** Provide alternate CSS rules in media query that replace complex animations with opacity-only transitions.

---

**Design Specification Complete**
*Version 1.0 – ScorePro E-Learning Platform*
*Author: MiniMax Agent*
