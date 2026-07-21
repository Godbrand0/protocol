# ProtocolLink – Detailed Project Specification

**Version:** 1.0  
**Last Updated:** July 21, 2026  
**Status:** Ready for Development  
**Target Launch:** MVP in 6–10 weeks  

---

## 1. Project Overview

**ProtocolLink** is a premium two-sided marketplace that connects elite clients (executives, diplomats, high-net-worth individuals, religious leaders, corporate teams) with verified protocol service providers across Nigeria.

**Core Value Proposition**  
“Seamless, verified, and discreet protocol services — airport meet & greet, VIP facilitation, event protocol, and logistics — booked in minutes instead of through endless word-of-mouth.”

**Primary Markets (MVP)**  
- Lagos (Murtala Muhammed International & Domestic)  
- Abuja (Nnamdi Azikiwe International)  
- Port Harcourt (future phase)

**Monetization**  
- Commission on every successful booking (recommended 15–18%)  
- Optional premium provider subscriptions / featured listings  

---

## 2. Problem & Solution

### Current Pain Points
- Protocol services are almost exclusively discovered via referrals and WhatsApp groups.
- No centralized verification of credentials (“red cards”, CAC, airport access permits, association membership).
- No transparent pricing or availability.
- Payment and trust issues between parties.
- Clients have no easy way to compare providers or leave reviews.

### Our Solution
A trusted digital marketplace with:
- Rigorous provider verification
- Search by location + service type + date
- Secure escrow-style payments via Paystack
- In-app messaging
- Reviews & ratings
- Beautiful, premium mobile-first experience

---

## 3. User Roles

| Role       | Description                                      | Key Actions                                      |
|------------|--------------------------------------------------|--------------------------------------------------|
| Client     | Elite individual or company booking services     | Search, book, pay, chat, review                  |
| Provider   | Protocol company or independent professional     | Register, get verified, manage calendar, accept bookings, receive payouts |
| Admin      | Platform team                                    | Verify providers, manage disputes, analytics     |

---

## 4. Core Features (MVP Scope)

### Client Side
- Advanced search (location, airport, service type, date range, price range, rating)
- Provider profile pages (photos, bio, experience years, verified credentials badges, services offered, reviews)
- Instant booking request with flight/event details + special requests
- Secure payment (full amount or deposit + balance)
- In-app real-time chat
- Booking dashboard (upcoming, past, cancelled)
- Review & rating system after service completion
- Profile & saved providers

### Provider Side
- Multi-step registration + document upload (CAC, “red card”/access permits, ID, association membership, insurance)
- Profile builder with service packages & pricing
- Availability calendar
- Booking request inbox (accept / decline / counter)
- Earnings dashboard + payout requests
- Review management

### Platform / Admin
- Provider verification queue (approve / reject with notes)
- Dispute resolution tools
- Transaction monitoring
- Basic analytics (GMV, active providers, conversion rates)

### Future Features (Post-MVP)
- Native mobile apps (React Native / Expo)
- Corporate accounts & team booking
- Multi-city expansion
- Protocol training / certification marketplace
- AI matching suggestions
- WhatsApp notifications integration

---

## 5. Tech Stack

| Layer              | Technology                          | Reason |
|--------------------|-------------------------------------|--------|
| Frontend           | **Next.js 15** (App Router)         | Best DX, SEO, performance, React Server Components |
| Styling            | **Tailwind CSS v4** + **shadcn/ui** | Rapid, consistent, beautiful UI |
| Animations         | **Framer Motion** (motion/react)    | Premium, smooth micro-interactions |
| Backend / DB       | **Supabase**                        | Auth, Postgres, Realtime, Storage, RLS |
| Payments           | **Paystack**                        | Best Nigerian payment experience + split payments |
| File Storage       | Supabase Storage                    | Secure document uploads |
| Realtime Chat      | Supabase Realtime                   | Built-in, low latency |
| Email / SMS        | Resend + Termii (or Africa’s Talking) | Transactional emails + Nigerian SMS |
| Hosting            | Vercel                              | Perfect Next.js integration |
| Analytics          | Vercel Analytics + PostHog          | Product insights |

---

## 6. Design System & Styling Guidelines

### Brand Personality
Premium • Trustworthy • Discreet • Efficient • Nigerian-rooted luxury

### Color Palette (Tailwind Config)
```js
// tailwind.config.ts
colors: {
  primary: {
    50:  '#f0f4ff',
    100: '#e0e9ff',
    200: '#c7d6fe',
    300: '#a5b8fc',
    400: '#8193f8',
    500: '#6366f1',   // Deep indigo-blue
    600: '#4f46e5',
    700: '#4338ca',
    800: '#3730a3',
    900: '#312e81',
    950: '#1e1b4b',
  },
  gold: {
    400: '#fbbf24',
    500: '#f59e0b',
    600: '#d97706',
  },
  background: {
    DEFAULT: '#0f172a', // Deep navy
    secondary: '#1e293b',
    card: '#1e293b',
  },
  foreground: {
    DEFAULT: '#f8fafc',
    muted: '#94a3b8',
  }
}
```

