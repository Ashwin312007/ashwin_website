# ⚡ Ashwin T E — Mechatronics & Bio-Inspired Robotics Portfolio

<div align="center">

  ![Next.js](https://img.shields.io/badge/Next.js-16.2.4-black?style=for-the-badge&logo=next.js&logoColor=white)
  ![React](https://img.shields.io/badge/React-19.2.4-61DAFB?style=for-the-badge&logo=react&logoColor=black)
  ![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
  ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.2-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
  ![Framer Motion](https://img.shields.io/badge/Framer_Motion-12.38-0055FF?style=for-the-badge&logo=framer&logoColor=white)
  ![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

  <br />

  **Official personal engineering portfolio & research showcase for Ashwin T E**  
  *Mechatronics & Automation Undergraduate @ VIT Chennai (Class of 2028)*  
  *Bio-Inspired Robotics · Animal-Inspired Locomotion · Embedded Control Systems · State Estimation*

  <br />

  [🌐 Live Website](https://ashwinte.vercel.app/) · [📫 Contact Ashwin](mailto:teashwin3@gmail.com) · [💼 LinkedIn Profile](https://www.linkedin.com/in/ashwin-t-e-410655240) · [🐙 GitHub](https://github.com/Ashwin312007)

</div>

---

## 📌 Professional Identity & Value Statement

> **"Mechatronics student building bio-inspired robots and embedded control systems."**

This portfolio is engineered specifically for **robotics R&D recruiters, research professors, and graduate admissions reviewers**. It prioritizes **real engineering proof, design decisions, and physical constraints** over decorative interface animations.

### 🌟 Verified Credentials & Highlights
- **NASA Human Exploration Rover Challenge (HERC) 2026**: **6th Place Globally (RC Division)**, **Best Indian Team**, **7:02 Fastest Course Run**. Designed custom 4-layer 2oz copper Power Distribution Board (PDB) and performed structural FEA on rocker-bogie load paths.
- **2 Patent Applications Pending**:
  1. *Agri-Sorter*: Automated fruit-quality sorting combining 850nm NIR vision, 24-bit delta-sigma load-cell weighing, and mechatronic sizing (Institutional IPR Cell).
  2. *Portable Air-Puff Tonometer*: Non-contact intraocular pressure measurement using calibrated micro-pneumatic solenoid pulses and piezoresistive sensing (Institutional IPR Cell).
- **Leadership & Teaching**:
  - Secretary & Engineering Lead @ **AutoVIT Robotics Club** (VIT Chennai).
  - Designer & Instructor @ **AutoVIT ROS 2 Workshop** (ros2_control, URDF/Xacro, live teleoperation).
- **Industrial Internships**:
  - **Salcomp Manufacturing**: CAD modeling, DFM, and VMC shop-floor tooling.
  - **MEL Systems and Services**: Pick2Lite industrial hardware/IoT product; embedded C/C++ (STM32/ESP-IDF) and RS-485 architecture.

---

## 🚀 Key Engineering Sections

1. **Immediate Hero & Proof**:
   - Above-the-fold value proposition, verified proof badges, and instant CTAs ("View Selected Work" and "Download Résumé").
   - Zero blocking countdowns or artificial entry screens.
2. **Dedicated Research Interests (`#research`)**:
   - Focus on animal-inspired locomotion (peristaltic crawlers, variable-aperture jet propulsion), soft/compliant mechanisms, and real-time state estimation.
   - Explicitly distinguishes theoretical/simulation inquiries from completed physical builds.
3. **Responsive Project Showcase (`#work`)**:
   - Scannable responsive grid (1 col mobile, 2 col tablet, 3 col desktop) with instant category filters (*All, Biomimicry, Robotics & Autonomy, Embedded & Control, Medical & Vision*).
   - Prominent featured hierarchy for bio-inspired robotics projects.
   - Deep technical case study modal with 4 structured tabs (*Overview, Mechatronic Subsystems, Validation & Evidence, Kinematic Simulation*).
   - Zero generic AI concept art; authentic CAD renders and explicit `[TODO: Asset]` wireframe placeholders.
4. **How I Work (`#workflow`)**:
   - 3-stage development pipeline: *First Principles & Physical Transduction* → *Deterministic Estimation & Control Laws* → *Hardware-in-the-Loop & Validation*.
5. **Technical Capabilities (`#capabilities`)**:
   - 6 open capability domain cards with toolchains, deep descriptions, and direct citations to applied projects.
6. **Progressive WebGL & Accessibility**:
   - Strictly respects `prefers-reduced-motion`.
   - WebGL `<Canvas>` unmounts when motion is disabled or WebGL is unsupported, falling back to a static CSS technical grid.
   - Pauses rendering loops when the browser tab is hidden.
   - Full keyboard navigation, visible focus indicators, and accessible dialogs (WCAG 2.2 AA).
7. **CyberTerminal (`~` or `` ` ``)**:
   - Interactive CLI providing instant access to bio, project summaries, and verified contact channels without privacy leaks.

---

## 🛠️ Technology Stack

- **Framework**: [Next.js 16 (App Router)](https://nextjs.org/)
- **Core Library**: [React 19](https://react.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/) (Strict typing, 0 type errors)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Motion & Interactions**: [Framer Motion v12](https://www.framer.com/motion/) & [GSAP](https://gsap.com/)
- **Smooth Scroll**: [Lenis](https://lenis.darkroom.engineering/) (disabled under reduced-motion)
- **3D Graphics**: [Three.js](https://threejs.org/) & [React Three Fiber](https://r3f.docs.pmnd.rs/) (Progressive Enhancement)
- **Icons**: [Lucide React](https://lucide.dev/)

---

## 📁 Repository Structure

```
ashwin_website/
├── public/
│   ├── images/                 # General images & concept notes
│   ├── projects/               # Authentic CAD renders & diagrams
│   └── Ashwin_TE_Resume.pdf    # Verified technical résumé
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Root layout, OpenGraph, JSON-LD schema
│   │   ├── page.tsx            # Composition: Hero, Research, Projects, Capabilities, Contact
│   │   ├── robots.ts           # Dynamic robots.txt generator
│   │   ├── sitemap.ts          # Dynamic sitemap.xml generator
│   │   └── globals.css         # Tailwind v4 theme, focus-visible outlines
│   ├── canvas/                 # Three.js geometries, shaders & materials
│   ├── components/
│   │   ├── canvas/             # KineticStage & WebGL components
│   │   ├── motion/
│   │   │   ├── Capabilities.tsx    # Responsive 6-domain capabilities grid
│   │   │   ├── Contact.tsx         # Dedicated contact section & copy-email action
│   │   │   ├── CyberTerminal.tsx   # Keyboard-safe interactive CLI
│   │   │   ├── Footer.tsx          # Experience, milestones & academic record
│   │   │   ├── Hero.tsx            # Hero value proposition & verified proof
│   │   │   ├── HowIWork.tsx        # Mechatronic engineering pipeline
│   │   │   ├── ProjectCard.tsx     # Technical project cards with blueprint placeholders
│   │   │   ├── ProjectShowcase.tsx # Responsive project grid & category filter bar
│   │   │   ├── ResearchInterests.tsx # 6-thrust research direction section
│   │   │   ├── TopHUD.tsx          # Accessible header & mobile drawer
│   │   │   └── WorkModal.tsx       # 4-tab technical case study modal
│   │   └── seo/
│   │       └── JsonLd.tsx          # Schema.org Person JSON-LD
│   ├── context/
│   │   └── ExperienceProvider.tsx  # Global motion toggle & scroll state
│   ├── data/
│   │   ├── capabilities.ts     # 6 capability records
│   │   ├── experience.ts       # Verified experience & honors
│   │   ├── profile.ts          # Verified personal facts & links (no phone)
│   │   ├── projects.ts         # 8 deep engineering project case studies
│   │   └── research.ts         # 6 structured research thrusts
│   └── hooks/
│       ├── useLenisGSAP.ts     # Smooth scroll with reduced-motion fallback
│       ├── useMouseLight.ts    # Cursor light position tracker
│       └── useReducedMotion.ts # OS prefers-reduced-motion hook
├── CHANGES.md                  # Detailed overhaul changelog
├── TODO_ASSETS.md              # Missing physical evidence & assets catalog
├── next.config.ts              # Next.js configuration
├── package.json
└── tsconfig.json
```

---

## ⚙️ Development & Verification Commands

```bash
# Install dependencies
npm ci

# Run strict TypeScript typecheck
npm run typecheck

# Run ESLint
npm run lint

# Build optimized production bundle
npm run build

# Start production server
npm run start
```

---

## 📄 License

This repository is licensed under the [MIT License](LICENSE).
