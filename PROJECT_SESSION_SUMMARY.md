# 📌 ICICI Bank RM Survey & Analytics Platform — Master Project & Session Summary

> **How to use this file**: Refer to or attach this `PROJECT_SESSION_SUMMARY.md` whenever starting a new AI assistant session. It contains the complete architectural, design, database, and functional state of the project.

---

## 🚀 1. Executive Summary & Tech Stack

* **Project Name**: ICICI Bank Relationship Manager (RM) Feedback & Analytics Engine
* **Repository Branch**: `nextjs-migration`
* **Framework**: Next.js 16 (App Router + Turbopack) + React 19 + TypeScript
* **Database**: Supabase PostgreSQL (REST Client via `@supabase/supabase-js`)
* **Styling**: Tailwind CSS + Lucide Icons + `canvas-confetti`
* **Development Server**: `npm run dev` (running on `http://localhost:3000`)

---

## 🗄️ 2. Database Schema & Architecture

### A. Core Tables
1. **`survey_tokens`**:
   * `id`: UUID (Primary Key)
   * `token`: NanoID string (10 chars, e.g. `/s/NcbMn73E1Z`)
   * `status`: `'pending'` | `'opened'` | `'completed'` | `'expired'`
   * `generated_at`: Timestamp
   * `opened_at`: Timestamp
   * `completed_at`: Timestamp

2. **`survey_responses`**:
   * `id`: UUID (Primary Key)
   * `token_id`: Foreign Key referencing `survey_tokens.id`
   * `response_json`: Full JSON payload containing:
     * `npsScore`: Number (0-10)
     * `q1FollowUpText`: String (Min 20 chars validation rule)
     * `resolutionEase`: `'Very Easy'` | `'Easy'` | `'Difficult'` | `'Very Difficult'`
     * `q2FollowUpText`: String (Min 20 chars validation rule)
     * `aspectRatings`: Object mapping aspect IDs to `'Very Good'` | `'Good'` | `'Poor'` | `'Very Poor'`
     * `q4FeedbackText`: String
   * `submitted_at`: Timestamp

