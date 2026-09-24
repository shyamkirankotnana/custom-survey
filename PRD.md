# Product Requirements Document (PRD)
## Banking Mobile Customer Feedback Survey Application

---

## 1. Executive Summary
The Banking Customer Feedback Survey Application is a production-quality, mobile-first web interface designed for a leading banking institution. It offers a premium, high-trust user experience mirroring top-tier mobile banking apps (e.g., ICICI Bank, HDFC Bank, Axis Bank, Kotak Mahindra Bank, IndusInd Bank).

This document serves as the master Product Requirements Document (PRD) and live specification for the project, tracking implementation workflow, prompt histories, technical choices, and feature roadmaps across all development phases.

---

## 2. Project Scope & Roadmap

### Phase 1: Front-End UI & Experience (Current Focus)
- **Goal:** Deliver a fully interactive, mobile-first survey UI with high visual polish, fluid micro-interactions, responsive horizontal scrolling, and touch-optimized controls.
- **In Scope:**
  - Header welcome card & banking brand framing.
  - NPS Question (0-10 scale in single row with visual sentiment indicators & labels).
  - Single Choice query resolution ease selector (Pill style, horizontal scroll).
  - Open-ended qualitative feedback input with live character counter (500 limit).
  - 8 Multi-aspect Rating Cards (Accessibility, Regularity, Product Knowledge, Investment Knowledge, Financial Needs Understanding, Resolution Quality, Timeline Delivery, RM Etiquette).
  - Final general open-ended feedback card with live character counter (500 limit).
  - Simulated submission completion state / modal / success screen.
  - Device frame switcher for testing 320px, 360px, 375px, 390px (Target), 414px, and desktop viewing.
- **Explicitly Out of Scope (Phase 1):**
  - Authentication, Login, Registration.
  - Backend API integrations, Database (Supabase, PostgreSQL).
  - Unique respondent token validation & backend submission storage.
  - Branching logic & conditional question routing.
  - Admin dashboard & analytics.

### Future Phases (Planned)
- **Phase 2:** Backend integration, response persistence, unique survey link generator, submission validation.
- **Phase 3:** RM performance dashboard, analytics, real-time sentiment analysis, automated alert escalation for low NPS scores.

---

## 3. Technical Architecture & Stack

- **Framework:** React + TypeScript (Vite / Next.js architecture)
- **Styling:** Tailwind CSS + Custom CSS modules for scrollbar hiding and custom touch target states
- **Typography:** Google Font `Mulish` (Weights: 400, 500, 600, 700, 800)
- **Icons:** Lucide React icons for banking security & high-trust indicators
- **State Management:** React `useState` / custom hook for dynamic survey form management

---

## 4. Design System & Brand Guidelines

### 4.1 Color Palette
| Token Name | Hex Code | Purpose / Usage |
| :--- | :--- | :--- |
| **Primary / CTA** | `#059669` | Dark Emerald Green for primary CTAs, active selections, and progress bar |
| **Persuasive Tint** | `#ECFDF5` / `#D1FAE5` | Subtle emerald green background tinting on top rating options |
| **Success** | `#10B981` | Completion badges, high NPS indicators, success notifications |
| **Background** | `#F6F7FB` | Main mobile view background |
| **Card Background** | `#FFFFFF` | Card containers, elevated surfaces |
| **Text Primary** | `#1F2937` | Headings, questions, primary labels |
| **Text Secondary** | `#6B7280` | Subtext, captions, field labels |
| **Border** | `#E5E7EB` | Card dividers, input borders, unselected pill borders |
| **Shadow** | `0 4px 20px -2px rgba(0,0,0,0.05)` | Soft enterprise depth shadows |

### 4.2 Typography & Layout Tokens
- **Font Family:** `'Mulish', sans-serif`
- **Target Mobile Width:** `390px` (Supported: `320px`, `360px`, `375px`, `414px`, Full Responsive)
- **Minimum Touch Target:** `44px` height x `44px` width on all interactive buttons/pills.
- **Option Container Layout:** `display: flex; flex-wrap: nowrap; overflow-x: auto;` with hidden scrollbars.

---

## 5. Detailed Component Specifications

### 5.1 Welcome & Header Card
- **Branding Header:** Bank logo badge, security trust seal ("256-bit Encrypted Feedback"), RM details preview.
- **Title:** Customer Feedback Survey
- **Description:** "Dear Customer, Thank you for banking with us. We value your feedback regarding your recent interaction with your Relationship Manager. Your feedback helps us continuously improve our services and customer experience."

