# Resolyx — Demo Logins & Role Access Guide

> **Single Authentication Portal:** [`/login`](http://localhost:3000/login)  
> All user roles (Admin, Manager, Agent, Customer) sign in through the single unified auth page.

---

## Quick Reference Table

| Role | Demo Email | Password | Landing Page | Access Scope |
| :--- | :--- | :--- | :--- | :--- |
| **Admin** | `admin@resolyx.internal` | `admin123` *(or any 8+ chars)* | [`/admin`](http://localhost:3000/admin) | Full system & platform administration |
| **Agent** | `agent@resolyx.internal` | `agent123` *(or any 8+ chars)* | [`/agent`](http://localhost:3000/agent) | **Restricted** ticket queue & resolution workstation |
| **Manager** | `manager@resolyx.internal` | `manager123` *(or any 8+ chars)* | [`/admin`](http://localhost:3000/admin) | Helpdesk supervisor, queues & SLA oversight |
| **Customer** | `customer@acme.corp` | `customer123` *(or any 8+ chars)* | [`/customer`](http://localhost:3000/customer) | Interactive AI Support Chat & Ticket Tracking |

> **1-Click Demo Login:** On the sign-in card at [`/login`](http://localhost:3000/login), click the **Admin**, **Manager**, **Agent**, or **Customer** chip to automatically populate credentials and sign in immediately.

---

## 1. Admin Role (`admin@resolyx.internal`)

- **Persona:** Alex Mercer — *Helpdesk Administrator*
- **Department:** IT & Administration
- **Default Route:** [`/admin`](http://localhost:3000/admin)

### Admin Modules & Navigation Structure

#### 🔍 Top Utility Actions
- **Global Search (`^ K` / `Ctrl+K`):** Instant command palette search across all tickets, customer accounts, KB runbooks, support teams, and settings.
- **Notifications Hub:** Real-time alert tray with unread notification pills, SLA warning alerts, and automated AI activity logs.

#### 📌 Core Helpdesk Modules
1. **Home (`/admin`):**
   - Executive command hub with personalized greeting and system status banner.
   - Live KPI counters: *Active Tickets Requiring Attention*, *SLA Breach Risks*, *AI Auto-Triage %, and *Online Support Teams*.
   - Quick Action triggers: *Create Ticket*, *Add Runbook*, *Assignment Rule*, and *New Customer*.
   - Priority attention queue preview with one-click jump to Resolution Studio.

2. **Dashboard (`/admin/dashboard`):**
   - High-level analytics: Total tickets, active team members, AI autonomous resolution rate, and SLA compliance metrics.
   - Historical trend distribution and resolution speed breakdown.

3. **Tickets (`/admin/tickets`):**
   - Unified helpdesk tickets queue with real-time search, team filtering, and status tabs (*All*, *Open*, *Investigating*, *Suggested*, *Resolved*).
   - **Edit Ticket Modal:** Edit ticket subject, status, priority (Low, Medium, High, Urgent), assigned team, assigned agent, and tags.
   - Quick jump button to open any ticket directly in Agent Resolution Studio.

4. **Knowledge Base (`/admin/kb`):**
   - Central runbook and standard operating procedure (SOP) repository.
   - Searchable articles with category badges and AI-indexed tags.
   - **Create & Edit Article Modals:** Full markdown editing with tags and AI indexing toggles.

5. **Customers (`/admin/customers`):**
   - Enterprise organization accounts directory (e.g. *Apex Systems*, *CloudScale Logistics*, *Nordic FinTech Group*).
   - Track plan tiers (*Enterprise*, *Pro*, *Starter*), user seat counts, billing emails, and account status.
   - **Edit Customer Modal:** Update company name, billing email, tier, seat licenses, and status.

6. **Contacts (`/admin/contacts`):**
   - Customer stakeholders and designated technical contacts directory.
   - View contact name, company affiliation, email, phone number, and open tickets.
   - **Edit Contact Modal:** Update full name, email, phone, company, role, and active status.

#### 📂 Public Views (Collapsible Section)
- **⭐ My Feedback (`/admin/tickets?view=feedback`):** Filter tickets with recorded CSAT feedback and customer satisfaction ratings.
- **⌛ Pending Tickets (`/admin/tickets?view=pending`):** Real-time queue of all open, investigating, and suggested tickets awaiting final resolution.
- **👤✓ Recently Assigned Tickets (`/admin/tickets?view=assigned`):** View tickets recently routed to agents and support teams.
- **🕒 SLA Alerts (`/admin/tickets?view=sla-alerts`):** High-priority queue highlighting tickets nearing or at risk of SLA deadline breach.

#### ⚙️ Administration & Configuration (Collapsible Section)
- **Teams (`/admin/teams`):** Create and configure support teams, assign team leads, set default routing algorithms (Round-Robin, Least Loaded, Skill-Based), and member rosters. Full Edit Team modal included.
- **Assignment Rules (`/admin/assignment-rules`):** Multi-criteria condition builder with nested AND / OR condition groups, ticket attribute matching, and team dispatch rules.
- **Users & Roles (`/admin/users`):** Search and filter users by department, invite new members, configure custom roles and granular permission matrix. Edit User modal included.
- **AI Settings (`/admin/ai-settings`):** Private AI model thresholds, autonomous resolution limits, and human-in-the-loop review criteria.
- **Portal Settings & Theme Branding (`/admin/settings`):**
  - **Excel-Style Color Picker:** Interactive 10-column theme matrix (6 shades per column) and custom eyedropper.
  - Live preview and instantaneous CSS token application.
  - Custom brand logo upload with theme adaptation.

---

## 2. Agent Role (`agent@resolyx.internal`)

- **Persona:** Sarah Jenkins — *Support Agent*
- **Department:** Tier 1 & 2 Helpdesk
- **Default Route:** `/agent`
- **Scope:** **Restricted Access** — Focused purely on ticket resolution, AI Copilot assistance, and personal SLA compliance.

### Restricted Capabilities & Screens
- **Agent Ticket Queue (`/agent`):**
  - Overview stat counters: *Assigned To Me*, *Breaching Soon (< 2h)*, *Resolved Today*, and *Avg Resolution Speed*.
  - Queue filter tabs: *Assigned Queue*, *🚨 Urgent Breaching*, and *Resolved*.
  - Priority filter dropdown and keyword search.
  - Ticket cards with real-time SLA deadline badges (e.g. `1h 14m remaining`) and `✨ AI Draft Ready` readiness indicators.
- **Ticket Resolution Studio (`/agent/resolve/:ticketId`):**
  - **Customer Context:** Customer details, company enterprise tier, category, and ticket thread.
  - **Live SLA Deadline Timer:** Active warning badge for tickets nearing SLA breach.
  - **AI Copilot Assist Box:**
    - High-confidence draft reply generated from verified documentation.
    - Root-cause summary.
    - Verified Knowledge Base citations.
    - **1-Click "Apply AI Draft into Reply"** to copy the suggested resolution into the editor.
  - **Resolution Editor:**
    - Switch between *Public Customer Reply* and *Internal Agent Note*.
    - **"Browse KB" Modal:** 1-Click insertion of standard runbook solutions directly into the customer reply.
    - Status transition selector: `Investigating`, `Suggested`, `Resolved`, `Escalate to Manager`.
    - **"Send Reply & Resolve Ticket"** action with instant resolution confirmation.
- **Knowledge Base Reference (`/agent/kb`):**
  - Searchable repository of approved solutions, category filters, and runbooks.
  - Publish new articles with immediate private LLM embedding indexing.
- **My Performance Scorecard (`/agent/performance`):**
  - Personal SLA adherence score (**99.2%**).
  - Customer satisfaction rating (**4.9 / 5.0** stars).
  - Average resolution speed (**14.2m**) and shift activity log.

---

## 3. Manager Role (`manager@resolyx.internal`)

- **Persona:** Marcus Vance — *Support Team Lead*
- **Department:** Customer Care & Operations
- **Default Route:** `/admin`

### Key Capabilities
- Supervision of incoming ticket queues, agent routing, and unassigned queues.
- Monitoring SLA compliance rates across departments.
- Reviewing escalated tickets from Tier 1 agents.
- Viewing team-wide resolution metrics and agent workload reports.

---

## 4. Customer Role (`customer@acme.corp`)

- **Persona:** David Chen — *Enterprise Customer Lead*
- **Company:** Acme Corporation
- **Default Route:** `/customer`
- **Scope:** **Client Self-Service & AI Support Portal**

### Key Capabilities & Screens
- **AI Support Chat (`/customer` or `/customer/chat`):**
  - **Integrated Knowledge Base AI:** Real-time conversational AI copilot that searches the company's verified runbooks (e.g., Envoy 504 timeouts, Okta SAML SSO certs, API 429 rate limit quotas, WireGuard VPNs).
  - **Rich Technical Answers:** Formatted step-by-step markdown, code blocks, and linked Knowledge Base citations (e.g. `KB-402`, `KB-108`).
  - **Confidence Scoring & Feedback:** Real-time confidence score (e.g. `96% Confidence`) with helpful/unhelpful feedback buttons.
  - **Human Agent Escalation:** 1-Click **"Request Human Agent"** button or typing natural language requests escalates the ticket immediately to active support engineer Sarah Jenkins.
  - **Quick Prompt Chips:** 1-Click common enterprise issue prompts to get instant solutions.
- **Support Tickets Overview (`/customer/tickets`):**
  - Track submitted tickets with live statuses (`Investigating`, `Resolved`), priority levels, assigned agent, and last message snippet.
  - 1-Click **"Open in Chat"** to continue conversation on existing tickets.

---

## How to Test Role Switching

1. Open [`http://localhost:3000/login`](http://localhost:3000/login).
2. Click the **Customer** chip under **Demo Role Logins** &rarr; You will be logged in as David Chen and redirected to [`/customer`](http://localhost:3000/customer).
3. In the chat, click one of the prompt chips (e.g. *"How do I fix Envoy Ingress 504 Gateway Timeouts?"*) &rarr; Watch the Resolyx AI return a formatted runbook solution with KB citations!
4. Click **"Request Human Agent"** &rarr; The session escalates to Sarah Jenkins with ticket `#TICK-8049`.
5. Click **Sign Out** &rarr; Click the **Agent** chip &rarr; You can see and resolve tickets from the agent workstation at [`/agent`](http://localhost:3000/agent).
6. Click **Sign Out** &rarr; Click the **Admin** chip &rarr; Access full platform settings and helpdesk runbooks at [`/admin`](http://localhost:3000/admin).
