# Next Tasks

## Immediate
1. Confirm the restored `qr-payment.png` is the correct active receiving QR by scanning it with the bank app before production.
2. Deploy the development branch to a Vercel Preview and test the gift form end-to-end using a small test file.
3. Confirm the new row appears in Supabase `wedding_gifts` and the private file appears in Google Drive `SLIPS 2026`.
4. Inspect the existing Supabase schema and RLS policies before implementing RSVP persistence.
5. Add a dedicated RSVP endpoint and storage table only after confirming the existing schema; never store RSVP data in `wedding_gifts`.

## After gift flow verification
6. Build the public guest-wishes view with moderation controls.
7. Build the Admin Dashboard and secure admin authentication.
8. Test mobile/desktop, validation, upload failures and duplicate submissions.
9. Update deployment documentation and merge to main only after approval.
