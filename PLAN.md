# Frontend Redesign Plan — Awwwards-Caliber Interactive 3D Experience

## Objective
Completely redevelop ashwin_website portfolio into an Awwwards-caliber interactive motion and 3D experience, directly modeled after skhiladze.com (kinetic minimalism, audio-gated entry, inertia rotary dial, numbered editorial layout) and fragment.im (refractive geometry) and konkelectrical.com (cursor-reactive WebGL lighting). All existing domain content, copy, links, projects, and résumé preserved and adapted into the new visual architecture.

## Complexity
HIGH — Multi-phase implementation, ~25+ new files, Three.js / React Three Fiber integration, Web Audio API synthesised sound, GSAP ScrollTrigger choreography, custom GLSL shaders, inertia-driven rotary dial, Lenis smooth scrolling, motion/sound toggles, reduced-motion fallback, full responsive design (mobile → 4K).

## Recommended Model tier
`pro` (Gemini) for subagent coordination and GLSL/shader reasoning. `flash` for standard component implementation and routine logic.

---

## Phase 1: Foundation — Global State & Audio Engine

### 1.1 `ExperienceProvider` (`src/context/ExperienceProvider.tsx`)
React context provider delivering:
- `hasEntered: boolean` — whether user has passed the entry gate
- `soundEnabled: boolean` — global SFX mute state
- `motionEnabled: boolean` — respects `prefers-reduced-motion`
- Web Audio API procedural sound engine (`useSoundFX`):
  - `tick()` — mechanical click (rotary dial notch)
  - `click()` — micro-feedback on button/link hover
  - `chime()` — low-end entry chime (once on first entry)
- All SFX output gated by `soundEnabled`; muted entirely when false.

### 1.2 `useSoundFX` hook (`src/hooks/useSoundFX.ts`)
Zero-dependency Web Audio API synthesizer. Creates an AudioContext on first user gesture, caches oscillator/gain nodes. Methods:
- `tick(frequency = 440, duration = 0.1)` — short sine pulse with envelope
- `click()` — slightly broader pulse, tactile feel
- `chime()` — layered sine stack with decay, played once on entry
- `toggle(muted)` — immediate mute/unmute

### 1.3 Entry point integration
- `ExperienceProvider` wraps the entire app tree
- On mount, if `hasEntered` is false, render `EntryGate` first (see Phase 2)

---

## Phase 2: Audio-Gated Entry System

### 2.1 `EntryGate` (`src/components/entry/EntryGate.tsx`)
Full-viewport dark-mode screen (`#08080A`) with:
- Progress counter: `000` → `100` (animated, half-screen)
- WebGL teaser scene: single glowing point → morphing line →-forming plane (Three.js, `ssr: false`)
- Three choice cards (styled as minimal pills):
  1. **"Enter, with sound"** — unlocks Web AudioContext, enables SFX, proceeds
  2. **"Enter without sound"** — enters muted, `soundEnabled = false` from start
  3. **"Skip intro"** — proceeds directly to content (no progress animation)

State flow:
- User selects option → sets `hasEntered = true` → unmounts `EntryGate`
- `useSoundFX` context init tied to user gesture (entry choice)
- `hasEntered` stored in localStorage for session persistence

### 2.2 Reduced-motion handling
- If `prefers-reduced-motion: reduce` entered via system, skip WebGL teaser
- Progress counter simplifies to instant transition
- "Enter without sound" becomes the default primary action

---

## Phase 3: Kinematic 3D Canvas — Core Visual Engine

### 3.1 `KineticStage` (`src/components/canvas/KineticStage.tsx`)
Fixed full-screen `<Canvas>` rendering beneath all UI, configured:
- `dpr={[1, 2]}` — clamp device pixel ratio
- `gl={antlr.getContext("webgl2")}` — explicit WebGL2
- Custom `onCreated` callback for Three.js scene setup

