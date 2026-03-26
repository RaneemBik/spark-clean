# SparkClean

A full-stack informative cleaning-services website built with Next.js 14, React 18, Supabase, and PostgreSQL.
It includes a public-facing website and a private admin dashboard with dynamic role-based access control.

## Tech Stack

| Layer | Technology |
| --- | --- |
| Framework | Next.js 14.2.3 (App Router) |
| Frontend | React 18, Tailwind CSS 3 |
| Language | TypeScript 5 |
| Database | PostgreSQL via Supabase |
| Backend/Auth | Supabase Auth + Supabase Server Actions |
| RBAC | Database-backed dynamic roles and permissions |
| Deployment | Vercel (recommended) + Supabase |

## Project Structure

```text
sparkclean-nextjs/
|-- app/
|   |-- (auth)/                 # Login route group
|   |   |-- login/
|   |-- (public)/               # Public website routes
|   |   |-- page.tsx            # Home
|   |   |-- about/
|   |   |-- services/
|   |   |-- projects/
|   |   |-- blog/
|   |   |-- news/
|   |   |-- contact/
|   |-- dashboard/              # Private admin dashboard
|   |   |-- page.tsx            # Overview / stats
|   |   |-- home/               # Home page editor
|   |   |-- about/              # About page editor
|   |   |-- services/           # Services editor
|   |   |-- projects/           # Projects CRUD + trash/restore
|   |   |-- blog/               # Blog CRUD + trash/restore
|   |   |-- news/               # News CRUD + trash/restore
|   |   |-- contact/            # Contact inbox
|   |   |-- appointments/       # Appointments inbox
|   |   |-- submissions/        # Project submissions inbox
|   |   |-- users/              # User + role management
|   |   |-- settings/
|   |-- api/                    # API routes (auth, invitations, appointments)
|-- components/
|   |-- pages/                  # Public page clients
|   |-- dashboard/              # Dashboard shell, sidebar, topbar, page clients
|   |-- layout/                 # Navbar, footer
|   |-- ui/                     # Shared UI primitives
|-- lib/
|   |-- supabase/               # Clients, server actions, queries
|   |-- auth/                   # Permission checks + permission catalog
|   |-- dashboard/              # Dashboard auth context and mock helpers
|-- scripts/
|   |-- seed.js                 # Idempotent local seed script
|-- supabase-schema.sql         # Full schema, RLS, starter content
|-- supabase-update-dynamic-roles-trash.sql  # Upgrade migration for existing DBs
|-- middleware.ts               # Route protection
```

## Database Schema

The schema is split across content, submissions, and access-control domains.

### Content

- `home_content`
- `about_content`
- `services`
- `projects`
- `blog_posts`
- `news_items`

### Submissions

- `contact_submissions`
- `project_submissions`
- `appointments`

### Access Control and Auth Profile Data

- `profiles`
- `users`
- `permissions`
- `roles`
- `role_permissions`
- `invitations`

## Role-Based Access Control

This project uses dynamic, database-backed RBAC.
Roles and permission bundles are stored in tables, not hardcoded in UI-only logic.

### How it works

1. At login, user role and permissions are resolved from `roles` and `role_permissions`.
2. Dashboard routes and actions call permission guards before access/update.
3. Dashboard UI adapts based on the current permission set.
4. Super admins can create custom roles and assign permissions from the Users page.

### Built-in roles

| Role | Access |
| --- | --- |
| super_admin | Full access including user and role management |
| content_manager | Content editing (home/about/services/projects/blog/news) |
| communications | Contact and appointment workflows |
Super admin can add new roles with permissions in super admin dashboard.

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+
- A Supabase project (empty database is fine)

### 1. Clone and install

```bash
git clone <your-repository-url>
cd sparkclean-nextjs
npm install
```

### 2. Configure environment variables

Create `.env.local` from `.env.example`.

Mac/Linux:

```bash
cp .env.example .env.local
```

Windows PowerShell:

```powershell
Copy-Item .env.example .env.local
```

