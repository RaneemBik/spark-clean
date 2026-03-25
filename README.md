# SparkClean Next.js

Production-ready marketing website + role-based admin dashboard for a cleaning business, built with Next.js 14 and Supabase.

## Highlights

- Public site pages: Home, About, Services, Projects, Blog, News, Contact
- Admin dashboard for content management
- Role-based access control (`super_admin`, `content_manager`, `communications`)
- Contact and project-interest submission workflows
- Appointment booking support
- Supabase authentication and PostgreSQL backend

## Tech Stack

- Next.js 14 (App Router)
- React 18
- TypeScript
- Tailwind CSS
- Supabase (`@supabase/supabase-js`, `@supabase/ssr`)

## Project Structure

```text
app/                 Next.js routes (public pages, auth, dashboard, API)
components/          UI and feature components
lib/                 Supabase clients, queries, actions, permissions
scripts/             Utility scripts (seed user/data)
supabase-schema.sql  Database schema + policies + starter records
```

## Prerequisites

- Node.js 18+
- npm 9+
- A Supabase project

## Quick Start

```bash
npm install
cp .env.example .env.local
```

Update `.env.local` with your Supabase credentials:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `NEXT_PUBLIC_BASE_URL` (usually `http://localhost:3000`)

Then start the app:

```bash
npm run dev
```

Open `http://localhost:3000`.

## Database Setup (Supabase)

1. Create a new Supabase project.
2. Open the SQL Editor in Supabase.
3. Run the full contents of `supabase-schema.sql`.

This creates tables, RLS policies, triggers, and starter content for core public pages.

### Existing Database Upgrade

If your Supabase project was created before dynamic roles/trash support, run:

1. Open SQL Editor
2. Execute `supabase-update-dynamic-roles-trash.sql`

This enables:

- Trash + restore for Blog, News, Projects
- Dynamic role + permission tables
- Updated public-read policies to exclude trashed content

## Seed Data (Local Dev)

This project includes a seed script so teammates can bootstrap test data quickly.

### 1) Optional test-user env values

Set these in `.env.local` to customize admin login creation:

- `TEST_USER_EMAIL`
- `TEST_USER_PASSWORD`
- `TEST_USER_NAME`

Defaults used by the script if not provided:

- email: `test-admin@example.com`
- password: `password123`
- name: `Test Admin`

### 2) Run seed script

```bash
npm run seed
```

The script will:

- Ensure a test auth user exists (role: `super_admin`)
- Insert sample rows into:
  - `contact_submissions`
  - `project_submissions`
  - `appointments`

## Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Run production server
npm run lint     # Run ESLint
npm run seed     # Create test user + seed sample data
```

## Authentication and Roles

User profile + role data is managed in Supabase tables (`profiles`, `users`) and enforced in both:

- server actions (authorization checks)
- dashboard UI guards

Recommended first account for local testing: `super_admin`.

### Dynamic Roles

Super admins can now create custom roles in Dashboard -> Users:

- Define role key and label
- Assign granular permissions (blog/projects/news/etc.)
- Assign that role to invited users

Access in dashboard/public management is permission-based, not hardcoded to fixed roles.

## Deployment

- Frontend: Vercel or any Node-compatible host
- Backend/Auth/DB: Supabase

Before deploying, ensure production environment variables are configured and never expose `SUPABASE_SERVICE_ROLE_KEY` to the client.

## Troubleshooting

### App starts but dashboard data is empty

- Verify `supabase-schema.sql` was fully executed.
- Check that seeded records exist in Supabase tables.

### Seed script fails with auth/db errors

- Confirm `.env.local` values are correct.
- Ensure `SUPABASE_SERVICE_ROLE_KEY` belongs to the same project as `NEXT_PUBLIC_SUPABASE_URL`.

### Invite email fails (SMTP/Gmail daily limit)

- Set `ALLOW_INVITE_LINK_FALLBACK=true` in `.env.local`.
- The dashboard will keep the invitation and show a manual invite link you can copy/share.
- Set `INVITE_BASE_URL` to a public domain so the manual link works outside your machine.

### Permission denied in dashboard actions

- Confirm the signed-in user role in `profiles`/`users`.
- Use a `super_admin` account to validate admin-only features.

## License

Private project. Add a license section if you plan to open-source this repository.
