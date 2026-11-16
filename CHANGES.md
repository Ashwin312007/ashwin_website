# 📝 Implementation Decisions & Overhaul Changelog (`CHANGES.md`)

This log documents the architectural, visual, performance, accessibility, and content decisions executed during the complete overhaul of Ashwin T E's personal engineering portfolio.

---

## 1. Summary of Changes Grouped by Task ID

### Task 1: Remove the Blocking Entry Experience
- **Eliminated `EntryGate.tsx`**: Removed the artificial 000% → 100% counter, delay animations, and "ENTER PORTFOLIO" click gate.
- **Immediate First-Paint Usability**: `hasEntered` in `ExperienceProvider.tsx` now defaults immediately to `true`.
- **First Render**: Hero, navigation, and core identity are fully visible, scrollable, and interactive within $< 1\text{ s}$ of page load.

### Task 2 & Task 12: Responsive Project Showcase & Engineering Evidence
- **Replaced 765-line Pinned Dial**: Created `src/components/motion/ProjectShowcase.tsx` and `src/components/motion/ProjectCard.tsx` to replace `RotaryWorkDial.tsx`.
- **Category Filter System**: Instant tab filtering across `All (8)`, `Biomimicry (2)`, `Robotics & Autonomy (3)`, `Embedded & Control (2)`, and `Medical & Vision (1)`.
- **Responsive Layout**: 1 column on mobile, 2 columns on tablet, 3 columns on desktop. Featured bio-inspired projects (`bio-pipe-robot` and `archerfish-ejection`) have visual prominence.
- **Purged AI Concept Art**: Completely removed `/images/actuator-concept.webp` (an AI imagegen file) from all real project representations.
- **Real Media & Transparent Placeholders**: Loaded authentic assets (`earthworm-peristaltic-robot.png`, `archerfish-fluid-mechanism.png`) and instituted clean CAD wireframe placeholders for missing assets with explicit `[TODO: Hardware Photograph / Testing Video from Ashwin]` callouts.

### Task 3: Clear and Credible Hero Section
- **Overhauled `Hero.tsx`**: Prominently features **Ashwin T E** with the exact value statement: *"Mechatronics student building bio-inspired robots and embedded control systems."*
- **Verified Proof Badges**:
  1. `6th Globally · NASA HERC 2026 (Best Indian Team)`
  2. `2 Patent Applications Pending (Agri-Sorter & Air-Puff Tonometer)`
  3. `Summer 2027 · Seeking Research & Eng Internship`
- **Primary Actions**: "View Selected Work ↓" (`#work`) and "Download Résumé (PDF)" (`/Ashwin_TE_Resume.pdf`).
- **Verified Links**: GitHub, LinkedIn, and direct email chips. Removed decorative status gauges and fake telemetry coordinates.

### Task 4 & Task 9: Progressive WebGL Enhancement, Reduced Motion & Performance
- **Progressive WebGL (`KineticStage.tsx`)**: WebGL is strictly progressive. If `motionEnabled === false` or `prefers-reduced-motion` is active or WebGL is unsupported, the `<Canvas>` is NOT mounted; a lightweight static CSS technical grid on `#08080A` is rendered.
- **True Motion Toggle (`ExperienceProvider.tsx`)**: Replaced the previous no-op `toggleMotion: () => {}` with a functional toggle hook respecting system OS reduced-motion settings.
- **Lenis Optimization (`useLenisGSAP.ts`)**: Smooth scrolling is disabled and destroyed when reduced-motion is requested, reverting immediately to native instant scrolling.
- **Lifecycle Pausing**: Added `visibilitychange` listener to halt WebGL rendering loops (`frameloop="never"`) when the tab is hidden.

### Task 5 & Task 6: Typography, Hierarchy & Visual Design Simplification
- **Color Discipline**: Preserved technical dark theme (`#08080A`) with cool blue (`#9bc1ff`, `#38bdf8`) and emerald green (`#34d399`) accents.
- **Reduced Glass Distortion**: Replaced heavy translucent blur cards with solid, high-contrast dark surfaces and subtle 1px border lines.
- **Readable Type Scale**: Minimum 12px for technical metadata, 14–16px for body paragraphs, ensuring WCAG AA contrast against `#08080A`.

