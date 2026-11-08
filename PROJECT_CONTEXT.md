# ND THE WEDDING — Project Context

## Identity
- Project: ND THE WEDDING
- Groom: นายอุดร ชาตรี (Udorn Chatree)
- Bride: นางสาวดวงมณี ชาตรี (Duangmanee Chatree)
- Wedding date: 5 December 2026 (๕ ธันวาคม ๒๕๖๙)
- Venue: บ้านเลขที่ 14 หมู่ 1 บ้านแต้ ตำบลแต้ อำเภออุทุมพรพิสัย จังหวัดศรีสะเกษ
- Design direction in latest handover: Elegant Luxury / Romantic / Ivory / Champagne / Gold
- Monogram: DN

## Repository
- GitHub: https://github.com/dorn80049-afk/nes-dorn-wedding
- Default branch: main
- Current development branch: feat/nd-wedding-foundation
- Repository is the source of truth for project code and documentation.

## Existing integrations (reported by project owner; not independently re-verified yet)
- Supabase project ID: emlokjzwawjaxhfndded
- Google Drive slip folder: https://drive.google.com/drive/folders/1DYLCFk-tbTv8VGqwL10WfWkwrGtKLUur
- Google Apps Script upload test previously returned success and reference 12N35nmm0-HdTngYfpLMQIoqCqcZF4DLg.
- Do not replace the existing Apps Script upload implementation until its deployed code and request/response contract have been inspected.
- Do not recreate Supabase tables without inspecting the current schema first.

## Required product features
1. Public landing page and invitation cards
2. RSVP: attending / unable to attend / online congratulations
3. Guest wishes and online gift contribution
4. Payment QR and proof-of-transfer upload
5. Store slips in Google Drive
6. Store RSVP/gift records in Supabase
7. Public wishes display
8. Admin dashboard with review/approval and statistics

## Working agreements
- No ZIP handoffs.
- Inspect existing code before changes.
- Preserve working integrations.
- Verify database schema, RLS and policies before migrations.
- Record meaningful changes in CHANGELOG.md and update PROJECT_STATUS.md / NEXT_TASKS.md.
- Do not claim a feature works until it has been tested.
