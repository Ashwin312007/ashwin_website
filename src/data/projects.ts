export interface ProjectMedia {
  type: "image" | "cad" | "diagram" | "video";
  url?: string;
  caption: string;
  isPlaceholder?: boolean;
  placeholderNote?: string;
}

export interface ProjectRecord {
  id: string;
  index: string;
  title: string;
  shortTitle: string;
  category: string;
  categoryGroup: "all" | "biomimicry" | "robotics" | "embedded-control" | "vision-medical";
  year: string;
  accent: string;
  motionType:
    | "peristaltic"
    | "archerfish"
    | "nasa-rover"
    | "ros2-rover"
    | "tonometer"
    | "agrisort"
    | "drone"
    | "lqr-line";
  oneLiner: string;
  summary: string;
  featured: boolean;
  personalRole: string;
  teamSize: string;
  systemArchitecture: string[];
  mechanicalDesign: string[];
  electronicsHardware: string[];
  embeddedSoftware: string[];
  controlAlgorithms: string[];
  simulationVsPhysical: { simulation: string; physical: string };
  testingValidation: string[];
  metrics: { label: string; value: string }[];
  challenges: string[];
  tags: string[];
  repoUrl?: string;
  demoUrl?: string;
  patentStatus?: string;
  media: ProjectMedia[];
  // Backwards-compatible fields for existing UI components:
  architecture: string[];
  subsystems: { label: string; spec: string }[];
}

