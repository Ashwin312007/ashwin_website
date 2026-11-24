import type { MetadataRoute } from "next";
import { PROJECTS } from "@/data/projects";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://ashwinte.vercel.app";
  const lastModified = new Date();

  const projectRoutes: MetadataRoute.Sitemap = PROJECTS.map((project) => ({
    url: `${baseUrl}/work/${project.id}`,
    lastModified,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  return [
    {
      url: baseUrl,
      lastModified,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    ...projectRoutes,
  ];
}
