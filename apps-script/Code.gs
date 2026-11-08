/**
 * ND THE WEDDING — Google Sheets + private Google Drive slip storage
 *
 * Deploy as a Web App:
 *   Execute as: Me
 *   Who has access: Anyone
 *
 * Before deployment, run setupWeddingSheets() once from the Apps Script editor.
 * Then set Script Properties:
 *   API_SECRET       = the same long random secret as Vercel GOOGLE_APPS_SCRIPT_SECRET
 *   SLIPS_FOLDER_ID  = Google Drive folder ID for private slip files (optional until gifts are enabled)
 *
 * Vercel environment variable:
 *   GOOGLE_APPS_SCRIPT_URL = deployed Web App URL ending in /exec
 *   GOOGLE_APPS_SCRIPT_SECRET = same secret as API_SECRET
 */

const PROP = PropertiesService.getScriptProperties();
const RSVP_HEADERS = [
  "Timestamp", "Full name", "Phone", "Attendance",
  "Guest count", "Companion names", "Message"
];
const GIFT_HEADERS = [
  "Timestamp", "Full name", "Phone", "Amount (THB)",
  "Message", "Slip file name", "Slip file ID", "Slip MIME type", "Slip size (bytes)"
];

function setupWeddingSheets() {
  let spreadsheetId = PROP.getProperty("SPREADSHEET_ID");
  let spreadsheet;
  if (spreadsheetId) {
    spreadsheet = SpreadsheetApp.openById(spreadsheetId);
  } else {
    spreadsheet = SpreadsheetApp.create("ND THE WEDDING — Guest & Gift Records");
    spreadsheetId = spreadsheet.getId();
    PROP.setProperty("SPREADSHEET_ID", spreadsheetId);
  }

  ensureSheet_(spreadsheet, "RSVP", RSVP_HEADERS);
  ensureSheet_(spreadsheet, "GIFTS", GIFT_HEADERS);
  Logger.log("ND THE WEDDING spreadsheet: " + spreadsheet.getUrl());
  return spreadsheet.getUrl();
}

function doPost(e) {
  try {
    const body = JSON.parse((e && e.postData && e.postData.contents) || "{}");
    const expectedSecret = PROP.getProperty("API_SECRET");
    if (!expectedSecret || !body.secret || !constantTimeEquals_(String(body.secret), expectedSecret)) {
      return json_({ success: false, message: "Unauthorized" });
    }

    const lock = LockService.getScriptLock();
    lock.waitLock(20000);
    try {
      const spreadsheetId = PROP.getProperty("SPREADSHEET_ID");
      if (!spreadsheetId) throw new Error("ยังไม่ได้ตั้งค่า Google Sheets ให้เรียก setupWeddingSheets() ก่อน");
      const spreadsheet = SpreadsheetApp.openById(spreadsheetId);

      if (body.action === "rsvp") return saveRsvp_(spreadsheet, body);
      if (body.action === "gift") return saveGift_(spreadsheet, body);
      return json_({ success: false, message: "Unknown action" });
    } finally {
      lock.releaseLock();
    }
  } catch (err) {
    return json_({ success: false, message: err && err.message ? err.message : "Internal error" });
  }
}

function saveRsvp_(spreadsheet, body) {
  const name = cleanText_(body.full_name, 150);
  const phone = cleanText_(body.phone, 30);
  const attendance = String(body.attendance || "");
  const companions = cleanText_(body.companion_names, 500);
  const message = cleanText_(body.message, 1000);
  if (!name || !["attending", "not_attending", "online_gift"].includes(attendance)) {
    return json_({ success: false, message: "ข้อมูล RSVP ไม่ถูกต้อง" });
  }

  let guestCount = "";
  if (attendance === "attending") {
    guestCount = Number(body.guest_count);
    if (!Number.isInteger(guestCount) || guestCount < 1 || guestCount > 20) {
      return json_({ success: false, message: "จำนวนผู้เข้าร่วมไม่ถูกต้อง" });
    }
  }

  const sheet = spreadsheet.getSheetByName("RSVP");
  if (!sheet) throw new Error("ไม่พบชีต RSVP กรุณารัน setupWeddingSheets()");
  sheet.appendRow([
    new Date(), safeCell_(name), safeCell_(phone), attendance,
    guestCount, safeCell_(companions), safeCell_(message)
  ]);
  return json_({ success: true });
}

function saveGift_(spreadsheet, body) {
  const name = cleanText_(body.full_name, 150);
  const phone = cleanText_(body.phone, 30);
  const amount = Number(body.amount);
  const message = cleanText_(body.message, 1000);
  const file = body.file || {};
  const mimeType = String(file.mimeType || "");
  const allowed = ["image/jpeg", "image/png", "image/webp", "application/pdf"];

  if (!name || !Number.isFinite(amount) || amount <= 0 ||
      !file.base64 || !allowed.includes(mimeType)) {
    return json_({ success: false, message: "ข้อมูลของขวัญหรือไฟล์สลิปไม่ถูกต้อง" });
  }

  const bytes = Utilities.base64Decode(String(file.base64));
  if (!bytes.length || bytes.length > 3 * 1024 * 1024) {
    return json_({ success: false, message: "ไฟล์ต้องมีขนาดไม่เกิน 3 MB" });
  }

  const folderId = PROP.getProperty("SLIPS_FOLDER_ID");
  if (!folderId) throw new Error("ยังไม่ได้ตั้งค่า SLIPS_FOLDER_ID ใน Script Properties");
  const folder = DriveApp.getFolderById(folderId);
  const extension = extensionFor_(mimeType);
  const timestamp = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "yyyyMMdd-HHmmss");
  const safeName = name.replace(/[^\p{L}\p{N}_-]+/gu, "_").slice(0, 50) || "guest";
  const fileName = "ND-slip-" + timestamp + "-" + safeName + "." + extension;
  const blob = Utilities.newBlob(bytes, mimeType, fileName);
  const driveFile = folder.createFile(blob); // Remains private; no public sharing is enabled.

  const sheet = spreadsheet.getSheetByName("GIFTS");
  if (!sheet) throw new Error("ไม่พบชีต GIFTS กรุณารัน setupWeddingSheets()");
  sheet.appendRow([
    new Date(), safeCell_(name), safeCell_(phone), amount,
    safeCell_(message), fileName, driveFile.getId(), mimeType, bytes.length
  ]);
  return json_({ success: true });
}

function ensureSheet_(spreadsheet, name, headers) {
  let sheet = spreadsheet.getSheetByName(name);
  if (!sheet) sheet = spreadsheet.insertSheet(name);
  if (sheet.getLastRow() === 0) {
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    sheet.setFrozenRows(1);
    sheet.getRange(1, 1, 1, headers.length).setFontWeight("bold");
  }
}

function cleanText_(value, maxLength) {
  return String(value == null ? "" : value).trim().slice(0, maxLength);
}

function safeCell_(value) {
  const text = String(value == null ? "" : value);
  return /^[=+\-@\t\r]/.test(text) ? "'" + text : text;
}

function extensionFor_(mimeType) {
  return {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
    "application/pdf": "pdf"
  }[mimeType] || "bin";
}

function constantTimeEquals_(a, b) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

function json_(value) {
  return ContentService.createTextOutput(JSON.stringify(value))
    .setMimeType(ContentService.MimeType.JSON);
}