### Typography
- Headings: Inter or Plus Jakarta Sans (bold, elegant)
- Body: Inter
- Use `font-display` for large hero headlines

### Motion Guidelines (Framer Motion)
- Page transitions: subtle fade + slight y-shift
- Cards: gentle scale + shadow on hover
- Buttons: micro-scale on press
- Loading states: elegant skeleton + shimmer
- Modal / Sheet: spring physics
- Never over-animate — keep it premium and calm

### UI Components
- Prefer **shadcn/ui** + custom theming
- Rounded-2xl cards with subtle border + glass effect where appropriate
- Soft gold accents on primary CTAs and verified badges
- High contrast text for accessibility
- Dark mode first (premium feel), light mode optional later

---

## 7. High-Level Architecture

```
Client Browser
     │
     ▼
Next.js App (Vercel)
  ├── App Router (RSC + Client Components)
  ├── Server Actions / API Routes
  └── Middleware (auth protection)
     │
     ├──► Supabase (Auth + Postgres + Storage + Realtime)
     │
     └──► Paystack (Payments + Webhooks)
```

**Key Principles**
- Server Components by default
- Client Components only when needed (forms, animations, chat)
- Row Level Security (RLS) as the primary authorization layer
- All sensitive operations go through Server Actions or secured API routes
- Webhooks from Paystack verified with signature

---

## 8. Database Schema (Supabase / Postgres)

### Core Tables

```sql
-- profiles (extends auth.users)
profiles (
  id uuid PRIMARY KEY REFERENCES auth.users,
  role text CHECK (role IN ('client', 'provider', 'admin')),
  full_name text,
  phone text,
  avatar_url text,
  company_name text,
  created_at timestamptz DEFAULT now()
)

-- providers
providers (
  id uuid PRIMARY KEY REFERENCES profiles(id),
  business_name text,
  bio text,
  years_experience int,
  verification_status text DEFAULT 'pending', -- pending | approved | rejected
  verified_at timestamptz,
  service_areas text[], -- ['lagos', 'abuja']
  average_rating numeric(3,2),
  total_reviews int DEFAULT 0,
  is_featured boolean DEFAULT false
)

-- provider_documents
provider_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id uuid REFERENCES providers,
  document_type text, -- 'cac', 'red_card', 'id', 'association', 'insurance'
  file_path text,     -- Supabase Storage path
  status text DEFAULT 'pending',
  reviewed_at timestamptz,
  reviewer_notes text
)

-- services (packages offered by providers)
services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id uuid REFERENCES providers,
  title text, -- e.g. "Airport Arrival VIP Protocol"
  description text,
  service_type text, -- 'airport_arrival', 'airport_departure', 'event_protocol', 'full_day', etc.
  base_price numeric,
  currency text DEFAULT 'NGN',
  duration_hours int,
  is_active boolean DEFAULT true
)

-- bookings
bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid REFERENCES profiles,
  provider_id uuid REFERENCES providers,
  service_id uuid REFERENCES services,
  status text DEFAULT 'pending', -- pending | accepted | paid | in_progress | completed | cancelled | disputed
  booking_date date,
  start_time time,
  end_time time,
  location text, -- airport code or venue
  flight_number text,
  passenger_count int DEFAULT 1,
  special_requests text,
  total_amount numeric,
  platform_fee numeric,          -- our commission
  provider_amount numeric,       -- amount provider receives
  paystack_reference text,
  created_at timestamptz DEFAULT now(),
  completed_at timestamptz
)

-- messages (realtime chat)
messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id uuid REFERENCES bookings,
  sender_id uuid REFERENCES profiles,
  content text,
  created_at timestamptz DEFAULT now(),
  read_at timestamptz
)

-- reviews
reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id uuid REFERENCES bookings UNIQUE,
  client_id uuid REFERENCES profiles,
  provider_id uuid REFERENCES providers,
  rating int CHECK (rating BETWEEN 1 AND 5),
  comment text,
  created_at timestamptz DEFAULT now()
)

-- payouts
payouts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id uuid REFERENCES providers,
  amount numeric,
  status text DEFAULT 'pending', -- pending | processing | paid | failed
  paystack_transfer_code text,
  created_at timestamptz DEFAULT now()
)
```

**Critical:** Enable Row Level Security on every table and write strict policies based on `auth.uid()` and role.

---

## 9. Authentication & Authorization

- Supabase Auth (email + password + magic link + Google optional)
- After signup → choose role (Client or Provider)
- Provider role requires additional verification step
- Middleware protects routes:
  - `/dashboard/*` → authenticated
  - `/provider/*` → role = provider
  - `/admin/*` → role = admin
- Use `@supabase/ssr` package for proper cookie handling in App Router

---

## 10. Payments Flow (Paystack)

### Recommended Flow (Escrow-style)

