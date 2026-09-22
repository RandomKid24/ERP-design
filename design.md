# Aether ERP — Complete Design Context

> Everything about this design, extracted 1:1 from the codebase: colors, typography, spacing, every component (both the `UI/` primitive library and the `components/ui/` app components), toast system, charts, animations, layouts, pages, theming, and dependencies.

---

## 1. Design Philosophy

**Subtle Premiumism** — extreme clarity, hairline depth, high-end "Pro" aesthetics.

| Principle | Implementation |
|-----------|----------------|
| Zero Bulk | No heavy shadows, no thick borders, no high-contrast saturation |
| Glass & Air | Subtle translucency, generous whitespace, dot-grid backdrop |
| Hairline Borders | All borders `slate-200` or lighter (`slate-100`, `slate-50`) |
| Micro-Interactivity | Every hover/click has `duration-200` or `duration-300` transition |
| Consistency | Same color primitives, spacing scale, radii everywhere |
| Press Feedback | Buttons/segments/deletable actions use `active:scale-[0.95–0.98]` |

---

## 2. Color System

### 2.1 Brand Primary (Tailwind `blue`)

| Token | Hex | Usage |
|-------|-----|-------|
| `blue-50` | `#eff6ff` | Active nav bg, primary-muted surfaces |
| `blue-100` | `#dbeafe` | Borders/soft accents |
| `blue-200` | `#bfdbfe` | Hover borders, outline tints |
| `blue-500` | `#3b82f6` | Focus rings, accents, chart line |
| `blue-600` | `#2563eb` | Primary buttons, active icons, progress bars |
| `blue-700` | `#1d4ed8` | Primary hover |

### 2.2 Neutral Palette (Tailwind `slate`)

| Token | Hex | Usage |
|-------|-----|-------|
| `slate-50` | `#f8fafc` | Page bg, hover bg, table header |
| `slate-100` | `#f1f5f9` | Progress track, skeletons, borders |
| `slate-200` | `#e2e8f0` | Card/border/dividers, separator |
| `slate-300` | `#cbd5e1` | Disabled/placeholder icons |
| `slate-400` | `#94a3b8` | Meta text, sub-labels, muted icons |
| `slate-500` | `#64748b` | Secondary body, table headers |
| `slate-600` | `#475569` | Body / table cell text |
| `slate-700` | `#334155` | Emphasis labels |
| `slate-800` | `#1e293b` | Toast text, strong emphasis |
| `slate-900` | `#0f172a` | Headings, primary dark text, secondary buttons |

### 2.3 Semantic Colors

| Role | Text | Background | Border | Accent |
|------|------|------------|--------|--------|
| Success | `emerald-600`/`700` | `emerald-50` | `emerald-100`/`200` | `emerald-500` (icon) |
| Warning | `amber-600`/`700` | `amber-50` | `amber-100`/`200` | `amber-500` |
| Error/Danger | `rose-600`/`700` | `rose-50` | `rose-100`/`200` | `rose-500` (icon), `rose-600` (btn) |
| Info | `blue-600`/`700` | `blue-50` | `blue-100`/`200` | `blue-500` |

### 2.4 Theme Accent System (`context/ThemeContext.tsx`)

Live accent swap via CSS variables. Persisted in `localStorage` (`ui-color`, `ui-density`).

| Theme | Name | primary | hover | accent | muted | foreground |
|-------|------|---------|-------|--------|-------|------------|
| `blue` | Royal Blue | `#2563eb` | `#1d4ed8` | `#3b82f6` | `#eff6ff` | `#fff` |
| `sky` | Sky Blue | `#0ea5e9` | `#0284c7` | `#38bdf8` | `#f0f9ff` | `#fff` |
| `emerald` | Emerald | `#10b981` | `#059669` | `#34d399` | `#f0fdf4` | `#fff` |
| `rose` | Rose | `#f43f5e` | `#e11d48` | `#fb7185` | `#fff1f2` | `#fff` |
| `violet` | Violet | `#8b5cf6` | `#7c3aed` | `#a78bfa` | `#f5f3ff` | `#fff` |
| `slate` | Zinc | `#18181b` | `#27272a` | `#52525b` | `#f4f4f5` | `#fff` |

CSS variables set on `:root`:
```
--primary, --primary-hover, --primary-accent, --primary-muted,
--primary-foreground, --ui-padding, --ui-gap, --ui-radius, --ui-scale
```

### 2.5 Density Modes

| Density | padding | gap | radius | font scale |
|---------|---------|-----|--------|-----------|
| `compact` | `0.625rem` | `0.5rem` | `0.5rem` | `0.95` |
| `default` | `1.25rem` | `1rem` | `0.75rem` | `1` |
| `relaxed` | `2rem` | `1.5rem` | `1rem` | `1.05` |

Root font-size scales with `--ui-scale`.

---

## 3. Typography

### 3.1 Font Stack

```css
font-family: 'Outfit', 'Inter', system-ui, -apple-system, sans-serif;
```

Weights loaded: Outfit `300–900`, Inter `400–700`. Body uses `font-sans`. Autofill-safe, anti-aliased (`antialiased` on `<body>`).

### 3.2 Type Scale (as used in code)

