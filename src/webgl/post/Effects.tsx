"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import {
  Bloom,
  ChromaticAberration,
  EffectComposer,
  Noise,
  ToneMapping,
  Vignette,
} from "@react-three/postprocessing";
import {
  ChromaticAberrationEffect,
  ToneMappingMode,
  VignetteEffect,
} from "postprocessing";
import { Vector2 } from "three";
import { clamp, damp } from "@/lib/math";
import { useAppStore } from "@/store/useAppStore";
import { TriangleWipe } from "./TriangleWipeEffect";

export function Effects() {
  const tier = useAppStore((s) => s.tier);
  const chromaRef = useRef<ChromaticAberrationEffect | null>(null);
  const vignetteRef = useRef<VignetteEffect | null>(null);
  const initialChromaOffset = useMemo(() => new Vector2(0, 0), []);
  const chromaAmtRef = useRef(0);

  useFrame((_, rawDelta) => {
    const delta = Math.min(rawDelta, 0.05);
    const { scroll, reducedMotion, wipe } = useAppStore.getState();

    const chroma = chromaRef.current;
    if (chroma) {
      const targetOffset =
        reducedMotion || wipe.progress >= 0.99
          ? 0
          : clamp(Math.abs(scroll.velocity) * 0.00003, 0, 0.0018);

      chromaAmtRef.current = damp(chromaAmtRef.current, targetOffset, 10, delta);
      chroma.offset.set(chromaAmtRef.current, chromaAmtRef.current * 0.65);
    }

    const vignette = vignetteRef.current;
    if (vignette) {
      const targetDarkness = wipe.progress > 0.5 ? 0.16 : 0.65;
      vignette.darkness = damp(vignette.darkness, targetDarkness, 8, delta);
    }
  });

  if (tier === "low") {
    return (
      <EffectComposer
        multisampling={0}
        enableNormalPass={false}
        renderPriority={1}
      >
        <ToneMapping mode={ToneMappingMode.AGX} />
        <TriangleWipe />
        <Vignette ref={vignetteRef} offset={0.3} darkness={0.65} />
      </EffectComposer>
    );
  }

  return (
    <EffectComposer
      multisampling={tier === "high" ? 4 : 0}
      enableNormalPass={false}
      renderPriority={1}
    >
      <Bloom intensity={0.55} luminanceThreshold={0.62} mipmapBlur />
      <ChromaticAberration
        ref={chromaRef}
        offset={initialChromaOffset}
        radialModulation
        modulationOffset={0.15}
      />
      <ToneMapping mode={ToneMappingMode.AGX} />
      <TriangleWipe />
      <Noise opacity={0.035} premultiply />
      <Vignette ref={vignetteRef} offset={0.3} darkness={0.65} />
    </EffectComposer>
  );
}
