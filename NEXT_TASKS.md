# Next Tasks

## Immediate deployment configuration
1. Add `SUPABASE_URL` and `SUPABASE_ANON_KEY` to Vercel Project Settings → Environment Variables for Preview (and Production only when ready).
2. Redeploy the preview deployment after setting the variables.
3. Test RSVP with each allowed attendance value: `attending`, `not_attending`, `online_gift`.
4. Verify each submission appears in the existing Supabase `rsvps` table and admin-only SELECT remains enforced.
5. Test gift/slip upload separately; confirm a row in `wedding_gifts` and a private file in Drive `SLIPS 2026`.

## Security before public launch
6. Add Vercel Firewall/WAF rate limiting or another server-side abuse-control mechanism for `/api/rsvp` and `/api/gift`.
7. Review payload limits, duplicate submissions, and server logs without exposing private guest data.
8. Confirm the restored payment QR scans to the intended receiving account.

## After RSVP and gift verification
9. Build admin authentication and Admin Dashboard.
10. Add gift review/approval and guest-wishes moderation.
11. Add public display of approved wishes only.
12. Test mobile/desktop and merge to main only after owner approval.
