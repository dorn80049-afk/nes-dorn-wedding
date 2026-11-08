# Next Tasks

## Priority 1 — Restore real media assets
- Obtain the original Card 1 and Card 2 image files individually and replace the invalid card1.jpg / card2.jpg.
- Verify logo.png is the intended DN/ND monogram and confirm the final brand mark.
- Obtain the payment QR image and store it under a stable repository path only after confirming it is the intended receiving account QR.

## Priority 2 — Verify integrations
- Locate and inspect the deployed Google Apps Script source and deployment URL.
- Confirm Drive upload folder ID and file naming/reference behavior.
- Inspect whether Apps Script writes RSVP/gift data to Supabase.
- Inspect Supabase live schema, RLS and policies before changing anything.
- Locate Vercel project settings and confirm production deployment tracks the intended branch.

## Priority 3 — Complete public flows
- Build the RSVP and online congratulations form with choices: attending, unable to attend, online congratulations.
- Collect guest name, phone and wishes.
- Add QR payment display and slip upload through the already-tested Apps Script flow.
- Add clear success/error feedback and duplicate-submission handling.

## Priority 4 — Admin and public wishes
- Build authenticated Admin Dashboard using existing admin records and safe server-side access.
- Review/approve slips and moderate public wishes.
- Add summary statistics and export only after access controls are verified.

## Priority 5 — End-to-end QA
- Test mobile and desktop layouts.
- Test RSVP persistence, slip upload to Drive, Supabase writes, admin approval and public wishes.
- Verify no secrets are exposed in client-side assets.
- Verify Vercel production after merging reviewed changes.
