export interface CapabilityRecord {
  index: string;
  title: string;
  subtitle: string;
  description: string;
  skills: string[];
  appliedIn: string[];
  glyphType: "ros2" | "ekf" | "cad" | "embedded" | "vision" | "electronics";
}

export const CAPABILITIES: CapabilityRecord[] = [
  {
    index: "01",
    title: "Robotics & ROS 2",
    subtitle: "Middleware, Nav2 autonomy, and 2D/3D SLAM pipelines.",
    description:
      "Full-stack ROS 2 architecture across Humble and Jazzy distributions: ros2_control hardware interfaces, URDF/Xacro kinematic modeling, custom messages/services/actions, micro-ROS client integration, Nav2 navigation stack (costmap tuning, NavFn/Smac planners, MPPI, and Regulated Pure Pursuit), and 2D/3D SLAM via slam_toolbox and RTAB-Map.",
    skills: [
      "ROS 2 (ros2_control, URDF/Xacro)",
      "Nav2 (NavFn/Smac, MPPI, RPP)",
      "SLAM (slam_toolbox, RTAB-Map)",
      "micro-ROS",
      "Custom Msgs / Actions",
    ],
    appliedIn: [
      "Autonomous Delivery Rover",
      "ISRO Autonomous Drone",
      "AutoVIT ROS 2 Workshop",
    ],
    glyphType: "ros2",
  },
  {
    index: "02",
    title: "Estimation & Control",
    subtitle: "Multi-sensor Kalman fusion and state-space optimal control.",
    description:
      "Synthesizing dual-EKF and UKF state estimators with robot_localization (fusing 9-DOF IMU, wheel odometry, GNSS, and LiDAR/visual odometry), complementary and IIR/FIR digital filtering, hardware-tuned cascaded PID, continuous/discrete state-space LQR, and differential-drive/manipulator forward and inverse kinematics.",
    skills: [
      "EKF / UKF (robot_localization, dual-EKF)",
      "Kalman, Complementary, IIR/FIR",
      "PID & State-Space LQR",
      "Differential-Drive & Manipulator FK/IK",
      "Covariance Tuning",
    ],
    appliedIn: [
      "Autonomous Delivery Rover",
      "PID & LQR Line Robot",
      "Earthworm Peristaltic Pipe Robot",
    ],
    glyphType: "ekf",
  },
  {
    index: "03",
    title: "Mechanical, CAD/FEA & Simulation",
    subtitle: "Compliant mechanisms, structural FEA, DFM, and physics simulation.",
    description:
      "Parametric 3D assembly modeling in SolidWorks and Autodesk Fusion 360, linear and non-linear structural FEA stress/deflection validation, Design for Manufacturing (DFM) with shop-floor VMC tooling exposure, rigid + compliant Shore 95A/90A TPU 3D printing, and multi-friction dynamic simulation in Gazebo and Webots.",
    skills: [
      "SolidWorks & Fusion 360",
      "Structural FEA Simulation",
      "DFM & VMC Tooling Exposure",
      "3D Printing (Rigid + Flexible TPU)",
      "Gazebo & Webots Physics",
    ],
    appliedIn: [
      "Earthworm Peristaltic Pipe Robot",
      "Archerfish Fluid Jet",
      "NASA HERC 2026 Rover",
      "Salcomp Internship",
    ],
    glyphType: "cad",
  },
  {
    index: "04",
    title: "Embedded Systems & Firmware",
    subtitle: "Real-time C/C++ firmware, RTOS scheduling, and edge compute.",
    description:
      "Developing deterministic bare-metal and RTOS firmware in Embedded C/C++ and Python. Leveraging FreeRTOS preemptive multitasking, STM32 HAL/LL, ESP-IDF (ESP32), Arduino, Raspberry Pi 5, and NVIDIA Jetson Nano for microsecond-critical actuation, sensor acquisition, and telemetry streaming.",
    skills: [
      "Embedded C/C++ & Python",
      "FreeRTOS Preemptive Multitasking",
      "ESP32 (ESP-IDF) & STM32 (HAL)",
      "Raspberry Pi 5 & Jetson Nano",
      "Hardware Timer PWM & DMA",
    ],
    appliedIn: [
      "Pick2Lite (MEL Systems)",
      "Portable Air-Puff Tonometer",
      "Earthworm Peristaltic Pipe Robot",
    ],
    glyphType: "embedded",
  },
  {
    index: "05",
    title: "Vision & Machine Learning",
    subtitle: "Real-time edge inference and multi-spectral optical grading.",
    description:
      "Engineering computer vision and edge machine learning perception pipelines using OpenCV, YOLO, PyTorch, and TensorFlow. Implementing 850nm near-infrared (NIR) active illumination systems for non-destructive subsurface defect detection and multi-modal feature fusion.",
    skills: [
      "OpenCV Computer Vision",
      "YOLO Object/Defect Detection",
      "PyTorch & TensorFlow",
      "850nm NIR Active Illumination",
      "Multi-Modal Sensor Fusion",
    ],
    appliedIn: [
      "Agri-Sorter System (Patent Pending)",
      "Autonomous Delivery Rover",
    ],
    glyphType: "vision",
  },
  {
    index: "06",
    title: "Electronics & Hardware Protocols",
    subtitle: "Custom power distribution boards, circuit simulation, and bus protocols.",
    description:
      "Schematic capture and custom high-current PCB/PDB layout in EasyEDA Pro, analog and switching power simulation in LTspice, and robust low-level peripheral driver development across I2C, SPI, UART, RS-232, RS-485, 1-Wire, and I2S hardware buses.",
    skills: [
      "EasyEDA Pro & Custom PDB Layout",
      "LTspice Circuit Simulation",
      "I2C · SPI · UART",
      "RS-232 · RS-485 · 1-Wire · I2S",
      "Git & Linux Toolchains",
    ],
    appliedIn: [
      "NASA HERC Rover Custom PDB",
      "Pick2Lite (MEL Systems)",
      "Agri-Sorter System (Patent Pending)",
    ],
    glyphType: "electronics",
  },
];
