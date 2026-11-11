import type { ProjectData } from "@/types";

export const PROJECTS_DATA: ProjectData[] = [
  {
    id: "bio-pipe-robot",
    title: "Bio-Inspired Peristaltic In-Pipe Crawling Robot",
    category: "Biomimicry & Soft Robotics",
    status: "Active research prototype",
    tagline: "Peristaltic Metameric Pipe Locomotion",
    bioInspiration: "Retrograde peristaltic metameric locomotion of Lumbricus terrestris (alternating radial expansion anchoring and axial stroke extension).",
    description: "A modular soft-robotic in-pipe crawler using compliant 95A TPU bellows, tendon-driven capstans, and directional micro-setae to crawl through tortuous, slippery conduits without jamming.",
    highlights: [
      "Engineered multi-segment body with antagonistic radial expansion and axial stroke cycles",
      "Additive-manufactured 1.18 mm thin-shell compliant bellows in 95A TPU on Bambu Lab X1 Carbon",
      "Synthesized asymmetric micro-setae arrays achieving directional friction anisotropy",
      "Embedded ESP32/STM32 sequencer generating adaptive PWM wave gaits for real-time pipe adaptation"
    ],
    subsystems: [
      {
        name: "Segment Actuation & Kinematics",
        description: "Modular multi-segment body utilizing tendon-actuated mechanisms coupled with pneumatic/compliant bellows. Coordinated sequential phase shifts produce coupled radial anchorage against pipe walls while driving axial forward propulsion."
      },
      {
        name: "Additive Manufacturing & Materials",
        description: "Custom compliant bellows structures 3D-printed in Thermoplastic Polyurethane (95A TPU) on a Bambu Lab X1 Carbon. Thin-wall configuration (~1.18 mm shell profile) engineered to yield low axial stiffness for stroke displacement while resisting premature radial burst under pressure."
      },
      {
        name: "Anchoring & Directional Traction",
        description: "Integration of asymmetric synthetic micro-structures/setae mimicking biological setae to maximize forward friction ratios and prevent backward slippage during segment extension."
      },
      {
        name: "Embedded Control Architecture",
        description: "Central embedded controller (ESP32 / STM32) generating sequenced PWM wave actuation via micro-pumps/valves or tendon capstan reels. Synchronized wave gait modulation allows bidirectional crawling and active obstacle clearing."
      }
    ],
    specifications: [
      { label: "Material", value: "95A TPU (Bambu Lab X1C)" },
      { label: "Wall Thickness", value: "1.18 mm profile" },
      { label: "Controller", value: "ESP32 / STM32 RTOS" },
      { label: "Locomotion", value: "Retrograde Metameric Wave" }
    ],
    stack: ["Biomimicry", "95A TPU", "Bambu Lab X1C", "ESP32 / STM32", "Soft Robotics", "Kinematics", "Micro-Pneumatics"],
    image: "/projects/earthworm-peristaltic-robot.png",
    hasSimulation: true,
    simulationType: "peristalsis",
    links: []
  },
  {
    id: "archerfish-ejection",
    title: "Archerfish-Inspired Variable-Aperture Fluid Ejection",
    category: "Fluid Dynamics & Control",
    status: "Experimental system",
    tagline: "Dynamic Hydrodynamic Pulse Delivery",
    bioInspiration: "Hydrodynamic oral groove and variable tongue aperture deformation of Toxotes jaculatrix creating an overtaking velocity gradient.",
    description: "High-speed fluid-ejection mechanism featuring dynamic variable iris aperture modulation, producing a tailored velocity profile that coalesces airborne water into a high-momentum kinetic slug.",
    highlights: [
      "Tailored velocity gradient v(t) achieving kinetic water slug coalescence at range with zero spray dispersion",
      "Fast-response variable nozzle orifice varying cross-sectional flow area to eliminate cavitation",
      "High-speed voice-coil / fast-servo actuation modulating aperture in millisecond intervals",
      "Edge-vision camera integration for real-time target distance and trajectory-adapted firing profiles"
    ],
    subsystems: [
      {
        name: "Fluid Dynamics & Slug Formation",
        description: "Tailored velocity gradient (v(t) profile) utilizing dynamic flow deceleration/acceleration to achieve kinetic coalescence at distance, minimizing airborne spray dispersion and parasitic drag."
      },
      {
        name: "Dynamic Variable-Aperture Mechanism",
        description: "Mechanically controlled, fast-response variable nozzle orifice varying cross-sectional flow area synchronously with the input pressure transient. Multi-leaf iris geometry designed to prevent cavitation and sudden turbulence detachment."
      },
      {
        name: "Actuation & Valve Dynamics",
        description: "High-speed electromechanical / voice-coil actuation driving aperture constriction in millisecond intervals coupled with fast-acting pilot pressure valving for tight volume control."
      },
      {
        name: "Targeting & Visuomotor Sensing",
        description: "Targeted integration with an edge-vision camera module (Raspberry Pi embedded vision pipeline) to measure target distance and angle, dynamically computing the optimal discharge profile and aperture timing."
      }
    ],
    specifications: [
      { label: "Aperture Response", value: "< 15 ms constriction" },
      { label: "Actuation", value: "Voice-Coil / Fast-Servo" },
      { label: "Targeting", value: "Raspberry Pi Edge Vision" },
      { label: "Fluid Dynamic", value: "Kinetic Slug Coalescence" }
    ],
    stack: ["Fluid Dynamics", "Variable Aperture", "Voice-Coil Actuator", "Raspberry Pi Vision", "High-Speed Valving", "Control Theory"],
    image: "/projects/archerfish-fluid-mechanism.png",
    hasSimulation: true,
    simulationType: "archerfish",
    links: []
  },
  {
    id: "nasa-herc",
    title: "NASA HERC Rover",
    category: "Competition engineering",
    status: "6th place globally",
    tagline: "High-Reliability Extreme Terrain Mobility",
    description: "Electrical and software architecture for Team MOVIS at NASA HERC. Power distribution, motor control, and embedded systems built for the competition field.",
    highlights: [
      "Engineered the rover’s power distribution system",
      "Developed motor control logic and embedded software",
      "Contributed as programming lead, HERC point of contact, and advisory board member",
      "Team result: 6th globally and Best Indian Team"
    ],
    subsystems: [
      {
        name: "Power Distribution Unit",
        description: "High-current multi-rail power distribution board protecting telemetry, drive motors, and onboard compute."
      },
      {
        name: "Telemetry & Firmware",
        description: "Custom embedded telemetry logging real-time motor draw, speed, and chassis orientation during obstacle runs."
      }
    ],
    specifications: [
      { label: "Competition", value: "NASA HERC 2026" },
      { label: "Global Rank", value: "6th Globally" },
      { label: "National Rank", value: "Best Indian Team" },
      { label: "Discipline", value: "Electrical & Software" }
    ],
    stack: ["Motor control", "Power electronics", "Embedded C/C++"],
    links: []
  },
  {
    id: "agri-sorter",
    title: "Agri-Sorter",
    category: "Agricultural automation",
    status: "Patent pending",
    tagline: "High-Throughput Vision-Guided Quality Sorting",
    description: "Computer vision meets mechanical sorting. An automated classification system designed for high-throughput agricultural workflows.",
    highlights: [
      "Filed a patent for the automated sorting system",
      "Integrated computer vision with mechanical sorting mechanisms",
      "Designed for high-throughput classification"
    ],
    subsystems: [
      {
        name: "Vision Pipeline",
        description: "Real-time edge convolutional inference classifying produce defects and grading metrics."
      },
      {
        name: "Pneumatic Ejection",
        description: "Synchronized solenoid manifold diverting classified produce into discrete grading channels."
      }
    ],
    specifications: [
      { label: "Status", value: "Patent Pending" },
      { label: "Throughput", value: "High-speed conveyor" },
      { label: "Vision", value: "Edge AI Classification" }
    ],
    stack: ["Computer vision", "Mechatronics", "Automation"],
    links: []
  },
  {
    id: "air-puff-tonometer",
    title: "Portable Air-Puff Tonometer",
    category: "Medical device research",
    status: "Patent pending",
    tagline: "Non-Contact Micro-Pneumatic Corneal Applanation",
    description: "A non-contact approach to intraocular pressure measurement, combining micro-pneumatics with embedded sensing in a portable device.",
    highlights: [
      "Filed a patent for the non-contact device",
      "Designed the micro-pneumatic systems",
      "Developed the embedded sensing architecture"
    ],
    subsystems: [
      {
        name: "Micro-Pneumatic Chamber",
        description: "Precision micro-solenoid pulse delivery generating calibrated laminar air impulses."
      },
      {
        name: "Applanation Optoelectronics",
        description: "High-speed infrared reflectance detector measuring corneal deformation curves."
      }
    ],
    specifications: [
      { label: "Status", value: "Patent Pending" },
      { label: "Modality", value: "Non-Contact Air Impulse" },
      { label: "Form Factor", value: "Portable Handheld" }
    ],
    stack: ["Micro-pneumatics", "Embedded sensing", "Medical devices"],
    links: []
  },
  {
    id: "delivery-robot",
    title: "Autonomous Delivery Robot",
    category: "Autonomous logistics",
    status: "In development",
    tagline: "LiDAR SLAM Urban Navigational Platform",
    description: "A SLAM-based delivery robot with LiDAR navigation and custom power electronics. Building the connection between perception, planning, and motion.",
    highlights: [
      "Designed custom PCB/PDB architecture for power management",
      "Integrated LiDAR for SLAM navigation",
      "Developed core robot logic in Embedded C++"
    ],
    subsystems: [
      {
        name: "Navigation & SLAM",
        description: "Real-time 2D/3D LiDAR occupancy mapping coupled with adaptive costmap trajectory planning."
      },
      {
        name: "Chassis & PDB",
        description: "Custom power distribution architecture with hot-swap lithium packs and overcurrent trip protection."
      }
    ],
    specifications: [
      { label: "Localization", value: "LiDAR SLAM + Wheel Odometry" },
      { label: "Compute", value: "Embedded Linux + Microcontroller" },
      { label: "Status", value: "Active Prototype" }
    ],
    stack: ["SLAM", "LiDAR", "PCB design", "Embedded C++", "Altium"],
    links: []
  },
  {
    id: "isro-drone",
    title: "ISRO Robotics Challenge",
    category: "Autonomous flight",
    status: "Completed",
    tagline: "Autonomous Multirotor Precision Positioning",
    description: "An autonomous drone connecting ROS2, Raspberry Pi, and Pixhawk, with custom motor logic and navigation algorithms.",
    highlights: [
      "Integrated the Pixhawk flight controller with ROS2",
      "Developed custom motor logic",
      "Implemented autonomous navigation algorithms"
    ],
    subsystems: [
      {
        name: "Companion Computer & ROS2 Bridge",
        description: "MAVROS / micro-XRCE bridge coordinating high-level trajectory commands with flight firmware."
      },
      {
        name: "Visual Fiducial Precision Landing",
        description: "Downward-facing optical pipeline executing centimetre-accurate docking and target interception."
      }
    ],
    specifications: [
      { label: "Flight Controller", value: "Pixhawk / PX4" },
      { label: "High-Level Compute", value: "Raspberry Pi ROS2" },
      { label: "Competition", value: "ISRO Robotics Challenge" }
    ],
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
  {
    id: "biomimicry",
    title: "Biomimicry & soft robotics",
    filter: "Biomimicry",
    skills: ["Metameric peristalsis", "Compliant 95A TPU bellows", "Synthetic micro-setae traction"],
    evidence: "Applied in in-pipe crawlers and bio-actuation research."
  },
  {
    id: "control",
    title: "Control systems & dynamics",
    filter: "Control",
    skills: ["Dynamic aperture modulation", "Fluid velocity profiling", "State feedback & PWM wave gaits"],
    evidence: "Applied in hydrodynamic slug formation and precision dispensing."
  },
  {
    id: "embedded",
    title: "Embedded systems & firmware",
    filter: "Embedded",
    skills: ["Embedded C/C++ & FreeRTOS", "ESP32 & STM32 sequencers", "CAN bus & motor control"],
    evidence: "Applied in rover control, in-pipe actuation, and medical devices."
  },
  {
    id: "robotics",
    title: "Autonomous robotics & mechatronics",
    filter: "Robotics",
    skills: ["ROS2 & SLAM", "Pixhawk & flight control", "LiDAR perception & mapping"],
    evidence: "Applied in NASA HERC, delivery robotics, and autonomous drones."
  }
];