### 5.2 Question 1: Net Promoter Score (NPS)
- **Question Text:** "Based on the recent interaction you had with your Relationship Manager, how likely are you to recommend the Bank to a friend, relative or colleague?"
- **Scale:** `[0] [1] [2] [3] [4] [5] [6] [7] [8] [9] [10]`
- **Layout:** Strictly single horizontal row with equal-width buttons, horizontal scroll if screen < 390px, no wrapping.
- **Visual Sentiment Indicator:** Contextual emojis (😞 0-6 Detractor, 😐 7-8 Passive, 🙂 9-10 Promoter) that dynamically update based on selection.
- **Labels:** Left: "Will not recommend", Right: "Will definitely recommend".

### 5.3 Question 2: Query Resolution Ease (Single Choice)
- **Question Text:** "How easy was it for you to get a resolution from your Bank Relationship Manager for your query or transaction?"
- **Options:** `[Very Easy]` `[Easy]` `[Difficult]` `[Very Difficult]`
- **Layout:** Horizontal pill style row with clear selected highlight state.

### 5.4 Question 2A: Qualitative Resolution Follow-up
- **Question Text:** "What could have made the recent interaction with your Bank Relationship Manager easier? Could you please explain with an example?"
- **Input Type:** Textarea with 500-character cap and live character count badge (`0 / 500 characters`).

### 5.5 Question 3: Aspect-Based RM Ratings (8 Cards)
- **Instruction Header:** "Please rate the Relationship Manager on the below aspects"
- **Design Rule:** No HTML/CSS tables used. Each aspect rendered in an individual card container.
- **Options per Card:** `[Very Good]` `[Good]` `[Poor]` `[Very Poor]` (Single selection per aspect).
- **Cards Detail:**
  1. **Accessibility:** Ability to establish contact with the RM whenever needed.
  2. **Proactive Contact:** Frequency / Regularity of proactively being in touch with you.
  3. **Banking Products Knowledge:** Knowledge about banking related products and services.
  4. **Investment Knowledge:** Knowledge about investment related products and services.
  5. **Understanding Needs:** Ability to understand your financial needs and service requirements.
  6. **Resolution Quality:** Quality of resolution provided.
  7. **Timelines:** Service delivery within committed timelines.
  8. **RM Etiquette:** Politeness, Grooming, Corporate Attire, etc.

### 5.6 General Feedback Section
- **Question Text:** "Please share any additional comments, suggestions, or feedback."
- **Input Type:** Large multiline textarea with 500-character counter.

### 5.7 Submission & Confirmation Flow
- Sticky bottom submit container with progress meter (e.g. "8/8 questions completed").
- Form validation feedback.
- Interactive submission animation leading to a banking Thank You confirmation modal/screen with reference ID preview.

---

## 6. Development Workflow & Change Log

