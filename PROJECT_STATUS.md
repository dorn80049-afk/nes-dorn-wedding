# Project Status

Last updated: 2026-11-08

## Verified in GitHub
- Repository: dorn80049-afk/nes-dorn-wedding; development branch: feat/nd-wedding-foundation.
- Landing page includes invitation, both invitation-card images, schedule, venue and map.
- RSVP and gift endpoints now both forward validated submissions to a shared Google Apps Script endpoint.
- Added `apps-script/Code.gs` to create/initialize RSVP and GIFTS sheets, store RSVP rows, save gift rows, and upload slips to the configured private Drive folder.
- Apps Script authenticates requests using a shared secret stored in Script Properties and Vercel environment variables.
- Gift slip uploads accept JPG, PNG, WEBP and PDF, with a 3 MB limit.

## Not yet configured / tested
- Google Apps Script project has not yet been created/deployed by the owner from `apps-script/Code.gs`.
- Script Properties `API_SECRET`, `SLIPS_FOLDER_ID`, and Vercel variables `GOOGLE_APPS_SCRIPT_URL`, `GOOGLE_APPS_SCRIPT_SECRET` must be configured.
- The Spreadsheet and tabs must be created by running `setupWeddingSheets()`.
- RSVP and gift end-to-end submissions have not yet been tested against the newly deployed Apps Script.
- Vercel Preview deployment has not yet been redeployed with the new environment variables.

## Next
- Follow `SETUP_GOOGLE_SHEETS.md`.
- Test the three RSVP values and one gift upload using non-sensitive test data.
- Verify the Drive slip remains private.
- Add rate limiting / Firewall before sharing the site publicly.
- Confirm the QR receiving account before production.
- Merge to main only after owner approval and successful end-to-end tests.
