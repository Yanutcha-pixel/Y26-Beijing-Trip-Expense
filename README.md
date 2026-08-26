# Beijing Trip Expense PWA

ไฟล์นี้เป็น Progressive Web App สำหรับทริป Beijing 22–28 Nov 2026

## ฟังก์ชัน
- Net Expense = ส่วนของ Gift หลังหาร
- Default หาร 1 คน
- Payer: Gift, Pupple, Nutty, KT, Snook
- Add / Edit / Delete expense
- Checkbox "จ่ายคืนแล้ว" เมื่อคนอื่นสำรองจ่าย
- Add / Edit / Delete Category
- Payment Method เริ่มต้น: Cash, Boarding Card, Credit Card
- Add / Edit / Delete Payment Method
- Pie chart ตาม Net Expense
- Local storage: ปิดเว็บแล้วข้อมูลยังอยู่บนเครื่องเดิม
- Optional Excel Online sync ผ่าน Power Automate HTTP endpoint

## วิธีใช้เป็น App บน iPhone / Android
ต้องนำโฟลเดอร์นี้ขึ้นเว็บ HTTPS ก่อน (เช่น GitHub Pages, Netlify, Vercel หรือ hosting อื่น)

iPhone:
1. เปิด URL ด้วย Safari
2. Share
3. Add to Home Screen
4. กด Add

Android:
1. เปิด URL ด้วย Chrome
2. เมนู ⋮
3. Add to Home screen / Install app

## การเชื่อม Excel Online
HTML ไม่ควรใส่ Microsoft username/password หรือ Graph token ถาวรไว้ในไฟล์
แนะนำ Power Automate:
1. สร้าง Excel workbook ใน OneDrive/SharePoint
2. สร้าง Table ชื่อ `Expenses`
3. Columns แนะนำ:
   id, date, detail, category, currency, amount, fx, split, payer, payment,
   totalTHB, totalCNY, myTHB, myCNY, repaid, updatedAt
4. สร้าง Cloud Flow ที่รับ HTTP POST
5. Parse JSON จาก body.expenses
6. Apply to each
7. Add/Update row ใน Excel Online
8. Copy HTTP URL ไปใส่ในหน้า Excel Online Sync ของแอป

หมายเหตุ: ถ้าต้องการ sync แบบสองทางและแก้ข้อมูลจาก Excel แล้วสะท้อนกลับเข้าแอป ควรใช้ backend/Graph API ที่มี authentication แทน Power Automate แบบ POST อย่างเดียว
