# ตั้งค่าระบบ Google Sheets — ND THE WEDDING

คู่มือนี้ใช้กับ branch `feat/nd-wedding-foundation` หลังจากนำโค้ดขึ้น Vercel แล้ว

## ภาพรวม

- `RSVP`: บันทึกการตอบรับเข้าร่วมงาน
- `GIFTS`: บันทึกชื่อ เบอร์โทร จำนวนเงิน ข้อความ และรหัสไฟล์สลิป
- ไฟล์สลิปถูกเก็บใน Google Drive แบบ private ไม่เปิด public sharing
- Vercel API เป็นตัวกลาง ไม่ส่ง secret ไปยัง browser

## ขั้นตอนที่ 1 — สร้าง Google Apps Script

1. เปิด https://script.google.com/ ด้วยบัญชี Google ที่จะเป็นเจ้าของข้อมูล
2. สร้างโปรเจกต์ใหม่ ตั้งชื่อ `ND THE WEDDING — Sheets API`
3. เปิดไฟล์ `apps-script/Code.gs` ใน GitHub branch นี้ แล้วคัดลอกทั้งหมดไปวางในไฟล์ `Code.gs` ของ Apps Script
4. ที่เมนู Project Settings → Script Properties เพิ่มค่า:
   - `API_SECRET`: สร้างรหัสลับแบบสุ่มยาวอย่างน้อย 32 ตัวอักษร เก็บไว้ใช้ทั้ง Apps Script และ Vercel
   - `SLIPS_FOLDER_ID`: `1DYLCFk-tbTv8VGqwL10WfWkwrGtKLUur`
5. กด Save
6. เลือกฟังก์ชัน `setupWeddingSheets` แล้วกด Run อนุญาตสิทธิ์ Google Sheets และ Drive
7. เปิด Execution log แล้วคัดลอก URL ของ Spreadsheet ที่สร้างขึ้น เก็บไว้เป็นลิงก์ส่วนตัวของเจ้าภาพ

## ขั้นตอนที่ 2 — Deploy Apps Script เป็น Web App

1. กด Deploy → New deployment
2. เลือกประเภท Web app
3. Execute as: Me
4. Who has access: Anyone
5. กด Deploy และอนุญาตสิทธิ์เมื่อระบบร้องขอ
6. คัดลอก Web app URL ที่ลงท้ายด้วย `/exec`

อย่าแชร์ URL ของ Web App พร้อมรหัสลับในที่สาธารณะ

## ขั้นตอนที่ 3 — ตั้งค่า Vercel

เปิด Vercel Project → Settings → Environment Variables แล้วเพิ่ม:

| Name | Value |
|---|---|
| `GOOGLE_APPS_SCRIPT_URL` | URL Web App ที่ลงท้ายด้วย `/exec` |
| `GOOGLE_APPS_SCRIPT_SECRET` | ค่าเดียวกับ Script Property `API_SECRET` |

ตั้งค่าใน Preview ก่อน จากนั้น Redeploy Preview deployment ของ branch นี้

เมื่อทดสอบผ่านแล้ว จึงค่อยตั้งค่าใน Production และ deploy branch production ตามที่เจ้าของอนุมัติ

## ขั้นตอนที่ 4 — ทดสอบก่อนเปิดใช้งานจริง

1. ส่ง RSVP แบบ `attending` และตรวจแถวใหม่ในชีต RSVP
2. ส่ง RSVP แบบ `not_attending` และตรวจแถวใหม่
3. ส่ง RSVP แบบ `online_gift` และตรวจแถวใหม่
4. ทดสอบส่งของขวัญด้วยไฟล์ทดสอบที่ไม่ใช่หลักฐานเงินจริง ตรวจแถวใน GIFTS และไฟล์ในโฟลเดอร์ Drive
5. ตรวจว่าไฟล์ใน Drive ไม่ได้เปิด public sharing
6. ทดสอบเมื่อใส่ข้อมูลไม่ครบและเมื่อไฟล์ใหญ่เกิน 3 MB

## ข้อควรระวัง

- ห้ามใส่ API_SECRET ใน index.html หรือไฟล์ JavaScript ฝั่ง browser
- จำกัดสิทธิ์ Spreadsheet และโฟลเดอร์ Drive ให้เฉพาะเจ้าภาพ/ผู้ดูแลที่จำเป็น
- อย่าใช้ข้อมูลแขกจริงในการทดสอบ
- ก่อนเปิด public ให้เปิด rate limiting / Firewall สำหรับ `/api/rsvp` และ `/api/gift`
- Apps Script Web App แบบ Anyone จำเป็นต่อการเรียกจาก Vercel แต่การตรวจ secret จะป้องกันการเรียก API โดยตรงที่ไม่มีรหัส
- การแก้ไข Apps Script ต้อง Deploy version ใหม่ ไม่ใช่แค่กด Save
