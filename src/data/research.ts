export interface ResearchInterestRecord {
  id: string;
  title: string;
  category: string;
  hypothesis: string;
  methodology: string;
  relevanceToRobotics: string;
  relatedProjects: string[];
  status: "Active Research Direction" | "Theoretical Formulation";
}

export const RESEARCH_INTERESTS: ResearchInterestRecord[] = [
  {
    id: "animal-peristalsis",
    title: "Animal-Inspired Locomotion & Peristalsis",
    category: "Biomimetic Locomotion",
    hypothesis:
      "Metameric, segmented radial-axial expansion waves (retrograde peristalsis) enable self-propulsion through unpredictable, confined pipe geometries with lower continuous normal wall forces than rigid wheeled or tracked crawlers.",
    methodology:
      "Simulating elastomeric and tendon wave mechanics in Gazebo and Webots under variable friction regimes (μ = 0.15 to 0.4), coupled with empirical traction-force dynamometry on physical multi-segment TPU prototypes.",
    relevanceToRobotics:
      "Enables autonomous non-destructive inspection of sub-surface pipelines, heat-exchanger tubes, and civil conduits that cause wheeled rovers to high-center or jam.",
    relatedProjects: ["bio-pipe-robot"],
    status: "Active Research Direction",
  },
  {
    id: "soft-compliant-mechanisms",
    title: "Soft & Compliant Robotic Mechanisms",
    category: "Compliant & Continuum Robotics",
    hypothesis:
      "Monolithic compliant flexures with distributed strain energy storage can eliminate multi-link joint backlash and friction while surviving high-cycle dynamic loading without lubrication.",
    methodology:
      "Non-linear hyperelastic FEA modeling of Shore 95A/90A TPU and silicone elastomers, combined with additive manufacturing and cyclic fatigue stress testing under high-rate deformation.",
    relevanceToRobotics:
      "Fundamental to delicate medical devices (such as non-contact air-puff tonometry), adaptive variable-aperture nozzles, and human-collaborative soft robotic grippers.",
    relatedProjects: ["bio-pipe-robot", "archerfish-ejection", "air-puff-tonometer"],
    status: "Active Research Direction",
  },
  {
    id: "confined-space-locomotion",
    title: "Confined-Space Locomotion & Pipe Crawlers",
    category: "In-Pipe Robotics & Extreme Environments",
    hypothesis:
      "Decoupling radial anchoring from axial stroke extension via localized, phase-locked tendon actuation prevents cumulative friction lockup across vertical climbs and tight pipe elbow bends.",
    methodology:
      "Benchmarking tractive pull-force and payload capacity in variable-diameter acrylic pipe fixtures (80–150 mm ID) across 0° to 90° pipe inclinations with motor current stall detection.",
    relevanceToRobotics:
      "Solves critical robotic entrapment risks in municipal water infrastructure, chemical processing plants, and nuclear cooling networks.",
    relatedProjects: ["bio-pipe-robot"],
    status: "Active Research Direction",
  },
  {
    id: "bio-mechanical-design",
    title: "Bio-Inspired Mechanical Design",
    category: "Functional Morphology & Bionics",
    hypothesis:
      "Translating evolutionary morphology—such as the variable-aperture hydrodynamic iris of the archerfish or the hydrostatic skeleton of annelids—yields superior power density and mechanical efficiency compared to conventional rigid kinematic linkages.",
    methodology:
      "Synthesizing parametric 3D CAD models in SolidWorks and Autodesk Fusion 360 derived from biological high-speed kinematics, verified through computational fluid dynamics (CFD) and structural stress FEA.",
    relevanceToRobotics:
      "Transforms traditional high-mass industrial automation into agile, low-inertia mechanisms capable of high-impulse manipulation and fluid ejection.",
    relatedProjects: ["archerfish-ejection", "bio-pipe-robot"],
    status: "Theoretical Formulation",
  },
  {
    id: "embedded-realtime-control",
    title: "Embedded Control & Real-Time Systems",
    category: "Deterministic Embedded Firmware",
    hypothesis:
      "Microsecond-deterministic RTOS task scheduling coupled with hardware timer interrupts enables complex multi-actuator wave synchronization and sensor acquisition without requiring bulky centralized computers.",
    methodology:
      "Profiling interrupt latency, task jitter, and context-switching overhead on STM32 (HAL/FreeRTOS) and ESP32 (ESP-IDF) platforms using digital storage oscilloscopes and logic analyzers across 1 kHz+ control loops.",
    relevanceToRobotics:
      "Crucial for sub-15ms micro-pneumatic pulse control in ophthalmic diagnostics, reliable multi-channel power distribution, and decentralized robotic locomotion.",
    relatedProjects: ["bio-pipe-robot", "air-puff-tonometer", "nasa-herc", "line-follower-lqr"],
    status: "Active Research Direction",
  },
  {
    id: "sensor-fusion-estimation",
    title: "Multi-Sensor Fusion & State Estimation",
    category: "State Estimation & Optimal Control",
    hypothesis:
      "Cascaded dual Extended Kalman Filtering (continuous odom frame + global map frame) combined with optimal state-space LQR feedback guarantees bounded drift and trajectory stability under aggressive terrain slips and intermittent GNSS availability.",
    methodology:
      "Formulating covariance-tuned EKF models in the ROS 2 robot_localization framework, validating state tracking against ground-truth indoor optical motion capture, and synthesizing Algebraic Riccati Equation (ARE) solutions.",
    relevanceToRobotics:
      "Provides planetary rovers, autonomous ground vehicles, and multirotor drones with resilient, drift-free localization in GPS-denied and non-structured terrains.",
    relatedProjects: ["delivery-robot", "nasa-herc", "line-follower-lqr", "isro-drone"],
    status: "Active Research Direction",
  },
];