| Context | Size | Weight | Notes |
|---------|------|--------|-------|
| Page Title (PageLayout) | `text-4xl` (36px) | `font-bold` | `tracking-tight leading-none whitespace-nowrap` |
| Logo wordmark | `text-lg` | `font-bold` | `tracking-tight text-slate-900` |
| StatCard value | `text-2xl` | `font-bold` | `tracking-tight tabular-nums` |
| Modal title | `text-lg` | `font-bold` | `text-slate-900` |
| Card title | `text-base` | `font-semibold` | `text-slate-900` |
| Card description | `text-[11px]` | `font-medium` | `text-slate-400` |
| Body / inputs | `text-sm` | `font-medium` | |
| Table cells | `text-xs` | `font-normal`/`font-medium` | `text-slate-800/600` |
| Table header | `text-[10px]` | `font-bold` | `uppercase tracking-wider text-slate-500` |
| Meta labels | `text-[10px]`–`[11px]` | `font-bold` | `uppercase tracking-widest text-slate-400` |
| Micro-badges | `text-[9px]` | `font-black` | `uppercase tracking-wider` |
| Sidebar nav | `text-[13px]` | `font-medium` | active → `font-semibold` |
| Tooltips | `text-[11px]` | `font-semibold` | `leading-normal` |
| Error text | `text-[10px]`/`[11px]` | `font-bold`/`medium` | `text-rose-500`, uppercase in forms |

### 3.3 Numbers

All monetary values, counts, and dates use `tabular-nums` (StatCard values, table amount/date columns). Chart Y-axis formats INR: `K`, `L`, `Cr` suffixes.

---

## 4. Spacing, Layout, Radius, Shadows

### 4.1 Spacing Scale

| Token | Value | Context |
|-------|-------|---------|
| `gap-6` / `gap-8` | 1.5rem / 2rem | Major grid gaps |
| `p-5` / `p-6` | 1.25rem / 1.5rem | Card content |
| `px-6 py-5` | 1.5rem / 1.25rem | Card header |
| `px-4 py-3` | 1rem / 0.75rem | Table rows |
| `px-6 py-4` | 1.5rem / 1rem | Modal header/footer |
| `px-3 py-2` | 0.75rem / 0.5rem | Sidebar items |
| `gap-3` | 0.75rem | Button icon spacing |
| `gap-1.5` | 0.375rem | Tight groups, form stacks |

### 4.2 Border Radius

| Context | Class |
|---------|-------|
| Cards (dashboard) | `rounded-2xl` / inline `1.25rem` & `1rem` |
| Modal | `rounded-2xl` / `rounded-3xl` |
| Buttons / Inputs | `rounded-lg` / `rounded-xl` |
| Badges / Pills / Tags | `rounded-full` |
| SegmentToggle container | `rounded-xl`, indicator `rounded-[10px]` |
| Avatars / logo blocks | `rounded-lg` or `rounded-full` |

### 4.3 Shadows (layered, soft)

| Use | Shadow |
|-----|--------|
| StatCard (rest) | `0 2px 4px rgba(0,0,0,0.02), 0 1px 0 rgba(0,0,0,0.02)` |
| Card (rest) | `0 1px 3px rgba(0,0,0,0.05), 0 10px 40px -15px rgba(0,0,0,0.02)` |
| Card (hover) | `0 20px 50px -15px rgba(0,0,0,0.08)` + `border-blue-200/50` + `-translate-y-1` |
| StatCard (hover) | `shadow-xl shadow-blue-500/5` + `border-blue-200/50` |
| Primary button | `shadow-sm` + `hover:shadow-blue-500/20` |
| Modal | `shadow-2xl` |
| Select dropdown | `shadow-2xl` |
| Notifications panel | `shadow-2xl` |
| Search results / dropdowns | `shadow-xl` |
| Tooltip | `shadow-lg shadow-slate-100/80` |

### 4.4 Layout Dimensions

| Element | Spec |
|---------|------|
| Sidebar | `w-60` (240px), `h-screen`, fixed left, `z-30` |
| Navbar | `h-16` (64px), `sticky top-0 z-40`, `ml-60` |
| Content area | `ml-60`, `px-16`, `pt-[1.5625rem] pb-[0.625rem]` |
| Background | `bg-slate-50` / `bg-[#f8fafc]` |
| Backdrop pattern | `radial-gradient(#e2e8f0 1px, transparent 1px)` at `24px` grid, `opacity-30` |
| Toast position | `fixed bottom-8 right-8 z-[100]` |
| Select dropdown | `z-[99999]` |
| Modal | `z-[120]` (legacy) / `z-50` (UI layer) |

---

## 5. Component Library — `UI/` (Primitives)

Cleaner, semantic, reusable layer. Exported from `UI/index.ts`.

### 5.1 Button (`UI/Button.tsx`)

```yaml
base: "inline-flex items-center justify-center transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none whitespace-nowrap"
variants:
  primary:   "bg-blue-600 text-white shadow-sm hover:bg-blue-700 hover:shadow-blue-500/20 active:scale-[0.98]"
  secondary: "bg-slate-900 text-white hover:bg-slate-800 shadow-sm active:scale-[0.98]"
  outline:   "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 hover:border-slate-300 shadow-xs active:scale-[0.98]"
  ghost:     "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
  danger:    "bg-rose-600 text-white hover:bg-rose-700 shadow-sm active:scale-[0.98]"
  link:      "text-blue-600 hover:underline font-semibold p-0 h-auto"
sizes:
  xs:   "h-8 px-3 text-[10px] rounded-lg uppercase tracking-widest font-bold"
  sm:   "h-9 px-4 text-xs rounded-lg font-bold"
  md:   "h-10 px-5 text-sm rounded-lg font-bold"
  lg:   "h-12 px-8 text-base rounded-xl font-bold"
  icon: "h-10 w-10 p-0 rounded-lg"
props: isLoading (Loader2 spin, 16px), leftIcon, rightIcon (icons at opacity-90)
```

### 5.2 Input (`UI/Input.tsx`)

```yaml
container: "flex flex-col gap-1.5 w-full"
label: "text-sm font-medium text-slate-500 ml-1"
input: "flex h-11 w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium
        placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20
        focus:border-blue-500 disabled:cursor-not-allowed disabled:opacity-50 hover:border-slate-300"
error:  "border-rose-500 focus:ring-rose-500/20 focus:border-rose-500"
error_text: "text-[10px] font-bold text-rose-500 ml-1 uppercase tracking-tight"
```

