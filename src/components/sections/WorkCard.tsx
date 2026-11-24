"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import type { ProjectRecord } from "@/data/projects";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { TriangleCover } from "@/components/ui/TriangleCover";
import { TransitionLink } from "@/components/ui/TransitionLink";
import { LetterRoll } from "@/components/ui/LetterRoll";

function MotionSchematic({
  motionType,
  accent,
}: {
  motionType: ProjectRecord["motionType"];
  accent: string;
}) {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg || reducedMotion) return;

    const ctx = gsap.context(() => {
      if (motionType === "peristaltic") {
        const segs = svg.querySelectorAll<SVGRectElement>("[data-seg]");
        gsap.to(segs, {
          scaleY: 1.24,
          scaleX: 0.86,
          transformOrigin: "center center",
          duration: 0.65,
          stagger: { each: 0.28, repeat: -1, yoyo: true },
          ease: "sine.inOut",
        });
      } else if (motionType === "archerfish") {
        const jet = svg.querySelector<SVGPathElement>("[data-jet]");
        const iris = svg.querySelector<SVGCircleElement>("[data-iris]");
        if (jet) {
          gsap.fromTo(
            jet,
            { strokeDashoffset: 180 },
            { strokeDashoffset: 0, duration: 1.4, repeat: -1, ease: "power2.out" }
          );
        }
        if (iris) {
          gsap.to(iris, {
            attr: { r: 7 },
            duration: 0.7,
            repeat: -1,
            yoyo: true,
            ease: "power2.inOut",
          });
        }
      } else if (motionType === "nasa-rover") {
        const wheels = svg.querySelectorAll<SVGCircleElement>("[data-wheel]");
        gsap.to(wheels, {
          rotation: 360,
          transformOrigin: "center center",
          duration: 2.6,
          repeat: -1,
          ease: "none",
        });
      } else if (motionType === "ros2-rover") {
        const sweep = svg.querySelector<SVGLineElement>("[data-sweep]");
        if (sweep) {
          gsap.to(sweep, {
            rotation: 360,
            transformOrigin: "110px 60px",
            duration: 2.2,
            repeat: -1,
            ease: "none",
          });
        }
      } else if (motionType === "tonometer") {
        const rings = svg.querySelectorAll<SVGCircleElement>("[data-pulse]");
        gsap.fromTo(
          rings,
          { scale: 0.4, opacity: 0.9, transformOrigin: "center center" },
          {
            scale: 1.45,
            opacity: 0,
            duration: 1.3,
            stagger: 0.3,
            repeat: -1,
            ease: "power2.out",
          }
        );
      } else if (motionType === "agrisort") {
        const item = svg.querySelector<SVGCircleElement>("[data-produce]");
        const beam = svg.querySelector<SVGPolygonElement>("[data-nir]");
        if (item) {
          gsap.fromTo(
            item,
            { x: -55 },
            { x: 65, duration: 2.2, repeat: -1, ease: "none" }
          );
        }
        if (beam) {
          gsap.to(beam, {
            opacity: 0.55,
            duration: 0.6,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
          });
        }
      } else if (motionType === "drone") {
        const rotors = svg.querySelectorAll<SVGCircleElement>("[data-rotor]");
        gsap.to(rotors, {
          rotation: 360,
          transformOrigin: "center center",
          duration: 0.45,
          repeat: -1,
          ease: "none",
        });
      } else if (motionType === "lqr-line") {
        const bot = svg.querySelector<SVGRectElement>("[data-bot]");
        if (bot) {
          gsap.to(bot, {
            y: -10,
            rotation: -6,
            transformOrigin: "center center",
            duration: 0.9,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
          });
        }
      }
    }, svgRef);

    return () => ctx.revert();
  }, [motionType, reducedMotion]);

  return (
    <svg
      ref={svgRef}
      viewBox="0 0 220 120"
      fill="none"
      aria-hidden="true"
      className="h-28 w-full max-w-[240px]"
    >
      {motionType === "peristaltic" && (
        <>
          <line x1="16" y1="22" x2="204" y2="22" stroke="rgba(255,255,255,0.22)" strokeDasharray="4 4" />
          <line x1="16" y1="98" x2="204" y2="98" stroke="rgba(255,255,255,0.22)" strokeDasharray="4 4" />
          <rect data-seg x="36" y="40" width="38" height="40" rx="8" stroke={accent} strokeWidth="1.5" />
          <rect data-seg x="91" y="40" width="38" height="40" rx="8" stroke="#FAFAFA" strokeWidth="1.5" />
          <rect data-seg x="146" y="40" width="38" height="40" rx="8" stroke={accent} strokeWidth="1.5" />
        </>
      )}
      {motionType === "archerfish" && (
        <>
          <circle cx="44" cy="76" r="18" stroke="rgba(255,255,255,0.3)" strokeWidth="1.2" />
          <circle data-iris cx="44" cy="76" r="12" stroke={accent} strokeWidth="1.5" />
          <path
            data-jet
            d="M54 66 Q 120 18 192 48"
            stroke={accent}
            strokeWidth="1.6"
            strokeDasharray="180"
            strokeDashoffset="0"
          />
          <circle cx="192" cy="48" r="4" fill="#FAFAFA" />
        </>
      )}
      {motionType === "nasa-rover" && (
        <>
          <path d="M12 94 L62 84 L110 92 L162 78 L208 90" stroke="rgba(255,255,255,0.25)" strokeWidth="1.2" />
          <path d="M62 82 L88 52 L134 52 L160 76" stroke="#FAFAFA" strokeWidth="1.4" />
          <rect x="86" y="38" width="48" height="16" rx="2" stroke={accent} strokeWidth="1.4" />
          <circle data-wheel cx="62" cy="82" r="11" stroke={accent} strokeWidth="1.5" strokeDasharray="6 3" />
          <circle data-wheel cx="110" cy="84" r="11" stroke="#FAFAFA" strokeWidth="1.5" strokeDasharray="6 3" />
          <circle data-wheel cx="160" cy="76" r="11" stroke={accent} strokeWidth="1.5" strokeDasharray="6 3" />
        </>
      )}
      {motionType === "ros2-rover" && (
        <>
          <circle cx="110" cy="60" r="44" stroke="rgba(255,255,255,0.18)" strokeDasharray="3 4" />
          <circle cx="110" cy="60" r="26" stroke="rgba(255,255,255,0.28)" />
          <rect x="94" y="48" width="32" height="24" rx="4" stroke="#FAFAFA" strokeWidth="1.4" />
          <circle cx="110" cy="60" r="5" fill={accent} />
          <line data-sweep x1="110" y1="60" x2="110" y2="16" stroke={accent} strokeWidth="1.6" />
        </>
      )}
      {motionType === "tonometer" && (
        <>
          <rect x="24" y="48" width="38" height="24" rx="3" stroke="#FAFAFA" strokeWidth="1.4" />
          <line x1="62" y1="60" x2="84" y2="60" stroke={accent} strokeWidth="1.6" />
          <circle data-pulse cx="116" cy="60" r="12" stroke={accent} strokeWidth="1.4" />
          <circle data-pulse cx="116" cy="60" r="22" stroke={accent} strokeWidth="1.2" />
          <path d="M174 26 Q 152 60 174 94" stroke="#FAFAFA" strokeWidth="1.8" />
        </>
      )}
      {motionType === "agrisort" && (
        <>
          <line x1="22" y1="84" x2="198" y2="84" stroke="#FAFAFA" strokeWidth="1.5" />
          <polygon data-nir points="110,22 86,78 134,78" fill={accent} fillOpacity="0.2" stroke={accent} strokeWidth="1.2" />
          <rect x="98" y="14" width="24" height="10" rx="2" stroke="#FAFAFA" strokeWidth="1.2" />
          <circle data-produce cx="110" cy="74" r="9" stroke={accent} strokeWidth="1.6" fill="#0A0A0A" />
        </>
      )}
      {motionType === "drone" && (
        <>
          <line x1="62" y1="26" x2="158" y2="94" stroke="#FAFAFA" strokeWidth="1.6" />
          <line x1="158" y1="26" x2="62" y2="94" stroke="#FAFAFA" strokeWidth="1.6" />
          <rect x="98" y="48" width="24" height="24" rx="4" fill="#0A0A0A" stroke={accent} strokeWidth="1.5" />
          <circle data-rotor cx="62" cy="26" r="16" stroke={accent} strokeWidth="1.3" strokeDasharray="10 6" />
          <circle data-rotor cx="158" cy="26" r="16" stroke={accent} strokeWidth="1.3" strokeDasharray="10 6" />
          <circle data-rotor cx="62" cy="94" r="16" stroke={accent} strokeWidth="1.3" strokeDasharray="10 6" />
          <circle data-rotor cx="158" cy="94" r="16" stroke={accent} strokeWidth="1.3" strokeDasharray="10 6" />
        </>
      )}
      {motionType === "lqr-line" && (
        <>
          <path d="M20 80 C 70 80, 95 40, 145 45 C 175 48, 190 36, 204 32" stroke="rgba(255,255,255,0.4)" strokeWidth="1.4" strokeDasharray="5 4" />
          <rect data-bot x="94" y="48" width="32" height="20" rx="3" stroke={accent} strokeWidth="1.5" fill="#0A0A0A" />
          <line x1="110" y1="58" x2="110" y2="42" stroke="#FAFAFA" strokeWidth="1.2" />
        </>
      )}
    </svg>
  );
}

