export interface ProjectData {
  id: string;
  title: string;
  category: string;
  status: string;
  tagline?: string;
  bioInspiration?: string;
  description: string;
  highlights: string[];
  subsystems?: { name: string; description: string }[];
  specifications?: { label: string; value: string }[];
  stack: string[];
  image?: string;
  hasSimulation?: boolean;
  simulationType?: "peristalsis" | "archerfish";
  links: { label: string; url: string }[];
}
