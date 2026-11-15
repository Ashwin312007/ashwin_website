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
      "Designed and delivered a two-day, two-module hands-on workshop on ROS 2, covering fundamentals through intermediate topics including URDF/Xacro and live teleoperation.",
    ],
  },
  {
    period: "May – Jun 2026",
    role: "Engineering Intern",
    organization: "Salcomp Manufacturing",
    location: "Chennai, India",
    type: "Internship",
    highlights: [
      "Applied CAD modeling and Design for Manufacturing (DFM) principles, observing VMC processes, fixtures, and high-volume production workflows on the shop floor.",
    ],
  },
  {
    period: "2025 – 2026",
    role: "Team Head, Software & Electrical Lead",
    organization: "Team MOVIS — NASA Human Exploration Rover Challenge 2026",
    location: "VIT Chennai / Huntsville, AL",
    type: "Leadership",
    highlights: [
      "Led a 30+ member team to a 6th-place global finish (Best Indian Team, fastest run 7:02), responsible for all software and electrical systems.",
      "Designed and built the rover's custom Power Distribution Board (PDB) and ran structural FEA on load-bearing rover components.",
    ],
  },
  {
    period: "May – Jun 2025",
    role: "Embedded System Design Intern",
    organization: "MEL Systems and Services",
    location: "Perungudi, Chennai",
    type: "Internship",
    highlights: [
      "Contributed to the Pick2Lite industrial hardware/IoT product, supporting embedded C/C++ logic (STM32/ESP-IDF) and electronic system architecture.",
    ],
  },
  {
    period: "2024 – Present",
    role: "Secretary & Engineering Lead",
    organization: "AutoVIT Robotics Club, VIT Chennai",
    location: "Chennai, India",
    type: "Leadership",
    highlights: [
      "Coordinate technical activities, recruitment drives, hands-on workshops, and autonomous-vehicle projects while mentoring student teams in robotics and embedded systems.",
    ],
  },
];

export const ACHIEVEMENTS: AchievementRecord[] = [
  {
    metric: "06TH GLOBALLY",
    title: "NASA Human Exploration Rover Challenge 2026",
    organization: "NASA · Huntsville, AL",
    detail: "Remote-Controlled Division · Best Indian Team · Fastest run 7:02",
  },
  {
    metric: "SEMI-FINALIST",
    title: "Caterpillar Autonomy Challenge",
    organization: "IIT Madras & Caterpillar",
    detail: "Hardware and autonomous systems integration role",
  },
  {
    metric: "01ST PLACE",
    title: "REVIVE 2024 National Hackathon",
    organization: "National Level",
    detail: "1st Place Winner · Hardware and embedded systems build",
  },
  {
    metric: "03RD PLACE",
    title: "Innovate National Hackathon",
    organization: "National Level",
    detail: "3rd Place Nationally · Rapid mechatronic prototyping",
  },
  {
    metric: "FINALIST",
    title: "Project Expo — BITS Hyderabad",
    organization: "BITS Pilani, Hyderabad Campus",
    detail: "Selected national finalist for applied robotics engineering",
  },
];