Three.js scene contents:
- **Particle field**: volume-filling system of oriented points/planes with subtle motion, governed by a GLSL noise function
- **Refractive geometric centerpiece**: morphing wireframe/glass polyhedron (icosahedron → dodecahedron → custom shape), driven by a sinusoidal progression uniform
- **Ambient backgrid**: faint subtle grid texture for depth perception
- **Cursor-reactive point light**: mouse-following 3D light position affecting geometry diffuse + specular, volumetric glow connecting to background (inspired by konkelectrical.com)

### 3.2 GLSL shaders (inline in `KineticStage` or separate `.glsl` files imported via `raw-loader` or `import` with `asar`)
- **Particle vertex shader**: positions + offset via 3D noise (`sin(dot(position, frequency) + time)`)
- **Particle fragment shader**: soft additive blending, size fade, color from palette (`#38bdf8`, `#34d399`, `#9bc1ff`)
- **Geometry vertex shader**: morph uniform drives vertex displacement (`morph = sin(time * speed + angle) * strength`)
- **Geometry fragment shader**: glass-like refractive index coloring, edge glow
- **Lighting shader**: `position = normalize(mousePos - lightPos)` for cursor-reactive diffuse

### 3.3 Resize & cleanup
- `useFrame` from `@react-three/fiber` for per-tick updates
- `useDisposable` pattern: geometries/materials disposed on unmount
- `resize` event listener throttled to `requestAnimationFrame`

---

## Phase 4: Hero & Narrative Section — Editorial + 3D Synchrony

### 4.1 Rewritten `HeroSection` (`src/components/HeroSection.tsx`)
- **Swiss-grotesque** monumental typography (imported via CSS `font-family: "Swiss", system-ui, sans-serif`; fallbacks)
- **Monospace metadata bar** (`STATUS`, `LOCATION`, `FOCUS`) — always visible, updates per section
- **Tight-tracking line-height** and letter-spacing for headline feel
- **Pinned GSAP `ScrollTrigger`** storytelling sequence:
  - Scroll scrubs through the `KineticStage` scene
  - Uniform progression drives geometry morph state (point → line → plane → polyhedron)
  - Each editorial block (copy) corresponds to a specific geometry state and camera position
  - Fixed-position navigation highlights current sectiondot
  - Trigger markers correspond to section headings

### 4.2 Editorial copy blocks (preserved from current content)
- Name + tagline: "Ashwin T E — Engineering adaptive machines, bio-inspired robotics, and real-time control systems."
- Body: "From peristaltic in-pipe soft crawlers and dynamic hydrodynamic fluid mechanisms to space exploration rovers and medical sensing devices. Bridging mechanics, firmware, and autonomy."
- Highlights: 7 Projects, 2 Patents Pending, 6th Globally (NASA HERC 2026)
- CTA: "Explore Selected Work" → scroll to first project section

### 4.3 Responsive hero
- Desktop: full-width hero-panel with 2-column layout (text left, CTA right)
- Mobile: single-column, full-width, larger touch targets
- Reduced-motion: geometry morph transitions freeze; editorial blocks transition via simple fades

---

## Phase 5: Interactive Rotary Dial — Signature Feature

### 5.1 `RotaryWorkDial` (`src/components/motion/RotaryWorkDial.tsx`)
Tactile, physics-driven circular/arc dial, the signature `skhiladze.com` feature:

**Navigation inputs**:
- Mouse drag (click-and-rotate around center)
- Trackpad wheel (delta → angle increment)
- Touch swipe (two-finger rotate gesture)
- Keyboard arrows (left/right → stepwise notch advance)

**Physics**:
- Momentum/inertia: dial continues rotating after input stops, gradual friction damping
- Snapping to discrete notches (8 projects = 45° intervals)
- Spring-based overshoot dampening

**Per-notch feedback**:
- `useSoundFX.tick()` — short mechanical tick every time dial crosses a notch boundary
- Visual: subtle scale pulse + color highlight on active project