### 5.3 Label (`UI/Label.tsx`)

```yaml
base: "text-sm font-medium text-slate-500 leading-none flex items-center gap-1
       peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
required: adds red asterisk (text-rose-500)
```

### 5.4 Badge (`UI/Badge.tsx`)

```yaml
base: "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold
       transition-colors focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2"
variants:
  default:   "bg-slate-900 text-white border-transparent"
  secondary: "bg-slate-100 text-slate-900 border-transparent hover:bg-slate-200"
  outline:   "text-slate-900 border-slate-200 bg-transparent"
  success:   "bg-emerald-50 text-emerald-700 border-emerald-100"
  warning:   "bg-amber-50 text-amber-700 border-amber-100"
  danger:    "bg-rose-50 text-rose-700 border-rose-100"
  info:      "bg-blue-50 text-blue-700 border-blue-100"
```

### 5.5 Card (`UI/Card.tsx`)

```yaml
Card:        "rounded-2xl border border-slate-200 bg-white text-slate-950 shadow-sm transition-all duration-300"
hoverable:   "hover:shadow-md hover:border-blue-200/50 hover:-translate-y-1"
CardHeader:  "flex flex-col space-y-1.5 p-6"
CardTitle:   "text-base font-semibold text-slate-900"
CardDescription: "text-sm font-semibold text-slate-500"
CardContent: "p-6 pt-0"
CardFooter:  "flex items-center p-6 pt-0"
```

### 5.6 Table (`UI/Table.tsx`) — semantic shadcn-style

```yaml
container:   "relative w-full overflow-auto rounded-xl border border-slate-200 shadow-sm"
table:       "w-full caption-bottom text-sm border-separate border-spacing-0"
TableHeader: "bg-slate-50/50 [&_tr]:border-b"
TableFooter: "border-t bg-slate-50/50 font-medium"
TableRow:    "border-b transition-colors hover:bg-slate-50/50 data-[state=selected]:bg-slate-100"
TableHead:   "h-11 px-4 text-left align-middle font-semibold text-slate-500 uppercase tracking-wider text-xs border-b border-slate-200"
TableCell:   "p-4 align-middle border-b border-slate-100 font-medium text-slate-600"
TableBody:   "[&_tr:last-child]:border-0 bg-white"
```

### 5.7 Modal (`UI/Modal.tsx`)

```yaml
sizes: sm="max-w-sm" md="max-w-md" lg="max-w-lg" xl="max-w-2xl" full="max-w-[95vw]"
backdrop: "absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
panel:  "relative w-full rounded-3xl bg-white shadow-2xl transition-all duration-300 animate-in fade-in zoom-in-95"
header: "px-6 py-4 border-b border-slate-100 flex items-center justify-between" + ghost X icon button (rounded-full h-8 w-8)
body:   "px-6 py-6 overflow-y-auto max-h-[70vh]"
footer: "bg-slate-50/50 border-t border-slate-100 flex items-center justify-end gap-3 px-6 py-4"
scroll-lock: body overflow hidden while open (restored on close)
```

### 5.8 Select (`UI/Select.tsx`) — native select

```yaml
label: "text-sm font-medium text-slate-500 ml-1"
select: "flex h-11 w-full appearance-none rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium
         focus:ring-2 focus:ring-blue-500/20 disabled:opacity-50 hover:border-slate-300"
chevron: "absolute right-3 top-3.5 h-4 w-4 text-slate-400 pointer-events-none"
error:   border-rose-500 + "text-[10px] font-bold text-rose-500 ml-1 uppercase tracking-tight"
```

### 5.9 Switch (`UI/Switch.tsx`)

```yaml
track: "rounded-full bg-slate-200 transition-all duration-300 peer-checked:bg-blue-600
        peer-focus:ring-2 peer-focus:ring-blue-500/20"
sizes: sm="h-4 w-8 (thumb 12px, xl 16px)"  md="h-6 w-11 (thumb 20px, xl 20px)"
thumb: "absolute top-0.5 left-0.5 rounded-full bg-white transition-all duration-300"
label: "text-sm font-semibold text-slate-700 select-none"
```

### 5.10 Pagination (`UI/Pagination.tsx`)

```yaml
layout:   centered, gap-1.5, px-4 py-3
buttons:  9x9 square (h-9 w-9 rounded-lg), outline variant; active = primary + shadow-blue-500/20
current page / total; prev disabled at 1, next disabled at last
ellipsis: MoreHorizontal size-14 text-slate-400, window of 5 pages
```

### 5.11 Separator (`UI/Separator.tsx`)

```yaml
base: "shrink-0 bg-slate-200"
horizontal: "h-[1px] w-full"   vertical: "h-full w-[1px]"
```

### 5.12 DatePicker (`UI/DatePicker.tsx`)

```yaml
size:  "h-11 w-full rounded-xl border border-slate-200 pl-11 pr-4 text-sm font-semibold"
icon:  Calendar (or Clock for time / datetime-local) at left-4, slate-400 → blue-500 on focus-within
hover: group-hover:border-slate-300; appearance:none; cursor-pointer
focus: ring-2 ring-blue-500/20, border-blue-500; error → border-rose-500
```

### 5.13 Tooltip (`UI/Tooltip.tsx`) — Radix

```yaml
trigger:  asChild, delayDuration=100 default
content:  "z-[100] px-2.5 py-1.5 rounded-xl border border-slate-200 bg-white shadow-lg
           shadow-slate-100/80 animate-in fade-in zoom-in-95 duration-100
           data-[state=closed]:animate-out fade-out zoom-out-95"
text:     "text-[11px] font-semibold text-slate-800 whitespace-pre-line"
arrow:    fill-white stroke-slate-200 stroke-1 (w8 h4), sideOffset 6
```