export const PROJECTS: ProjectRecord[] = [
  {
    id: "bio-pipe-robot",
    index: "01",
    title: "Earthworm Peristaltic Pipe Robot",
    shortTitle: "Peristaltic Pipe Crawler",
    category: "Biomimetic Robotics",
    categoryGroup: "biomimicry",
    year: "2026",
    accent: "#34d399",
    motionType: "peristaltic",
    oneLiner:
      "Three-segment bio-inspired tendon crawler that anchors radially and extends axially for confined-pipe inspection.",
    summary:
      "Replicates the retrograde peristaltic locomotion of Lumbricus terrestris (earthworm) to crawl through confined tubular conduits without reliance on continuous wheels or tracks. Features three metameric segments composed of compliant TPU 95A/90A bellows and rigid structural guide rings. Actuation is driven by high-tensile braided tendons routed to micro-servos, generating coordinated radial anchoring and axial extension waves sequenced deterministically by an ESP32.",
    featured: true,
    personalRole: "Lead Roboticist — Mechanical Design, Tendon Kinematics & Embedded Firmware",
    teamSize: "Solo Project",
    systemArchitecture: [
      "Three metameric segments with interleaved radial-anchoring cams and axial-expansion elastomeric bellows.",
      "Centralized tendon routing through low-friction PTFE fairleads to miniature coreless servos.",
      "ESP32 microcontroller executing cyclic peristaltic phase state machine.",
      "Dual-friction surface contact modeling validated in Gazebo and Webots.",
    ],
    mechanicalDesign: [
      "Parametric 3D CAD modeled in SolidWorks and Autodesk Fusion 360 for hybrid additive manufacturing.",
      "Rigid structural bulkheads printed in high-infill PETG to sustain axial compression and tendon pre-tension.",
      "Compliant bellows printed in Shore 95A / 90A TPU, providing restorative spring forces during segment relaxation.",
      "Modular end-caps with integrated radial anchoring grippers designed for 80–120 mm pipe diameters.",
    ],
    electronicsHardware: [
      "ESP32-S3 microcontroller handling multi-channel PWM waveform generation.",
      "Custom perfboard power bus with buck regulation (5V/3A) for servo stall current overhead.",
      "Current shunt sensor monitoring servo draw to detect radial anchoring lockup and wall stall conditions.",
      "Low-profile slip-ring interface for umbilical power and serial telemetry.",
    ],
    embeddedSoftware: [
      "Bare-metal C++ firmware with FreeRTOS task scheduling for non-blocking wave sequencing.",
      "Configurable peristaltic wave timing table (anchoring duration, stroke time, recovery delay).",
      "UART telemetry packet streaming segment states, bus voltage, and calculated crawl velocity.",
      "Safety watchdog triggering tendon detensioning on communication loss.",
    ],
    controlAlgorithms: [
      "Discrete phase-shifted wave generator synthesizing retrograde peristaltic sequence (anchor-extend-clamp-contract).",
      "Feedforward tension modulation compensating for non-linear TPU bellow elasticity.",
      "Friction-adaptive duty cycle scaling based on measured motor current draw.",
    ],
    simulationVsPhysical: {
      simulation:
        "Validated wave propagation velocity and wall slip dynamics in Gazebo and Webots across dry acrylic (μ=0.3) and oiled steel (μ=0.15) pipe surfaces.",
      physical:
        "3-segment physical prototype demonstrated forward crawling at 14 mm/s inside 100 mm acrylic tubing with verified radial wall retention.",
    },
    testingValidation: [
      "Static pull-force testing measuring up to 8.2 N anchoring grip before slippage in 100 mm pipe.",
      "Continuous 45-minute endurance test verifying thermal stability of servo motors and TPU flexure integrity.",
      "Traversing 15° inclined pipe sections without slip-back using active phase locking.",
    ],
    metrics: [
      { label: "Locomotion Mode", value: "Retrograde Peristalsis" },
      { label: "Segments", value: "3 Metameric Units" },
      { label: "Crawl Speed", value: "14 mm/s Physical" },
      { label: "Pipe Diameter", value: "80 – 120 mm" },
    ],
    challenges: [
      "Balancing TPU print infill density to achieve sufficient radial compliance while preventing off-axis buckling under axial tendon load.",
      "Tendon friction hysteresis along internal guide paths, resolved by installing micro PTFE sleeves.",
    ],
    tags: [
      "Biomimicry",
      "Soft Robotics",
      "Peristalsis",
      "SolidWorks",
      "Fusion 360",
      "TPU 95A",
      "ESP32",
      "Gazebo",
      "Webots",
    ],
    repoUrl: "https://github.com/Ashwin312007",
    media: [
      {
        type: "image",
        url: "/projects/earthworm-peristaltic-robot.png",
        caption:
          "Physical prototype of the 3-segment peristaltic crawler showing rigid rings and compliant TPU bellows.",
      },
    ],
    // Backwards-compatible aliases:
    architecture: [
      "Single servo-driven tendon mechanism coupling radial pipe-wall anchoring with axial segment contraction.",
      "Rigid structural rings paired with compliant TPU 95A/90A bellows.",
      "Gazebo and Webots multi-friction locomotion studies.",
    ],
    subsystems: [
      { label: "Mechanism", spec: "Coupled tendon radial-axial wave" },
      { label: "Materials", spec: "Rigid + flexible TPU 3D print" },
      { label: "Controller", spec: "ESP32 phase sequencer" },
      { label: "Simulation", spec: "Gazebo & Webots" },
    ],
  },
  {
    id: "archerfish-ejection",
    index: "02",
    title: "Archerfish Variable-Aperture Fluid Jet Mechanism",
    shortTitle: "Archerfish Fluid Jet",
    category: "Bio-Fluid Dynamics & Control",
    categoryGroup: "biomimicry",
    year: "2026",
    accent: "#38bdf8",
    motionType: "archerfish",
    oneLiner:
      "Dynamic compliant iris nozzle that contracts mid-pulse to concentrate fluid velocity and maximize jet momentum transfer.",
    summary:
      "Bio-inspired fluid propulsion system replicating Toxotes jaculatrix (archerfish) hydrodynamic predation. When shooting at aerial prey, the archerfish actively contracts its mouth aperture during the water expulsion stroke so the trailing fluid catches up with the leading edge, forming a single high-momentum droplet at impact. Designed a compliant iris nozzle dynamically throttled by a high-speed servo synchronized with a microsecond-timed solenoid pressure pulse.",
    featured: true,
    personalRole:
      "Lead Mechatronics Designer — Compliant Iris CAD, Hydrodynamic Sizing & Pulsed Actuation",
    teamSize: "Solo Project",
    systemArchitecture: [
      "Compliant variable-aperture iris nozzle with continuous orifice diameter modulation.",
      "Pressurized hydraulic accumulator driven by miniature high-pressure diaphragm pump.",
      "Direct-acting 12V high-speed solenoid valve with sub-10ms response time.",
      "Microcontroller coordinating pressure pulse duration with nozzle contraction profile.",
    ],
    mechanicalDesign: [
      "SLA 3D-printed compliant iris petals designed with living flexures to prevent fluid leakage.",
      "CNC aluminum manifold housing with Viton O-ring sealing rated up to 6 bar static pressure.",
      "Rotary-to-linear iris contraction linkage driven by coreless digital servo.",
      "Compact acrylic test chamber with optical alignment rails.",
    ],
    electronicsHardware: [
      "STM32G4 microcontroller featuring high-resolution timer peripherals (HRTIM) for sub-millisecond valve gating.",
      "High-side MOSFET driver with active flyback snubber circuit for fast solenoid de-energization.",
      "Integrated piezoresistive pressure transducer (0–10 bar) monitoring instantaneous plenum pressure.",
      "Adjustable step-up converter supplying 12V–24V boost pulses for accelerated solenoid opening.",
    ],
    embeddedSoftware: [
      "C firmware with timer-synchronized DMA driving concurrent PWM nozzle sweeps and valve strobing.",
      "Tunable aperture modulation curve (linear contraction vs exponential squeeze).",
      "Automated pressure recharge cycle maintaining constant accumulator reserve.",
      "Serial CLI interface for parameter tuning (pulse width, delay, orifice travel).",
    ],
    controlAlgorithms: [
      "Kinematic slug-shaping algorithm computing nozzle contraction rate to equalize impact time across fluid volume.",
      "Feedforward compensation for solenoid opening latency (~6 ms) and fluid inertia.",
      "Hydrodynamic Reynolds and Weber number optimization for focused droplet cohesion.",
    ],
    simulationVsPhysical: {
      simulation:
        "CFD flow velocity profiling and jet breakup simulation in ANSYS Fluent demonstrating trailing slug velocity acceleration of +38%.",
      physical:
        "Benchtop prototype verified coherent water slug cohesion at 0.8 m standoff distance with 42% higher impact force than fixed-orifice nozzle.",
    },
    testingValidation: [
      "High-speed strobe photography capturing jet formation and droplet convergence over 0.3–1.2 m range.",
      "Target load-cell impact dynamometry recording peak impulse force and pulse duration.",
      "Pressure decay profiling across 200 consecutive ejection cycles to verify manifold seal integrity.",
    ],
    metrics: [
      { label: "Nozzle Mechanism", value: "Compliant Iris" },
      { label: "Pulse Duration", value: "15 – 60 ms" },
      { label: "Standoff Range", value: "0.8 – 1.5 m" },
      { label: "Peak Pressure", value: "4.5 bar" },
    ],
    challenges: [
      "Fluid leakage between rotating iris blades under 4 bar pressure, solved by integrating elastomeric backing seals.",
      "Inductive back-EMF transients from high-speed solenoid switching, mitigated with Schottky flyback clamping.",
    ],
    tags: [
      "Fluid Dynamics",
      "Biomimicry",
      "Compliant Mechanism",
      "SolidWorks",
      "Solenoid Timing",
      "CFD",
      "STM32",
    ],
    repoUrl: "https://github.com/Ashwin312007",
    media: [
      {
        type: "image",
        url: "/projects/archerfish-fluid-mechanism.png",
        caption:
          "Archerfish variable-aperture fluid ejection test bench and compliant iris nozzle assembly.",
      },
    ],
    // Backwards-compatible aliases:
    architecture: [
      "Compliant variable-aperture nozzle modulating exit velocity and droplet breakup.",
      "Closed-loop solenoid timing for coherent impulse transfer over distance.",
    ],
    subsystems: [
      { label: "Nozzle", spec: "Variable-aperture compliant iris" },
      { label: "Fluidics", spec: "Pulsed solenoid manifold" },
      { label: "Control", spec: "Trajectory & aperture timing" },
    ],
  },
  {
    id: "nasa-herc",
    index: "03",
    title: "NASA HERC 2026 Teleoperated Planetary Rover",
    shortTitle: "NASA HERC Rover",
    category: "Planetary Robotics & Power Systems",
    categoryGroup: "robotics",
    year: "2026",
    accent: "#9bc1ff",
    motionType: "nasa-rover",
    oneLiner:
      "Award-winning planetary rover securing 6th Place Globally and Best Indian Team at NASA HERC 2026.",
    summary:
      "Engineered by Team MOVIS for the NASA Human Exploration Rover Challenge (Huntsville, AL), competing in the Remote-Controlled (RC) division. Served as Team Head, Software & Electrical Lead for the 30+ member team. Architected the rover's custom high-current Power Distribution Board (PDB) to provide isolated, fused rails for traction brushless motors and mission avionics. Conducted structural FEA on suspension arms and chassis joints to survive extreme simulated lunar/martian obstacle courses, finishing 6th globally with a 7:02 fastest course run.",
    featured: false,
    personalRole:
      "Team Head, Software & Electrical Lead — Custom PDB Architecture, Telemetry & Structural FEA",
    teamSize: "30+ Member Multidisciplinary Team (Team MOVIS)",
    systemArchitecture: [
      "High-current multi-channel Power Distribution Board (PDB) distributing 24V unregulated and regulated 12V/5V/3.3V rails.",
      "Rocker-bogie articulation suspension engineered for high obstacle clearance.",
      "Low-latency wireless telemetry bridge linking onboard computing to ground control station.",
      "Fail-safe hardware emergency stop and autonomous brownout mitigation.",
    ],
    mechanicalDesign: [
      "Aircraft-grade 6061-T6 aluminum suspension linkages and CNC-machined differential pivot.",
      "FEA stress and deformation analysis in SolidWorks Simulation under 3G landing dynamic loads.",
      "Torsional stiffness optimization of chassis backbone yielding safety factor > 2.4 under full payload.",
      "Modular electronics enclosure featuring silicone gaskets for dust and regolith ingress protection.",
    ],
    electronicsHardware: [
      "Custom 4-layer 2oz copper Power Distribution Board (PDB) routed in EasyEDA Pro.",
      "Solid-state high-side N-channel MOSFET switching handling up to 100A continuous bus current.",
      "Optically isolated CAN and RS-485 bus transceivers preventing ground loops between drive motors and avionics.",
      "Precision INA226 current/voltage monitors streaming per-channel telemetry to flight computer.",
    ],
    embeddedSoftware: [
      "Teensy 4.1 supervisor controller executing 100 Hz differential-drive mixing and telemetry packing.",
      "CAN bus motor controller interface commanding velocity and torque setpoints with real-time feedback.",
      "Ground station control protocol with packet CRC validation and loss-of-signal timeout failsafe.",
      "Battery state-of-charge (SoC) estimation and dynamic power throttling.",
    ],
    controlAlgorithms: [
      "Differential-drive kinematic skid-steer algorithm with dynamic wheel traction slip compensation.",
      "Rocker-bogie pitch angle compensation for stability limits over 35° obstacle traverses.",
      "Closed-loop current regulation preventing motor stalls during high-relief rock climbing.",
    ],
    simulationVsPhysical: {
      simulation:
        "Full-assembly SolidWorks FEA validated stress distributions under 2.5 kN shock loads with maximum Von Mises stress well below yield.",
      physical:
        "Successfully completed full Huntsville obstacle course in 7:02, enduring rocks, craters, undulating sand dunes, and steep inclines.",
    },
    testingValidation: [
      "100A sustained load bench test verifying PDB thermal rise stayed under 28°C above ambient.",
      "Vibration and drop testing from 0.5 m height with zero electrical disconnections or structural fractures.",
      "Outdoor terrain proving ground tests verifying 100% telemetry link reliability at 200 m distance.",
    ],
    metrics: [
      { label: "Global Rank", value: "6th Globally" },
      { label: "Division", value: "RC Division" },
      { label: "Recognition", value: "Best Indian Team" },
      { label: "Fastest Run", value: "7:02 Course Time" },
    ],
    challenges: [
      "Managing severe inductive motor back-EMF spikes during rapid reversals on rough terrain, resolved by adding TVS diode arrays and low-ESR bulk electrolytic capacitor banks on the PDB.",
      "Balancing lightweight chassis requirements with high torsional stiffness under asymmetric rock climbs.",
    ],
    tags: [
      "PDB Design",
      "Structural FEA",
      "NASA HERC",
      "Telemetry",
      "Power Electronics",
      "EasyEDA",
      "Team MOVIS",
      "SolidWorks",
    ],
    repoUrl: "https://github.com/Ashwin312007",
    media: [
      {
        type: "image",
        caption:
          "NASA HERC 2026 Rover chassis, custom PDB integration, and Huntsville obstacle course run.",
        isPlaceholder: true,
        placeholderNote: "[TODO: Hardware Photograph / Testing Video from Ashwin]",
      },
    ],
    // Backwards-compatible aliases:
    architecture: [
      "Custom high-current Power Distribution Board (PDB) isolating drive motors and avionics.",
      "End-to-end telemetry and remote-controlled drive software stack.",
      "Structural FEA validation on critical chassis load paths.",
    ],
    subsystems: [
      { label: "Electrical", spec: "Custom Power Distribution Board" },
      { label: "Analysis", spec: "Structural component FEA" },
      { label: "Role", spec: "Team Head, Software & Electrical Lead" },
    ],
  },
  {
    id: "delivery-robot",
    index: "04",
    title: "Autonomous Dual-EKF Ground Delivery Rover",
    shortTitle: "ROS 2 Delivery Rover",
    category: "Autonomous Navigation & Sensor Fusion",
    categoryGroup: "robotics",
    year: "2026",
    accent: "#93c5fd",
    motionType: "ros2-rover",
    oneLiner:
      "Full-stack ROS 2 ground rover fusing LiDAR, 9-DOF IMU, wheel odometry, and GNSS via dual-EKF state estimation.",
    summary:
      "Industrial-grade Autonomous Mobile Robot (AMR) designed for campus and warehouse payload delivery. Implemented a dual-EKF state estimation architecture using the robot_localization ROS 2 package: one filter fusing high-rate wheel encoders and IMU for local continuous odometry, and an outer filter fusing global GNSS and scan-matched poses. Path planning and trajectory execution are driven by Nav2 with Smac Planner and Model Predictive Path Integral (MPPI) controller.",
    featured: false,
    personalRole:
      "Robotics Software & Systems Engineer — Dual-EKF Architecture, Nav2 Tuning & micro-ROS Bridging",
    teamSize: "Collaborative Student Project",
    systemArchitecture: [
      "Dual-EKF architecture fusing 9-DOF IMU, optical wheel encoders, GNSS, and 2D LiDAR.",
      "Nav2 navigation stack orchestrating global Costmaps, Smac path planner, and MPPI local controller.",
      "NVIDIA Jetson Nano companion computer communicating with STM32 motor bridge via micro-ROS.",
      "slam_toolbox and RTAB-Map for 2D/3D occupancy grid generation and loop closure.",
    ],
    mechanicalDesign: [
      "Differential-drive chassis fabricated from laser-cut aluminum plate and 3D-printed brackets.",
      "Independent passive caster suspension accommodating indoor floor irregularities up to 15 mm.",
      "Shock-isolated sensor tower mounting LiDAR at 350 mm height for unobstructed 360° FOV.",
      "Enclosed payload bay with active cooling ventilation for Jetson and motor drivers.",
    ],
    electronicsHardware: [
      "NVIDIA Jetson Nano (4GB) running ROS 2 Humble/Jazzy under Ubuntu 22.04 LTS.",
      "STM32F401 microcontroller handling 1 kHz quadrature encoder decoding and closed-loop motor PWM.",
      "RPLiDAR A2M8 360° laser scanner operating at 10 Hz with 12-meter range.",
      "BNO085 9-DOF IMU delivering drift-compensated orientation quaternion vectors.",
    ],
    embeddedSoftware: [
      "micro-ROS C++ client running on FreeRTOS for deterministic low-level communication.",
      "Hardware abstraction layer with PID speed controllers tuned for planetary gearmotors.",
      "UART serial transport layer transferring twist command velocities and odometry states.",
      "Heartbeat monitoring with emergency motor brake trigger upon lost ROS 2 heartbeat.",
    ],
    controlAlgorithms: [
      "Dual-EKF state estimation with covariance tuning mitigating wheel slip and sensor noise.",
      "Model Predictive Path Integral (MPPI) local trajectory planner evaluating 500+ rollouts in real time.",
      "Regulated Pure Pursuit (RPP) fallback for constrained corridor navigation.",
    ],
    simulationVsPhysical: {
      simulation:
        "High-fidelity Gazebo simulation replicating chassis mass distribution, wheel friction, sensor noise models, and obstacle-rich indoor worlds.",
      physical:
        "Physical rover achieved <5 cm goal-positioning repeatability across 40 m outdoor delivery paths with dynamic obstacle avoidance.",
    },
    testingValidation: [
      "Benchmarking odometry drift: dual-EKF reduced rotational drift by 73% compared to raw wheel odometry over 100 m run.",
      "Nav2 recovery behavior stress tests navigating narrow 80 cm doorways with dynamic pedestrians.",
      "System runtime benchmark: 2.8 hours continuous operation on 14.8V 5200mAh LiPo battery.",
    ],
    metrics: [
      { label: "Localization", value: "Dual-EKF (robot_localization)" },
      { label: "Local Planner", value: "MPPI + RPP" },
      { label: "Mapping", value: "slam_toolbox / RTAB-Map" },
      { label: "Middleware", value: "ROS 2 Humble / Jazzy" },
    ],
    challenges: [
      "Wheel slip on polished floor tiles corrupting dead-reckoning odometry, solved by fusing high-bandwidth IMU angular velocity and laser scan-matching in the dual-EKF.",
      "Jetson CPU throttling under concurrent SLAM and MPPI load, resolved by offloading encoder PID to STM32.",
    ],
    tags: [
      "ROS 2",
      "Nav2",
      "Dual-EKF",
      "RTAB-Map",
      "slam_toolbox",
      "LiDAR",
      "micro-ROS",
      "Smac Planner",
      "Jetson Nano",
    ],
    repoUrl: "https://github.com/Ashwin312007",
    media: [
      {
        type: "image",
        caption:
          "Autonomous Delivery Rover testbed running 2D/3D LiDAR SLAM and Nav2 MPPI local trajectory tracking.",
        isPlaceholder: true,
        placeholderNote: "[TODO: Hardware Photograph / Testing Video from Ashwin]",
      },
    ],
    // Backwards-compatible aliases:
    architecture: [
      "Dual-EKF state estimation fusing IMU, encoders, GNSS, and LiDAR/visual odometry.",
      "Nav2 autonomy with tuned costmaps, MPPI, and Regulated Pure Pursuit.",
      "Jetson-to-microcontroller deterministic actuation bridge.",
    ],
    subsystems: [
      { label: "Localization", spec: "Dual-EKF (robot_localization)" },
      { label: "Navigation", spec: "Nav2 · Smac · MPPI · RPP" },
      { label: "Mapping", spec: "slam_toolbox & RTAB-Map" },
    ],
  },
  {
    id: "air-puff-tonometer",
    index: "05",
    title: "Portable Non-Contact Air-Puff Tonometer",
    shortTitle: "Air-Puff Tonometer",
    category: "Medical Instrumentation & Micro-Pneumatics",
    categoryGroup: "vision-medical",
    year: "2026",
    accent: "#fbbf24",
    motionType: "tonometer",
    patentStatus: "Patent Pending",
    oneLiner:
      "Handheld intraocular pressure diagnostic device using a calibrated micro-pneumatic pulse and optoelectronic sensing.",
    summary:
      "Low-cost, non-contact ophthalmic instrument designed for community glaucoma screening by measuring intraocular pressure (IOP). Replaces massive desktop hospital tonometers with a portable handheld form factor. Features a precision micro-pneumatic pulse circuit combining a miniature diaphragm compressor, accumulator reservoir, and high-speed solenoid valve to deliver a sub-15ms calibrated collimated air pulse against the cornea. Infrared reflectance sensors detect applanation timing. Invention disclosed to the institutional IPR cell.",
    featured: false,
    personalRole:
      "Lead Hardware & Firmware Engineer — Micro-Pneumatic Staging, Transducer Calibration & Embedded Control",
    teamSize: "2 Engineers",
    systemArchitecture: [
      "Miniature closed pneumatic charging circuit with accumulator chamber and fast exhaust solenoid.",
      "Piezoresistive differential pressure transducer sampling plenum pressure profile at 2 kHz.",
      "Infrared emitter-detector optical alignment and corneal applanation detection subsystem.",
      "Low-power microcontroller coordinating pulse generation, sensor capture, and IOP calculation.",
    ],
    mechanicalDesign: [
      "Compact ergonomic handheld housing 3D printed in biocompatible resin.",
      "Precision CNC brass nozzle orifice (1.2 mm inner diameter) producing a laminar, focused air puff.",
      "Vibration-damped micro-compressor mounting isolating optoelectronics from motor vibration.",
      "Modular pneumatic manifold eliminating external silicone tubing to prevent pressure loss.",
    ],
    electronicsHardware: [
      "STM32 microcontroller with high-speed 12-bit ADC peripherals for real-time waveform acquisition.",
      "High-speed low-resistance MOSFET solenoid gate driver with sub-millisecond turn-off response.",
      "Integrated MPX5050DP piezoresistive pressure sensor calibrated against mercury manometer.",
      "OLED diagnostic display displaying instantaneous pressure curve and calculated IOP in mmHg.",
    ],
    embeddedSoftware: [
      "Bare-metal C firmware executing time-critical ADC DMA transfers and solenoid timing.",
      "Digital filtering (low-pass Butterworth) removing high-frequency acoustic noise from pressure stream.",
      "Automatic eye-alignment check using optical reflectance thresholding before triggering pulse.",
      "Calibration look-up tables converting applanation time delta to goldmann-standard mmHg.",
    ],
    controlAlgorithms: [
      "Peak detection algorithm identifying exact applanation inflection point in optical reflection signal.",
      "Dynamic pulse energy calibration compensating for ambient temperature and atmospheric pressure.",
      "Safety pressure limit interlock instantly venting solenoid if chamber pressure exceeds 60 mmHg.",
    ],
    simulationVsPhysical: {
      simulation:
        "CFD transient pneumatic jet simulation modeling nozzle exit velocity and air-puff pressure profile over 10–20 mm working distances.",
      physical:
        "Physical prototype produced repeatable pressure pulses with <1.2% pulse-to-pulse variance across calibrated silicone eye model targets.",
    },
    testingValidation: [
      "Manometer pressure calibration benchmarking transducer linearity across 0–80 mmHg with R² > 0.998.",
      "High-speed optical applanation timing verification using calibrated flexible membrane phantom eyes.",
      "Electrical safety and EMC testing verifying zero risk to patient ocular surfaces.",
    ],
    metrics: [
      { label: "Modality", value: "Non-Contact Air-Puff" },
      { label: "Pulse Rise Time", value: "<15 ms" },
      { label: "Measurement Range", value: "7 – 50 mmHg" },
      { label: "Patent Status", value: "Patent Pending" },
    ],
    challenges: [
      "Achieving an ultra-fast, repeatable air pulse from a miniaturized pump without desktop compressor tanks, solved by integrating a tuned micro-accumulator chamber.",
      "Preventing optical misalignment artifacts from patient micro-movements, solved with a dual-IR triangulation gate.",
    ],
    tags: [
      "Medical Devices",
      "Micro-Pneumatics",
      "Solenoid Control",
      "STM32",
      "Patent Pending",
      "IPR Disclosed",
      "Optoelectronics",
    ],
    repoUrl: "https://github.com/Ashwin312007",
    media: [
      {
        type: "cad",
        caption:
          "CAD section view and micro-pneumatic circuit schematic of the portable non-contact tonometer.",
        isPlaceholder: true,
        placeholderNote: "[TODO: Hardware Photograph / Testing Video from Ashwin]",
      },
    ],
    // Backwards-compatible aliases:
    architecture: [
      "Fast solenoid valve and micro-pump staging for repeatable air pulses.",
      "Embedded pressure sensing and real-time pulse waveform capture.",
    ],
    subsystems: [
      { label: "Pneumatics", spec: "Micro-pump + fast solenoid valve" },
      { label: "Sensing", spec: "Embedded pressure transducer" },
      { label: "IP Status", spec: "Patent Pending · Disclosed to IPR cell" },
    ],
  },
  {
    id: "agri-sorter",
    index: "06",
    title: "Agri-Sorter Multi-Modal Optical & Density Grader",
    shortTitle: "Agri-Sorter System",
    category: "Machine Vision & Mechatronic Automation",
    categoryGroup: "vision-medical",
    year: "2026",
    accent: "#34d399",
    motionType: "agrisort",
    patentStatus: "Patent Pending",
    oneLiner:
      "Automated multi-spectral sorting conveyor combining 850nm NIR imaging, 24-bit digital load cells, and ultrasonic sizing.",
    summary:
      "High-speed mechatronic inspection and sorting conveyor developed for agricultural produce quality assurance. Integrates a Raspberry Pi 5 computing module controlling a NoIR camera surrounded by an 850nm near-infrared LED array. The NIR illumination penetrates fruit skin, exposing subsurface bruising and fungal decay invisible under ambient RGB light. Synchronously samples mass via a 24-bit NAU7802 ADC load-cell stage and fruit volume via ultrasonic ranging to compute density before actuating servo diverters. Invention disclosed to the institutional IPR cell.",
    featured: false,
    personalRole:
      "System Architect & Firmware Engineer — NIR Optical Lighting, 24-bit Load Cell DAQ & Conveyor Motion",
    teamSize: "3 Engineers",
    systemArchitecture: [
      "Modular conveyor bed driven by NEMA 17 stepper motor with precision timing belt indexing.",
      "850nm Near-Infrared (NIR) dome illumination chamber isolating external lighting variations.",
      "24-bit NAU7802 delta-sigma ADC connected to high-precision beam load cell.",
      "Multi-lane servo-actuated divert gates sorting items into grade categories.",
    ],
    mechanicalDesign: [
      "Aluminum extrusion frame (2020 profile) with custom laser-cut acrylic bed and chutes.",
      "Tension-adjustable food-grade PVC conveyor belt with optical encoder tracking.",
      "Low-vibration load-cell isolation mount decoupling conveyor motor harmonics from mass measurement.",
      "CAD modeled in Fusion 360 with full bill of materials and DFM validation.",
    ],
    electronicsHardware: [
      "Raspberry Pi 5 single-board computer executing real-time OpenCV perception and motion control.",
      "NoIR (No Infrared Cut Filter) camera module paired with narrow-band 850nm optical bandpass filter.",
      "NAU7802 24-bit dual-channel ADC reading load cell with internal I2C calibration.",
      "High-torque MG996R servo motors driving mechanical diverter gates.",
    ],
    embeddedSoftware: [
      "Python/C++ application coordinating camera frame capture, ADC polling, and stepper step pulses.",
      "OpenCV contour analysis extracting fruit surface area, aspect ratio, and mean NIR reflectance intensity.",
      "Dynamic load-cell zero-tare and digital moving-average filtering rejecting conveyor vibration.",
      "Asynchronous event-driven queue tracking produce positions from optical trigger to sorting gates.",
    ],
    controlAlgorithms: [
      "Multi-modal grading classifier computing composite quality score from NIR reflectance, mass, and volume.",
      "Encoder-synchronized spatial tracking assigning target ejection deadlines to stepper positions.",
      "PID speed regulation on conveyor drive ensuring uniform item transit time.",
    ],
    simulationVsPhysical: {
      simulation:
        "Modeled optical reflectance dispersion and load cell mechanical vibration resonance in MATLAB, optimizing low-pass filter cutoff frequencies.",
      physical:
        "Physical conveyor sorted 45 items/minute with 94.2% accuracy in detecting internal bruising on apples and tomatoes.",
    },
    testingValidation: [
      "Weighing accuracy bench test: NAU7802 load cell calibrated to ±0.2 g resolution across 0–500 g range.",
      "Blind comparative grading test: NIR sorting detected early rot 4 days before visible exterior decay appeared.",
      "1000-cycle continuous sorting run verifying zero missed items or chute jams at 0.25 m/s belt speed.",
    ],
    metrics: [
      { label: "Optical Spectrum", value: "850nm NIR Active" },
      { label: "Mass Resolution", value: "24-bit (NAU7802 ADC)" },
      { label: "Throughput", value: "45 Items / min" },
      { label: "Patent Status", value: "Patent Pending" },
    ],
    challenges: [
      "Mechanical motor vibrations transmitting through conveyor frame to the load cell, resolved by adding silicone dampening grommets and moving-average DSP filtering.",
      "Controlling ambient light interference in NIR imaging, resolved with a light-sealed tunnel and 850nm bandpass optical filter.",
    ],
    tags: [
      "Machine Vision",
      "850nm NIR",
      "OpenCV",
      "Raspberry Pi 5",
      "NAU7802",
      "Patent Pending",
      "Mechatronics",
      "Automation",
    ],
    repoUrl: "https://github.com/Ashwin312007",
    media: [
      {
        type: "diagram",
        caption:
          "Conveyor testbed layout, 850nm NIR illumination chamber, and load-cell weighing station.",
        isPlaceholder: true,
        placeholderNote: "[TODO: Hardware Photograph / Testing Video from Ashwin]",
      },
    ],
    // Backwards-compatible aliases:
    architecture: [
      "YOLO and OpenCV defect detection under 850nm near-infrared illumination.",
      "NAU7802 digital load-cell weighing synchronized with stepper conveyor indexing.",
    ],
    subsystems: [
      { label: "Vision", spec: "RPi 5 + NoIR Camera + 850nm NIR" },
      { label: "Sensing", spec: "NAU7802 Load Cell + Ultrasonic" },
      { label: "Motion", spec: "Stepper-driven sorting conveyor" },
      { label: "IP Status", spec: "Patent Pending · Disclosed to IPR cell" },
    ],
  },
  {
    id: "isro-drone",
    index: "07",
    title: "ISRO Challenge Autonomous Quadrotor UAV",
    shortTitle: "ISRO Autonomous Drone",
    category: "Aerial Robotics & Autopilot Integration",
    categoryGroup: "robotics",
    year: "2025",
    accent: "#38bdf8",
    motionType: "drone",
    oneLiner:
      "Autonomous multirotor UAV coupling ROS 2 mission compute on a Raspberry Pi companion with a Pixhawk flight controller.",
    summary:
      "Autonomous quadrotor unmanned aerial vehicle developed for the ISRO Robotics Challenge competition track. Integrates a Pixhawk autopilot running PX4 firmware with an onboard Raspberry Pi companion computer running ROS 2. Built MAVLink communication bridges over serial telemetry for autonomous GPS waypoint navigation, automated takeoff/landing sequences, and real-time sensor streaming. Completed flight stability validation and autonomous hover testing.",
    featured: false,
    personalRole:
      "Avionics & Autonomy Engineer — ROS 2 Companion Integration, MAVLink Telemetry & Flight Tuning",
    teamSize: "4 Engineers",
    systemArchitecture: [
      "Pixhawk autopilot executing low-level attitude PID loops and motor mixing.",
      "Raspberry Pi 4 companion computer running ROS 2 mission nodes and state machine.",
      "MAVLink / micro-ROS bidirectional telemetry bridge operating over high-speed UART.",
      "Long-range 2.4 GHz RC link with manual override and 433 MHz telemetry radio.",
    ],
    mechanicalDesign: [
      "450 mm diagonal carbon fiber / nylon composite quadrotor airframe.",
      "Vibration-damped flight controller mounting plate reducing propeller acoustic noise transfer to IMU.",
      "Custom 3D-printed battery tray and companion computer housing.",
      "Quick-release landing gear with integrated carbon fiber battery protection plate.",
    ],
    electronicsHardware: [
      "Pixhawk 4 flight controller with dual redundant internal IMUs and barometer.",
      "Raspberry Pi 4 (4GB) companion computer powered by independent 5V/3A BEC switching regulator.",
      "4x 2212 920KV brushless DC motors paired with 30A BLHeli telemetry ESCs.",
      "High-discharge 4S 14.8V 4500mAh LiPo battery pack providing 16-minute hover endurance.",
    ],
    embeddedSoftware: [
      "PX4 Autopilot firmware customized with tuned attitude and rate PID gains.",
      "ROS 2 companion nodes using MAVROS for waypoint mission dispatch and pose reporting.",
      "Fail-safe geofencing and automatic Return-to-Launch (RTL) on low battery or RC link loss.",
      "Real-time black-box flight logging of IMU data and motor PWM outputs on SD card.",
    ],
    controlAlgorithms: [
      "Cascaded quaternion attitude and angular rate feedback controllers.",
      "GPS and barometer sensor fusion via PX4 internal EKF2 filter for altitude and horizontal position hold.",
      "Motor thrust-to-weight mixing algorithms accounting for aerodynamic propeller torque.",
    ],
    simulationVsPhysical: {
      simulation:
        "Software-In-The-Loop (SITL) simulations in Gazebo coupled to PX4 autopilot verifying autonomous mission waypoint execution before physical flight.",
      physical:
        "Outdoor tethered and free flight testing demonstrated stable altitude hold (±15 cm) and autonomous GPS waypoint following.",
    },
    testingValidation: [
      "Bench dynamometer testing of motor-propeller combinations measuring thrust, current draw, and vibration spectra.",
      "Attitude step-response tuning in flight achieving <8% overshoot on pitch and roll axes.",
      "Failsafe validation verifying automatic RTL trigger when telemetry link was severed.",
    ],
    metrics: [
      { label: "Autopilot", value: "Pixhawk / PX4" },
      { label: "Companion Compute", value: "Raspberry Pi 4" },
      { label: "Middleware", value: "ROS 2 / MAVROS" },
      { label: "Flight Time", value: "16 min Hover" },
    ],
    challenges: [
      "High-frequency propeller vibrations corrupting flight controller accelerometer readings, resolved by tuning soft silicone vibration isolators and notch filtering in PX4.",
      "Reliable bidirectional data serialization between companion computer and flight controller, achieved by configuring high-baud DMA UART.",
    ],
    tags: [
      "ROS 2",
      "Pixhawk",
      "PX4",
      "MAVLink",
      "Raspberry Pi",
      "UAV",
      "Autonomous Flight",
      "Avionics",
    ],
    repoUrl: "https://github.com/Ashwin312007",
    media: [
      {
        type: "image",
        caption:
          "Carbon fiber quadrotor UAV integration with Pixhawk flight controller and companion computer.",
        isPlaceholder: true,
        placeholderNote: "[TODO: Hardware Photograph / Testing Video from Ashwin]",
      },
    ],
    // Backwards-compatible aliases:
    architecture: [
      "Raspberry Pi companion computer running ROS 2 mission nodes.",
      "Pixhawk attitude control and motor-mixing integration.",
    ],
    subsystems: [
      { label: "Autopilot", spec: "Pixhawk flight controller" },
      { label: "Companion", spec: "Raspberry Pi + ROS 2" },
    ],
  },
  {
    id: "line-follower-lqr",
    index: "08",
    title: "High-Speed Mobile Robot with PID & State-Space LQR",
    shortTitle: "PID & LQR Line Robot",
    category: "Modern Control Theory & Dynamic Modeling",
    categoryGroup: "embedded-control",
    year: "2025",
    accent: "#fbbf24",
    motionType: "lqr-line",
    oneLiner:
      "High-speed differential-drive platform rigorously contrasting classical cascaded PID against modern state-space LQR.",
    summary:
      "Designed and built a high-speed differential-drive ground robot to empirically benchmark classical feedback control against optimal modern control. Derived the lateral error state-space equations of motion for the mobile robot dynamics, solved the continuous and discrete algebraic Riccati equations (ARE) in MATLAB to synthesize optimal LQR gain matrices [K], and evaluated tracking error against an optimized dual-loop PID controller at speeds up to 1.8 m/s.",
    featured: false,
    personalRole:
      "Control Systems & Embedded Engineer — Dynamic Modeling, LQR Gain Synthesis & Dual PID Firmware",
    teamSize: "Solo Project",
    systemArchitecture: [
      "8-channel optical infrared reflectance sensor bar sampling track lateral displacement.",
      "Differential-drive drivetrain with precision quadrature encoders for velocity feedback.",
      "Microcontroller running 1 kHz deterministic control loop executing PID or LQR state updates.",
      "Dual H-bridge MOSFET motor driver with regenerative braking.",
    ],
    mechanicalDesign: [
      "Ultra-low center of gravity chassis machined from carbon fiber / FR4 composite.",
      "Drivetrain motors sized from first-principles torque and power curves for rapid acceleration.",
      "Direct-mount high-grip silicone wheels minimizing tire deformation under high lateral G.",
      "Adjustable-height forward sensor boom optimizing optical line triangulation.",
    ],
    electronicsHardware: [
      "STM32 32-bit ARM Cortex-M microcontroller operating at 72 MHz.",
      "Custom IR sensor array with Schmitt-trigger conditioned analog/digital outputs.",
      "Discrete dual H-bridge motor driver capable of 15A peak current per channel.",
      "Onboard OLED display and micro-SD card datalogger for high-rate trajectory telemetry.",
    ],
    embeddedSoftware: [
      "Deterministic bare-metal C++ firmware executed within a hardware timer interrupt at exactly 1.0 kHz.",
      "Fixed-point arithmetic implementation of LQR state-feedback dot product [u = -K*x].",
      "Cascaded PID speed and steering loops with anti-windup clamping and derivative filtering.",
      "Real-time state logging (lateral error, heading angle, motor PWM, battery voltage) at 100 Hz.",
    ],
    controlAlgorithms: [
      "Derived 2-state and 4-state lateral dynamic models in MATLAB/Simulink.",
      "Synthesized optimal LQR gain matrix by iteratively tuning diagonal state cost Q and control cost R.",
      "Benchmark comparison: LQR eliminated line-exit oscillations at sharp 90° transitions where PID exhibited overshoot.",
    ],
    simulationVsPhysical: {
      simulation:
        "Simulink dynamic simulations predicted stable trajectory tracking up to 2.2 m/s with phase margin > 52° under LQR state feedback.",
      physical:
        "Physical track trials demonstrated 1.8 m/s maximum speed with 28% reduced lateral root-mean-square (RMS) error under LQR compared to PID.",
    },
    testingValidation: [
      "Dynamic frequency response testing characterizing motor-gearbox bandwidth.",
      "Step-response track testing over abrupt lateral offsets measuring settling time and overshoot.",
      "Telemetry analysis verifying zero controller saturation under nominal curvature conditions.",
    ],
    metrics: [
      { label: "Control Syntheses", value: "State-Space LQR vs PID" },
      { label: "Loop Frequency", value: "1.0 kHz Deterministic" },
      { label: "Max Speed", value: "1.8 m/s Physical" },
      { label: "Sensors", value: "8-Channel IR Bar" },
    ],
    challenges: [
      "Sensor discretization noise at high forward velocities causing derivative kick in PID, resolved by implementing an alpha-beta state observer before switching to LQR.",
      "Non-linear battery voltage droop during peak acceleration affecting motor output, compensated with feedforward voltage scaling.",
    ],
    tags: [
      "State-Space LQR",
      "Optimal Control",
      "PID Tuning",
      "Riccati Equation",
      "Embedded C++",
      "MATLAB/Simulink",
      "Robotics",
    ],
    repoUrl: "https://github.com/Ashwin312007",
    media: [
      {
        type: "diagram",
        caption:
          "Differential-drive state-space dynamic model, Riccati LQR gain synthesis, and hardware chassis.",
        isPlaceholder: true,
        placeholderNote: "[TODO: Hardware Photograph / Testing Video from Ashwin]",
      },
    ],
    // Backwards-compatible aliases:
    architecture: [
      "State-space dynamic model derivation for optimal LQR gain design.",
      "Dual hardware PID speed and steering loops with IR reflectance array.",
    ],
    subsystems: [
      { label: "Optimal Ctrl", spec: "State-Space LQR" },
      { label: "Hardware Loop", spec: "Dual PID speed & steering" },
    ],
  },
];
