# Next Tasks

## Immediate — Google Sheets setup
1. Follow SETUP_GOOGLE_SHEETS.md and create the Apps Script project from apps-script/Code.gs.
2. Set Script Properties API_SECRET and SLIPS_FOLDER_ID.
3. Run setupWeddingSheets() once and keep the resulting spreadsheet private.
4. Deploy Apps Script as Web App (Execute as Me; access Anyone) and copy the /exec URL.
5. Set GOOGLE_APPS_SCRIPT_URL and GOOGLE_APPS_SCRIPT_SECRET in Vercel Preview.
6. Redeploy Preview.

## Verification
7. Test RSVP values attending, not_attending, online_gift using test-only data.
8. Test gift upload with a non-sensitive sample file; confirm a GIFTS row and private Drive file.
9. Confirm failed/invalid submissions do not create rows.
10. Test mobile and desktop forms.

## Security / production
11. Add Vercel Firewall/WAF rate limiting for /api/rsvp and /api/gift.
12. Limit spreadsheet and Drive folder access to authorized hosts only.
13. Confirm payment QR destination with the receiving account owner.
14. Configure Production variables and merge to main only after owner approval and successful tests.
