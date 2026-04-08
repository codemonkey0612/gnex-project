# G-NEX Database Setup Guide

## Quick Start (Prisma Dev - Recommended for local development)

Prisma Dev runs an embedded PostgreSQL server locally. No Docker or external DB required.

```bash
# 1. Start the local database server (keep this terminal open)
npx prisma dev

# 2. In a new terminal, run the migration
npm run db:migrate

# 3. Seed the database
npm run db:seed

# 4. Start the dev server
npm run dev
```

The `.env` file is automatically configured when you run `npx prisma dev`.

## Alternative: Supabase Setup

1. Create a Supabase project at https://supabase.com
2. Go to **Settings > Database** and copy the connection strings
3. Update `.env`:

```env
DATABASE_URL=prisma+postgres://accelerate.prisma-data.net/?api_key=YOUR_API_KEY
DIRECT_DATABASE_URL=postgresql://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:5432/postgres
```

4. Run migration and seed:

```bash
npm run db:migrate
npm run db:seed
```

## Alternative: Docker PostgreSQL

```bash
# Start PostgreSQL container
docker run -d \
  --name gnex-postgres \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=gnex_dev \
  -p 5432:5432 \
  postgres:16

# Update .env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/gnex_dev
DIRECT_DATABASE_URL=postgresql://postgres:postgres@localhost:5432/gnex_dev
```

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run db:generate` | Regenerate Prisma Client |
| `npm run db:migrate` | Create and apply migrations |
| `npm run db:migrate:prod` | Apply migrations in production |
| `npm run db:push` | Push schema directly (no migration file) |
| `npm run db:seed` | Seed the database |
| `npm run db:studio` | Open Prisma Studio (visual DB editor) |
| `npm run db:reset` | Reset database and re-apply migrations |

## Seed Data

The seed script creates:

### Users (4 test accounts)

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@gnex.jp | admin123456 |
| Client (発注者) | client@example.com | client123456 |
| Contractor (受注者) | contractor@example.com | contractor123456 |
| Lead Buyer (リード購入型) | leadbuyer@example.com | leadbuyer123456 |

### Lead Pricing

| Type | Price |
|------|-------|
| SUBSIDY (補助金) | ¥15,000 |
| FINANCE (融資・リース) | ¥15,000 |
| WASTE (産廃) | ¥10,000 |

### Simulator Configs (4 categories from requirements Section 7)

| Slug | Unit | Pattern | Description |
|------|------|---------|-------------|
| solar-power | UNIT_A | Pattern A | 太陽光発電 |
| hvac-led | UNIT_B | Pattern B | 高効率空調・LED |
| ev-charger | UNIT_C | Pattern A | EV充電設備・V2H |
| waste-recycling | UNIT_D | Pattern B | 産廃・有価物買取 |

### Additional Seed Data

- 8 photo guides (撮影ガイド) across all 4 Units
- 10 dynamic form fields (動的フォーム項目) across all 4 Units
- 1 sample project (工場太陽光案件)

## Schema Overview

See the full entity-relationship details in the Prisma schema at `prisma/schema.prisma`.

Total: **20 models**, **14 enums**, **660 lines of migration SQL**.
