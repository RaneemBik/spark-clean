# SparkClean Project - Fix Summary

**Date:** March 25, 2026  
**Status:** Ready for local setup and team onboarding

## What is now completed

- Added local seed workflow for easy first-run setup.
- Added a production-style README with setup, schema, and troubleshooting steps.
- Added trash and restore support for blog posts, projects, and news.
- Updated public queries so trashed content is hidden from public pages.
- Added dynamic role and permission model backed by database tables.
- Added dashboard UI for super admins to create roles and assign permissions.
- Added invitation fallback behavior when SMTP provider quota is exceeded.
- Added migration SQL for existing databases:
  - `supabase-update-dynamic-roles-trash.sql`

## Access and permissions

- Authorization is now permission-based, not hardcoded role-only checks.
- Super admin can:
  - create custom roles
  - assign permissions to roles
  - manage user roles
- Dashboard navigation and actions rely on resolved permissions.

## Trash and restore behavior

- Dashboard delete actions for Blog, Projects, and News perform soft-delete.
- Soft-deleted rows are marked as trashed and hidden from public pages.
- Admin can restore trashed rows from dashboard lists.

## Invitation behavior with email quota limits

- If SMTP/SendGrid fails, invitation can still be created.
- Admin receives a manual invite link and can share it directly.
- Local setup can keep `INVITE_BASE_URL=http://localhost:3000`.

## Seed script readiness

- Script: `scripts/seed.js`
- Command: `npm run seed`
- Seed behavior:
  - ensures test auth user exists
  - ensures test user has `super_admin` role in `users` and `profiles`
  - inserts sample records into:
    - `contact_submissions`
    - `project_submissions`
    - `appointments`
  - skips inserts when those tables already contain data

## Environment template readiness

- `.env.example` now includes:
  - Supabase public/server keys placeholders
  - invite URL settings (`NEXT_PUBLIC_BASE_URL`, `INVITE_BASE_URL`)
  - SendGrid and SMTP placeholders
  - `ALLOW_INVITE_LINK_FALLBACK`
  - test user values for the seed script

## Git hygiene updates

- `.gitignore` includes local migration folders and explicit `.env.local` ignore.
- Build output is ignored (`.next`), and should remain untracked.

## Run this project on a new laptop

1. Install dependencies: `npm install`
2. Copy env template: `cp .env.example .env.local`
3. Fill Supabase values in `.env.local`
4. Run schema in Supabase SQL editor:
   - `supabase-schema.sql`
   - `supabase-update-dynamic-roles-trash.sql` (for existing DBs)
5. Seed test data: `npm run seed`
6. Start app: `npm run dev`
