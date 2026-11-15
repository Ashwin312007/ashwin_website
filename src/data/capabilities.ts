export interface CapabilityRecord {
  index: string;
  title: string;
  subtitle: string;
  description: string;
  skills: string[];
  appliedIn: string[];
  glyphType: "ros2" | "ekf" | "cad" | "embedded" | "vision" | "electronics";
}

// Plan.pdf P6: Six numbered rows from the resume's 6-group skill matrix
export const CAPABILITIES: CapabilityRecord[] = [
  {
    index: "01",
    title: "Robotics & ROS 2",
    subtitle: "Middleware, Nav2 autonomy, and 2D/3D SLAM pipelines.",
    description:
      "Full-stack ROS 2 architecture across Humble and Jazzy: ros2_control hardware interfaces, URDF/Xacro modeling, custom messages/services/actions, micro-ROS, Nav2 (costmaps, NavFn/Smac, MPPI, Regulated Pure Pursuit), slam_toolbox, and RTAB-Map.",
    skills: [
      "ROS 2 (ros2_control, URDF/Xacro)",
      "Nav2 (NavFn/Smac, MPPI, RPP)",
      "SLAM (slam_toolbox, RTAB-Map)",
      "micro-ROS",
      "Custom Msgs / Actions",
    ],
    appliedIn: ["Autonomous Delivery Rover", "ISRO Autonomous Drone", "AutoVIT ROS 2 Workshop"],
    glyphType: "ros2",
  },
  {
    index: "02",
    title: "Estimation & Control",
    subtitle: "Multi-sensor Kalman fusion and state-space optimal control.",
    description:
      "Designing dual-EKF and UKF state estimators with robot_localization (fusing IMU, wheel odometry, GNSS, and LiDAR/visual odometry), Kalman/complementary/IIR/FIR filters, hardware-tuned PID, state-space LQR, and differential-drive/manipulator FK/IK.",
    skills: [
      "EKF / UKF (robot_localization, dual-EKF)",
      "Kalman, Complementary, IIR/FIR",
      "PID & State-Space LQR",
      "Differential-Drive & Manipulator FK/IK",
      "Covariance Tuning",
    ],
    appliedIn: ["Autonomous Delivery Rover", "Line-Following Robot (PID & LQR)"],
    glyphType: "ekf",
  },
  {
    index: "03",
    title: "Mechanical, CAD/FEA & Simulation",
    subtitle: "Compliant mechanisms, structural FEA, DFM, and physics simulation.",
    description:
      "Parametric 3D assembly modeling in SolidWorks and Fusion 360, structural FEA validation, Design for Manufacturing (DFM) with shop-floor VMC fixture exposure, rigid + flexible TPU 95A/90A 3D printing, and multi-friction simulation in Gazebo and Webots.",
    skills: [
      "SolidWorks & Fusion 360",
      "Structural FEA",
      "DFM & VMC Exposure",
      "3D Printing (Rigid + Flexible TPU)",
      "Gazebo & Webots",
    ],
    appliedIn: ["Peristaltic Crawling Robot", "NASA HERC 2026 Rover", "Salcomp Internship"],
    glyphType: "cad",
  },
  {
    index: "04",
    title: "Embedded Systems & Firmware",
    subtitle: "Real-time C/C++ firmware, RTOS scheduling, and edge compute.",
    description:
      "Developing deterministic firmware in Embedded C/C++ and Python with FreeRTOS, STM32 HAL, ESP-IDF (ESP32), Arduino, Raspberry Pi 5, and NVIDIA Jetson Nano for high-reliability actuation and sensor acquisition.",
    skills: [
      "Embedded C/C++ & Python",
      "FreeRTOS",
      "ESP32 (ESP-IDF) & STM32 (HAL)",
      "Raspberry Pi 5 & Jetson Nano",
      "Arduino",
    ],
    appliedIn: ["Pick2Lite (MEL Systems)", "Portable Air-Puff Tonometer", "Peristaltic Crawler"],
    glyphType: "embedded",
  },
  {
    index: "05",
    title: "Vision & Machine Learning",
    subtitle: "Real-time edge inference and multi-spectral optical grading.",
    description:
      "Building computer vision and deep learning perception pipelines using OpenCV, YOLO, PyTorch, and TensorFlow, including 850nm near-infrared (NIR) active illumination for non-destructive defect detection.",
    skills: [
      "OpenCV",
      "YOLO Object/Defect Detection",
      "PyTorch & TensorFlow",
      "850nm NIR Imaging",
      "Multi-Modal Sensor Fusion",
    ],
    appliedIn: ["Agri-Sorter Multi-Modal System", "Autonomous Delivery Rover"],
    glyphType: "vision",
  },
  {
    index: "06",
    title: "Electronics & Hardware Protocols",
    subtitle: "Custom power distribution boards, circuit simulation, and bus protocols.",
    description:
      "Schematic capture and custom PCB/PDB layout in EasyEDA, analog/switching simulation in LTspice, and low-level driver integration across I2C, SPI, UART, RS-232, RS-485, 1-Wire, and I2S buses.",
    skills: [
      "EasyEDA & Custom PDB Design",
      "LTspice Circuit Simulation",
      "I2C · SPI · UART",
      "RS-232 · RS-485 · 1-Wire · I2S",
      "Git & Linux",
    ],
    appliedIn: ["NASA HERC Rover PDB", "Pick2Lite (MEL Systems)", "Agri-Sorter"],
    glyphType: "electronics",
  },
];
