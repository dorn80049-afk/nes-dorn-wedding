# Project Status

Last updated: 2026-11-08

## Verified in GitHub during this work
- Repository is accessible: dorn80049-afk/nes-dorn-wedding.
- Default branch: main.
- Development branch created: feat/nd-wedding-foundation.
- Existing files observed: index.html, gemini-code-1794066337883.html, README.txt, logo.png, card1.jpg, card2.jpg, 25691024_121114_658.MP4.
- Existing index.html contained placeholder date/time/venue copy and an RSVP link that did not submit data.
- card1.jpg and card2.jpg each contain only a newline (base64 payload DQo=); they are not valid image files.
- No database or Apps Script source was found in the root file listing inspected so far.

## Reported by project owner; pending independent verification
- Supabase project ID: emlokjzwawjaxhfndded.
- wedding_admins table already exists; a prior CREATE TABLE attempt returned 42P07.
- Google Apps Script upload test succeeded and saved a test slip to Drive.
- Supabase RSVP/gift persistence is not confirmed by that Apps Script test.

## Not yet verified
- Supabase tables, columns, relationships, RLS and policies.
- Apps Script deployed source, deployment URL, Drive upload implementation and Supabase write path.
- Vercel project configuration and production deployment.
- End-to-end RSVP, slip upload, moderation and Admin Dashboard.
- Payment QR asset and actual Google Forms / RSVP endpoint.
- Actual invitation card image assets (card1.jpg and card2.jpg are invalid).

## Important content note
The supplied invitation schedule shows 08:09, 09:09, 10:09 and 11:00. A separate handover summary says the event begins at 09:00. Confirm the intended guest arrival/start time before publishing a single overall start time. The current landing page displays the four supplied schedule entries and does not claim a separate start time.
