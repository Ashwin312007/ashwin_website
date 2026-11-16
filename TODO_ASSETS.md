# 📋 Ashwin T E — Required Engineering Evidence & Assets TODO List

This document catalogues the missing physical media, CAD assets, schematics, and demonstration recordings needed to replace the technical wireframe placeholders across the portfolio projects.

> [!IMPORTANT]
> The portfolio strictly prioritizes **real engineering proof** over visual decoration. Generic stock photography and AI-generated conceptual art have been completely purged from the codebase.
> Please provide the following authentic files to enhance the technical case studies.

---

## 1. Projects Requiring Media Assets

### 1. NASA HERC 2026 Rover (`nasa-herc`)
- [ ] **Course Run Action Photo / Video**: High-resolution image or 10-20s video clip of the rover tackling the obstacle course in Huntsville, AL (demonstrating the 7:02 fastest course run).
- [ ] **Custom Power Distribution Board (PDB) Layout**: 2D/3D PCB export (Gerber render or high-resolution photo of the fabricated board showing high-current traces, solid-state switches, and isolation).
- [ ] **Structural FEA Visualization**: SolidWorks Simulation stress contour plot (Von Mises stress distribution on critical chassis/rocker-bogie load paths under 3G impact).

### 2. Autonomous Delivery Rover (`delivery-robot`)
- [ ] **Hardware Platform Photograph**: Clear photograph of the physical differential-drive rover showing the RPLiDAR A2M8, Jetson Nano, and chassis wiring.
- [ ] **Nav2 / SLAM RViz Screenshot**: RViz2 visualization showing costmaps (global/local), LiDAR scan matching via `slam_toolbox`, and Regulated Pure Pursuit / MPPI path execution.

### 3. Portable Air-Puff Tonometer (`air-puff-tonometer`)
- [ ] **Benchtop Prototype Photograph**: Clear photograph of the micro-pneumatic test rig (showing the fast solenoid valve, miniature accumulator, pressure transducer, and 3D printed housing).
- [ ] **Pulse Waveform Oscilloscope / Sensor Capture**: Graph showing pressure rise time ($<15\text{ ms}$) and calibration curve.
- [ ] **Patent Application Reference**: (Optional) Filing number or title confirmation from the institutional IPR cell disclosure.

### 4. Agri-Sorter Optical & Density Grader (`agri-sorter`)
- [ ] **Sorting Rig Photograph**: Photograph of the conveyor apparatus with the Raspberry Pi 5, 850nm NIR LED illumination ring, and sorting chute.
- [ ] **NIR Image Comparison**: Split view comparing standard RGB defect visibility vs 850nm near-infrared surface/bruise contrast.
- [ ] **Load Cell DAQ Proof**: Screenshot or plot of the NAU7802 24-bit ADC scale readings synchronized with conveyor step pulses.

### 5. ISRO Challenge Autonomous Drone (`isro-drone`)
- [ ] **UAV Platform Photograph**: Photograph of the multirotor quadcopter frame with Pixhawk flight controller, companion computer (Raspberry Pi), and GPS mast.
- [ ] **Flight Telemetry / Log Plot**: Plot showing attitude stability (roll/pitch/yaw tracking) or QGroundControl waypoint mission.

### 6. PID & State-Space LQR Line-Following Robot (`line-follower-lqr`)
- [ ] **Chassis & Sensor Array Photograph**: Photograph of the high-speed differential-drive chassis showing the IR reflectance sensor array and custom motor driver.
- [ ] **Response Comparison Plot**: Comparative step response graph (LQR state-space optimal control vs classical tuned PID at high forward velocity $1.8\text{ m/s}$).

---

## 2. Profile & General Evidence Assets

- [ ] **Professional Headshot / Action Photo**: Clear workshop or laboratory photo of Ashwin working with hardware (to optionally replace monogram badge in the hero if desired).
- [ ] **GitHub Repository Public Links**: Public repository links for open-source project codebases (e.g. ROS 2 rover packages, LQR simulation script, or AutoVIT workshop material).
- [ ] **Video Demonstrations**: Short YouTube or unlisted demonstration links for embed or modal link-out.

---

## 3. How to Add Assets

1. Place image files (`.png`, `.webp`, `.jpg`) into the `public/projects/` directory.
2. Update the corresponding `media` array in `src/data/projects.ts`:
   ```typescript
   media: [
     {
       type: "image",
       url: "/projects/your-new-image.png",
       caption: "Detailed engineering description of what this image shows.",
       isPlaceholder: false,
     },
   ]
   ```
3. Run `npm run build` to verify image optimization and layout.
