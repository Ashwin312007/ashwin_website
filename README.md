# Ashwin Resume - Robotic Command Center

## Project Overview
This project is a high-performance, cinematic 3D portfolio for **Ashwin T E**, a Robotics Enthusiast and Embedded Systems Developer. It is built as a "Robotic Command Center" using modern web technologies to simulate a technical, HUD-based interface.

- **Purpose**: Showcasing Ashwin's technical skills, professional experience, and robotics projects through an interactive 3D experience.
- **Main Technologies**:
  - **Framework**: [Next.js 16](https://next.js) (App Router, Turbopack)
  - **3D Engine**: [Three.js](https://threejs.org/) via [@react-three/fiber](https://r3f.docs.pmnd.rs/) and [@react-three/drei](https://github.com/pmndrs/drei).
  - **Animations**: [GSAP](https://gsap.com/) for scroll-synchronized camera movement and [Framer Motion](https://www.framer.com/motion/) for HUD UI transitions.
  - **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) with a custom Cyberpunk/HUD glass-panel aesthetic.
  - **Icons**: [Lucide React](https://lucide.dev/).
- **Architecture**:
  - **`Experience` Component**: Manages the fixed 3D background, including the `HeroModel` (robotic core), `PointCloud` (VSLAM visualization), and `CameraRig`.
  - **`HUD` Component**: A fixed overlay that displays resume content in scroll-based "chapters".
  - **Camera Rig**: Synchronized with page scroll using `gsap/ScrollTrigger` to navigate the 3D scene.

## Building and Running

### Development
To start the development server with Hot Module Replacement:
```bash
npm run dev
```

### Production Build
To create an optimized production build (static export):
```bash
npm run build
```
This command runs `next build` which is configured for static output (`output: "export"`) in `next.config.ts`. The final assets will be located in the `out/` directory.

### Linting
To run the ESLint check:
```bash
npm run lint
```

## Development Conventions

### 3D Component Patterns
- **Seeded Randomness**: When generating random data (like point clouds), use a seeded pseudo-random generator (found in `src/components/PointCloud.tsx`) to ensure deterministic results during React hydration.
- **Resource Cleanup**: Always use `useEffect` cleanup functions to kill GSAP timelines and ScrollTriggers (see `src/components/CameraRig.tsx`).
- **Performance Optimization**: Use `useMemo` for heavy geometry/attribute generation and `useRef` for animation state to avoid unnecessary re-renders.

### UI & Styling
- **HUD Panels**: Use the `.glass-panel` utility class (defined in `globals.css`) for consistent backdrop blur and semi-transparent backgrounds.
- **Colors**:
    - Primary Accent: `#00ffcc` (Teal/Cyber)
    - Secondary Accent: `#0066ff` (Blue/Tech)
- **Icons**: Always prefer `lucide-react` for consistent tech-themed iconography.

### Coding Standards
- **TypeScript**: Strict typing is enabled. Avoid `any` and prefer proper Three.js types (e.g., `THREE.Vector3`, `THREE.Mesh`).
- **React**: Functional components with hooks. Use `useEffect` with appropriate dependency arrays. Note: `useLayoutEffect` should be avoided for hydration-sensitive state (prefer `useEffect` with a `mounted` check).
- **Security**: For external links, always include `target="_blank"` and `rel="noopener noreferrer"`.
