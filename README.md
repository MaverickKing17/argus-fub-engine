# ARGUS AI Sales Closer — Multi-Tenant B2B SaaS Platform

> **High-Density Speed-to-Lead SMS Qualification & Compliance Engine for Greater Toronto Area (GTA) Real Estate Teams using Follow Up Boss (FUB)**

---

## 🚀 Executive Overview

**ARGUS AI Sales Closer** is a white-label, multi-tenant B2B SaaS platform engineered specifically for GTA real estate brokerage teams. It automates inbound lead qualification via real-time SMS outreach within **30 seconds** of a lead being created in Follow Up Boss (FUB). 

Powered by **Gemini 3.6 Flash** (`@google/genai`), **Twilio SMS Gateway**, and **Follow Up Boss REST APIs**, ARGUS auto-enforces Ontario's **TRESA (Trust in Real Estate Services Act) & RECO (Real Estate Council of Ontario)** regulatory compliance checks before handing off qualified buyers or disqualifying leads bound by active Buyer Representation Agreements (BRA).

---

## 🏛️ System Architecture

ARGUS employs a hybrid data architecture combining real-time document sync with strict relational multi-tenant row-level security:

```
                          ┌───────────────────────────┐
                          │   Inbound Leads & SMS     │
                          └─────────────┬─────────────┘
                                        │
                         ┌──────────────┴──────────────┐
                         │   Express API / Webhooks    │
                         │   /api/v1/webhooks/*        │
                         └──────────────┬──────────────┘
                                        │
           ┌────────────────────────────┼────────────────────────────┐
           ▼                            ▼                            ▼
┌────────────────────┐       ┌────────────────────┐       ┌────────────────────┐
│  Gemini 3.6 Flash  │       │ Follow Up Boss API │       │ Twilio SMS Gateway │
│  Structured ISA    │       │ Notes & Auto-Tags  │       │ Speed-to-Lead Out  │
└────────────────────┘       └────────────────────┘       └────────────────────┘
           │                            │                            │
           └────────────────────────────┼────────────────────────────┘
                                        │
                        ┌───────────────┴───────────────┐
                        │   Multi-Tenant State Engine   │
                        │   Firestore + Postgres RLS    │
                        └───────────────────────────────┘
```

### Core Tech Stack
- **Frontend**: React 18, Tailwind CSS, Lucide Icons, Dark Slate Charcoal UI (`#0B0F17`).
- **Backend Runtime**: Node.js & Express server (`server.ts`) running on port 3000.
- **AI Engine**: `@google/genai` SDK using `gemini-3.6-flash` with strict structured outputs and heuristic fallbacks.
- **Database Architecture**:
  - **Firestore**: Real-time cloud persistence for active tenants, leads, chat history, and notifications.
  - **PostgreSQL (`schema.sql`)**: Production-grade relational schema with PostgreSQL Row Level Security (RLS) policies enforcing strict `tenant_id` data isolation across `tenants`, `leads`, `messages`, and `notifications`.

---

## ⚖️ TRESA & RECO Regulatory Compliance Engine

Under Ontario's **Trust in Real Estate Services Act (TRESA)** rules administered by the **Real Estate Council of Ontario (RECO)**, real estate licensees and automated ISA systems must verify representation status before negotiating or offering representation.

### Mandatory TRESA Representation Check
During early qualification, Gemini ISA presents the required disclosure prompt:
> *"Per Ontario TRESA regulations: Are you currently under a signed buyer representation agreement (BRA) with another real estate brokerage?"*

### Regulatory Guardrail Actions
1. **Unrepresented / Needs Verification**: Qualification proceeds normally (budget, timeline, location criteria, pre-approval).
2. **Represented by Other Brokerage**: 
   - `qualification_stage` is immediately set to `Unrepresented_Disqualified`.
   - Outbound SMS sends a polite regulatory sign-off text: *"Thank you! Per Ontario TRESA rules, since you are currently under contract with another brokerage, we cannot provide buyer services. Best of luck with your home search!"*
   - Outreach is instantly halted and auto-tagged in FUB as `#TRESA_Disqualified`.
   - A real-time `HUMAN_HANDOFF` alert is dispatched to the team dashboard.

---

## 🔐 Multi-Tenant Isolation & Security Audit

### 1. PostgreSQL Row Level Security (RLS)
The database enforces tenant isolation using session configuration variables:

```sql
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY tenant_isolation_policy ON leads
  USING (tenant_id = current_setting('app.current_tenant_id', true));
```

### 2. API Key Masking
Sensitive inputs in the Team Configuration panel (Follow Up Boss API keys, Twilio Account SIDs, and Twilio Auth Tokens) are masked by default (`••••••••1a2b`) with interactive eye-toggle visibility controls.

---

## 🔔 Real-Time High-Priority Alert Engine

ARGUS features an interactive Notification Bell component in the top header with:
- **Unread Badge Counts**: Live visual badge counters for unread events.
- **Web Audio Synthetic Chime**: Soft audio feedback on new high-priority alerts.
- **Event Feed Categories**:
  - `LEAD_QUALIFIED`: High-intent pre-approved leads ready for agent appointment booking.
  - `URGENT_INTENT`: Specific feature inquiries (e.g. EV charger parking, nanny suites).
  - `HUMAN_HANDOFF`: TRESA disqualifications or requests for licensed agent contact.

---

## 🛠️ API & Webhook Endpoints

### Inbound Webhooks
- `POST /api/v1/webhooks/fub`: Processes Follow Up Boss `personCreated` webhooks and triggers instant SMS outreach within 15 seconds.
- `POST /api/v1/webhooks/twilio`: Receives inbound buyer SMS, evaluates context via Gemini 3.6 Flash, updates state, and syncs notes/tags back to FUB.

### REST API
- `GET /api/v1/tenants`: List active multi-tenant real estate teams.
- `PUT /api/v1/tenants/:id/settings`: Update team credentials and ISA prompt parameters.
- `GET /api/v1/leads?tenantId=...`: Retrieve pipeline leads filtered by tenant.
- `GET /api/v1/notifications?tenantId=...`: Retrieve real-time notifications feed.
- `POST /api/v1/leads/:id/simulate-inbound`: Test interactive inbound SMS simulation.
- `POST /api/v1/simulate-fub-webhook`: Trigger synthetic FUB lead creation test.

---

## 💻 Getting Started & Local Development

1. **Environment Variables**:
   Create a `.env` file (see `.env.example`):
   ```env
   GEMINI_API_KEY=your_gemini_api_key
   ```
2. **Install Dependencies & Start**:
   ```bash
   npm run dev
   ```
3. **Open Preview**:
   Access the app at `http://localhost:3000`. Use the **Test Inbound Lead** button in the header to simulate a live FUB webhook and inspect the automated Gemini speed-to-lead flow!