**Display** (center of dial, overlaying 3D canvas):
- Active project index: `01 / 08`
- Project title (truncated if long)
- Category tag(s) (biomimicry, robotics, controls, autonomy)
- Live preview stage: small Three.js thumbnail with hover tilt + shader sheen (Framer Motion `layoutId` for cross-section transitions)

**View switcher** (below dial):
- "Featured" — shows 1 featured project at a time (full-screen modal with layoutId transition)
- "Full Archive" — grid of all 7 project cards (scrollable, grid layout)

### 5.2 Project data structure (enhanced from current `src/types.ts`)
```typescript
type Project = {
  id: "01" | "02" | "03" | "04" | "05" | "06" | "07"
  title: string
  category: "biomimicry" | "robotics" | "controls" | "autonomy"
  subtitle: string
  description: string
  heroImage: string // public URL
  demoLink?: string
  repoLink?: string
  techStack: string[]
  // New for dial
  displayOrder: number // 1-7, maps to dial notch
}
```

### 5.3 All 7 existing projects preserved with enhanced metadata
- Peristaltic in-pipe soft crawler
- Archerfish fluid mechanism
- Biomimicry robotics projects
- 3D renders and kinetic simulators
- NASA HERC rover contributions
- Patent-related mechanical systems
- Embedded systems projects

### 5.4 Accessibility
- Keyboard: arrows navigate, `Enter` opens detail modal, `Esc` closes
- ARIA: `role="region"`, `aria-label="Project navigation dial"`
- Reduced-motion: disables inertia, snaps instantly to notches

---

## Phase 6: Numbered Capabilities & Editorial Footer

### 6.1 `CapabilitiesAccordion` (`src/components/motion/CapabilitiesAccordion.tsx`)
Clean horizontal layout with:

**Numerical tabs**:
- Oversized tabular numerals: `01`, `02`, `03`, `04`, `05`, `06`
- CSS: `font-variant-numeric: tabular-numbers;` + `font-weight: 900;` + custom `letter-spacing` for visual impact
- `1px solid rgba(255,255,255,0.12)` hairline between tabs
- Active tab: highlighted with subtle background fill

**Per-capability content**:
- Title (e.g., "Adaptive Mechanics", "Real-Time Control", "Bio-Inspired Design")
- Short descriptive tagline
- Hover-triggered floating preview thumbnail that follows cursor with spring physics (GSAP `utils.to` custom vector)
- On click: expand to show full description, tech stack, links

**Six capabilities** (mapped from existing project domains):
1. Peristaltic Mechanisms
2. Fluid Dynamics
3. Biomimetic Robotics
4. Autonomous Navigation
5. Embedded Firmware
6. Human-Robot Interaction

**Lenis integration**:
- Smooth momentum scrolling synced with GSAP ticker
- Capability section scrolling feels weighty but responsive

### 6.2 Editorial footer
- Numbered items (`01`–`06`) integrated below the capabilities grid
- Each has associated micro-copy linking to project domains

---

## Phase 7: Motion & Sound Toggles — HUD

### 7.1 Top-bar HUD (persistent, always visible)
Minimal bar at top of viewport (below browser chrome, above hero):
- Brand/name left-aligned: "Ashwin T E"
- Section links as tiny pills: `01 Work`, `02 Capabilities`, `03 About`
- Toggle pills right-aligned:
  - **Motion: ON** / **Motion: OFF** — toggles `motionEnabled` global state
    - When OFF: all GSAP/Three.js animations freeze (`enable()` / `disable()` on timelines, particle count → 0, dial inertia disabled)
    - When ON: animations resume from frozen state
  - **Sound: ON** / **Sound: OFF** — toggles `soundEnabled`
    - When OFF: `useSoundFX` context suspended, no tick/chime/click audio
    - Note: Web AudioContext requires user gesture to resume; clicking the pill re-activates context

