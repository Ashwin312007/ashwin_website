# Ashwin T E — Mechatronics & Bio-Inspired Robotics Portfolio

<div align="center">

  ![Next.js](https://img.shields.io/badge/Next.js-16.2.4-black?style=for-the-badge&logo=next.js&logoColor=white)
  ![React](https://img.shields.io/badge/React-19.2.4-61DAFB?style=for-the-badge&logo=react&logoColor=black)
  ![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
  ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.2-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
  ![Three.js](https://img.shields.io/badge/Three.js-0.187-000000?style=for-the-badge&logo=three.js&logoColor=white)
  ![GSAP](https://img.shields.io/badge/GSAP-3.15-88CE02?style=for-the-badge&logo=greensock&logoColor=black)

  <br />

  **Cinematic 3D engineering portfolio & technical case-study archive for Ashwin T E**  
  *Mechatronics & Automation Undergraduate @ VIT Chennai (Class of 2028)*  
  *Bio-Inspired Robotics · Embedded Control Systems · ROS 2 Autonomy · Power Electronics*

  <br />

  [Live Site](https://ashwinte.vercel.app/) · [Email](mailto:teashwin3@gmail.com) · [LinkedIn](https://www.linkedin.com/in/ashwin-t-e-410655240) · [GitHub](https://github.com/Ashwin312007)

</div>

---

## Architecture Overview ("Living Machines")

Built around a single persistent WebGL `<Canvas>` (`WebGLRoot`) layered behind DOM sections and persistent chrome UI:

- **Procedural Peristaltic Core (`webgl/Core/PeristalticCore.tsx`)**: A custom non-indexed icosphere with barycentric coordinates, triangle-lattice dithered chrome lighting (`triangleDither.ts`), three travelling metameric contraction waves, cursor dent deformation, and scroll-velocity jitter.
- **Atmospheric Scene & Post-Processing**: Fullscreen silk `RibbonField` with iridescent shader rims, `StarField` particle streaks scaled by scroll velocity, procedural `StudioEnvironment` (`RoomEnvironment` + `Lightformer`s), keyframed `CameraRig`, footer `Monogram` + `TerrainDome`, portrait `PortraitHalftone` (`drei` `<View>`), and custom `TriangleWipeEffect` post-processing pass flipping `<html data-surface="dark|light">`.
- **Scroll & Route Choreography**:
  - `SmoothScroll` (`lenis` synced to `gsap.ticker` and `ScrollTrigger`)
  - `TransitionProvider` + `TransitionLink` + `Curtain` (Canvas2D equilateral triangle lattice transition across `/` and `/work/[slug]`)
  - `TourController` for a guided end-to-end walkthrough that aborts cleanly on user input
- **Generative Web Audio (`audio/AudioEngine.ts`)**: Opt-in ambient synthesizer responsive to scroll velocity plus subtle UI sound effects.
- **Dedicated Case Study Routes (`/work/[slug]`)**: Statically pre-rendered via `generateStaticParams` from `src/data/projects.ts` with per-project `generateMetadata`, accent-tinted 3D core, `Odometer` metrics, ordered engineering breakdowns, `TriangleCover` media reveals / spec plates, and wrap-around `NextProject` navigation.

---

## Controls, Shortcuts & Accessibility

### Keyboard Shortcuts (`?` opens Shortcuts Sheet)

| Key | Action |
|---|---|
| `M` | Toggle ambient audio & UI SFX |
| `T` | Start or stop guided tour |
| `H` | Toggle live telemetry HUD (`VEL · FPS · SEC · Y`) |
| `` ` `` | Toggle interactive Cyber Terminal |
| `?` | Open Keyboard Shortcuts sheet |
| `Esc` | Close active overlay/menu/sheet or stop tour |

### Accessibility Controls (`A11ySheet`)

Persisted in `localStorage` and reflected onto `<html data-*>`:

- **Reduce motion**: Disables GSAP/smooth-scroll motion and minimizes animations (also honors OS `prefers-reduced-motion`).
- **Disable 3D**: Unmounts the WebGL `<Canvas>` and switches to a monochrome CSS gradient fallback.
- **High contrast**: Enforces pure `#000000` / `#FFFFFF` foreground/background tokens across both dark and light surfaces.
- **Larger text**: Scales root typography by `+12.5%`.
- **Tilt control**: Enables optional mobile device-orientation parallax.
- **Sound**: Explicit opt-in audio toggle (never auto-plays without user gesture).

---

## Repository Structure

```text
public/
  Ashwin_TE_Resume.pdf          # Verified technical résumé
  images/                       # Concept assets & notes
  projects/                     # Hardware & prototype photography
src/
  app/
    layout.tsx                  # Sora + JetBrains Mono fonts, metadata, Providers, WebGLRoot, Chrome
    page.tsx                    # Scroll-driven home showcase (Hero → Footer)
    work/[slug]/page.tsx        # Dynamic Next.js 16 case-study pages (generateStaticParams + generateMetadata)
    not-found.tsx               # Monochrome 404 with Emblem reticle & TransitionLink
    globals.css                 # Surface tokens, a11y attributes, fluid typography utilities
    robots.ts                   # Robots rules pointing to sitemap.xml
    sitemap.ts                  # Dynamic sitemap covering / and all /work/[slug] routes
  audio/
    AudioEngine.ts              # Generative Web Audio ambient drone & UI SFX
  components/
    chrome/                     # Preloader, Header, MenuOverlay, BottomBar, Cursor, Curtain, HUD, Sheets
    sections/                   # Hero, Dive, Approach, Capabilities, Work, Experience, Research, About, Footer
    seo/JsonLd.tsx              # Schema.org Person structured data
    terminal/CyberTerminal.tsx  # Interactive keyboard-accessible CLI
    ui/                         # TriangleCover, LetterRoll, MagneticButton, TransitionLink, Odometer, SplitReveal, Emblem
    work/                       # CaseHero, CaseMetrics, CaseSection, CaseGallery, NextProject
  data/
    profile.ts                  # Identity, education, narrative steps, verified links
    projects.ts                 # 8 engineering project case studies & specs
    capabilities.ts             # 6 mechatronic capability domains
    experience.ts               # Internships, leadership & competition recognitions
    research.ts                 # 6 research directions
  hooks/                        # useReducedMotion, useIsTouch, useMediaQuery, useMagnetic, useScrollVelocity, etc.
  lib/                          # gsap plugin registration, math helpers, triangleLattice, emblemPath
  providers/                    # Providers, SmoothScroll, AudioProvider, A11yProvider, TransitionProvider
  store/
    useAppStore.ts              # Zustand global state read in R3F useFrame without React re-renders
  webgl/                        # WebGLRoot, Scene, CameraRig, StudioEnvironment, Core, Background, Particles, Footer, About, post, shaders, materials
```

---

## Technology Stack

- **Framework**: Next.js 16.2.4 (App Router) & React 19.2.4
- **Language**: TypeScript 5 (`strict: true`)
- **Styling**: Tailwind CSS v4 + CSS custom properties
- **3D & Post-Processing**: `three`, `@react-three/fiber`, `@react-three/drei`, `@react-three/postprocessing`, `postprocessing`
- **Animation & Scroll**: `gsap` (`ScrollTrigger`, `SplitText`, `Observer`, `Flip`, `ScrollToPlugin`, `CustomEase`), `lenis`
- **State & Audio**: `zustand`, native Web Audio API

---

## Development & Verification Commands

```bash
# Install dependencies
npm ci

# Run local development server (webpack mode for custom shaders/R3F)
npm run dev

# Run strict TypeScript check
npm run typecheck

# Run ESLint
npm run lint

# Build production bundle (statically generates / and all /work/[slug] routes)
npm run build

# Serve production build locally
npm run start
```

---

## License

This repository is licensed under the [MIT License](LICENSE).