3. **`vw_batch_summary` (SQL View)**:
   * Aggregates survey tokens by generation timestamp (`date_trunc('second', generated_at)`).
   * Calculates total links, pending count, opened count, completed count, and sample tokens per batch run.
   * Defined in [supabase/phase5_batch_summary.sql](file:///e:/self-projects/custom-survey/supabase/phase5_batch_summary.sql).

### B. Utility Scripts
* **Database Reset Command**:
  ```bash
  npm run db:reset
  ```
  Runs `scripts/reset_db.mjs` to clear test rows from `survey_responses` and `survey_tokens` for fresh token testing.

---

## 📱 3. Survey Customer Flow & Formatting Rules

The survey is a 3-screen, mobile-optimized experience available at `/s/[token]`:

### **Screen 1: NPS Rating (`NpsPageOne.tsx`)**
* **NPS Scale (0 to 10)**:
  * Increased font size (`clamp(14px, 4.5vw, 20px)`) and bold weight (`font-black`).
  * 1-line vertical spacing (`<div class="h-2" />`) between question text and scale grid.
* **Inline Follow-up Box**:
  * Character validation message *"Minimum 20 characters needed"* appears in red animation when 1-19 characters are typed.
  * Disappears once 20+ characters are entered, enabling the **Next** button.

### **Screen 2: Customer Effort Score (CES) (`Q2ResolutionPageThree.tsx`)**
* **4 Resolution Ease Pills**: `Very Easy`, `Easy`, `Difficult`, `Very Difficult`.
  * Text wrapping enabled (`whitespace-normal text-center leading-[1.1]`).
  * Increased font size inside (`clamp(11.5px, 3.2vw, 14px) font-black`) while keeping standard button heights (`h-11 sm:h-12`).
* **Conditional Follow-up Box**:
  * Selecting `Difficult` or `Very Difficult` reveals inline feedback text box with the same *"Minimum 20 characters needed"* validation rule.

### **Screen 3: RM Aspect Ratings (`AspectsPageFive.tsx`)**
* **8 Evaluation Touchpoints**: Accessibility, Proactive Contact, Banking Knowledge, Investment Knowledge, Understanding Needs, Resolution Quality, Timeline Delivery, RM Etiquette.
* **Sticky Comparison Grid Header**:
  * Frozen header at top of scroll container (`bg-orange-50 border-b-2 border-orange-200`).
  * Radio button columns allocated to `44px` width (`gridTemplateColumns: '1fr repeat(4, 44px)'`).
  * Header label font size scaled up to **`15px`** (`text-[12px] sm:text-[15px] font-black max-w-[44px]`).
* **Confetti & Finish**: Submitting triggers celebratory confetti and transitions to **Screen 4: Thank You** (`SuccessPageThree.tsx`).

---

## ⚙️ 4. Unified Admin Portals & Navigation

All `/admin/*` routes share a top navigation bar defined in [app/admin/layout.tsx](file:///e:/self-projects/custom-survey/app/admin/layout.tsx):

### **1. Analytics Dashboard (`/admin/analytics`)**
* **Master NPS Score Hero Card**: Displays live NPS (-100 to +100), calculated as `% Promoters - % Detractors`.
* **Sentiment Breakdown Cards**:
  * 🟢 **Promoters (9-10)**
  * 🟡 **Passives (7-8)**
  * 🔴 **Detractors (0-6)**
* **Funnel Performance Metrics**:
  * `Generated Links`, `Opened Links`, `Completed`, `Open Rate (%)`, `Completion Rate (%)`.
* **Self-Explainable Tooltips**:
  * Hovering over any metric card displays a dark popover card explaining how the metric is derived in plain English without raw SQL code or `COUNT(...)` functions.

### **2. Token Generator (`/admin/tokens`)**
* **Batch Controls**: Custom quantity input box + quick preset buttons (`+1`, `+10`, `+100`).
* **Batch Generation History Table**:
  * Columns: `BATCH`, `GENERATED AT`, `LINKS QUANTITY`, `STATUS BREAKDOWN`, `ACTION`.
  * Removed Sample Link column for cleaner look.
  * Standard bold sans-serif font (`font-semibold text-gray-800 text-sm sm:text-base`) for timestamps.
  * Center-aligned top summary cards and `LINKS QUANTITY` column.
  * **Export CSV** button on every batch row.

### **3. Responses Explorer (`/admin/responses`)**
* Displays submitted customer feedback rows with search, NPS badge breakdown, and detailed JSON inspection popovers (`/admin/responses/[id]`).

---

## 🎨 5. Interactive Presentation Deck

* **Standalone Presentation Web App**: [public/presentation.html](file:///e:/self-projects/custom-survey/public/presentation.html)
* **Access URL**: [http://localhost:3000/presentation.html](http://localhost:3000/presentation.html) (or `/workflow.html`)
* **Features**:
  * 6-Slide presentation deck built with Tailwind CSS glassmorphism cards and dark charcoal ICICI Bank aesthetic.
  * Left / Right arrow key navigation.
  * One-click **Print PPT** button to export as a clean PDF for team meetings.

---

## 📜 6. Key Git Branch & Commit History

* **Branch**: `nextjs-migration`
* **Recent Commits**:
  * `b5541bd`: Added vertical spacing between question text and rating options on Screen 2 (`Q2ResolutionPageThree.tsx`).
  * `c535781`: Added `PROJECT_SESSION_SUMMARY.md` master documentation.
  * `872afe1`: Hidden Responses Explorer tab from top admin navigation header.
  * `7eee0ca`: Replaced technical card formulas with plain English explanations and enlarged Page 3 Aspects header font size.
  * `c68dc5a`: Fixed React `className` to HTML `class` attributes in `presentation.html`.
  * `5849f91`: Scaled Page 3 Aspects table header font size to **15px**.
  * `012d0d9`: Added interactive 6-slide presentation deck.

---

## 💡 Quick Tips for Starting a New Session:
1. To start dev server: `npm run dev`
2. To clear test data: `npm run db:reset`
3. To test survey UI: Open [http://localhost:3000/s/testtoken](http://localhost:3000/s/testtoken)
4. To test Admin Portal: Open [http://localhost:3000/admin/analytics](http://localhost:3000/admin/analytics)
5. To view team presentation: Open [http://localhost:3000/presentation.html](http://localhost:3000/presentation.html)