### 5.14 Breadcrumb (`UI/Breadcrumb.tsx`)

```yaml
nav: "flex items-center gap-2 mb-6"
home: Home icon (14px) slate-400 → blue-600 on hover, scale on hover (group-hover:scale-110)
separator: ChevronRight (14px) text-slate-300
links:  "text-xs font-semibold text-slate-500 hover:text-blue-600"
current: "text-slate-900 border-b-2 border-blue-500/50 pb-0.5"
```

### 5.15 SegmentToggle (`UI/SegmentToggle.tsx`)

```yaml
container: "bg-slate-100/80 inline-flex items-center p-0.5 rounded-xl border border-slate-200/60 shadow-sm relative"
sizes: sm="min-w-[120px]" md="min-w-[140px]"
indicator: "absolute top-0.5 bottom-0.5 rounded-[10px] bg-white shadow-sm border border-slate-200/50
            transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]"  (width/left computed by index)
option:   "relative flex-1 flex items-center justify-center gap-2 rounded-[10px] z-10 active:scale-[0.98]"
active:   "text-blue-700"   idle: "text-slate-500 hover:text-slate-800"
label:    "text-[11px] font-medium uppercase tracking-wide" (+ icon size-3/size-3.5)
accessibility: role="radiogroup" / role="radio" aria-checked
```

---

## 6. App Components — `components/ui/`

### 6.1 Toast (`components/ui/Toast.tsx`) — the notification system

```yaml
type: 'success' | 'error' | 'info'  (exported as ToastType)
position: "fixed bottom-8 right-8 z-[100] flex items-center gap-3 px-4 py-3 rounded-xl border shadow-lg
           animate-in slide-in-from-right-10 fade-in duration-300"
variants:
  success → bg-emerald-50 border-emerald-100, icon CheckCircle emerald-500 (18px)
  error   → bg-rose-50     border-rose-100,     icon AlertCircle rose-500 (18px)
  info    → bg-blue-50     border-blue-100,     icon Info blue-500 (18px)
text:    "text-sm font-semibold text-slate-800"
close:   "ml-2 p-1 hover:bg-black/5 rounded-lg transition-colors"  X icon 14px slate-400
autodismiss: 3000ms default (configurable via duration prop)
```

**How toasts are triggered** (global, via AppContext `showToast(message, type)`):
- Demo data simulated → `success`
- Demo data flushed → `info`
- Notifications "Clear all" → success
- Dashboard "Save Layout" → success, "Layout unlocked" → info
- Export CSV → success ("Enterprise data exported successfully")
- Login success → "Welcome back, Admin!" success; login failure → inline error alert
- Other pages call `showToast` for create/update/delete operations

**Inline error alert** (LoginPage): `bg-rose-50 border border-rose-200 text-rose-700 p-4 rounded-lg` with AlertCircle.

### 6.2 Sidebar (`components/ui/Sidebar.tsx`)

```yaml
aside: "w-60 h-screen bg-white border-r border-slate-200/60 flex flex-col fixed left-0 top-0 z-30 p-5"
logo:   "flex items-center gap-2.5 mb-7 px-2 hover:opacity-80"
logo block: "w-7 h-7 bg-blue-600 rounded shadow-sm" + white bold "A"
wordmark: "Aether" (slate-900 bold) + "ERP" (slate-400 medium)
branding: "Powered by <b>BeForth</b>" text-[11px]; version pill "v1.1.1" (blue-50/border-blue-200) opens changelog
section labels: "text-[10px] font-bold text-slate-400 uppercase tracking-widest"
nav item:
  base: "group flex items-center justify-between w-full rounded-lg text-[13px] transition-all duration-200 font-medium px-3 py-2"
  idle: "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
  active: "bg-blue-50 text-blue-700 font-semibold"
  icon: size 18, strokeWidth 1.8 idle (text-slate-400, group-hover:text-slate-600) / 2.2 active (text-blue-600)
  badge: idle "bg-slate-100 text-slate-500" / active "bg-blue-600 text-white" — text-[10px] px-1.5 py-0.5 rounded-md font-bold
secondary section: top border-t border-slate-100 pt-3
user card: "mt-4 flex items-center gap-2.5 p-2.5 rounded-xl border border-slate-100/80 bg-slate-50/50 hover:bg-slate-50"
  avatar: "w-8 h-8 rounded-lg bg-blue-100 border border-blue-200/50 text-blue-600 font-bold text-xs" ("AR")
  name: "text-[12px] font-semibold text-slate-900 truncate" ("Alex Rivera")
  role: "text-[10px] text-slate-500 font-medium truncate" ("Administrator")
```

**Nav config** (`constants.tsx`): Dashboard, Orders (badge `12`), Quotations, Customers, Inventory, Financials, Reports, Invoices + Settings, Support (Lucide icons).

### 6.3 Navbar (`components/ui/Navbar.tsx`)

