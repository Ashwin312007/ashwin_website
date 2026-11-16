export interface ExperienceRecord {
  period: string;
  role: string;
  organization: string;
  location: string;
  type: "Internship" | "Leadership" | "Teaching" | "Research";
  highlights: string[];
}

export interface AchievementRecord {
  metric: string;
  title: string;
  organization: string;
  detail: string;
}

export const EXPERIENCE: ExperienceRecord[] = [
  {
    period: "Oct 2026",
    role: "Designer & Instructor — ROS 2 Workshop",
    organization: "AutoVIT, VIT Chennai",
    location: "Chennai, India",
    type: "Teaching",
    highlights: [
      "Designed and delivered an intensive two-day, two-module hands-on workshop on ROS 2 Humble/Jazzy for 40+ engineering students, covering middleware architecture, ros2_control, URDF/Xacro modeling, and teleoperation.",
    ],
  },
  {
    period: "May – Jun 2026",
    role: "Engineering Intern",
    organization: "Salcomp Manufacturing",
    location: "Chennai, India",
    type: "Internship",
    highlights: [
      "Applied CAD modeling and Design for Manufacturing (DFM) principles, studying high-volume production workflows, vertical machining center (VMC) tooling, and precision assembly fixtures on the shop floor.",
    ],
  },
  {
    period: "2025 – 2026",
    role: "Team Head, Software & Electrical Lead",
    organization: "Team MOVIS — NASA Human Exploration Rover Challenge 2026",
    location: "Huntsville, AL / VIT Chennai",
    type: "Leadership",
    highlights: [
      "Led a 30+ member multidisciplinary team to a 6th-place global finish (Remote-Controlled Division) and 'Best Indian Team' award at NASA HERC in Huntsville, AL, achieving a 7:02 fastest course run.",
      "Architected and routed the rover's custom high-current Power Distribution Board (PDB) isolating motor noise from avionics, and conducted structural FEA on suspension arms and chassis load paths.",
    ],
  },
  {
    period: "May – Jun 2025",
    role: "Embedded System Design Intern",
    organization: "MEL Systems and Services",
    location: "Perungudi, Chennai",
    type: "Internship",
    highlights: [
      "Contributed to the Pick2Lite industrial hardware/IoT product, developing deterministic embedded C/C++ logic (STM32/ESP-IDF) and verifying RS-485/Modbus industrial communication bus architecture.",
    ],
  },
  {
    period: "2024 – Present",
    role: "Secretary & Engineering Lead",
    organization: "AutoVIT Robotics Club, VIT Chennai",
    location: "Chennai, India",
    type: "Leadership",
    highlights: [
      "Coordinate technical roadmap, recruitment, hands-on robotics workshops, and autonomous-vehicle project tracks while mentoring collegiate teams in ROS 2, CAD/FEA, and embedded systems.",
    ],
  },
];

export const ACHIEVEMENTS: AchievementRecord[] = [
  {
    metric: "06TH GLOBALLY",
    title: "NASA Human Exploration Rover Challenge 2026",
    organization: "NASA · Huntsville, AL",
    detail: "Remote-Controlled Division · Best Indian Team · 7:02 Fastest Course Run",
  },
  {
    metric: "PATENT PENDING",
    title: "Multi-Modal Agri-Sorter Optical & Density Grader",
    organization: "Institutional IPR Cell",
    detail: "850nm NIR active illumination + 24-bit NAU7802 mass & ultrasonic sizing system",
  },
  {
    metric: "PATENT PENDING",
    title: "Portable Non-Contact Air-Puff Tonometer",
    organization: "Institutional IPR Cell",
    detail: "Micro-pneumatic rapid solenoid pulse & corneal applanation optoelectronics",
  },
  {
    metric: "SEMI-FINALIST",
    title: "Caterpillar Autonomy Challenge",
    organization: "IIT Madras & Caterpillar",
    detail: "Autonomous navigation stack and hardware systems integration role",
  },
  {
    metric: "01ST PLACE",
    title: "REVIVE 2024 National Hackathon",
    organization: "National Level",
    detail: "1st Place Winner · Rapid embedded hardware and sensor integration build",
  },
  {
    metric: "03RD PLACE",
    title: "Innovate National Hackathon",
    organization: "National Level",
    detail: "3rd Place Nationally · Mechatronic rapid prototyping and control",
  },
  {
    metric: "FINALIST",
    title: "Project Expo — BITS Hyderabad",
    organization: "BITS Pilani, Hyderabad Campus",
    detail: "Selected national finalist for applied robotics engineering demonstration",
  },
];
