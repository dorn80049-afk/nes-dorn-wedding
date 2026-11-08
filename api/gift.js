// Vercel serverless proxy for the existing ND THE WEDDING Apps Script.
// Keeps the browser request same-origin and avoids exposing Supabase credentials.
const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbza6k2TVgItHTcjksITh4zj1Nre6c6annYUqtnq4sMIIenQPNqG0-yHP8dGYqGl1EaFLQ/exec";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }

  try {
    const data = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
    if (!data || typeof data !== "object") {
      return res.status(400).json({ success: false, message: "Invalid request body" });
    }
    const fullName = String(data.full_name || "").trim();
    const phone = String(data.phone || "").trim();
    const amount = Number(data.amount);
    const message = String(data.message || "").trim();
    const file = data.file || {};

    if (!fullName || !phone || !Number.isFinite(amount) || amount <= 0 ||
        !file.base64 || !file.mimeType) {
      return res.status(400).json({ success: false, message: "กรุณากรอกข้อมูลและแนบสลิปให้ครบถ้วน" });
    }
    if (fullName.length > 150 || phone.length > 30 || message.length > 1000) {
      return res.status(400).json({ success: false, message: "ข้อมูลมีความยาวเกินกำหนด" });
    }
    if (typeof file.base64 !== "string" || file.base64.length > 4_300_000) {
      return res.status(413).json({ success: false, message: "ไฟล์มีขนาดใหญ่เกินไป กรุณาใช้ไฟล์ไม่เกิน 3 MB" });
    }

    const upstream = await fetch(APPS_SCRIPT_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        full_name: fullName,
        phone,
        amount,
        message,
        file: { base64: file.base64, mimeType: String(file.mimeType) }
      }),
      redirect: "follow"
    });

    const raw = await upstream.text();
    let result;
    try { result = JSON.parse(raw); }
    catch (_) { throw new Error("Apps Script ส่งผลลัพธ์ที่ไม่ใช่ JSON กลับมา"); }

    if (!upstream.ok || !result.success) {
      return res.status(502).json({
        success: false,
        message: result.message || "Apps Script ไม่สามารถบันทึกข้อมูลได้"
      });
    }
    return res.status(200).json(result);
  } catch (error) {
    return res.status(502).json({
      success: false,
      message: error.message || "ไม่สามารถเชื่อมต่อบริการอัปโหลดได้"
    });
  }
}
