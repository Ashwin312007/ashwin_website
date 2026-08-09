# ⚡ Ashwin T E — Autonomous Systems & Mechatronics R&D Engineer

<div align="center">

  ![Next.js](https://img.shields.io/badge/Next.js-16.2.4-black?style=for-the-badge&logo=next.js&logoColor=white)
  ![React](https://img.shields.io/badge/React-19.2.4-61DAFB?style=for-the-badge&logo=react&logoColor=black)
  ![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
  ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.2-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
  ![Framer Motion](https://img.shields.io/badge/Framer_Motion-12.38-0055FF?style=for-the-badge&logo=framer&logoColor=white)
  ![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

  <br />

  **Official personal website & interactive portfolio for Ashwin T E**  
  *Mechatronics R&D | Autonomous Systems | Embedded Systems & Firmware | Robotics*

  <a href="https://github.com/Ashwin312007/ashwin_website"><strong>Explore the Repository »</strong></a>

  <br />
  <br />

  [🌐 Live Portfolio](https://github.com/Ashwin312007/ashwin_website) · [📫 Contact Ashwin](mailto:teashwin3@gmail.com) · [💼 LinkedIn Profile](https://www.linkedin.com/in/ashwin-t-e-410655240/)

</div>

---

## 📌 Overview

This repository contains the source code for **Ashwin T E's** high-performance interactive portfolio. Designed with a futuristic dark aesthetic, glassmorphism UI elements, micro-animations, and real-time interactive components, it highlights Ashwin's engineering journey, patents, hardware/software R&D projects, and leadership roles across robotics and autonomous systems.

### 🌟 About Ashwin T E
- **Secretary & Engineering Lead** @ AutoVIT Club (VIT Chennai)
- **Advisory Board Member & Former Programming Lead** @ Team MOVIS (NASA HERC 6th Place Global & Best Indian Team)
- **Former R&D Lead** @ VIT Chennai Open Source Programming (OSP) Club
- **Student In-Charge** @ ATAL Tinkering Lab (Govt. of India Initiative)
- **Patents Pending**: Automated Agri-Sorter (Agri-Tech/Vision) & Portable Air-Puff Tonometer (Medical Devices)

---

## 🚀 Key Features

- 🌌 **Particle Physics Canvas**: Interactive canvas background featuring fluid-connected particle physics that respond gracefully to cursor hover and motion.
- ⚡ **Interactive Cyber Terminal CLI**: Floating command-line interface allowing users to query bio details, skill matrices, projects, and contact info directly via text commands.
- 🍱 **Glassmorphism Bento Grid**: Clean modular layout showcasing work experience, skill breakdown with animated proficiency meters, key achievements, and patents.
- 🔍 **Deep-Dive Specification Modals**: Interactive modal popups providing granular technical specifications, project highlights, and hardware/software stack details for featured projects.
- 📱 **Fully Responsive & Accessible**: Optimized for all device viewports with full support for reduced-motion preferences (`prefers-reduced-motion`).
- 🎨 **Modern Cyber Dark Aesthetic**: Built using sleek silver-cyan gradients, HSL tailored glows, glass cards, and micro-interactions powered by Framer Motion.

---

## 🛠️ Tech Stack

### Frontend & UI
- **Framework**: [Next.js 16 (App Router)](https://nextjs.org/)
- **Core Library**: [React 19](https://react.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) & [PostCSS](https://postcss.org/)
- **Animations**: [Framer Motion v12](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)

### Engineering & Domain Competencies
- **Robotics & ROS**: ROS2, SLAM, Kinematics & Control Systems
- **Embedded & Firmware**: Embedded C/C++, ESP32, STM32, FreeRTOS
- **AI & Computer Vision**: Python, OpenCV, TensorFlow / PyTorch
- **Hardware & Electronics**: Fusion 360 (CAD), PCB & PDB Design, DFM & VMC Manufacturing

---

## 📁 Project Architecture

```
ashwin_website/
├── public/                     # Static assets & icons
├── src/
│   ├── app/
│   │   ├── favicon.ico
│   │   ├── globals.css         # Global styles & glassmorphism utilities
│   │   ├── layout.tsx          # Root layout & Metadata configuration
│   │   └── page.tsx            # Main page composition
│   ├── components/
│   │   ├── BentoGrid.tsx       # Experience, Projects, Skills & Achievements grid
│   │   ├── CyberTerminal.tsx   # Interactive floating terminal CLI
│   │   ├── HeroSection.tsx     # Tabbed experience showcase & Hero section
│   │   ├── NavBar.tsx          # Floating navigation bar
│   │   ├── ParticleBackground.tsx # HTML5 Canvas particle animation
│   │   └── ProjectModal.tsx    # Technical deep-dive spec modal
│   ├── lib/
│   │   └── utils.ts            # Class merge & utility helpers
│   └── types.ts                # TypeScript interfaces for projects & data structures
├── eslint.config.mjs           # ESLint configuration
├── next.config.ts              # Next.js configuration
├── package.json                # Project dependencies & npm scripts
├── tsconfig.json               # TypeScript configuration
└── README.md                   # Repository documentation
```

---

## ⚙️ Getting Started

### Prerequisites

Ensure you have the following installed on your machine:
- **Node.js**: `v18.17.0` or higher
- **npm** (v9+) / **yarn** / **pnpm** / **bun**

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Ashwin312007/ashwin_website.git
   cd ashwin_website
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Run the development server**:
   ```bash
   npm run dev
   ```

4. **Open in browser**:
   Navigate to [http://localhost:3000](http://localhost:3000) to view the site locally.

### Production Build

To test or build the production bundle:
```bash
npm run build
npm run start
```

---

## 🏆 Featured Projects & Patents

| Project / Patent | Domain | Highlights & Impact | Tech Stack |
| :--- | :--- | :--- | :--- |
| **Agri-Sorter** | Agri-Tech / Patent | Automated high-throughput agricultural sorting system combining computer vision & mechatronics (*Patent Pending*). | Computer Vision, Mechatronics, Python, Patent |
| **Portable Air-Puff Tonometer** | Medical Devices / Patent | Non-contact intraocular pressure measurement device utilizing micro-pneumatics & embedded sensing (*Patent Pending*). | Embedded Systems, Micro-Pneumatics, Medical Devices |
| **NASA HERC Autonomous Rover** | Space Tech | 6th Place Global & Best Indian Team at NASA Human Exploration Rover Challenge (HERC). | Motor Control, Power Electronics, Embedded C/C++ |
| **ISRO Robotics Challenge Drone** | Autonomous Systems | Autonomous drone utilizing ROS2, Raspberry Pi, Pixhawk flight controller, and custom motor logic. | ROS2, C++, Python, Pixhawk, Raspberry Pi |
| **Autonomous Delivery Robot** | Logistics R&D | Industrial-grade SLAM navigation robot with custom PCB/PDB architecture for power management. | SLAM, LiDAR, PCB Design, Embedded C++, Altium |

---

## 💻 Interactive Cyber Terminal CLI

The website features an embedded floating terminal CLI that visitors can launch by clicking **"Init Terminal"** or pressing the terminal button.

### Available Terminal Commands:
- `whoami` — Displays summary bio and leadership background.
- `skills` — Outputs key skill matrix (ROS2, Embedded C++, Python, SLAM, etc.).
- `projects` — Lists key projects and patents.
- `contact` — Displays email, LinkedIn, and GitHub links.
- `clear` — Clears the terminal output buffer.
- `help` — Prints list of all supported commands.

---

## 📬 Contact & Connect

- **Email**: [teashwin3@gmail.com](mailto:teashwin3@gmail.com)
- **LinkedIn**: [linkedin.com/in/ashwin-t-e-410655240](https://www.linkedin.com/in/ashwin-t-e-410655240/)
- **GitHub**: [github.com/Ashwin312007](https://github.com/Ashwin312007)

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

<div align="center">
  <sub>Built with ❤️ by Ashwin T E. Designed with Next.js 16 & Tailwind CSS.</sub>
</div>
