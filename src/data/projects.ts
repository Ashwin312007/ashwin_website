export interface ProjectRecord {
  id: string;
  index: string;
  title: string;
  shortTitle: string;
  category: string;
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
  architecture: string[];
  subsystems: { label: string; spec: string }[];
  metrics: { label: string; value: string }[];
  tags: string[];
}

export const PROJECTS: ProjectRecord[] = [
  {
    id: "bio-pipe-robot",
    index: "01",
    title: "Earthworm Peristaltic Pipe Robot",
    shortTitle: "Peristaltic Crawler",
    category: "Biomimicry",
    year: "2026",
    accent: "#34d399",
    motionType: "peristaltic",
    oneLiner:
      "Three-segment tendon crawler that anchors radially and extends axially inside confined pipes.",
    summary:
      "Modeled in Fusion 360 and SolidWorks for rigid-plus-TPU 3D printing, with an ESP32 sequencing peristaltic waves validated across surface frictions in Gazebo and Webots.",
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
    metrics: [
      { label: "Segments", value: "3" },
      { label: "Actuation", value: "Tendon + TPU" },
      { label: "Sim", value: "Gazebo / Webots" },
    ],
    tags: ["Fusion 360", "SolidWorks", "TPU", "ESP32", "Gazebo"],
  },
  {
    id: "archerfish-ejection",
    index: "02",
    title: "Archerfish Variable-Aperture Jet",
    shortTitle: "Archerfish Fluid Jet",
    category: "Fluid Control",
    year: "2026",
    accent: "#38bdf8",
    motionType: "archerfish",
    oneLiner:
      "Dynamic nozzle that contracts its aperture mid-pulse to focus high-impulse water jets.",
    summary:
      "Reproduces the archerfish's variable-aperture fluid propulsion, synchronizing valve timing and nozzle contraction to manipulate parabolic jet trajectories.",
    architecture: [
      "Compliant variable-aperture nozzle modulating exit velocity and droplet breakup.",
      "Closed-loop solenoid timing for coherent impulse transfer over distance.",
    ],
    subsystems: [
      { label: "Nozzle", spec: "Variable-aperture compliant iris" },
      { label: "Fluidics", spec: "Pulsed solenoid manifold" },
      { label: "Control", spec: "Trajectory & aperture timing" },
    ],
    metrics: [
      { label: "Nozzle", value: "Var-Aperture" },
      { label: "Regime", value: "Pulsed Jet" },
      { label: "Status", value: "Prototype" },
    ],
    tags: ["Fluid Dynamics", "Biomimicry", "Compliant Mechanism", "CAD"],
  },
  {
    id: "nasa-herc",
    index: "03",
    title: "NASA HERC 2026 Rover",
    shortTitle: "NASA HERC Rover",
    category: "Space Robotics",
    year: "2026",
    accent: "#9bc1ff",
    motionType: "nasa-rover",
    oneLiner:
      "6th globally and Best Indian Team at NASA HERC 2026 with a 7:02 fastest course run.",
    summary:
      "Led software and electrical systems for a 30+ member team (Team MOVIS), designing the custom Power Distribution Board (PDB) and running structural FEA on load-bearing components.",
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
    metrics: [
      { label: "Global Rank", value: "6th" },
      { label: "Fastest Run", value: "7:02" },
      { label: "Team", value: "30+ Members" },
    ],
    tags: ["PDB Design", "Structural FEA", "NASA HERC", "Telemetry"],
  },
  {
    id: "delivery-robot",
    index: "04",
    title: "Autonomous Delivery Rover",
    shortTitle: "ROS 2 Delivery Rover",
    category: "Autonomy",
    year: "2026",
    accent: "#93c5fd",
    motionType: "ros2-rover",
    oneLiner:
      "ROS 2 ground rover fusing LiDAR, IMU, wheel encoders, and GNSS through a dual-EKF stack.",
    summary:
      "Uses robot_localization (odom and map filters), Nav2 with Smac/NavFn planners and MPPI/Pure Pursuit controllers, plus 2D/3D SLAM via slam_toolbox and RTAB-Map.",
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
    metrics: [
      { label: "Filter", value: "Dual-EKF" },
      { label: "Control", value: "MPPI + RPP" },
      { label: "Stack", value: "ROS 2" },
    ],
    tags: ["ROS 2", "Nav2", "Dual-EKF", "RTAB-Map", "LiDAR"],
  },
  {
    id: "air-puff-tonometer",
    index: "05",
    title: "Portable Air-Puff Tonometer",
    shortTitle: "Air-Puff Tonometer",
    category: "Medical Hardware",
    year: "2026",
    accent: "#fbbf24",
    motionType: "tonometer",
    oneLiner:
      "Non-contact intraocular pressure sensor using a calibrated micro-pneumatic solenoid pulse.",
    summary:
      "Combines miniature pneumatic valving, pump staging, and embedded pressure sensing to produce a controlled air pulse for corneal applanation. Disclosed to the institute IPR cell.",
    architecture: [
      "Fast solenoid valve and micro-pump staging for repeatable air pulses.",
      "Embedded pressure sensing and real-time pulse waveform capture.",
    ],
    subsystems: [
      { label: "Pneumatics", spec: "Micro-pump + fast solenoid valve" },
      { label: "Sensing", spec: "Embedded pressure transducer" },
      { label: "IP Status", spec: "Invention disclosed to IPR cell" },
    ],
    metrics: [
      { label: "Mode", value: "Non-Contact" },
      { label: "Pulse", value: "Pneumatic" },
      { label: "Status", value: "IPR Disclosed" },
    ],
    tags: ["Pneumatics", "Embedded C", "Solenoid", "MedTech"],
  },
  {
    id: "agri-sorter",
    index: "06",
    title: "Agri-Sorter Optical Grader",
    shortTitle: "Agri-Sorter System",
    category: "Machine Vision",
    year: "2026",
    accent: "#34d399",
    motionType: "agrisort",
    oneLiner:
      "Multi-modal fruit sorting conveyor pairing 850nm NIR vision with load-cell and ultrasonic sensing.",
    summary:
      "Built on a Raspberry Pi 5 with a stepper-driven conveyor, NoIR camera under 850nm NIR LEDs, NAU7802 24-bit load cell, and ultrasonic transducers for non-destructive grading.",
    architecture: [
      "YOLO and OpenCV defect detection under 850nm near-infrared illumination.",
      "NAU7802 digital load-cell weighing synchronized with stepper conveyor indexing.",
    ],
    subsystems: [
      { label: "Vision", spec: "RPi 5 + NoIR Camera + 850nm NIR" },
      { label: "Sensing", spec: "NAU7802 Load Cell + Ultrasonic" },
      { label: "Motion", spec: "Stepper-driven sorting conveyor" },
    ],
    metrics: [
      { label: "Compute", value: "RPi 5" },
      { label: "Optical", value: "850nm NIR" },
      { label: "ADC", value: "NAU7802" },
    ],
    tags: ["Raspberry Pi 5", "YOLO", "OpenCV", "850nm NIR"],
  },
  {
    id: "isro-drone",
    index: "07",
    title: "ISRO Challenge Autonomous Drone",
    shortTitle: "ISRO Autonomous UAV",
    category: "Aerial Robotics",
    year: "2025",
    accent: "#38bdf8",
    motionType: "drone",
    oneLiner:
      "Multirotor UAV integrating ROS 2 onboard compute with a Pixhawk flight controller.",
    summary:
      "Developed autonomous flight logic and motor-control integration using ROS 2, Raspberry Pi, and Pixhawk, achieving stable manual flight and partial autonomous functions.",
    architecture: [
      "Raspberry Pi companion computer running ROS 2 mission nodes.",
      "Pixhawk attitude control and motor-mixing integration.",
    ],
    subsystems: [
      { label: "Autopilot", spec: "Pixhawk flight controller" },
      { label: "Companion", spec: "Raspberry Pi + ROS 2" },
    ],
    metrics: [
      { label: "Flight", value: "Pixhawk" },
      { label: "Stack", value: "ROS 2" },
      { label: "Compute", value: "Raspberry Pi" },
    ],
    tags: ["ROS 2", "Pixhawk", "Raspberry Pi", "UAV"],
  },
  {
    id: "line-follower-lqr",
    index: "08",
    title: "PID & LQR Line-Following Robot",
    shortTitle: "PID & LQR Robot",
    category: "Control Theory",
    year: "2025",
    accent: "#fbbf24",
    motionType: "lqr-line",
    oneLiner:
      "High-speed differential-drive robot comparing hardware-tuned PID loops against a state-space LQR controller.",
    summary:
      "Sized drivetrain motors for torque and runtime, tuned hardware PID speed and steering loops with reflectance sensing, and synthesized an LQR controller on the robot's dynamic model.",
    architecture: [
      "State-space dynamic model derivation for optimal LQR gain design.",
      "Dual hardware PID speed and steering loops with IR reflectance array.",
    ],
    subsystems: [
      { label: "Optimal Ctrl", spec: "State-Space LQR" },
      { label: "Hardware Loop", spec: "Dual PID speed & steering" },
    ],
    metrics: [
      { label: "Control", value: "PID + LQR" },
      { label: "Model", value: "State-Space" },
      { label: "Motors", value: "Torque-Sized" },
    ],
    tags: ["LQR", "PID", "State-Space", "Embedded C++"],
  },
];