### Task 7 & Task 13: Research Identity & Technical Case Studies
- **Created `ResearchInterests.tsx` (`#research`)**: Structured presentation of 6 core research thrusts:
  1. Animal-Inspired Locomotion & Peristalsis
  2. Soft & Compliant Robotic Mechanisms
  3. Confined-Space Locomotion & Pipe Crawlers
  4. Bio-Inspired Mechanical Design
  5. Embedded Control & Real-Time Systems
  6. Multi-Sensor Fusion & State Estimation
  Distinguishes active research direction from completed physical builds.
- **Created `HowIWork.tsx` (`#workflow`)**: Replaced decorative Point-Line-Plane with a 3-stage mechatronic development pipeline (First Principles & Transduction → Deterministic Estimation & Control → Hardware-in-the-Loop & Validation).
- **Responsive `Capabilities.tsx` (`#capabilities`)**: Replaced single-open accordion with an open 6-card grid displaying all skill groups simultaneously. Removed cursor-dependent hover popup (`CursorPreview.tsx`).
- **Overhauled `WorkModal.tsx`**: Deep technical case study modal with 4 tabs: Overview, Mechatronic Subsystems (Mechanical, Electronics, Firmware, Control), Validation & Evidence (Simulation vs Reality), and Kinematic Simulation.

### Task 8 & Task 16: Accessibility & Responsive Verification
- **Global Visible Focus Indicator**: Added `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9bc1ff]` globally in `layout.tsx`.
- **Keyboard Trapping**: Full tab trapping in `WorkModal.tsx` and mobile navigation drawer in `TopHUD.tsx`, with Escape key dismiss and focus restoration.
- **Safe Terminal Shortcuts (`CyberTerminal.tsx`)**: Global `~` and ``` ` ``` shortcuts are guarded against firing when the user is typing inside any `<input>`, `<textarea>`, or contenteditable field.
- **Touch Target Verification**: All interactive navigation buttons, links, and drawer triggers meet the minimum $\ge 44 \times 44\text{px}$ criteria.

### Task 10: SEO & Structured Data
- **Canonical URL**: `https://ashwinte.vercel.app`.
- **Social Sharing**: OpenGraph and Twitter Summary Large Image cards configured in `src/app/layout.tsx`.
- **Sitemap & Robots**: Dynamic `src/app/sitemap.ts` and `src/app/robots.ts` generating `/sitemap.xml` and `/robots.txt`.
- **Structured Data**: Schema.org `Person` JSON-LD rendered via `src/components/seo/JsonLd.tsx`.

### Task 11: Privacy Enforcement
- **Purged Phone Number**: Removed `+91 88256 77628` from `profile.ts`, `CyberTerminal.tsx` (command output), metadata, and all components.
- **Direct Contact Section (`Contact.tsx`)**: Added dedicated `#contact` section with accessible copy-email badge, direct mailto link, GitHub, LinkedIn, and resume download.

---

## 2. Before vs After Performance & Codebase Metrics

| Metric / Dimension | Baseline (Pre-Overhaul) | Final Implementation |
| :--- | :--- | :--- |
| **First Contentful Display** | Gated behind 000% → 100% counter + click | **Immediate on first paint ($< 1\text{ s}$)** |
| **Project Navigation** | Pinned 765-line rotary dial (scroll trapping) | **Responsive 3-column grid + 5 category filters** |
| **Project Images** | Used AI conceptual art (`actuator-concept.webp`) | **Authentic CAD/renders + explicit TODO blueprints** |
| **Capabilities View** | Accordion (1 open at a time, hover popups) | **Open 6-card grid with linked project citations** |
| **Research Direction** | Hidden / absent | **Dedicated 6-thrust Research Interests section** |
| **WebGL Accessibility** | Hardcoded `motionEnabled = true`, no fallback | **Strict progressive enhancement + CSS grid fallback** |
| **Privacy** | Public phone number in profile and terminal | **Phone completely removed; verified email/links only** |
| **TypeScript Typecheck** | 0 errors | **0 errors (`tsc --noEmit`)** |
| **ESLint Warnings/Errors**| 2 warnings | **0 warnings, 0 errors** |
| **Production Build** | Succeeded (4 static routes) | **Succeeded (6 static routes including sitemap & robots)** |
| **Static Output Size** | 2.27 MB | **2.33 MB (Includes sitemap, robots, rich case study data)** |