```yaml
header: "h-16 sticky top-0 bg-white/5 backdrop-blur-md z-40 ml-60 flex items-center justify-between"
hairline: "absolute bottom-0 left-8 right-8 h-px bg-slate-200/50"
search zone: "flex-1 max-w-lg relative pl-8" — SearchInput with ⌘K
results dropdown: "absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 shadow-xl rounded-xl
                   animate-in fade-in slide-in-from-top-1 duration-200"
  row: "w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-50"
  icon slate-400 → blue-600 on hover; ArrowRight arrow fades in on hover
notifications bell button:
  idle:   "bg-blue-50/50 border-blue-100 text-blue-600 hover:bg-blue-50"
  active: "bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-100"
  shape:  "flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all active:scale-95"
  count: unread number badges only
panel (w-80, shadow-2xl, rounded-2xl, z-50):
  header: "px-5 py-3.5 bg-slate-50/50 border-b border-slate-100" + "Clear all" blue link
  list: max-h-[320px] with custom scrollbar; item "px-4 py-2.5 hover:bg-slate-50 border-b border-slate-50"
  unread dot: "w-1 h-1 rounded-full bg-blue-600 shadow-[0_0_8px_rgba(37,99,235,0.4)]"
  footer: "bg-slate-50/50 border-t border-slate-100" → "Full Activity Log" link
type icons: order=ShoppingBag(blue) system=ShieldAlert(amber) inventory=Package(rose) customer/follow_up/new_inquiry=MessageSquare(emerald/blue)
avatar: "w-8 h-8 rounded-full bg-blue-600 text-white text-xs font-bold border-2 border-white shadow-sm" ("AR")
settings gear: "p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-lg" (20px, strokeWidth 1.5)
shortcut: ⌘K (Meta/Ctrl+K) focuses search
```

### 6.4 SearchInput (`components/ui/SearchInput.tsx`)

```yaml
shape: pill (rounded-full), white, border-slate-200, shadow-sm
sizes: md="h-10 pl-11 pr-10 text-[13px] font-medium"  sm="h-9 pl-9 pr-9 text-xs"
hover: "hover:border-slate-300 hover:bg-slate-50/50"
focus: "focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:shadow-md"
icon: Search 16px (sm 14px) strokeWidth 2.5, slate-400 → blue-600 on focus-within
clear: X 14px right-3, p-1.5 rounded-full hover:bg-slate-100
rightElement: shown when empty (⌘K hint "⌘" 10px + "K")
```

### 6.5 DataTable (`components/ui/DataTable.tsx`)

```yaml
container: "relative w-full overflow-auto customize-scrollbar" (+ bordered → "border border-slate-200 rounded-2xl bg-white shadow-xs")
header (sticky top-0 z-20):
  "h-10 px-4 text-left select-none bg-slate-50 text-slate-500 uppercase text-[10px] tracking-wider font-bold border-b border-slate-200"
  first col: pl-6; align center/right supported
sorting: sortable → "cursor-pointer hover:bg-slate-100/70 transition-colors duration-150 group"
  idle: ArrowUpDown 10px slate-300 (group-hover:text-slate-400) strokeWidth 2
  asc:  ArrowUp 10px blue-600 strokeWidth 2.5   desc: ArrowDown same
body rows:
  "px-4 align-middle text-xs font-normal text-slate-800 truncate" py-3 (dense py-2)
  divider: "border-b border-slate-200/60" (not on last row)
  hover: "hover:bg-slate-50/40"  clickable: "cursor-pointer hover:bg-slate-50/60 active:bg-slate-50/90"
loading:
  first-load: 6 skeleton rows "h-3 rounded bg-slate-100 animate-pulse" (~55–90% width pattern)
  refresh: absolute overlay "bg-white/40 backdrop-blur-[1px]" + "w-5 h-5 border-2 border-slate-200 border-t-blue-600 rounded-full animate-spin"
empty:
  "py-16 text-center" — Database icon in "w-9 h-9 rounded-lg bg-slate-50 border border-slate-200/50" + "No data found"
props: sortConfig, onSort, rowKey, onRowClick, getRowClassName, isLoading, dense, hideHeader, bordered, custom render per column
```

### 6.6 Badge (`components/ui/Badge.tsx`) — dashboard flavor

```yaml
variants:
  default: "bg-slate-100 text-slate-800"           (no border)
  success: "bg-emerald-50 text-emerald-700 border border-emerald-100"
  warning: "bg-amber-50 text-amber-700 border border-amber-100"
  error:   "bg-rose-50 text-rose-700 border border-rose-100"
  outline: "border border-slate-200 text-slate-600"
base: "px-2 py-0.5 rounded-full text-xs font-medium inline-flex items-center"
used for tx status: Completed→success, Pending→warning, Canceled→error
```

### 6.7 Modal (`components/ui/Modal.tsx`) — legacy portal version

```yaml
portal: createPortal to document.body, z-[120], backdrop "bg-slate-900/55"
panel: "bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-visible animate-in fade-in zoom-in-95 duration-150" (default max-w-lg)
header: "px-6 py-4 border-b border-slate-100 flex items-center justify-between rounded-t-2xl"
close: "p-2 hover:bg-slate-100 rounded-xl text-slate-400" X 18px
body: "p-6 max-h-[70vh] overflow-y-auto"
footer: "px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3"
scroll-lock while open
```

### 6.8 StatCard (`components/ui/StatCard.tsx`) — KPI card

```yaml
card: "bg-white border border-slate-200/50 transition-all duration-300 group cursor-default p-6 rounded-[1rem]
       shadow-[0_2px_4px_rgba(0,0,0,0.02),0_1px_0_rgba(0,0,0,0.02)]
       hover:shadow-xl hover:shadow-blue-500/5 hover:border-blue-200/50"
icon tile: "w-9 h-9 bg-slate-50 border border-slate-100 rounded-lg text-slate-400
            group-hover:text-blue-600 group-hover:bg-blue-50 group-hover:border-blue-100"
trend pill: "flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full"
  up: emerald-600 on emerald-50 (TrendingUp 10px strokeWidth 3)
  down: rose-600 on rose-50 (TrendingDown)
  neutral: slate-500 on slate-100 (Minus)
value: "text-2xl font-bold text-slate-900 tracking-tight tabular-nums"
meta: label text-xs slate-500 semibold; change text-xs slate-400
```

### 6.9 Card (`components/ui/Card.tsx`) — dashboard widget card

