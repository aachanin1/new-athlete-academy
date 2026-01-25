# CMS NASC - AI Context Handover

> **Last Updated:** 2026-01-25 13:18  
> **Version:** 2.1  
> **Purpose:** ให้ AI เข้าใจ context ทั้งหมดเมื่อเริ่มทำงานที่เครื่องใหม่

---

## 🚀 วิธีใช้ไฟล์นี้ (สำหรับ AI ใหม่)

**Copy ข้อความนี้ไปวางให้ AI ที่เครื่องใหม่:**

```
ผมกำลังพัฒนา CMS NASC ระบบจัดการสโมสรแบดมินตัน กรุณา:
1. อ่านไฟล์ CONTEXT_HANDOVER.md ในโปรเจค
2. อ่านไฟล์ task.md ใน .gemini/antigravity/brain/ folder
3. ดำเนินการต่อจาก Phase ที่ค้างอยู่
```

---

## 🎯 Project Overview

**ระบบ CMS สำหรับ New Athlete Badminton Academy**

| รายการ | รายละเอียด |
|--------|-----------|
| Tech Stack | Next.js 16 + Supabase + TypeScript + Tailwind 4 |
| สาขา | 7 แห่ง (แจ้งวัฒนะ, พระราม 2, รามอินทรา, สุวรรณภูมิ, เทพารักษ์, รัชดา, ราชพฤกษ์) |
| คอร์ส | Kids Group, Adult Group, Private |
| User Types | Parent, Coach, Head Coach, Super User/Admin |

---

## 📋 Current Status (อัปเดตล่าสุด)

| Phase | Status | Description |
|-------|--------|-------------|
| **1** | ✅ Done | Database Schema (23 tables) |
| **1.3** | ⏳ Pending | Run migrations ใน Supabase |
| **1.5** | ⏳ Pending | ปรับ UI เดิมให้รองรับ Schema ใหม่ |
| 2 | 🔲 | User System (Booking Flow) |
| 3 | 🔲 | Coach System |
| 4 | 🔲 | Admin System |
| 5 | 🔲 | Core Features |
| 6 | 🔲 | Notifications & UX |
| 7 | 🔲 | Testing |

---

## 📊 Business Rules (สำคัญ!)

### Pricing - เด็ก (รายเดือน)
| ครั้ง | ราคา | เฉลี่ย |
|------|------|-------|
| 1 | ฿700 | ฿700 |
| 2-6 | ฿2,500 | ฿625 |
| 7-10 | ฿4,000 | ฿500 |
| 11-14 | ฿5,200 | ฿433 |
| 15-18 | ฿6,500 | ฿406 |
| 19+ | ฿7,000 | ฿350 |

### Pricing - ผู้ใหญ่ (ใช้ได้ 10 เดือน!)
- 1 ครั้ง: ฿600
- 10 ครั้ง: ฿5,500 (ใช้ได้ 10 เดือน)
- 16 ครั้ง: ฿8,000 (ใช้ได้ 10 เดือน)

### Pricing - Private
- ชั่วโมงละ: ฿900
- Package 10 ชม.: ฿8,000

### Sibling Pricing (เรทพี่น้อง)
- รวมจำนวนครั้งของลูกทุกคนเพื่อได้ tier ที่ดีกว่า

### Coach OT (เกิน 25 ชม./สัปดาห์)
- กลุ่ม: ฿200/ชม.
- Private: ฿400/ชม.

---

## 📁 Key Files (ไฟล์สำคัญ)

### Database & Types
| File | Purpose |
|------|---------|
| `supabase/migrations/011_complete_schema_redesign.sql` | Schema 23 tables |
| `supabase/migrations/012_schedule_templates.sql` | รอบเรียน 7 สาขา |
| `src/types/database.ts` | TypeScript types |
| `src/lib/pricingUtils.ts` | Pricing + Sibling logic |

### App Structure
| Path | Purpose |
|------|---------|
| `src/app/parent/` | Parent dashboard + enroll |
| `src/app/coach/` | Coach dashboard |
| `src/app/dashboard/` | Admin dashboard |
| `src/lib/data/dashboard.ts` | Data fetching functions |
| `src/lib/auth/actions.ts` | Auth actions |

### Requirements
| File | Purpose |
|------|---------|
| `CMS NASC..md` | Original requirements (Thai) |
| `CONTEXT_HANDOVER.md` | นี่คือไฟล์นี้! |

---

## 🔧 Database Schema (23 Tables)

**Core:**
`users`, `parents`, `students`, `coaches`, `branches`

**Booking & Schedule:**
`schedule_templates`, `sessions`, `enrollments`, `bookings`, `monthly_usage`

**Payment:**
`pricing_tiers`, `payments`, `coupons`, `coupon_usage`

**Tracking:**
`learning_history`, `level_history`, `attendance`

**Admin:**
`activity_logs`, `notifications`, `coach_payroll`, `teaching_programs`

**Relations:**
`branch_coaches`, `courts`, `course_types`

---

## ⚙️ Setup Commands

```bash
# 1. Install
npm install

# 2. Environment (.env.local)
NEXT_PUBLIC_SUPABASE_URL=xxx
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxx

# 3. Run migrations in Supabase SQL Editor:
#    - 011_complete_schema_redesign.sql
#    - 012_schedule_templates.sql

# 4. Run dev
npm run dev
```

---

## 📌 Special Notes

1. **ผู้ใหญ่ต่างจากเด็ก**: 10-16 ครั้งใช้ได้ 10 เดือน (ไม่ใช่รายเดือน)
2. **Learning History**: โค้ชดูว่าสอนใคร, นักเรียนดูว่าเรียนกับใคร
3. **Activity Logs**: Super User only, เก็บ 1 ปี
4. **Head Coach**: จำกัดสาขาเดียว

---

## ✅ What's Done

1. Database schema 23 tables ✅
2. Schedule templates 7 branches ✅
3. TypeScript types ✅
4. Pricing utilities (sibling pricing) ✅
5. Task checklist created ✅

---

## ⏳ Next Steps (ตามลำดับ)

1. **Run migrations** ใน Supabase SQL Editor
2. **Phase 1.5**: ปรับ UI เดิมให้ใช้ schema ใหม่
   - dashboard.ts ใช้ column ใหม่
   - EnrollClient เพิ่ม 3 ประเภทคอร์ส
   - API routes ใช้ tables ใหม่
3. **Phase 2+**: ทำ feature ใหม่ต่อ

---

> **AI Note**: หากต้องการ context เพิ่มเติม อ่าน:
> - `task.md` ใน .gemini folder
> - `implementation_plan.md` ใน .gemini folder
> - `CMS NASC..md` สำหรับ full requirements
