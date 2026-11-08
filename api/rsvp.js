// Public RSVP endpoint. Google Sheets is the single source of truth.
export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }

  try {
    const data = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
    if (!data || typeof data !== "object" || Array.isArray(data)) {
      return res.status(400).json({ success: false, message: "ข้อมูลที่ส่งมาไม่ถูกต้อง" });
    }

    // Honeypot: silently accept automated form fills without storing them.
    if (String(data.website || "").trim()) {
      return res.status(200).json({ success: true });
    }

    const full_name = String(data.full_name || "").trim();
    const phone = String(data.phone || "").trim();
    const attendance = String(data.attendance || "").trim();
    const companion_names = String(data.companion_names || "").trim();
    const message = String(data.message || "").trim();

    if (!full_name || full_name.length > 150 || phone.length > 30 ||
        companion_names.length > 500 || message.length > 1000) {
      return res.status(400).json({ success: false, message: "กรุณาตรวจสอบชื่อ เบอร์โทร และความยาวของข้อความ" });
    }
    if (!["attending", "not_attending", "online_gift"].includes(attendance)) {
      return res.status(400).json({ success: false, message: "กรุณาเลือกสถานะการเข้าร่วมงานให้ถูกต้อง" });
    }

    let guest_count = "";
    let companions = "";
    if (attendance === "attending") {
      guest_count = Number(data.guest_count);
      if (!Number.isInteger(guest_count) || guest_count < 1 || guest_count > 20) {
        return res.status(400).json({ success: false, message: "จำนวนผู้เข้าร่วมต้องอยู่ระหว่าง 1 ถึง 20 คน" });
      }
      companions = companion_names;
    }

    const result = await sendToWeddingSheets({
      action: "rsvp",
      full_name,
      phone,
      attendance,
      guest_count,
      companion_names: companions,
      message
    });

    if (!result.success) {
      return res.status(502).json({ success: false, message: result.message || "ไม่สามารถบันทึกคำตอบได้" });
    }
    return res.status(200).json({ success: true, message: "บันทึกคำตอบเรียบร้อยแล้ว" });
  } catch (error) {
    return res.status(502).json({ success: false, message: error.message || "ไม่สามารถเชื่อมต่อระบบจัดเก็บข้อมูลได้" });
  }
}

async function sendToWeddingSheets(payload) {
  const url = process.env.GOOGLE_APPS_SCRIPT_URL;
  const secret = process.env.GOOGLE_APPS_SCRIPT_SECRET;
  if (!url || !secret) {
    throw new Error("เซิร์ฟเวอร์ยังไม่ได้ตั้งค่า Google Sheets");
  }
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...payload, secret }),
    redirect: "follow"
  });
  const raw = await response.text();
  let result;
  try { result = JSON.parse(raw); }
  catch (_) { throw new Error("Google Apps Script ส่งผลลัพธ์ไม่ถูกต้อง"); }
  if (!response.ok || !result.success) {
    throw new Error(result.message || "Google Sheets ไม่สามารถบันทึกข้อมูลได้");
  }
  return result;
}