```yaml
shell: "h-full bg-white border border-slate-200/50 flex flex-col min-h-[140px] rounded-[1.25rem]
        shadow-[0_1px_3px_rgba(0,0,0,0.05),0_10px_40px_-15px_rgba(0,0,0,0.02)]"
hover (when clickable): "hover:shadow-[0_20px_50px_-15px_rgba(0,0,0,0.08)] hover:border-blue-200/50 hover:-translate-y-1"
draggable: "cursor-move active:scale-[0.98] active:rotate-[0.5deg]"
header: "px-6 py-5 flex justify-between items-center border-b border-slate-50 min-h-[72px]"
  title text-base semibold slate-900; description text-[11px] slate-400
  actions (opacity-0 → 100 on group-hover/card): headerAction + resize(Maximize2, hover→blue-600) + grip(GripVertical)
content: "flex-1 p-6" (noPadding flag removes padding; maxHeight + scrollbar-hide scroll); child fades in (animate-in fade-in duration-500)
```

### 6.10 Pagination (`components/ui/Pagination.tsx`) — with page-size select

```yaml
left: "Rows per page" + Select (w-20, clearable/searchable off) + "start–end of total" text-xs slate-500
right: ghost xs Buttons "Previous"/"Next" with Chevron icons, disabled at bounds + "Page {x} of {y}" text-xs slate-600
options: [10, 25, 50, 100]
```

### 6.11 DeleteButton (`components/ui/DeleteButton.tsx`)

```yaml
base: "flex justify-center items-center text-slate-900 hover:text-rose-600 transition-colors p-1
       rounded-md hover:bg-rose-50/50 active:scale-95"  Trash2 (default 14px)
```

### 6.12 ThemeSwitcher (`components/ui/ThemeSwitcher.tsx`)

```yaml
trigger: Palette icon 20px strokeWidth 2, slate-500 → slate-900
panel: "absolute right-0 mt-4 w-56 bg-white border border-slate-200 shadow-xl z-50 p-2 rounded-2xl animate-in fade-in zoom-in-95 duration-200"
  header "Theme Palette"; swatch row: color dot + name; active row "bg-slate-900 text-white" + Check
backdrop: fixed inset-0 z-40 closes on click
```

### 6.13 Breadcrumb (`components/ui/Breadcrumb.tsx`) — legacy

```yaml
nav: "flex items-center space-x-2 text-sm text-slate-600 mb-4"
Home icon 16px + "Home" link; ChevronRight 16px slate-400 separators
current (last): "text-slate-900 font-medium"; links hover:text-slate-900
```

### 6.14 Button (`components/ui/Button.tsx`) — legacy shadcn-flavored

```yaml
variants: default=primary, primary (blue-600/700 + shadow-blue-500/20), destructive=danger (rose-600/700),
          outline (white/slate-700/border), secondary (slate-900/800), ghost, link
sizes: default "h-10 px-5 text-sm rounded-lg font-bold", xxs "h-7 px-2 text-[9px] rounded-md uppercase tracking-widest",
       xs "h-8 px-3 text-[10px] rounded-lg uppercase tracking-widest", sm "h-9 px-4 text-xs rounded-lg",
       md, lg "h-12 px-8 text-base rounded-xl", icon "h-10 w-10"
base: "inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-all duration-200
       disabled:opacity-50 disabled:pointer-events-none focus-visible:ring-2 focus-visible:ring-offset-2"
loading: spins "h-4 w-4 border-b-2 border-current"
```

### 6.15 Input (`components/ui/Input.tsx`) — legacy

```yaml
variants: slate="bg-slate-50 border-slate-200 focus:bg-white"  white="bg-white border-slate-200 shadow-sm focus:shadow-md"  ghost="transparent hover:bg-slate-50 focus:bg-white focus:border-slate-200"
sizes: sm="h-9 px-3 text-xs" md="h-10 px-4 text-sm font-medium" lg="h-12 px-5 text-base font-medium"
shape: "w-full border rounded-lg outline-none transition-all placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500/10 focus:border-blue-600"
label: "text-xs font-semibold text-slate-700 ml-0.5"; error: border-rose-300 bg-rose-50 + text
icon: left-3.5 slate-400 → blue-600 on focus-within; supports rightElement + onClear (X)
```

### 6.16 Select (`components/ui/Select.tsx`) — advanced dropdown (portal)

```yaml
features: searchable, clearable, fuzzy search, keyboard nav (↑↓ Enter Esc), creatable/combobox mode,
          exact-dial-code matching (RegExp), dropdownWidth (trigger|auto|px), smart open-up/down, portal z-[99999]
trigger: "bg-white border-slate-300 hover:border-slate-400 hover:bg-slate-50/30 font-medium shadow-sm
          focus:ring-2 focus:ring-blue-500 rounded-lg" sizes sm/md/lg
dropdown: "fixed z-[99999] bg-white border border-slate-200 rounded-xl shadow-2xl animate-in fade-in zoom-in-95 duration-150" maxHeight 300
search box: "bg-slate-50/50 border-b border-slate-100" + magnifier; input "pl-8 pr-3 py-1.5 text-xs"
option: selected "bg-blue-50 text-blue-700 font-bold" + glow dot "w-1.5 h-1.5 bg-blue-600 shadow-[0_0_8px_rgba(37,99,235,0.4)]"
        hover "hover:bg-slate-50 text-slate-600", keyboard-active "bg-slate-100", disabled opacity-40
empty: "No results" — text-[10px] slate-300 uppercase tracking-[0.2em] font-bold py-8
label: "text-xs font-semibold text-slate-700" + red * when required; error text-[11px] rose-500
ARIA: role=combobox/listbox/listbox options, aria-expanded, aria-activedescendant, aria-selected
```

---

## 7. Layouts