| Phase / Prompt | Date | Description / Work Completed | Status |
| :--- | :--- | :--- | :--- |
| **Initial Prompt** | Sep 24, 2026 | PRD Created. Defined project scope, tech stack (React + TypeScript + Tailwind CSS), design tokens, and components. | Completed |
| **Phase 1 Implementation** | Sep 24, 2026 | Built all Phase 1 mobile UI components. | Completed |
| **Phase 1.1 Experiment (ICICI 2-Page Flow)** | Sep 24, 2026 | Re-engineered UI into a 2-page zero-scroll mobile experience based on ICICI iMobile feedback reference image. Page 1: Q1 NPS 0-10 scale fitting 100% viewport width without horizontal scroll. Page 2: Q3 RM Aspect Ratings with "Finish" button. | Completed |
| **Phase 1.2 Rating Order & Single-Line Formatting** | Sep 24, 2026 | Reversed Q3 aspect rating options to low-to-high order (`[Very Poor] [Poor] [Good] [Very Good]`). Enforced strict single-line text formatting (`whitespace-nowrap`) with responsive font sizing so text never wraps across two lines on any mobile width. | Completed |
| **Phase 1.3 Square Buttons & Proportional Scaling** | Sep 24, 2026 | Updated 0-10 NPS scale buttons to 1:1 aspect ratio (`aspect-square`) with responsive text scaling (`text-[11px]` to `text-base`) to maintain a proportional text-to-box ratio across all screen width dimensions (320px–414px+). | Completed |
| **Phase 1.4 Narrow Mobile Font Fitting (320px–375px)** | Sep 24, 2026 | Micro-tuned card side padding (`p-2.5`), corner radius (`rounded-md`), and breakpoint font sizing (`text-[9px]` on 320px, `text-[10px]` on 360px, `text-xs` on 375px) with `leading-none` so numbers fit inside square boxes with clean margin clearance and 0 border touching. | Completed |
| **Phase 1.5 Node.js Server & Fluid Font Clamp** | Sep 24, 2026 | Added Express Node.js backend server (`server.js`). Applied CSS inline fluid clamp (`clamp(8.5px, 2.7vw, 14px)`) to override browser cache and ensure text never touches square button borders on any screen size. | Completed |
| **Phase 1.6 Full Width Screen Space Utilization** | Sep 24, 2026 | Eliminated wasted outer side margins (`p-1.5`). Expanded white card container to utilize maximum screen width, allowing 0-10 square buttons to scale ~30% larger with comfortable font margins on all mobile viewports. | Completed |
| **Phase 1.7 Mobile Viewports Only in Switcher** | Sep 24, 2026 | Removed "Full Width" option from the device viewport switcher. Focused preview testing strictly on standard mobile device widths (`320px`, `360px`, `375px`, `390px`, `414px`). | Completed |
| **Phase 1.8 Centered Viewport Toolbar & Clean Label** | Sep 24, 2026 | Removed `(Target)` text from the `390px` button label. Center-aligned the device viewport dimension buttons across the top header bar (`justify-center`). | Completed |
| **Phase 1.9 Normal Number Font & Non-Wrapping Switcher** | Sep 24, 2026 | Changed rating numbers font weight to normal (`font-normal`). Applied `flex-nowrap` to the device viewport switcher bar so all 5 dimension buttons fit on a single line on 320px screens with zero wrapping. | Completed |
| **Phase 1.10 Screen Size Label Update** | Sep 24, 2026 | Updated the device viewport bar header text label from `Viewport:` to `Screen Size:`. | Completed |
| **Phase 1.11 2-Line Centered Screen Size Switcher** | Sep 24, 2026 | Formatted switcher bar into 2 centered lines: Top line displaying centered `Screen Size` title, bottom line containing all 5 dimension buttons (`320px`, `360px`, `375px`, `390px`, `414px`) in a strictly non-wrapping row. | Completed |
| **Phase 2.0 Logical Branching, 1 Question/Screen & Progress Bar** | Sep 24, 2026 | Implemented 1 question per screen flow with conditional logic: Q1 → Q1a (0–8) / Q1b (9–10) → Q2 → Q2a (only if Difficult/Very Difficult selected) → Q3 (with removed `0/8 Rated` badge). | Completed |
| **Phase 2.1 Minimalist Top Progress Bar Line** | Sep 24, 2026 | Removed text step labels (`"Step 4 of 4: Aspect Ratings"`). Replaced with a sleek 4px minimalist top progress indicator line directly below the red header for a clean, distraction-free experience. | Completed |
| **Phase 2.2 Black & White Header Theme** | Sep 24, 2026 | Removed solid red header bar background. Transitioned top app header to an enterprise black-and-white theme (`bg-gray-900 text-white`) with associated dark progress bar track (`bg-gray-800`). | Completed |
| **Phase 2.3 Dark Green CTAs, Progress Bar & Subtle Persuasive Tinting** | Sep 24, 2026 | Replaced red accent completely with Dark Emerald Green (`#059669`) for progress bar and CTAs. Applied subtle bad-to-good color grading on unselected rating options (subtle emerald tint on top options: 9–10, Easy/Very Easy, Good/Very Good) to gently persuade respondents toward top ratings. Enforced bad-to-good ordering across all questions. | Completed |
| **Phase 2.4 Removed Success Screen Summary Box** | Sep 24, 2026 | Removed the summary box (Reference ID, NPS Score, Resolution Ease, Aspects Rated) from the thank you confirmation page as requested for a cleaner end state. | Completed |
| **Phase 2.5 Added Q4 Open-End Prompt & Removed Final Page Actions** | Sep 24, 2026 | Added Question 4 (`ASK Q4 TO ALL`: "4. Is there any other feedback related to your Relationship Manager that you want to share?") with disappearing grey placeholder text and character counter. Removed "Test Survey Again" button and hidden back button (`<`) on the final Thank You screen. | Completed |
| **Phase 2.6 Consistent CTA Icons & Clean Text Removal** | Sep 24, 2026 | Standardized all `Next` and `Finish & Submit` buttons to use a consistent `ArrowRight` icon. Removed Q4 badge bubble and `Open End Feedback` remark. Removed footer brand module text and subtext from the final confirmation page. | Completed |
| **Phase 2.7 Fluid Font Clamp Scaling Across All Options** | Sep 24, 2026 | Applied CSS inline fluid clamp scaling (`clamp(7.5px, 2.3vw, 11.5px)`) and optimized card padding across all question option pills (Q1 NPS, Q2 Resolution Ease, Q3 Aspect Ratings) so option text fits with generous margin clearance without touching pill borders on 320px–414px+ mobile viewports. | Completed |
| **Phase 3.0 Next.js App Router Conversion** | Sep 24, 2026 | Converted application to Next.js App Router architecture (`app/layout.tsx`, `app/page.tsx`, `app/globals.css`) with Google Font `Mulish` optimization (`next/font/google`). Maintained 100% UI fidelity, logical branching, fluid typography, dark emerald green CTAs, and responsive device switcher. Built and verified cleanly with Next.js 15. | Completed |

---
*Note: This PRD is continuously updated as new features, prompts, or structural changes are introduced to the project.*
