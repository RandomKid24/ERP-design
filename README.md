# Aether ERP — Enterprise Design Blueprint

> A high-performance, pixel-perfect ERP dashboard — built with React 19, Tailwind CSS 4, and [befui](https://github.com/RandomKid24/befui) components.

> **Note:** the UI has been migrated to befui (Tailwind 4, token-based theming, `components/ui/*`). The architecture diagrams and file tree below describe the original design blueprint; component names such as `ChartsSection`, `StatCard` and `Toast` now map to befui equivalents (`charts`, `stat-card`, `toast`).

```mermaid
%%{init: {'theme': 'neutral', 'themeVariables': { 'primaryColor': '#2563eb', 'lineColor': '#e2e8f0'}}}%%
graph TD
    subgraph " " 
        direction LR
        A["User"] --> B["DashboardLayout"]
        B --> C["Sidebar w/ Changelog"]
        B --> D["Navbar w/ Search + Notifications"]
        B --> E["PageLayout w/ Breadcrumbs"]
        E --> F["DashboardPage"]
        E --> G["OrdersPage"]
        E --> H["CustomersPage"]
        E --> I["InventoryPage"]
        E --> J["FinancialsPage"]
        E --> K["ReportsPage"]
        E --> L["SettingsPage"]
        E --> M["SupportPage"]
        E --> N["LoginPage"]
    end

    style A fill:#2563eb,color:#fff
    style B fill:#1e293b,color:#fff
```

---

## Design System Architecture

```mermaid
%%{init: {'theme': 'neutral', 'themeVariables': { 'primaryColor': '#2563eb'}}}%%
graph BT
    subgraph Pages["Pages / Views"]
        DP["DashboardPage"]
        OP["OrdersPage"]
        CP["CustomersPage"]
        IP["InventoryPage"]
        FP["FinancialsPage"]
        RP["ReportsPage"]
        SP["SettingsPage"]
        SUP["SupportPage"]
        LP["LoginPage"]
    end

    subgraph Layout["Layout Components"]
        DL["DashboardLayout"]
        PL["PageLayout"]
    end

    subgraph Compound["Compound Components"]
        SB["Sidebar"]
        NB["Navbar"]
        SI["SearchInput"]
        DT["DataTable"]
        T["Toast"]
        CS["ChartsSection"]
        SC["StatCard"]
        DB["DeleteButton"]
        MS["VersionsModal"]
    end

    subgraph Primitives["UI Primitives (16)"]
        BT["Button"]
        IN["Input"]
        CD["Card"]
        BD["Badge"]
        MD["Modal"]
        TB["Table"]
        SL["Select"]
        SW["Switch"]
        DP2["DatePicker"]
        TT["Tooltip"]
        BC["Breadcrumb"]
        ST["SegmentToggle"]
        PG["Pagination"]
        SP2["Separator"]
        LB["Label"]
    end

    Layout --> Primitives
    Compound --> Primitives
    Pages --> Layout
    Pages --> Compound
    Pages --> Primitives

    style Pages fill:#eff6ff,stroke:#2563eb
    style Layout fill:#f0fdf4,stroke:#16a34a
    style Compound fill:#fef3c7,stroke:#d97706
    style Primitives fill:#fce7f3,stroke:#db2777
```

---

## Visual Identity

| Token | Value | Usage |
|-------|-------|-------|
| **Primary** | `#2563eb` (Blue 600) | Buttons, switches, active states |
| **Primary Accent** | `#3b82f6` (Blue 500) | Focus rings, highlights |
| **Primary Hover** | `#1d4ed8` (Blue 700) | Button hover |
| **Primary Muted** | `rgba(37,99,235,0.08)` | Soft backgrounds |
| **Surface** | `#ffffff` | Cards, modals |
| **Body BG** | `#f8fafc` (Slate 50) | Page backgrounds |
| **Text Primary** | `#0f172a` (Slate 900) | Headings |
| **Text Body** | `#475569` (Slate 600) | Content |
| **Text Muted** | `#94a3b8` (Slate 400) | Labels |

```mermaid
%%{init: {'theme': 'neutral'}}%%
pie title Color Distribution in Design System
    "Blue (Primary)" : 25
    "Slate (Neutral)" : 45
    "Emerald (Success)" : 10
    "Amber (Warning)" : 8
    "Rose (Error)" : 7
    "White (Surface)" : 5
```

### Typography Scale

```mermaid
%%{init: {'theme': 'neutral'}}%%
block-beta
    columns 3
        block:Header["Headers"]
            H1["28px — Page Title"]
            H2["22px — Section Header"]
            H3["16px — Card Title"]
            H4["13px — Component Title"]
        end
        block:Body["Body"]
            B1["14px — Table Data"]
            B2["13px — Main Content"]
            B3["12px — Description"]
            B4["11px — Sub-label"]
        end
        block:System["System"]
            S1["10px — Uppercase Label"]
            S2["9px — Badge Text"]
            S3["10px — Meta Data"]
            S4["11px — Breadcrumb"]
        end
    Header --> Body --> System
```

---

## Component Specifications

### Button Variants

```mermaid
%%{init: {'theme': 'neutral'}}%%
graph LR
    subgraph Variants
        P["primary<br/>bg-blue-600 → hover:bg-blue-700"]
        S["secondary<br/>bg-slate-900 → hover:bg-slate-800"]
        O["outline<br/>border-slate-200 → hover:bg-slate-50"]
        G["ghost<br/>hover:bg-slate-100"]
        D["danger<br/>bg-rose-600 → hover:bg-rose-700"]
        L["link<br/>text-blue-600 → hover:underline"]
    end
    subgraph Sizes
        XS["xs: h-7 px-2.5"]
        SM["sm: h-8 px-3.5"]
        MD["md: h-10 px-5"]
        LG["lg: h-12 px-7"]
        IC["icon: w-8 h-8 p-0"]
    end
    subgraph States
        IDLE["idle"]
        HV["hover: bg shift + scale"]
        ACT["active: scale-[0.98]"]
        DIS["disabled: opacity-50"]
        LOD["loading: Loader2 spin"]
    end
```

### Card Anatomy

```
┌─────────────────────────────────────┐
│  px-6 py-5                           │
│  ┌─────────────────────────────────┐ │
│  │ title (text-base font-semibold)  │ │
│  │ description (text-sm text-500)   │ │ headerAction
│  └─────────────────────────────────┘ │
│  ┌─────────────────────────────────┐ │
│  │ p-6 (content area)              │ │
│  │                                 │ │
│  │                                 │ │
│  └─────────────────────────────────┘ │
│  rounded-2xl border border-slate-200 │
│  shadow-sm bg-white                  │
└─────────────────────────────────────┘
```

---

## Route Map

| Path | Page | Layout |
|------|------|--------|
| `/login` | LoginPage | None (standalone) |
| `/` | DashboardPage | DashboardLayout |
| `/orders` | OrdersPage | DashboardLayout |
| `/customers` | CustomersPage | DashboardLayout |
| `/inventory` | InventoryPage | DashboardLayout |
| `/financials` | FinancialsPage | DashboardLayout |
| `/reports` | ReportsPage | DashboardLayout |
| `/settings` | SettingsPage | DashboardLayout |
| `/support` | SupportPage | DashboardLayout |

---

## Data Flow

```mermaid
sequenceDiagram
    actor User
    participant UI as UI Component
    participant App as AppContext
    participant State as React State
    participant Demo as demoData.ts

    User->>UI: Interact
    UI->>App: showToast / setGlobalSearch
    App->>State: Update context
    State-->>UI: Re-render
    User->>UI: Click "Simulate Demo"
    UI->>Demo: import demoData
    Demo-->>UI: DEMO_ORDERS, DEMO_CUSTOMERS
    UI->>App: setOrders / setCustomers
    App->>State: Bulk update
    State-->>UI: Full re-render
```

---

## Performance

```mermaid
xychart-beta
    title "Build Output Size"
    x-axis ["JS Bundle", "CSS (CDN)", "Assets", "Total"]
    y-axis "Size (kB)" 0 --> 1000
    bar [789, 5, 6, 800]
```

- **JS Bundle**: ~789 kB (gzip: ~224 kB)
- **CDN Tailwind**: loaded externally, zero bundle cost
- **Build time**: ~3.5s
- **Framework**: React 19 + Vite 6

---

## Quickstart

```bash
npm install        # Install dependencies
npm run dev        # Start dev server
npm run build      # Production build → /dist
```

---

## File Structure

```
ERP-design/
├── UI/                        # 16 primitive design components
│   ├── Button.tsx, Card.tsx, Input.tsx, Badge.tsx
│   ├── Modal.tsx, Table.tsx, Select.tsx, Switch.tsx
│   ├── DatePicker.tsx, Tooltip.tsx, Breadcrumb.tsx
│   ├── SegmentToggle.tsx, Pagination.tsx
│   ├── Separator.tsx, Label.tsx, index.ts
├── components/
│   ├── ui/                    # 18 compound components
│   │   ├── Sidebar.tsx, Navbar.tsx, SearchInput.tsx
│   │   ├── DataTable.tsx, Toast.tsx, Modal.tsx
│   │   ├── ChartsSection.tsx, StatCard.tsx
│   │   ├── DeleteButton.tsx, ThemeSwitcher.tsx
│   │   └── TransactionTable.tsx
│   ├── layout/
│   │   ├── DashboardLayout.tsx
│   │   └── PageLayout.tsx
│   └── VersionsModal.tsx
├── pages/
│   ├── DashboardPage.tsx
│   ├── OrdersPage.tsx, CustomersPage.tsx
│   ├── InventoryPage.tsx, FinancialsPage.tsx
│   ├── ReportsPage.tsx, InvoicesPage.tsx
│   ├── SettingsPage.tsx, SupportPage.tsx
│   └── LoginPage.tsx
├── lib/utils.ts               # cn() class merger
├── types.ts                   # Global TypeScript types
├── constants.tsx              # Sidebar link config
├── demoData.ts                # Demo data store
└── App.tsx                    # Router + Context
```

---

## Licensing

Internal design prototype — BeForth Technologies.
