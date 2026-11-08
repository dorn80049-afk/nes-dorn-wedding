// Vercel serverless endpoint for private slip upload + Google Sheets record.
export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }

  try {
    const data = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
    if (!data || typeof data !== "object" || Array.isArray(data)) {
      return res.status(400).json({ success: false, message: "Invalid request body" });
    }

    const full_name = String(data.full_name || "").trim();
    const amount = Number(data.amount);
    const file = data.file || {};
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "application/pdf"];

    if (!full_name || !Number.isFinite(amount) || amount <= 0 ||
        !file.base64 || !allowedTypes.includes(String(file.mimeType || ""))) {
      return res.status(400).json({ success: false, message: "กรุณากรอกข้อมูลและแนบสลิปให้ครบถ้วน" });
    }
    if (full_name.length > 150) {
      return res.status(400).json({ success: false, message: "ข้อมูลมีความยาวเกินกำหนด" });
    }
    if (typeof file.base64 !== "string" || file.base64.length > 4_300_000) {
      return res.status(413).json({ success: false, message: "ไฟล์มีขนาดใหญ่เกินไป กรุณาใช้ไฟล์ไม่เกิน 3 MB" });
    }

    const result = await sendToWeddingSheets({
      action: "gift",
      full_name,
      phone: "",
      amount,
      message: "",
      file: { base64: file.base64, mimeType: String(file.mimeType) }
    });

    if (!result.success) {
      return res.status(502).json({ success: false, message: result.message || "ไม่สามารถบันทึกข้อมูลได้" });
    }
    return res.status(200).json({ success: true, message: "ส่งข้อมูลและหลักฐานเรียบร้อยแล้ว" });
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