### 7.1 DashboardLayout (`components/layout/DashboardLayout.tsx`)

```yaml
shell: "min-h-screen flex bg-slate-50 font-sans selection:bg-blue-600 selection:text-white"
main:  "flex-1 flex flex-col min-h-screen min-w-0 bg-[#f8fafc]"
content: "ml-60 flex-1 min-w-0 overflow-x-auto px-16 pt-[1.5625rem] pb-[0.625rem] transition-all duration-500 relative"
dotgrid: radial-gradient slate-200 dots, 24px, opacity-30, -z-10
toasts: rendered globally here next to <Outlet/>
```

### 7.2 PageLayout (`components/layout/PageLayout.tsx`)

```yaml
wrapper: "w-full transition-all duration-300 animate-in fade-in flex flex-col gap-2"
title: "text-4xl font-bold text-slate-900 tracking-tight leading-none whitespace-nowrap"
description: "text-sm text-slate-500 font-medium"
actions: "flex items-center gap-2 shrink-0" (right-aligned on lg)
optional breadcrumbs on top; children below
```

---

## 8. Pages & Routing

| Route | Page | Key content |
|-------|------|-------------|
| `/login` | LoginPage | Split screen: branded gradient panel (`from-blue-600/10 via-blue-50 to-purple-50`, AI-gem logo block `from-blue-500 to-purple-600`, module chips) + white form panel. Admin/admin demo. Show/hide password, inline error alert, loading spinner "Checking authentication..." |
| `/` | DashboardPage | 4 StatCards + draggable/resizable widget grid (Revenue AreaChart, Goal BarChart, Recent Activity DataTable, Global Reach progress bars). Customize/Save Layout, Simulate/Flush Demo, Export CSV. Layout persisted to localStorage `dashboard-layout` |
| `/orders` | OrdersPage | order registry |
| `/quotations` | QuotationsPage | quotations |
| `/customers` | CustomersPage | customer base |
| `/inventory` | InventoryPage | inventory logs |
| `/financials` | FinancialsPage | financial ledger |
| `/reports` | ReportsPage | analytics reports |
| `/invoices` | InvoicesPage | invoice manager |
| `/settings` | SettingsPage | incl. ThemeSwitcher, Audit Logs |
| `/support` | SupportPage | Help Center, accordion FAQ, quick-launch cards |

Wildcard redirects to `/`.

---

## 9. Charts (`components/ui/ChartsSection.tsx`) — Recharts

### RevenueChart (Area)
```yaml
gradient: #3b82f6 @ 5% opacity 0.2 → @ 95% opacity 0
grid: "strokeDasharray 4 4, vertical false, stroke #f1f5f9"
axis ticks: { fill: '#94a3b8', fontSize: 10, fontWeight: 600 }
area: monotone, stroke #3b82f6 width 3, animationDuration 1500
height: h-[300px] pt-6
```

### SalesTargetChart (Bar)
```yaml
target gradient: #e2e8f0→#cbd5e1  (opacity .9→.4)
achieved gradient: #3b82f6→#2563eb (opacity .95→.5)
bars: radius [4,4,0,0], barSize 18, barGap 8, animationDuration 2000
legend: top-right, circle icon 6px, fontSize 10, #64748b
cursor hover fill: #f8fafc
```

### CustomTooltip
```yaml
panel: "bg-white border border-slate-200 p-3 rounded-xl shadow-xl"
macron label: "text-xs font-semibold text-slate-500 border-b border-slate-100 pb-2"
rows: color dot (w-2 h-2 rounded-full, entry.color) + name text-[11px] slate-500 semibold + value text-xs slate-900 bold (toLocaleString; 2-decimals when <1000 non-integer)
```

---

## 10. Notifications & Toast System

- **Global context** (`App.tsx` `useApp()`): `showToast`, `notifications`, `unreadCount`, `markAsRead`, `markAllAsRead`, `toast`, `onCloseToast`, `simulateDemo`, `clearDemo`, `orders`, `customers`, `globalSearch`.
- **Toast rendering**: single toast, bottom-right, auto-dismiss 3s, manual X close, enter animation `slide-in-from-right-10 fade-in duration-300`.
- **Notification types** (colored icons): order=blue, system=amber, inventory=rose, customer/follow_up/new_inquiry=emerald/blue.
- **Demo flow**: `simulateDemo` injects DEMO_ORDERS/DEMO_CUSTOMERS/DEMO_NOTIFICATIONS and toasts "System-wide demo data simulated"; `clearDemo` restores and toasts "Demo data flushed from system".

---

## 11. Global Styles (`index.html`)

```css
:root {
  --primary:#2563eb; --primary-hover:#1d4ed8; --primary-accent:#3b82f6;
  --primary-muted:rgba(37,99,235,0.08); --primary-foreground:#fff;
  --background:#f8fafc; --card:#fff; --border:#e2e8f0;
  --zinc-900:#0f172a; --zinc-500:#64748b;
  --ui-padding:2rem; --ui-gap:1.5rem; --ui-scale:1;
}
body { font-family:'Outfit','Inter',sans-serif; background:var(--background);
       color:var(--zinc-900); font-size:calc(1rem * var(--ui-scale,1)); transition:font-size .3s ease; }
```

**Custom scrollbars**:
- Global: 6px, track transparent, thumb `#cbd5e1` (hover `#94a3b8`), radius 10px
- `.scrollbar-hide`: hides scrollbar, keeps scroll (used on scrollable cards)
- `.customize-scrollbar`: 4px, thumb `#e2e8f0` hover `#cbd5e1` (tables, dropdowns, notifications)

