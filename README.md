# Resolyx — Private AI Helpdesk

> **Brand Tagline:** Private AI. Smarter Support.  
> **Product Subtitle:** AI Helpdesk  

Resolyx is an enterprise helpdesk engineered for IT support and customer support teams. It brings ticket management, company knowledge base indexing, and private AI assistance into a unified workspace—allowing organizations to resolve repetitive requests quickly using AI running entirely on infrastructure they control.

---

## Table of Contents

- [Demo Logins & Roles](#demo-logins--roles)
- [Architectural Overview](#architectural-overview)
- [Technology Stack](#technology-stack)
- [Folder Structure](#folder-structure)
- [Prerequisites](#prerequisites)
- [Installation & Setup](#installation--setup)
- [Development Server](#development-server)
- [Building for Production](#building-for-production)
- [Testing & Quality Verification](#testing--quality-verification)
- [Design System & Theme Architecture](#design-system--theme-architecture)
- [Logo & Brand Assets](#logo--brand-assets)
- [How to Add a New Page](#how-to-add-a-new-page)
- [How to Add a Reusable Component](#how-to-add-a-reusable-component)
- [Current Limitations & Boundary Disclaimers](#current-limitations--boundary-disclaimers)
- [Future Backend Integration Roadmap](#future-backend-integration-roadmap)

---

## Demo Logins & Roles

See [`LOGINS.md`](./LOGINS.md) for full details, workflows, and screen breakdowns.

| Role | Demo Email | Password | Landing Page | Permissions |
| :--- | :--- | :--- | :--- | :--- |
| **Admin** | `admin@resolyx.internal` | `admin123` *(or any 8+ chars)* | [`/admin`](http://localhost:3000/admin) | Full system control: Dashboard, Users & Roles, Helpdesk config, AI settings, Reports, Portal settings |
| **Agent** | `agent@resolyx.internal` | `agent123` *(or any 8+ chars)* | [`/agent`](http://localhost:3000/agent) | **Restricted access**: Ticket queue & Resolution Studio (no settings or role management) |
| **Manager** | `manager@resolyx.internal` | `manager123` *(or any 8+ chars)* | [`/admin`](http://localhost:3000/admin) | Supervision: Helpdesk queues, agent workload, SLA reports, escalation routing |

> **1-Click Login:** Visit [`/login`](http://localhost:3000/login) and click the **Admin**, **Manager**, or **Agent** chip to populate and sign in with a single click.

---

## Architectural Overview

Resolyx is organized around **feature-driven modularity**, clear presentation/domain separation, and centralized design tokens.

Key architectural tenets:
1. **Zero External Data Leakage:** Frontend interfaces are structured for private inference endpoints (e.g. self-hosted LLM runtimes such as vLLM or Ollama), with no telemetry transmitted to third-party public AI APIs.
2. **Human-in-the-Loop Oversight:** Automated suggestions, draft replies, and triage actions always require explicit agent authorization before dispatching to requesters.
3. **No Fake Backends:** Incomplete or unauthenticated modules route to transparent architectural placeholders (`/placeholder`) rather than faking network success.

---

## Technology Stack

- **Framework:** React 18 with TypeScript in strict mode
- **Bundler & Tooling:** Vite 5
- **Routing:** React Router v6 (Data Router with `createBrowserRouter`)
- **Styling:** Tailwind CSS v3 integrated with CSS Variables design tokens
- **Icons:** Lucide React
- **Code Quality:** ESLint 9 (Flat Config), Prettier
- **Testing:** Vitest, React Testing Library, and `@testing-library/jest-dom`

---

## Folder Structure

```text
resolva/
├── public/
│   ├── brand/
│   │   ├── resolva-logo.png          # Optional custom raster logo export
│   │   └── README.md                 # Brand asset guidelines & specs
│   ├── favicon.svg                   # Vector brand symbol with checkmark accent
│   ├── robots.txt                    # Search crawler rules
│   └── site.webmanifest              # PWA / web manifest
│
├── src/
│   ├── app/
│   │   ├── App.tsx                   # App root component with providers
│   │   ├── router.tsx                # Central routing configuration
│   │   ├── providers/
│   │   │   ├── ThemeContext.ts       # Context and useTheme hook
│   │   │   ├── ThemeProvider.tsx     # Theme state, DOM sync, and storage persistence
│   │   │   └── index.tsx             # Composite AppProviders wrapper
│   │   └── config/
│   │       ├── app.config.ts         # App metadata, defaults, and brand paths
│   │       └── navigation.config.ts  # Header & footer navigation definitions
│   │
│   ├── components/
│   │   ├── brand/
│   │   │   ├── BrandMark.tsx         # Precision vector symbol with orange checkmark
│   │   │   └── ResolvaLogo.tsx       # Reusable logo with adaptive themes & fallback
│   │   ├── feedback/
│   │   │   ├── ErrorState.tsx        # Standardized error fallback
│   │   │   └── LoadingState.tsx      # Accessible loading spinner
│   │   ├── layout/
│   │   │   ├── MarketingLayout/      # Layout wrapper with header and footer
│   │   │   ├── SiteFooter/           # Responsive brand footer
│   │   │   └── SiteHeader/           # Responsive header with theme toggle & mobile drawer
│   │   └── ui/
│   │       ├── Badge/                # Semantic status badges
│   │       ├── Button/               # Primary, secondary, violet, ghost buttons
│   │       ├── Container/            # Responsive max-width wrappers
│   │       ├── SectionHeading/       # Standardized section headings
│   │       └── ThemeToggle/          # Accessible light/dark theme switch
│   │
│   ├── features/
│   │   ├── marketing/                # Marketing landing page feature module
│   │   │   ├── components/
│   │   │   │   ├── FAQSection.tsx        # Accessible accordion FAQ
│   │   │   │   ├── FeaturesSection.tsx   # 6-card product features grid
│   │   │   │   ├── FinalCTASection.tsx   # Closing CTA banner
│   │   │   │   ├── HelpdeskPreview.tsx   # Interactive ticket & AI suggestion workspace
│   │   │   │   ├── HeroSection.tsx       # Hero with locked copy & benefit pills
│   │   │   │   ├── HowItWorksSection.tsx # 3-step Capture-Understand-Resolve workflow
│   │   │   │   ├── PrivacySection.tsx    # Private-AI dark surface differentiator
│   │   │   │   ├── TrustSection.tsx      # Value proposition cards
│   │   │   │   └── UseCasesSection.tsx   # IT Helpdesk vs Customer Helpdesk panels
│   │   │   ├── data/
│   │   │   │   ├── faqs.ts               # FAQ questions and verified answers
│   │   │   │   ├── features.ts           # Feature and value proposition data
│   │   │   │   └── useCases.ts           # IT and customer scenario examples
│   │   │   ├── pages/
│   │   │   │   ├── LandingPage.tsx       # Assembly of marketing sections
│   │   │   │   └── PlaceholderPage.tsx   # Unimplemented feature boundary page
│   │   │   └── index.ts
│   │   ├── tickets/README.md         # Architecture blueprint for ticket queues
│   │   ├── knowledge-base/README.md  # Architecture blueprint for document retrieval
│   │   └── ai-assistant/README.md    # Architecture blueprint for private inference
│   │
│   ├── hooks/
│   │   ├── useMediaQuery.ts          # Responsive breakpoint observer
│   │   └── useTheme.ts               # Theme accessor hook
│   │
│   ├── lib/
│   │   ├── constants.ts              # Brand constants, storage keys, routes
│   │   └── utils.ts                  # Tailwind class merging (`cn`) helper
│   │
│   ├── styles/
│   │   ├── globals.css               # Base styles, focus rings, utility classes
│   │   ├── themes.css                # Light & dark theme CSS variable definitions
│   │   └── tokens.css                # Base color constants, typography, and radii
│   │
│   ├── test/
│   │   ├── setup.ts                  # Vitest DOM environment setup
│   │   ├── BrandLogo.test.tsx        # BrandMark & ResolvaLogo unit tests
│   │   ├── FAQSection.test.tsx       # Accordion accessibility & interaction tests
│   │   ├── HelpdeskPreview.test.tsx  # Queue switching & AI draft approval tests
│   │   ├── LandingPage.test.tsx      # Landing page integration tests
│   │   └── ThemeToggle.test.tsx      # Theme persistence & toggle tests
│   │
│   ├── types/
│   │   ├── common.ts                 # Theme, ticket, and common domain types
│   │   └── navigation.ts             # Navigation schema types
│   │
│   ├── main.tsx                      # Vite React entry point
│   └── vite-env.d.ts                 # Environment variable typings
│
├── .env.example
├── .gitignore
├── .prettierrc
├── eslint.config.js
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.js
├── tsconfig.json
├── tsconfig.node.json
├── vite.config.ts
└── README.md
```

---

## Prerequisites

- **Node.js:** v18.0.0 or later (tested on Node v24)
- **Package Manager:** npm v9 or later (or yarn / pnpm)

---

## Installation & Setup

1. Clone or open the project directory:
   ```bash
   cd Resolva
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. (Optional) Configure environment variables:
   ```bash
   cp .env.example .env.local
   ```

---

## Development Server

Start the local Vite development server:
```bash
npm run dev
```

The application will be accessible at: `http://localhost:3000/`

---

## Building for Production

Compile TypeScript and build the optimized production assets:
```bash
npm run build
```

Preview the production build locally:
```bash
npm run preview
```

---

## Testing & Quality Verification

Run unit and component tests with Vitest:
```bash
npm run test
```

Run tests in watch mode:
```bash
npm run test:watch
```

Run the ESLint quality check:
```bash
npm run lint
```

Format code with Prettier:
```bash
npm run format
```

Check code formatting:
```bash
npm run format:check
```

---

## Design System & Theme Architecture

The design system is locked to a modern, restrained SaaS aesthetic supporting both **Light** and **Dark** themes.

### Brand Palette

| Token | Hex Code | Purpose |
| :--- | :--- | :--- |
| **Electric Indigo** | `#6366F1` | Primary brand action, active states, focus rings |
| **Vivid Violet** | `#8B5CF6` | AI-related highlights, private AI badges |
| **Midnight Navy** | `#0B1020` | Dark theme base background |
| **Deep Slate** | `#151C2E` | Dark theme surface cards & navigation |
| **Soft Cloud** | `#F8FAFC` | Light theme base background |
| **Pure White** | `#FFFFFF` | Light theme card & surface container |
| **Slate Black** | `#172033` | Primary text in light mode |
| **Muted Slate** | `#64748B` | Secondary text, subtitles, icons |
| **Emerald** | `#10B981` | Success states, approved resolutions |
| **Amber** | `#F59E0B` | Warning states, SLA notices |
| **Rose Red** | `#F43F5E` | Error states, urgent priorities |

### CSS Variables Strategy

Colors are declared centrally in `src/styles/tokens.css` and scoped by theme in `src/styles/themes.css`:
- `:root, [data-theme="light"]`: Light mode variables
- `[data-theme="dark"]`: Dark mode variables

Tailwind is configured (`tailwind.config.js`) to consume these variables via semantic utilities:
- `bg-background`: `var(--color-background)`
- `bg-surface`: `var(--color-surface)`
- `text-foreground`: `var(--color-text)`
- `border-border`: `var(--color-border)`

### Theme Persistence & Anti-Flash

- The user preference is stored in `localStorage` under `resolva-theme`.
- An inline synchronous script in `index.html` inspects `localStorage` and `prefers-color-scheme` before DOM rendering, preventing any flash of the wrong theme.

---

## Logo & Brand Assets

The approved Resolyx identity includes:
- **Symbol:** Abstract speech-bubble and gear-inspired symbol with an integrated checkmark.
- **Symbol Gradient:** Blue (`#0284C7`) to cyan (`#06B6D4`).
- **Accent:** Vivid orange checkmark (`#F97316` / `#FB923C`).
- **Wordmark:** Resolyx.
- **Subtitle:** "AI Helpdesk" in radiant cyan.

### Adding Your Own Logo Asset
1. Export your approved logo as a PNG or SVG.
2. Place it in `public/brand/resolyx.png`.
3. The `<ResolvaLogo />` component (`src/components/brand/ResolvaLogo.tsx`) automatically checks for `/brand/resolyx.png`. If not found, it seamlessly falls back to the pixel-perfect inline vector representation without breaking layout or displaying a missing image icon.

---

## How to Add a New Page

1. Create a page component in the appropriate feature directory (e.g. `src/features/tickets/pages/TicketsDashboardPage.tsx`):
   ```tsx
   import React from 'react';
   import { Container } from '@/components/ui/Container';

   export const TicketsDashboardPage: React.FC = () => {
     return (
       <Container size="xl" className="py-8">
         <h1 className="text-2xl font-bold">Ticket Queue</h1>
       </Container>
     );
   };
   ```

2. Register the route in `src/app/router.tsx`:
   ```tsx
   import { TicketsDashboardPage } from '@/features/tickets/pages/TicketsDashboardPage';

   export const router = createBrowserRouter([
     // ...
     {
       path: '/tickets',
       element: (
         <MarketingLayout>
           <TicketsDashboardPage />
         </MarketingLayout>
       ),
     },
   ]);
   ```

---

## How to Add a Reusable Component

1. Create a new component directory under `src/components/ui/` or `src/components/feedback/` (e.g., `src/components/ui/Input/Input.tsx`).
2. Implement using standard design tokens and Tailwind classes:
   ```tsx
   import React from 'react';
   import { cn } from '@/lib/utils';

   export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
     label?: string;
   }

   export const Input: React.FC<InputProps> = ({ label, className, ...props }) => {
     return (
       <div className="flex flex-col gap-1.5">
         {label && <label className="text-xs font-medium text-foreground">{label}</label>}
         <input
           className={cn(
             'rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground placeholder:text-foreground-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-indigo',
             className,
           )}
           {...props}
         />
       </div>
     );
   };
   ```
3. Export from an `index.ts` file in the component directory.

---

## Enterprise Authentication Experience (Frontend Only)

Resolva includes a comprehensive enterprise authentication interface implemented as a pure frontend prototype strictly adhering to the locked brand identity and design tokens.

### Authentication Routes

| Route | Screen | Description |
|---|---|---|
| `/login` | Standard Sign-In | Two-column desktop layout featuring the dark Resolva brand panel (with 3 product benefits) and an interactive sign-in panel with email/password validation, show/hide password toggle, and mock submission feedback. |
| `/super-admin/login` | Super Admin Sign-In | Dedicated security-conscious administrative sign-in with "ADMINISTRATION" label, administrative access shield notice, and navigation back to standard sign-in. **No role selection dropdown exists.** |
| `/forgot-password` | Password Recovery | Work email recovery request with format validation and a local confirmation state clearly stating that email delivery is not connected. |
| `/reset-password` | Password Reset | Password update interface with interactive password strength feedback (length, numbers, uppercase), confirm-password validation, and no persistent storage of credentials. |
| `/auth/verify` | Verification Result | Reusable status page supporting 4 states: `pending`, `success`, `failed`, and `unavailable`. Includes interactive tabs to preview all demonstration states. |
| `/auth/unauthorized` | Access Restricted | Informational restricted-access screen with Return to Sign In and Return to Home navigation. |

### Component Architecture (`src/features/auth/`)

```text
src/features/auth/
├── components/
│   ├── AuthLayout.tsx           # Responsive shell supporting 2-column and centered layouts in light/dark
│   ├── AuthBrandPanel.tsx       # Dark brand panel with Resolva logo, tagline, headline, and 3 benefits
│   ├── AuthFormCard.tsx         # Surface card container using design tokens
│   ├── AuthInput.tsx            # Accessible input with inline errors and focus rings
│   ├── PasswordInput.tsx        # Accessible show/hide password toggle
│   ├── AuthPageHeader.tsx       # Heading, description, and optional administration badge
│   ├── SecurityNotice.tsx       # Shield notice and planned enterprise capabilities
│   ├── AuthStatusCard.tsx       # Reusable status card for verification and unauthorized states
│   └── PasswordStrengthMeter.tsx # Visual strength meter and requirement checklist
├── pages/
│   ├── LoginPage.tsx            # /login
│   ├── SuperAdminLoginPage.tsx  # /super-admin/login
│   ├── ForgotPasswordPage.tsx   # /forgot-password
│   ├── ResetPasswordPage.tsx    # /reset-password
│   ├── VerificationPage.tsx     # /auth/verify
│   └── UnauthorizedPage.tsx     # /auth/unauthorized
├── schemas/
│   └── authValidation.ts        # Client-side validation logic
├── types/
│   └── auth.types.ts            # Form and authentication types
└── index.ts                     # Public feature exports
```

### Critical Security & Scope Notice

> [!WARNING]
> **FRONTEND ONLY — NOT SECURE FOR PRODUCTION USE**  
> All authentication and verification interfaces in this project are frontend prototypes.
> - **No real authentication or authorization is performed.**
> - **No backend server, API, session token, or JWT is issued.**
> - **No passwords or credentials are saved to `localStorage`, `sessionStorage`, or cookies.**
> - **No outbound emails or recovery links are dispatched.**
> - **The Super Admin sign-in page is an interface demonstration only and does not confer elevated privileges.**
> 
> Production deployment requires connecting these frontend forms to a secure, enterprise-grade identity provider (e.g., OIDC, SAML, Keycloak, or Okta) with server-side session management and MFA enforcement.

---

## Current Limitations & Boundary Disclaimers

- **Frontend Scope:** This repository establishes the complete frontend client, design system, marketing landing page, and authentication user interface.
- **Backend-Dependent Features:** Real authentication, database persistence, knowledge document indexing, and live AI inference endpoints require connection to your private backend service and self-hosted model runtime.
- **Prototype Behavior:** Forms and actions display transparent demonstration notices rather than faking network success.

---

## Future Backend Integration Roadmap

1. **Authentication Backend:** Implement JWT / OIDC integration supporting corporate SSO (Okta, Azure AD, Keycloak) and secure password reset tokens under `src/features/auth/`.
2. **WebSocket Ticket Sync:** Connect real-time ticket queue updates via SSE or WebSockets in `src/features/tickets/`.
3. **Private Model Server:** Configure HTTP / SSE streaming client in `src/features/ai-assistant/` targeting your private inference gateway (e.g., vLLM or Ollama).
4. **Vector Document Store:** Implement semantic search integration for knowledge retrieval under `src/features/knowledge-base/`.

