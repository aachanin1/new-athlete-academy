# Project Context & Handover Summary
**Date:** 2026-01-23 (Updated: 16:24)

This file contains the "brain" and context of the project up to this point. Use this to initialize the AI on a new machine.

## How to use this file
1. **Copy** this `CONTEXT_HANDOVER.md` file along with your project code to the new machine.
2. **Open** the project in your IDE/Agent.
3. **Prompt** the AI with:
   > "I am moving this project to a new machine. Please read `CONTEXT_HANDOVER.md` to understand the current status, plan, and recent changes. Re-initialize your memory with this context and continue the task."

---

## 1. Project Overview

**New Athlete Badminton Academy** - ระบบจัดการสโมสรแบดมินตัน

### Tech Stack
- **Framework**: Next.js 16.1.4 (App Router)
- **Database**: Supabase (PostgreSQL + Auth)
- **Styling**: Tailwind CSS 4
- **Language**: TypeScript

### Key Features
- 🔐 Authentication (Login/Register/Logout with Supabase Auth)
- 👨‍👧 Multi-role Dashboard (Admin, Coach, Parent)
- 🧒 Course Type System (Kids/Adults/Family)
- 📅 Session Booking System
- 💰 Pricing Tiers per Course Type

---

## 2. Current Task Status

### ✅ Completed Today (2026-01-23)
1. **System Testing** - Fixed build error in `FamilyEnrollClient.tsx` (missing `branches` prop)
2. **Logout Function** - Connected logout buttons to `signOut` server action
3. **Logout Alert** - Added success alert "ออกจากระบบเรียบร้อยแล้ว" on homepage

### 🔄 In Progress
- Course Type System Implementation (partially complete)

### 📋 Pending Tasks
- [ ] Complete booking flow (save to database)
- [ ] Run migration `007_add_course_types.sql` in Supabase
- [ ] Test full registration → booking flow

---

## 3. Recent Changes

### Files Modified Today

#### `src/lib/auth/actions.ts`
- `signOut()` now redirects to `/?logged_out=true` for showing alert

#### `src/components/DashboardLayout.tsx`
- Added `import { signOut } from "@/lib/auth/actions"`
- Wrapped logout buttons in `<form action={signOut}>` (both mobile & desktop sidebar)

#### `src/components/LogoutAlert.tsx` (NEW)
- Client component showing success alert when `logged_out=true` in URL
- Auto-dismisses after 4 seconds
- Animated slide-down effect

#### `src/app/page.tsx`
- Added `<LogoutAlert />` wrapped in `<Suspense>`

#### `src/app/parent/enroll/family/FamilyEnrollClient.tsx`
- Fixed: Added missing `branches` prop to `<AddChildForm />`

---

## 4. Key File Locations

### Authentication
- `src/lib/auth/actions.ts` - Server actions (signUp, signIn, signOut)
- `src/lib/supabase/server.ts` - Supabase server client
- `src/lib/supabase/client.ts` - Supabase browser client

### Layouts
- `src/components/DashboardLayout.tsx` - Shared layout for Admin/Coach/Parent

### Registration Flow
- `src/app/parent/enroll/page.tsx` - Course type selection
- `src/app/parent/enroll/adult/` - Adult self-enrollment
- `src/app/parent/enroll/family/` - Family enrollment
- `src/app/parent/children/add/` - Add child form

### API Routes
- `src/app/api/parent/sessions/route.ts` - Get sessions by courseType
- `src/app/api/parent/book/route.ts` - Book a session
- `src/app/api/parent/enroll-adult/route.ts` - Adult enrollment

---

## 5. Database Schema

### Key Tables
- `users` - User profiles with role (admin, coach, parent)
- `parents` - Parent records linked to users
- `students` - Children or adult students
- `sessions` - Class sessions with course_type
- `enrollments` - Student enrollments
- `attendance` - Booking records
- `branches` - Academy branches
- `pricing_tiers` - Pricing per course type

### Pending Migration
> ⚠️ Run `supabase/migrations/007_add_course_types.sql` in Supabase SQL Editor

---

## 6. Environment Variables

Required in `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

---

## 7. Commands

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Lint
npm run lint
```

---

## 8. Next Steps (Priority Order)

1. **Run Migration** - Execute `007_add_course_types.sql` in Supabase
2. **Complete Booking Flow** - Connect session booking to database
3. **Test Full Flow** - Register → Add child → Book session → Payment

---

## 9. Known Issues

| Issue | Status | Notes |
|-------|--------|-------|
| Adult pricing placeholder | ⚠️ | Using ฿800 single, ฿3000 Course 4 (need real prices) |
| Family mode summary | ❌ | Not fully implemented |
| Payment integration | ❌ | Not started |

---

## 10. Test Accounts

For testing, you can create accounts via `/register` or use existing:
- Login at `/login`
- Admin dashboard: `/dashboard`
- Coach dashboard: `/coach`
- Parent dashboard: `/parent`
