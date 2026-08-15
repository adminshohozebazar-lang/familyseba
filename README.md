# Family Seba

Online store for Family Seba, selling OTC herbal/wellness supplements in Bangladesh.
Traffic is primarily driven by TikTok/Facebook ads, with Cash-on-Delivery (COD) as the
primary payment model.

This repository is currently in an early scaffolding stage — no product, cart, or
checkout functionality yet.

## Tech stack

- **Framework:** Next.js 14+ (App Router), TypeScript (strict mode)
- **Styling:** Tailwind CSS
- **Database ORM:** Prisma, targeting PostgreSQL
- **Linting/formatting:** ESLint + Prettier
- **Package manager:** npm

## Running locally

### Prerequisites

- Node.js 18.18+ (or 20+ recommended)
- A PostgreSQL database (local or hosted) — only needed once Prisma models are added

### Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Copy the environment variable template and fill in real values:

   ```bash
   cp .env.example .env
   ```

   At minimum, set `DATABASE_URL` to a PostgreSQL connection string.

3. Start the dev server:

   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000). You should see the "Family Seba"
   placeholder homepage styled with the brand colors.

### Other useful commands

| Command                | Purpose                                   |
| ----------------------- | ------------------------------------------ |
| `npm run build`         | Production build                          |
| `npm run start`         | Run the production build locally          |
| `npm run lint`          | Run ESLint                                |
| `npm run format`        | Format the codebase with Prettier         |
| `npm run type-check`    | Run the TypeScript compiler with no emit  |

## Folder structure

```
src/
├── app/                    # App Router pages (Next.js file-based routing)
│   ├── (storefront)/       # Customer-facing route group (empty for now)
│   ├── admin/               # Admin panel route group (empty for now)
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Placeholder homepage
│   └── globals.css          # Tailwind entrypoint
├── components/
│   ├── ui/                  # Reusable primitives (button, input, etc.)
│   └── layout/               # Header, footer, nav
├── lib/                     # Helpers, Prisma client, utilities
├── types/                   # Shared TypeScript types
└── config/                  # Site config and brand constants

prisma/
└── schema.prisma            # Prisma schema (placeholder model only, for now)
```

Route groups (`(storefront)`) don't affect the URL path — they exist purely to organize
routes without adding a URL segment, per Next.js App Router conventions.

## Brand colors

Defined in `tailwind.config.ts` under the `brand` theme namespace, and mirrored as plain
constants in `src/config/brand.ts` for use outside Tailwind classes:

| Name                | Hex       | Usage                          |
| -------------------- | --------- | -------------------------------- |
| `brand-primary`       | `#1F6B3D` | Main brand color (forest green) |
| `brand-accent`        | `#D97B3F` | CTAs, highlights (terracotta)   |
| `brand-neutral-light` | `#FAF9F6` | Background                      |
| `brand-neutral-dark`  | `#2B2B2B` | Body text                       |

## What's out of scope right now

Product pages, cart, checkout, admin auth, real database models, Cloudinary integration,
payment logic, and hosting/deployment config — all planned for later steps.