Fill required values in `.env.local`:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `NEXT_PUBLIC_BASE_URL=http://localhost:3000`
- `INVITE_BASE_URL=http://localhost:3000`

For invite email testing, also set either SendGrid values or SMTP values.

### 3. Set up the database

In your Supabase SQL Editor, run:

1. `supabase-schema.sql`

If your database is old and already has earlier versions, then also run:

2. `supabase-update-dynamic-roles-trash.sql`

### 4. Seed data (required for first local run)

```bash
npm run seed
```

The seed script is idempotent and safe to run multiple times.

It does all of the following:

- ensures a test auth user exists
- ensures user role rows in `users` and `profiles` are `super_admin`
- ensures single-row website content exists (`home_content`, `about_content`)
- seeds `services`, `projects`, `blog_posts`, and `news_items` if empty
- seeds sample `contact_submissions`, `project_submissions`, and `appointments` if empty

Default seeded admin credentials:

- Email: `admin@example.com`
- Password: `ChangeMe123!`

You can override these via `.env.local`:

- `TEST_USER_EMAIL`
- `TEST_USER_PASSWORD`
- `TEST_USER_NAME`

### 5. Run the development server

```bash
npm run dev
```

Open http://localhost:3000.
Dashboard is at http://localhost:3000/dashboard.

## Instructor Quick Start (Empty Database)

Use this exact checklist for your instructor:

1. Create a new Supabase project.
2. Clone this repository and run `npm install`.
3. Copy `.env.example` to `.env.local` and fill Supabase keys.
4. Run `supabase-schema.sql` in Supabase SQL Editor.
5. Run `npm run seed`.
6. Run `npm run dev`.
7. Open `/dashboard` and sign in with seeded admin credentials.

If she follows these 7 steps in order, she can run the project on her own laptop and database.

## Environment Variables Reference

| Variable | Required | Description |
| --- | --- | --- |
| NEXT_PUBLIC_SUPABASE_URL | Yes | Supabase project URL |
| NEXT_PUBLIC_SUPABASE_ANON_KEY | Yes | Public anon key |
| SUPABASE_SERVICE_ROLE_KEY | Yes | Service key used by server actions and seed |
| NEXT_PUBLIC_BASE_URL | Yes | App URL for local links |
| INVITE_BASE_URL | Recommended | Base URL for invite links |
| SENDGRID_API_KEY | Optional | SendGrid API key |
| SENDGRID_FROM | Optional | Sender email for SendGrid |
| SMTP_HOST | Optional | SMTP host |
| SMTP_PORT | Optional | SMTP port |
| SMTP_USER | Optional | SMTP username |
| SMTP_PASS | Optional | SMTP password |
| SMTP_FROM | Optional | Sender email for SMTP |
| ALLOW_INVITE_LINK_FALLBACK | Optional | Keep invite + show manual link if email fails |
| TEST_USER_EMAIL | Optional | Seed admin email |
| TEST_USER_PASSWORD | Optional | Seed admin password |
| TEST_USER_NAME | Optional | Seed admin display name |

## Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
npm run seed     # Seed auth user + website data + sample submissions
```

## Dashboard Overview

The dashboard is protected and permission-based.

### Content management

- Edit Home, About, and Services content
- Create, update, trash, and restore Projects
- Create, update, trash, and restore Blog posts
- Create, update, trash, and restore News items

### Submissions

- View and manage contact submissions
- View and manage project interest submissions
- View and manage appointments

### User and role management

- Invite users
- Update user roles
- Create custom roles with selected permissions

## Troubleshooting

### Seed fails with relation does not exist

Cause: schema was not applied.
Fix: run `supabase-schema.sql`, then run `npm run seed` again.

### Dashboard loads but content is missing

Cause: empty tables or skipped seed.
Fix: run `npm run seed` again.

### Invite email fails (provider quota)

Set `ALLOW_INVITE_LINK_FALLBACK=true` and share manual invite link shown in dashboard.

## License

Private project.