export function WorkCard({
  project,
  stackIndex,
  isLast,
  cardRef,
}: {
  project: ProjectRecord;
  stackIndex: number;
  isLast: boolean;
  cardRef: (el: HTMLElement | null) => void;
}) {
  const leadMedia = project.media[0];
  const hasRealImage = Boolean(leadMedia && !leadMedia.isPlaceholder && leadMedia.url);
  const statusPill = project.patentStatus || project.year;

  return (
    <article
      ref={cardRef}
      data-cursor="view"
      style={{
        top: `calc(10vh + ${stackIndex * 1.4}vh)`,
      }}
      className={`sticky flex min-h-[78vh] w-full flex-col justify-between overflow-hidden rounded-[28px] border border-black/10 bg-[#EDEDED]/[0.94] p-6 text-[#0A0A0A] shadow-[0_24px_80px_rgba(0,0,0,0.45)] backdrop-blur-[18px] will-change-transform md:p-10 lg:h-[78vh] ${
        isLast ? "mb-[12vh]" : "mb-[42vh]"
      }`}
    >
      {/* Top bar: Index + Category | Status Pill */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span
            className="inline-flex items-center rounded-full bg-[#0A0A0A] px-2.5 py-1 font-mono text-[11px] font-medium tracking-[0.12em]"
            style={{ color: project.accent }}
          >
            {project.index}
          </span>
          <span className="font-mono-label text-[#525252]">{project.category}</span>
        </div>

        <span className="rounded-full border border-black/15 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.12em] text-[#0A0A0A]">
          {statusPill}
        </span>
      </div>

      {/* Main grid */}
      <div className="my-auto grid grid-cols-1 gap-8 py-6 lg:grid-cols-12 lg:items-center lg:gap-10">
        {/* Left column */}
        <div className="flex flex-col justify-between gap-6 lg:col-span-6">
          <div className="space-y-4">
            <h3 className="text-[clamp(1.65rem,3vw,3.1rem)] font-light leading-[1.06] tracking-[-0.025em] text-[#0A0A0A]">
              {project.title}
            </h3>
            <p className="max-w-[48ch] text-sm leading-relaxed text-[#3d3d3d] md:text-base">
              {project.oneLiner}
            </p>
          </div>

          {/* 3 Metrics */}
          <div className="grid grid-cols-1 gap-4 border-y border-black/10 py-4 sm:grid-cols-3">
            {project.metrics.slice(0, 3).map((m) => (
              <div key={m.label} className="space-y-1">
                <div className="text-base font-medium tracking-[-0.015em] text-[#0A0A0A] md:text-lg">
                  {m.value}
                </div>
                <div className="font-mono text-[10px] uppercase tracking-[0.1em] text-[#525252]">
                  {m.label}
                </div>
              </div>
            ))}
          </div>

          {/* Role + Case link */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <p className="max-w-[36ch] text-xs leading-relaxed text-[#525252]">
              {project.personalRole}
            </p>

            <TransitionLink
              href={`/work/${project.id}`}
              cursor="view"
              className="inline-flex shrink-0 items-center gap-2 border-b border-[#0A0A0A] pb-1 font-mono text-[11px] uppercase tracking-[0.12em] text-[#0A0A0A] transition-opacity hover:opacity-70"
            >
              <LetterRoll text="View case study ->" />
            </TransitionLink>
          </div>
        </div>

        {/* Right media panel */}
        <div className="h-52 w-full overflow-hidden rounded-[18px] bg-[#0A0A0A] sm:h-64 lg:col-span-6 lg:h-[48vh]">
          {hasRealImage ? (
            <TriangleCover
              variant="reveal"
              imageSrc={leadMedia.url}
              imageAlt={leadMedia.caption || project.title}
              className="h-full w-full bg-[#121212]"
            />
          ) : (
            <div className="relative flex h-full w-full flex-col justify-between overflow-hidden bg-[#0E0E10] p-6 text-[#FAFAFA]">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 opacity-20"
                style={{
                  backgroundImage:
                    "linear-gradient(to right, rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.08) 1px, transparent 1px)",
                  backgroundSize: "28px 28px",
                }}
              />

              <div className="relative z-10 flex items-start justify-between">
                <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#8A8A8A]">
                  SPEC PLATE · {project.motionType.toUpperCase()}
                </span>
                <span
                  className="font-mono text-4xl font-extralight leading-none opacity-80 md:text-5xl"
                  style={{ color: project.accent }}
                >
                  {project.index}
                </span>
              </div>

              <div className="relative z-10 flex items-center justify-center py-2">
                <MotionSchematic
                  motionType={project.motionType}
                  accent={project.accent}
                />
              </div>

              <div className="relative z-10 flex flex-wrap gap-1.5">
                {project.tags.slice(0, 6).map((tag) => (
                  <span
                    key={tag}
                    className="rounded border border-white/15 bg-white/[0.04] px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.08em] text-[#BDBDBD]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