### 7.2 Reduced-motion media query
- `@media (prefers-reduced-motion: reduce)` applied at CSS + JS level
- Particle field: `count = 0`, no motion animation
- Geometry morph: disabled, static final shape
- Dial inertia: disabled, instant notch snap
- ScrollTrigger: `toggleActions: "restart none none none"` simplified
- All transitions: `transition-duration: 0s` where appropriate

---

## Phase 8: Organization, Types, and Exports

### 8.1 Directory structure (final)
```
src/
  context/        ExperienceProvider.tsx
  hooks/          useSoundFX.ts
  components/
    entry/        EntryGate.tsx
    canvas/       KineticStage.tsx  (GLSL shaders inline)
    motion/
      RotaryWorkDial.tsx
      CapabilitiesAccordion.tsx
      ProjectCard.tsx       (enhanced from existing)
      HeroSection.tsx       (redesigned)
      NavBar.tsx            (enhanced)
    shared/       utility components
  types.ts        enhanced Project type + global state interfaces
  App.tsx         wraps everything with ExperienceProvider
  globals.css     extended with new variables, reduced-motion overrides

src/components/motion/       # RotaryDial, Accordion, Hero, ProjectCards
src/components/canvas/       # KineticStage + shaders
src/context/                 # ExperienceProvider
src/hooks/                   # useSoundFX
src/types.ts                 # Project[] + ExperienceState
```

### 8.2 All existing content preserved verbatim
- 7 projects with full descriptions
- 2 pending patents
- Bio text: "From peristaltic in-pipe soft crawlers and dynamic hydrodynamic fluid mechanisms to space exploration rovers and medical sensing devices. Bridging mechanics, firmware, and autonomy."
- Contact: teashwin3@gmail.com · Chennai, India
- GitHub + LinkedIn links
- Résumé PDF download
- Terminal component — unchanged (or minimally adapted)

### 8.3 Build & typecheck goals
- `npm run build` — Next.js production build, zero TypeScript errors
- `npm run lint` — ESLint clean
- `npx tsc --noEmit` — no unresolved types
- Dynamic imports (`ssr: false`) for all Canvas/motion components prevent SSR hydration mismatch

### 8.4 Mobile touch strategy
- Rotary dial: touch swipe rotates, pinch-to-zoom alternative for archive view
- Particle field: reduced particle count on mobile (`dpr={1}`)
- ScrollTrigger: horizontal scroll fallback on mobile if vertical overflow issues
- Touch-action: manipulation on interactive elements

### 8.5 Cross-browser baseline
- WebGL 2 required for full 3D experience
- Fallback: if WebGL 1 only, disable refractive geometry, keep particle field
- No `cubic-bezier` values that break on Safari; use `linear` or `ease-out` universally

---

## Subagent Execution Plan (4 distinct, non-overlapping agents)

| Agent | Role | Task | Deliverable | Verification |
|-------|------|------|-------------|--------------|
| Agent-A | **Layout & Structure** | Scaffold file structure, create `ExperienceProvider`, `EntryGate`, `useSoundFX`, `App.tsx` wiring | All context/hooks setup + TypeScript compilation clean | `npm run build` succeeds; `npm run lint` clean |
| Agent-B | **3D Canvas & Shaders** | `KineticStage` component + all GLSL shaders, cursor-reactive light, particle field | Working Three.js canvas with particle effects + shader files | Visual inspection: particles move, geometry morphs, light follows cursor |
| Agent-C | **Motion & Interaction** | `RotaryWorkDial`, `CapabilitiesAccordion`, GSAP ScrollTrigger choreography in Hero + section links, Lenis integration | Interactive rotary dial with tick sounds + numbered capabilities with smooth scroll | Manual test: dial navigates projects, tick sounds on notches, scroll chores sync with copy |
| Agent-D | **Audio & Polish** | `useSoundFX` hook, audio-gated EntryGate, motion/sound toggle pills, reduced-motion fallback logic | Working Web Audio engine + entry gate + toggle behaviors | Audio plays/doesn't play per toggle; mute pill visually toggles; reduced-motion media query active |