**Custom animations** (also tailwindcss `/animate-in` used widely):
- `.animate-smooth-in` slideDownFade `0.25s cubic-bezier(0.16,1,0.3,1)`
- `.animate-pop-in` popIn `0.25s cubic-bezier(0.16,1,0.3,1)` (origin top)
- `.animate-spring-in` popIn `0.35s cubic-bezier(0.34,1.56,0.64,1)`
- `.expand-section` grid-template-rows 0fr→1fr `0.35s` accordion

**Selection**: `background rgba(37,99,235,0.1); color #2563eb` (in-app overridden to `bg-blue-600 text-white`).

---

## 12. Animation & Interaction Spec

| Element | Behavior |
|---------|----------|
| Buttons | `transition-all duration-200`, `active:scale-[0.98]`, loading = spinner swap |
| Cards | `duration-300`, hover `-translate-y-1` + soft shadow + blue hairline |
| Modals | `animate-in fade-in zoom-in-95 duration-150` (legacy 150 / UI 300) |
| Toasts | `slide-in-from-right-10 fade-in duration-300`, dismiss 3s |
| Tables rows | `transition-colors duration-100/200`, hover `bg-slate-50/40` |
| Sidebar nav | `duration-200` color/bg transition, active `bg-blue-50` |
| SegmentToggle | indicator `duration-300 cubic-bezier(0.4,0,0.2,1)`, options `active:scale-[0.98]` |
| Progress bars | fill `transition-all duration-1000` |
| Page mount | `animate-in fade-in` (`PageLayout` duration-300, cards duration-500) |
| Dropdowns | `fade-in zoom-in-95` or `slide-in-from-top` |
| Spinners | `animate-spin`; skeleton `animate-pulse` |
| Notification dot | `shadow-[0_0_8px_rgba(37,99,235,0.4)]` glow |

---

## 13. Iconography (Lucide)

| Context | Size | Stroke |
|---------|------|--------|
| Sidebar icon | 18px | 1.8 idle / 2.2 active |
| Toast status | 18px | 2 |
| Form field icons (Input) | 16px | 2–2.5 |
| Search magnifier | 14–16px | 2.5 |
| Table sort | 10px | 2/2.5 |
| Micro helpers (dots, arrows) | 10–14px | 2.5–3 |
| Navbar settings gear | 20px | 1.5 |
| Delete / row actions | 14px | default |

---

## 14. Dependencies

| Package | Version | Role |
|---------|---------|------|
| `react` / `react-dom` | ^19.0.0 | UI |
| `react-router-dom` | ^6.28.0 | routing |
| `lucide-react` | ^0.474.0 | icons |
| `recharts` | ^2.15.1 | charts |
| `clsx` | ^2.1.1 | class merge |
| `tailwind-merge` | ^3.0.1 | class merge |
| `@radix-ui/react-tooltip` | ^1.2.10 | tooltip primitives |
| `framer-motion` | ^12.42.0 | (available for future animation) |
| `tailwindcss` | ^3.4.17 | styling (CDN in index.html) |
| `typescript` | ^5.7.3 | types |
| `vite` | ^6.0.11 | build |

---

## 15. File Map

### Primitives — `UI/`
| File | Exports |
|------|---------|
| `Button.tsx` | `Button` |
| `Input.tsx` | `Input` |
| `Label.tsx` | `Label` |
| `Badge.tsx` | `Badge` (7 variants) |
| `Card.tsx` | `Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter` |
| `Switch.tsx` | `Switch` |
| `Table.tsx` | `Table, TableHeader, TableBody, TableFooter, TableRow, TableHead, TableCell` |
| `Modal.tsx` | `Modal` (5 sizes) |
| `Select.tsx` | `Select` (native) |
| `Pagination.tsx` | `Pagination` |
| `Separator.tsx` | `Separator` |
| `DatePicker.tsx` | `DatePicker` |
| `Tooltip.tsx` | `Tooltip, TooltipProvider` (Radix) |
| `Breadcrumb.tsx` | `Breadcrumb` |
| `SegmentToggle.tsx` | `SegmentToggle` |
| `index.ts` | re-exports all |

### App components — `components/ui/`
| File | Exports |
|------|---------|
| `Sidebar.tsx` | `Sidebar` |
| `Navbar.tsx` | `Navbar` |
| `SearchInput.tsx` | `SearchInput` |
| `DataTable.tsx` | `DataTable, Column` |
| `Toast.tsx` | `Toast, ToastType` |
| `Modal.tsx` | `Modal` (portal) |
| `Badge.tsx` | `Badge` (5 variants) |
| `StatCard.tsx` | `StatCard` |
| `Card.tsx` | `Card` (widget/draggable) |
| `Pagination.tsx` | `Pagination` (page-size) |
| `DeleteButton.tsx` | `DeleteButton` |
| `ThemeSwitcher.tsx` | `ThemeSwitcher` |
| `Breadcrumb.tsx` | `Breadcrumb` |
| `ChartsSection.tsx` | `RevenueChart, SalesTargetChart, CustomTooltip` |
| `TransactionTable.tsx` | `TransactionTable` |
| `Button.tsx` | `Button` (legacy) |
| `Input.tsx` | `Input` (legacy) |
| `Select.tsx` | `Select` (advanced dropdown) |

### Layout / misc
| File | Exports |
|------|---------|
| `components/layout/DashboardLayout.tsx` | shell |
| `components/layout/PageLayout.tsx` | page scaffold |
| `components/VersionsModal.tsx` | changelog modal |
| `context/ThemeContext.tsx` | `ThemeProvider, useTheme, THEMES` |
| `constants.tsx` | nav links, stats, transactions, chart data |
| `demoData.ts` | demo notifications/orders/customers |
| `types.ts` | interfaces |
| `lib/utils.ts` | `cn` |
| `App.tsx` | app context + routes |

---

> *Generated from the Aether ERP codebase — v1.1.1, June 2026.*