1. Client confirms booking → Frontend calls Server Action
2. Server creates booking record with status `pending_payment`
3. Server initializes Paystack transaction (amount = total_amount)
4. Client is redirected to Paystack checkout (or inline popup)
5. On successful payment → Paystack webhook hits `/api/webhooks/paystack`
6. Webhook verifies signature → updates booking to `paid` → notifies provider
7. After service is marked `completed` by both parties (or after X hours):
   - Create payout record
   - Initiate Paystack Transfer to provider’s bank account (minus platform fee)
8. Platform fee stays in the main Paystack balance

### Key Paystack Features to Use
- Transaction initialization
- Webhook verification
- Subaccounts or Multi-Split (if you want automatic split at payment time)
- Transfers API for provider payouts
- Virtual accounts (optional advanced feature)

**Important Security**
- Never trust client-side payment success alone
- Always verify via webhook + signature
- Store Paystack secret key only in server environment variables

---

## 11. Recommended Folder Structure (Next.js App Router)

```
src/
├── app/
│   ├── (marketing)/          # Public pages
│   │   ├── page.tsx          # Landing
│   │   ├── about/
│   │   └── pricing/
│   ├── (auth)/
│   │   ├── login/
│   │   ├── register/
│   │   └── verify/
│   ├── (dashboard)/
│   │   ├── client/
│   │   │   ├── bookings/
│   │   │   ├── messages/
│   │   │   └── profile/
│   │   ├── provider/
│   │   │   ├── dashboard/
│   │   │   ├── services/
│   │   │   ├── calendar/
│   │   │   ├── documents/
│   │   │   └── earnings/
│   │   └── admin/
│   ├── api/
│   │   ├── webhooks/paystack/
│   │   └── ...
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── ui/                   # shadcn components
│   ├── marketing/
│   ├── forms/
│   ├── chat/
│   └── providers/
├── lib/
│   ├── supabase/
│   │   ├── client.ts
│   │   ├── server.ts
│   │   └── middleware.ts
│   ├── paystack.ts
│   ├── utils.ts
│   └── validations.ts        # Zod schemas
├── hooks/
├── types/
└── styles/
```

---

## 12. Key Pages & Routes

| Route                          | Description                              | Access     |
|--------------------------------|------------------------------------------|------------|
| `/`                            | Premium landing page                     | Public     |
| `/search`                      | Main search & results                    | Public     |
| `/providers/[id]`              | Provider profile                         | Public     |
| `/book/[serviceId]`            | Booking form                             | Client     |
| `/dashboard`                   | Client dashboard                         | Client     |
| `/provider/dashboard`          | Provider overview                        | Provider   |
| `/provider/onboarding`         | Multi-step verification                  | Provider   |
| `/messages/[bookingId]`        | Chat interface                           | Auth       |
| `/admin/verifications`         | Review pending providers                 | Admin      |

---

## 13. Implementation Phases

### Phase 1 – Foundation (Week 1–2)
- Next.js + Tailwind + Framer Motion setup
- Supabase project + Auth + basic profiles
- Landing page + design system
- Database schema + RLS policies

### Phase 2 – Core Marketplace (Week 3–5)
- Provider registration + document upload
- Admin verification flow
- Search + provider profiles
- Booking creation flow
- Paystack integration (initialize + webhook)

### Phase 3 – Transactions & Trust (Week 6–7)
- Full payment → completion → payout cycle
- Realtime chat
- Reviews & ratings
- Email / SMS notifications

### Phase 4 – Polish & Launch Prep (Week 8–10)
- Animations & micro-interactions
- Mobile responsiveness polish
- Error handling & edge cases
- Analytics + monitoring
- Soft launch with selected providers

---

## 14. Security & Compliance Checklist

- [ ] Strict Row Level Security on all tables
- [ ] Paystack webhook signature verification
- [ ] Document uploads restricted to private Supabase buckets
- [ ] Rate limiting on sensitive endpoints
- [ ] NDPR compliance (privacy policy, data retention, consent)
- [ ] Clear Terms of Service (platform is intermediary only)
- [ ] Input validation with Zod on every form
- [ ] Environment variables for all secrets

---

## 15. Environment Variables (Example)

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

PAYSTACK_SECRET_KEY=
PAYSTACK_PUBLIC_KEY=
PAYSTACK_WEBHOOK_SECRET=

NEXT_PUBLIC_APP_URL=https://protocollink.ng

RESEND_API_KEY=
TERMII_API_KEY=
```

---

## 16. Success Metrics (MVP)

- Number of verified providers in Lagos & Abuja
- Number of completed bookings
- Gross Merchandise Value (GMV)
- Average rating of completed services
- Client retention (repeat bookings)
- Provider response time to booking requests

---

## 17. Next Immediate Actions

1. Create Supabase project and set up the schema above
2. Initialize Next.js 15 project with Tailwind + Framer Motion + shadcn/ui
3. Design the landing page and core design system
4. Implement authentication + role selection
5. Build provider onboarding + document upload flow

---

**This document is the single source of truth for the ProtocolLink project.**

Feel free to iterate on it as we start building. Ready when you are.

— Grok
```