**Dependencies between agents**:
- Agent-A must complete first (provides file structure, context that others consume)
- Agent-B needs Agent-A's context files (`ExperienceProvider`, `useSoundFX`) to wire audio state correctly
- Agent-C depends on Agent-B's `KineticStage` for ScrollTrigger scrub targets
- Agent-D's `useSoundFX` is used by Agent-C (rotary dial ticks) and top-level HUD

**Integration milestone**: After all 4 agents complete, main agent runs end-to-end verification: dev server start, entry gate flow, rotary dial interaction, toggle behaviors, build pass.

---

## Empirical Verification Checklist (Pass-Fail)
1. `npm run build` — passes with zero TypeScript errors ✓/✗
2. `npm run lint` — passes ✓/✗
3. `npm run dev` starts — no runtime JS errors in console ✓/✗
4. Entry gate appears on first visit; user can select "with sound", "without sound", or "skip" ✓/✗
5. After entry, `KineticStage` renders: particles animate, geometry morphs, cursor light follows ✓/✗
6. ScrollTrigger in Hero scrubs geometry state in sync with editorial copy blocks ✓/✗
7. Rotary dial navigates projects left/right via mouse/trackpad/touch/arrows ✓/✓
8. Tick sound plays every time dial crosses a notch ✓/✗
9. "Featured" view switcher opens modal with Framer Motion layoutId transition ✓/✗
10. "Full Archive" shows all 7 projects in grid ✓/✗
11. Motion OFF toggle freezes all 3D/GSAP animations ✓/✗
12. Sound OFF toggle mutes all SFX ✓/✗
13. Reduced-motion system preference simplifies all animations ✓/✗
14. Mobile: touch swipe rotates dial, touch thresholds reasonable ✓/✗
15. No horizontal overflow at 320px, 390px, 768px, 1000px, 1600px ✓/✗
16. All 7 projects preserved with correct titles, categories, descriptions ✓/✗
16. Résumé PDF download works ✓/✗

---

## Risks & Mitigations
| Risk | Mitigation |
|------|------------|
| Three.js + Next.js SSR hydration mismatch | Dynamic imports with `ssr: false` for all Canvas/motion components; `'use client'` at top of each |
| Web Audio autoplay policy blocked | Entry gate requires user gesture (choice pill click) to init AudioContext; all SFX gated behind this |
| Performance degradation on low-end devices | `dpr={[1, 2]}`, cap particle count (< 200), throttle `useFrame` to 30Hz min, disable on `prefers-reduced-motion` |
| GLSL shaders not compatible across browsers | Test Chrome/Edge (WebGL2 best), Firefox (fallback to simpler shader), Safari (validate WebGL2 support) |
| Keyboard navigation rotary dial | Test arrow keys, `Home/End` to featured view, `Esc` to close modals, ARIA labels |
| Build fails due to new dependencies | Install deps first (`three`, `@react-three/fiber`, `@react-three/drei`, `@react-three/postprocessing`, `postprocessing`, `gsap`, `lenis`, `framer-motion`, `lucide-react` already in `package.json`) |
| Reduced-motion not respected by third-party libraries | Manual override: wrap all GSAP/Three.js in `if (!reducedMotion) { ... }` checks |

---

## Success Metrics (post-launch)
- Build passes cleanly (0 TS errors, 0 lint errors)
- Dev server starts without runtime errors
- Entry gate flow works across browsers
- Rotary dial interactive on desktop + mobile touch
- Motion/Sound toggles function correctly
- Reduced-motion system preference honored
- Mobile touch interactions functional
- No horizontal overflow at any breakpoint
- All original content preserved and accessible

---

## Non-Goals (out of scope for this redesign)
- Backend/content CMS integration
- Blog or article publishing system
- E-commerce or transaction functionality
- Authentication or user accounts
- SEO beyond meta tags already present
- Internationalization / i18n
- Accessibility audit beyond basic keyboard/focus checks (beyond scope of this task)

---