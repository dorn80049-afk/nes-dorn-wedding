# Database Notes — Supabase

Project ID: emlokjzwawjaxhfndded

## Live schema and RLS inspection supplied by project owner (2026-11-08)

Existing tables (do not recreate):
- `rsvps`: id (uuid, not null), full_name (text, not null), phone (text), attendance (text, not null), guest_count (integer), companion_names (text), message (text), created_at (timestamptz).
- `wedding_admins`: user_id (uuid, not null).
- `wedding_gifts`: id (uuid, not null), full_name (text, not null), phone (text), amount (numeric), slip_path (text), message (text), status (text), created_at (timestamptz).
- `wedding_wishes`: id (uuid, not null), guest_name (text, not null), message (text, not null), is_approved (boolean), created_at (timestamptz).

## RSVP constraints
The existing check constraint `rsvps_attendance_check` permits exactly:
- `attending`
- `not_attending`
- `online_gift`

The primary key `rsvps_pkey` is on `rsvps.id`. No additional RSVP constraints were present in the supplied inspection output.

## RLS policies reported by owner
RLS is enabled on all four tables (not forced).
- `rsvps`: authenticated admins can SELECT when their auth.uid() exists in wedding_admins; anon and authenticated can INSERT with WITH CHECK true.
- `wedding_gifts`: admins can SELECT and UPDATE; anon and authenticated can INSERT with WITH CHECK true.
- `wedding_wishes`: admins can manage all rows; anon/authenticated can SELECT only is_approved=true and INSERT.
- `wedding_admins`: authenticated users can SELECT under an admin membership predicate.

## Application integration
- Public RSVP endpoint uses Supabase anon key server-side and relies on the existing RLS guest INSERT policy.
- Required Vercel environment variables for RSVP: `SUPABASE_URL`, `SUPABASE_ANON_KEY`.
- Never use or expose `SUPABASE_SERVICE_ROLE_KEY` in browser code or the public RSVP endpoint.
- RSVP writes only to `rsvps`; gift uploads continue through the existing Apps Script path and write to `wedding_gifts`.

## Security notes / not yet verified
- The supplied policies allow unrestricted anonymous INSERT (`WITH CHECK (true)`). Validate at the API layer and add edge/WAF rate limiting before public launch.
- RLS inspection output did not include grants, indexes, triggers, defaults, or foreign keys; these remain unverified.
- Do not run CREATE TABLE or destructive migrations for these existing tables.
