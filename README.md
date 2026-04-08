# G-NEX - コスト削減マッチングプラットフォーム

建物オーナー・管理者と、エネルギー・産廃関連の専門業者をつなぐBtoBマッチングプラットフォーム。

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS + shadcn/ui
- **Database:** PostgreSQL (Supabase)
- **Storage:** Amazon S3
- **Payment:** Stripe
- **Linting:** ESLint + Prettier

## Getting Started

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/
│   ├── (auth)/          # Authentication pages (login, register, forgot-password)
│   ├── (dashboard)/     # Dashboard pages by user role
│   │   ├── client/      # Client (発注者) dashboard
│   │   ├── contractor/  # Contractor (受注者) dashboard
│   │   └── admin/       # Admin (運営者) dashboard
│   ├── (marketing)/     # Public pages (LP, simulator, blog)
│   └── api/             # API routes
│       ├── auth/        # Authentication
│       ├── projects/    # Project CRUD
│       ├── leads/       # Lead management
│       ├── messages/    # Messaging
│       ├── simulator/   # Simulator calculations
│       ├── upload/      # File upload (S3)
│       └── stripe/      # Payment webhooks
├── components/
│   ├── ui/              # shadcn/ui components
│   ├── layout/          # Header, Footer, Sidebar
│   ├── forms/           # Form components (wizard, upload)
│   ├── dashboard/       # Dashboard widgets
│   ├── simulator/       # Simulator components
│   └── marketing/       # LP sections
├── lib/                 # Utility functions
├── hooks/               # Custom React hooks
├── types/               # TypeScript type definitions
├── config/              # App constants and configuration
└── styles/              # Additional styles
```

## Service Categories (4 Units)

| Unit | Category | Description |
|------|----------|-------------|
| A | 創エネ・蓄エネ | Solar, batteries, carports |
| B | 省エネ・効率化 | LED, HVAC, insulation, EMS |
| C | モビリティ | EV chargers, V2H |
| D | 運用・循環 | Waste management, recycling |

## Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run format       # Format code with Prettier
npm run format:check # Check formatting
```
