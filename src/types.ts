export interface ProjectData {
  id: string;
  title: string;
  category: string;
  status: string;
  description: string;
  highlights: string[];
  stack: string[];
  links: { label: string; url: string }[];
}
