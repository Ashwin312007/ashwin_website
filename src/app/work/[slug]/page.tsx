import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PROJECTS } from "@/data/projects";
import { CaseHero } from "@/components/work/CaseHero";
import { CaseMetrics } from "@/components/work/CaseMetrics";
import { CaseSection } from "@/components/work/CaseSection";
import { CaseGallery } from "@/components/work/CaseGallery";
import { NextProject } from "@/components/work/NextProject";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { TransitionLink } from "@/components/ui/TransitionLink";
import { LetterRoll } from "@/components/ui/LetterRoll";

interface WorkPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return PROJECTS.map((project) => ({
    slug: project.id,
  }));
}

export async function generateMetadata({
  params,
}: WorkPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = PROJECTS.find((p) => p.id === slug);

  if (!project) {
    return {
      title: "Case Study Not Found — Ashwin T E",
      description: "The requested engineering case study could not be found.",
    };
  }

  const primaryImage = project.media.find((m) => !m.isPlaceholder && m.url)?.url;

  return {
    title: `${project.title} — Ashwin T E`,
    description: project.oneLiner,
    alternates: {
      canonical: `/work/${project.id}`,
    },
    openGraph: {
      title: `${project.title} — Ashwin T E`,
      description: project.oneLiner,
      url: `https://ashwinte.vercel.app/work/${project.id}`,
      type: "article",
      ...(primaryImage
        ? { images: [{ url: primaryImage, alt: project.title }] }
        : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: `${project.title} — Ashwin T E`,
      description: project.oneLiner,
      ...(primaryImage ? { images: [primaryImage] } : {}),
    },
  };
}

export default async function ProjectCasePage({ params }: WorkPageProps) {
  const { slug } = await params;
  const currentIndex = PROJECTS.findIndex((p) => p.id === slug);

  if (currentIndex === -1) {
    notFound();
  }

  const project = PROJECTS[currentIndex];
  const nextProject = PROJECTS[(currentIndex + 1) % PROJECTS.length];

  return (
    <article className="relative min-h-screen w-full text-[var(--surface-fg)]">
      <CaseHero project={project} />
      <CaseMetrics project={project} />
      <CaseSection project={project} />
      <CaseGallery project={project} />

      {/* External Artifacts & Inquiries */}
      {(project.repoUrl || project.demoUrl) ? (
        <section
          aria-label="Project repositories and external links"
          className="mx-auto w-full max-w-6xl border-t border-[var(--surface-border)] px-6 py-12 md:px-10 md:py-16"
        >
          <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
            <div>
              <span
                className="font-mono text-[11px] uppercase tracking-[0.16em]"
                style={{ color: project.accent }}
              >
                11 · ARTIFACTS & SOURCE
              </span>
              <p className="mt-2 max-w-lg text-sm font-light leading-relaxed text-[var(--surface-muted)]">
                Explore source repositories, CAD assemblies, or discuss implementation details directly.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              {project.repoUrl ? (
                <MagneticButton
                  href={project.repoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  cursor="view"
                  className="font-mono text-[11px] uppercase tracking-[0.14em]"
                >
                  <span className="inline-flex items-center gap-2">
                    <LetterRoll text="View Repository" trigger="hover" />
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 12 12"
                      fill="none"
                      aria-hidden="true"
                    >
                      <path
                        d="M3 9L9 3M9 3H4.5M9 3V7.5"
                        stroke="currentColor"
                        strokeWidth="1.25"
                        strokeLinecap="square"
                      />
                    </svg>
                  </span>
                </MagneticButton>
              ) : null}

              {project.demoUrl ? (
                <MagneticButton
                  href={project.demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  cursor="view"
                  className="font-mono text-[11px] uppercase tracking-[0.14em]"
                >
                  <span className="inline-flex items-center gap-2">
                    <LetterRoll text="Live Demo" trigger="hover" />
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 12 12"
                      fill="none"
                      aria-hidden="true"
                    >
                      <path
                        d="M3 9L9 3M9 3H4.5M9 3V7.5"
                        stroke="currentColor"
                        strokeWidth="1.25"
                        strokeLinecap="square"
                      />
                    </svg>
                  </span>
                </MagneticButton>
              ) : null}

              <TransitionLink
                href="/#contact"
                cursor="talk"
                className="inline-flex items-center gap-2 border border-[var(--surface-border)] px-5 py-2.5 font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--surface-subtle)] transition-colors hover:border-[var(--surface-fg)] hover:text-[var(--surface-fg)]"
              >
                <LetterRoll text="Discuss Build" trigger="hover" />
              </TransitionLink>
            </div>
          </div>
        </section>
      ) : null}

      <NextProject project={nextProject} />
    </article>
  );
}
