import { Emblem } from "@/components/ui/Emblem";
import { TransitionLink } from "@/components/ui/TransitionLink";
import { TriangleCover } from "@/components/ui/TriangleCover";
import { LetterRoll } from "@/components/ui/LetterRoll";

export default function NotFound() {
  return (
    <section
      aria-labelledby="not-found-heading"
      className="relative flex min-h-screen w-full flex-col items-center justify-center px-6 py-28 text-center text-[#FAFAFA]"
    >
      {/* Subtle geometric lattice reticle around the Emblem */}
      <div className="relative mb-10 flex h-32 w-32 items-center justify-center border border-white/15 bg-[#0A0A0A]/80 backdrop-blur-md">
        <span
          aria-hidden="true"
          className="absolute -top-1 -left-1 h-2 w-2 border-t border-l border-white/60"
        />
        <span
          aria-hidden="true"
          className="absolute -top-1 -right-1 h-2 w-2 border-t border-r border-white/60"
        />
        <span
          aria-hidden="true"
          className="absolute -bottom-1 -left-1 h-2 w-2 border-b border-l border-white/60"
        />
        <span
          aria-hidden="true"
          className="absolute -right-1 -bottom-1 h-2 w-2 border-r border-b border-white/60"
        />
        <Emblem size={56} color="#FAFAFA" />
      </div>

      <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#8A8A8A]">
        ERR 404 · COORDINATES UNRESOLVED
      </p>

      <h1
        id="not-found-heading"
        className="mt-4 text-[clamp(3.2rem,9vw,7.5rem)] font-extralight leading-none tracking-[-0.03em] text-[#FAFAFA]"
      >
        404
      </h1>

      <p className="mt-5 max-w-md text-sm font-light leading-relaxed text-[#BDBDBD] md:text-base">
        The requested trajectory or engineering case study does not exist in this workspace.
      </p>

      <TransitionLink
        href="/"
        cursor="view"
        className="group relative isolate mt-10 inline-flex items-center justify-center overflow-hidden border border-white/30 bg-[#0A0A0A]/90 font-mono text-[11px] uppercase tracking-[0.16em] text-[#FAFAFA]"
      >
        <TriangleCover
          variant="hover"
          fillColor="#FAFAFA"
          className="px-7 py-3.5"
        >
          <span className="inline-flex items-center gap-3">
            <span aria-hidden="true">←</span>
            <LetterRoll text="Back home" trigger="hover" />
          </span>
        </TriangleCover>
      </TransitionLink>
    </section>
  );
}
