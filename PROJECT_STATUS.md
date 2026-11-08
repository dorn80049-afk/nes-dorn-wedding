# Project Status

Last updated: 2026-11-08

## Verified in GitHub
- Repository: dorn80049-afk/nes-dorn-wedding; development branch: feat/nd-wedding-foundation.
- Landing page includes invitation, both invitation-card images, schedule, venue and map.
- Gift/slip form posts through `api/gift.js` to the existing Google Apps Script Web App.
- Added `api/rsvp.js` to validate RSVP payloads and insert into the existing Supabase `rsvps` table using the anon key and existing RLS INSERT policy.
- Added a public RSVP form with the three exact attendance values allowed by the existing database constraint.
- No Supabase tables, RLS policies, or Apps Script source were modified.

## Live schema / RLS reported by project owner
- Existing tables: `rsvps`, `wedding_admins`, `wedding_gifts`, `wedding_wishes`.
- RLS enabled on all four tables.
- RSVP attendance constraint allows `attending`, `not_attending`, `online_gift`.
- Guest INSERT policies exist on `rsvps`, `wedding_gifts`, and `wedding_wishes`.
- Admin SELECT on RSVP and gifts; approved-only public SELECT on wishes.
- Full details are recorded in DATABASE.md.

## Required Vercel environment variables
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
These are needed by `api/rsvp.js`. The anon key is public by design but kept server-side here; RLS remains the access boundary. Never expose the service-role key.

## Reported by owner; not independently tested in this development pass
- Apps Script previously passed a slip upload test and writes to `wedding_gifts`.
- Google Drive folder and Supabase Script Properties are configured.
- The deployed Vercel preview and live end-to-end RSVP/gift flows have not been tested from this commit.

## Remaining
- Configure the two Vercel environment variables and redeploy preview.
- Test all three RSVP options and verify rows in Supabase.
- Test gift/slip upload to Drive and Supabase.
- Add rate limiting/WAF protection to public submission endpoints; current RLS guest INSERT policies use WITH CHECK true.
- Build admin authentication/dashboard, gift review, wish moderation and public approved-wishes display.
- Confirm payment QR account details before production.
- Merge to main only after owner approval and successful tests.
