# Project Status

Last updated: 2026-11-08

## Verified in GitHub
- Repository: dorn80049-afk/nes-dorn-wedding; default branch main.
- Development branch: feat/nd-wedding-foundation.
- Landing page includes invitation cards, schedule, venue and map.
- card1.png and card2.png are present on the development branch.
- Added a Vercel serverless route at api/gift.js to proxy gift/slip submissions to the existing Google Apps Script endpoint.
- Added a gift form to index.html using the Apps Script contract: full_name, phone, amount, message, file.base64 and file.mimeType.
- Browser uploads are limited to 3 MB to remain below the typical Vercel function request-body limit; Apps Script itself accepts up to 5 MB.
- The proxy forwards the request server-side, avoiding browser CORS issues and keeping Supabase service-role credentials out of the browser.
- No Apps Script source, Supabase schema, or RLS policy was changed.

## Reported by project owner; not independently inspected in provider consoles
- Supabase project ID: emlokjzwawjaxhfndded.
- Script Properties are configured for DRIVE_FOLDER_ID, SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.
- Apps Script testSlipUpload previously returned success and saved a test file.
- The Apps Script code supplied by the owner inserts records into wedding_gifts with status=pending and stores the Google Drive file ID in slip_path.

## Pending / not yet verified
- The Apps Script deployment URL is supplied, but a live end-to-end request has not been executed from the deployed Vercel site.
- Recovered the payment QR image from the owner's saved RSVP prototype and added it to the repository as qr-payment.png.
- RSVP persistence is not implemented by the supplied Apps Script code. It requires inspection of existing RSVP table/schema and a separate endpoint; do not write RSVP rows into wedding_gifts.
- Supabase table columns, RLS and policies have not been independently inspected.
- Admin Dashboard, gift review/approval, and end-to-end tests remain outstanding.
- Vercel deployment and production domain have not been verified after this commit.

## Safety / operations
- Never put SUPABASE_SERVICE_ROLE_KEY in frontend files.
- Keep Drive slip files private.
- Do not run destructive SQL or recreate existing tables.
- The frontend caps files at 3 MB for transport reliability; the Apps Script endpoint continues to support up to 5 MB when called directly.
