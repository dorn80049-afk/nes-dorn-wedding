# Changelog

## 2026-11-08 — Landing page foundation and handover docs
- Connected to the existing GitHub repository and inspected the current root files.
- Confirmed the original index page had placeholder event details and a non-functional RSVP destination.
- Confirmed card1.jpg and card2.jpg are invalid 2-byte newline files, not usable images.
- Created development branch feat/nd-wedding-foundation from main.
- Replaced index.html on the feature branch with an ivory, champagne and gold ND monogram landing page.
- Added couple names, family invitation details, the four schedule entries, venue address and Google Maps coordinates/map embed.
- Added graceful fallback messages for missing card images.
- Added PROJECT_CONTEXT.md, PROJECT_STATUS.md, DATABASE.md, CHANGELOG.md and NEXT_TASKS.md.
- No Supabase schema or Google Apps Script code was modified.
- Changes remain on the feature branch pending review; not merged to main.
\n## 2026-11-08 — Gift/slip integration\n- Added a same-origin Vercel serverless proxy (`api/gift.js`) forwarding validated gift submissions to the existing Apps Script Web App.\n- Added a responsive online gift form to `index.html` with name, phone, amount, message and slip attachment.\n- Limited browser uploads to 3 MB to fit serverless request constraints.\n- Kept QR image as a named asset placeholder (`qr-payment.png`) because no payment QR file is currently present in the repository.\n- Did not modify Apps Script, Supabase schema, or policies. RSVP persistence remains pending because the supplied Apps Script only writes `wedding_gifts`.\n