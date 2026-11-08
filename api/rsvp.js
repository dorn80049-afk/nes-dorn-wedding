// Public RSVP endpoint. Uses the Supabase anon key and the existing RLS INSERT policy.
// Never put the service-role key in this endpoint or in browser code.
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

    let guest_count = null;
    let companions = null;
    if (attendance === "attending") {
      guest_count = Number(data.guest_count);
      if (!Number.isInteger(guest_count) || guest_count < 1 || guest_count > 20) {
        return res.status(400).json({ success: false, message: "จำนวนผู้เข้าร่วมต้องอยู่ระหว่าง 1 ถึง 20 คน" });
      }
      companions = companion_names || null;
    }

    const supabaseUrl = process.env.SUPABASE_URL;
    const anonKey = process.env.SUPABASE_ANON_KEY;
    if (!supabaseUrl || !anonKey) {
      return res.status(500).json({ success: false, message: "เซิร์ฟเวอร์ยังไม่ได้ตั้งค่า Supabase" });
    }

    const endpoint = supabaseUrl.replace(/\/$/, "") + "/rest/v1/rsvps";
    const upstream = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "apikey": anonKey,
        "Authorization": "Bearer " + anonKey,
        "Prefer": "return=minimal"
      },
      body: JSON.stringify({
        full_name,
        phone: phone || null,
        attendance,
        guest_count,
        companion_names: companions,
        message: message || null
      })
    });

    if (!upstream.ok) {
      const detail = (await upstream.text()).slice(0, 300);
      return res.status(502).json({ success: false, message: "บันทึก RSVP ไม่สำเร็จ: " + detail });
    }
    return res.status(200).json({ success: true, message: "บันทึกคำตอบเรียบร้อยแล้ว" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message || "เกิดข้อผิดพลาดภายในระบบ" });
  }
}
