import type { ProjectData } from "@/types";

export const PROJECTS_DATA: ProjectData[] = [
  {
    id: "nasa-herc", title: "NASA HERC Rover", category: "Competition engineering", status: "6th place globally",
    description: "Electrical and software architecture for Team MOVIS at NASA HERC. Power distribution, motor control, and embedded systems built for the competition field.",
    highlights: ["Engineered the rover’s power distribution system", "Developed motor control logic and embedded software", "Contributed as programming lead, HERC point of contact, and advisory board member", "Team result: 6th globally and Best Indian Team"],
    stack: ["Motor control", "Power electronics", "Embedded C/C++"], links: []
  },
  {
    id: "agri-sorter", title: "Agri-Sorter", category: "Agricultural automation", status: "Patent pending",
    description: "Computer vision meets mechanical sorting. An automated classification system designed for high-throughput agricultural workflows.",
    highlights: ["Filed a patent for the automated sorting system", "Integrated computer vision with mechanical sorting mechanisms", "Designed for high-throughput classification"],
    stack: ["Computer vision", "Mechatronics", "Automation"], links: []
  },
  {
    id: "air-puff-tonometer", title: "Portable Air-Puff Tonometer", category: "Medical device research", status: "Patent pending",
    description: "A non-contact approach to intraocular pressure measurement, combining micro-pneumatics with embedded sensing in a portable device.",
    highlights: ["Filed a patent for the non-contact device", "Designed the micro-pneumatic systems", "Developed the embedded sensing architecture"],
    stack: ["Micro-pneumatics", "Embedded sensing", "Medical devices"], links: []
  },
  {
    id: "delivery-robot", title: "Autonomous Delivery Robot", category: "Autonomous logistics", status: "In development",
    description: "A SLAM-based delivery robot with LiDAR navigation and custom power electronics. Building the connection between perception, planning, and motion.",
    highlights: ["Designed custom PCB/PDB architecture for power management", "Integrated LiDAR for SLAM navigation", "Developed core robot logic in Embedded C++"],
    stack: ["SLAM", "LiDAR", "PCB design", "Embedded C++", "Altium"], links: []
  },
  {
    id: "isro-drone", title: "ISRO Robotics Challenge", category: "Autonomous flight", status: "Completed",
    description: "An autonomous drone connecting ROS2, Raspberry Pi, and Pixhawk, with custom motor logic and navigation algorithms.",
    highlights: ["Integrated the Pixhawk flight controller with ROS2", "Developed custom motor logic", "Implemented autonomous navigation algorithms"],
    stack: ["ROS2", "Raspberry Pi", "Pixhawk", "Python", "C++"],
    links: [{ label: "GitHub profile", url: "https://github.com/Ashwin312007" }]
  }
];

export const EXPERIENCE = [
  { organization: "AutoVIT Club", role: "Secretary & engineering lead", period: "2024–present", detail: "Leading technical workshops, autonomous vehicle research, and engineering operations. Coordinating student teams working on robotics and automation at VIT Chennai." },
  { organization: "Team MOVIS", role: "Advisory board member", period: "NASA HERC", detail: "Advising electrical and software architecture for NASA HERC. Previously served as programming lead and HERC point of contact, directing telemetry and sensor integration." },
  { organization: "Salcomp Manufacturing", role: "Engineering intern", period: "May–Jun 2026", detail: "Worked with CAD modeling, design for manufacturability, and hands-on manufacturing using a vertical machining center in Chennai." },
  { organization: "MEL Systems and Services", role: "Embedded system design intern", period: "Chennai", detail: "Developed embedded logic and electronic system architecture for Pick2Lite, a hardware and IoT product." },
  { organization: "VIT Chennai OSP Club", role: "Former R&D lead", period: "Research", detail: "Led research and development initiatives, open-source software projects, and technical workshops. Mentored members in embedded systems and robotics." },
  { organization: "ATAL Tinkering Lab", role: "Student in-charge", period: "Govt. of India", detail: "Managed lab operations under the NITI Aayog initiative, mentored students in electronics and robotics, and led hands-on STEM workshops." },
  { organization: "Empower Tech National Hackathon", role: "Hackathon judge", period: "Mentorship", detail: "Evaluated hardware and software solutions, technical feasibility, software architecture, and mechatronics prototypes." }
];

export const CAPABILITIES = [
  { id: "robotics", title: "Robotics & autonomy", filter: "Robotics", skills: ["ROS2 & SLAM", "Kinematics & control systems", "Autonomous navigation"], evidence: "Applied in autonomous flight and delivery robotics." },
  { id: "embedded", title: "Embedded systems", filter: "Embedded", skills: ["Embedded C/C++", "ESP32 & STM32", "Real-time operating systems"], evidence: "Applied in rover control and embedded sensing." },
  { id: "vision", title: "Vision & software", filter: "Vision & AI", skills: ["Python & OpenCV", "Computer vision", "TensorFlow & PyTorch"], evidence: "Computer vision applied in Agri-Sorter." },
  { id: "hardware", title: "Hardware & design", filter: "Hardware", skills: ["CAD & Fusion 360", "PCB & PDB architecture", "DFM & VMC manufacturing"], evidence: "Applied in custom power boards and manufacturing." }
];
