"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { PerspectiveCamera, View } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { clamp, damp } from "@/lib/math";
import { drawEmblemToCanvas } from "@/lib/emblemPath";
import { useAppStore } from "@/store/useAppStore";
import { HALFTONE_FRAGMENT_SHADER, HALFTONE_VERTEX_SHADER } from "../shaders/halftone";

const elementIds = new WeakMap<HTMLElement, number>();
let nextElementId = 1;

function getElementKey(el: HTMLElement): number {
  let id = elementIds.get(el);
  if (id === undefined) {
    id = nextElementId++;
    elementIds.set(el, id);
  }
  return id;
}

function createProceduralMonogramTexture(): THREE.CanvasTexture {
  const width = 1024;
  const height = 1365;
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext("2d");
  if (ctx) {
    const grad = ctx.createRadialGradient(
      width * 0.5,
      height * 0.44,
      width * 0.06,
      width * 0.5,
      height * 0.5,
      height * 0.65
    );
    grad.addColorStop(0, "#242424");
    grad.addColorStop(0.55, "#111111");
    grad.addColorStop(1, "#060606");

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    drawEmblemToCanvas(ctx, width, height, {
      fill: "#f2f2f2",
      background: "transparent",
      paddingRatio: 0.22,
    });
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.generateMipmaps = false;
  texture.needsUpdate = true;
  return texture;
}

interface PortraitPlaneProps {
  portraitEl: HTMLElement;
  texture: THREE.Texture;
  texAspect: number;
}

function PortraitPlane({ portraitEl, texture, texAspect }: PortraitPlaneProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const { size } = useThree();

  const geometry = useMemo(() => new THREE.PlaneGeometry(1, 1), []);
  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: HALFTONE_VERTEX_SHADER,
        fragmentShader: HALFTONE_FRAGMENT_SHADER,
        transparent: true,
        depthTest: false,
        depthWrite: false,
        uniforms: {
          uTexture: { value: null as THREE.Texture | null },
          uMix: { value: 0 },
          uFade: { value: 0 },
          uCell: { value: 0.018 },
          uAspect: { value: 0.72 },
          uTexAspect: { value: 1 },
          uHasMouse: { value: 0 },
          uMouse: { value: new THREE.Vector2(0.5, 0.5) },
        },
      }),
    []
  );

  const materialRef = useRef<THREE.ShaderMaterial | null>(null);

  useLayoutEffect(() => {
    materialRef.current = material;
  }, [material]);

  useLayoutEffect(() => {
    const mat = materialRef.current;
    if (!mat) return;
    mat.uniforms.uTexture.value = texture;
    mat.uniforms.uTexAspect.value = texAspect;
  }, [texture, texAspect]);

  useEffect(() => {
    return () => {
      geometry.dispose();
      material.dispose();
    };
  }, [geometry, material]);

  const hoverRef = useRef({
    u: 0.5,
    v: 0.5,
    inside: false,
  });

  useEffect(() => {
    const onPointerMove = (e: PointerEvent) => {
      const rect = portraitEl.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) {
        hoverRef.current.inside = false;
        return;
      }
      const u = (e.clientX - rect.left) / rect.width;
      const v = 1 - (e.clientY - rect.top) / rect.height;
      if (u >= 0 && u <= 1 && v >= 0 && v <= 1) {
        hoverRef.current.u = u;
        hoverRef.current.v = v;
        hoverRef.current.inside = true;
      } else {
        hoverRef.current.inside = false;
      }
    };

    const onPointerLeave = () => {
      hoverRef.current.inside = false;
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    document.addEventListener("pointerleave", onPointerLeave);
    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("pointerleave", onPointerLeave);
    };
  }, [portraitEl]);

  useFrame((state, rawDelta) => {
    const mesh = meshRef.current;
    const mat = materialRef.current;
    if (!mesh || !mat) return;

    const delta = Math.min(rawDelta, 0.05);
    const { portraitMix, portraitFade, reducedMotion } = useAppStore.getState();

    // Size plane to fill the active View viewport seamlessly
    mesh.scale.set(state.viewport.width, state.viewport.height, 1);

    const frameAspect = size.width / Math.max(size.height, 1);
    mat.uniforms.uAspect.value = frameAspect;

    const lambda = reducedMotion ? 24 : 7;
    mat.uniforms.uMix.value = damp(
      mat.uniforms.uMix.value,
      clamp(portraitMix, 0, 1),
      lambda,
      delta
    );
    mat.uniforms.uFade.value = damp(
      mat.uniforms.uFade.value,
      clamp(portraitFade, 0, 1),
      lambda,
      delta
    );

    const hover = hoverRef.current;
    mat.uniforms.uHasMouse.value = damp(
      mat.uniforms.uHasMouse.value,
      hover.inside && !reducedMotion ? 1 : 0,
      8,
      delta
    );
    const mouseVec = mat.uniforms.uMouse.value as THREE.Vector2;
    mouseVec.x = damp(mouseVec.x, hover.u, 10, delta);
    mouseVec.y = damp(mouseVec.y, hover.v, 10, delta);
  });

  return <mesh ref={meshRef} geometry={geometry} material={material} />;
}

export interface PortraitHalftoneProps {
  hasPortrait?: boolean;
}

export function PortraitHalftone({ hasPortrait = false }: PortraitHalftoneProps) {
  const portraitEl = useAppStore((s) => s.portraitEl);
  const trackRef = useRef<HTMLElement>(null!);

  const fallbackTexture = useMemo(() => createProceduralMonogramTexture(), []);
  const [activeTex, setActiveTex] = useState<{
    texture: THREE.Texture;
    aspect: number;
  }>(() => ({
    texture: fallbackTexture,
    aspect: 1024 / 1365,
  }));

  useEffect(() => {
    return () => {
      fallbackTexture.dispose();
    };
  }, [fallbackTexture]);

  // Attempt to load /images/ashwin-portrait.jpg safely only when hasPortrait is enabled
  useEffect(() => {
    if (!hasPortrait) return;

    let cancelled = false;
    const controller = new AbortController();
    let loadedTexture: THREE.Texture | null = null;
    let objectUrl: string | null = null;

    const tryLoadPortrait = async () => {
      try {
        const res = await fetch("/images/ashwin-portrait.jpg", {
          signal: controller.signal,
        });
        if (!res.ok) return;

        const blob = await res.blob();
        if (cancelled) return;

        objectUrl = URL.createObjectURL(blob);
        const img = new Image();
        img.decoding = "async";
        await new Promise<void>((resolve, reject) => {
          img.onload = () => resolve();
          img.onerror = () => reject(new Error("Portrait decode error"));
          img.src = objectUrl ?? "";
        });

        if (cancelled) {
          if (objectUrl) URL.revokeObjectURL(objectUrl);
          return;
        }

        const tex = new THREE.Texture(img);
        tex.colorSpace = THREE.SRGBColorSpace;
        tex.minFilter = THREE.LinearMipmapLinearFilter;
        tex.magFilter = THREE.LinearFilter;
        tex.generateMipmaps = true;
        tex.needsUpdate = true;

        loadedTexture = tex;
        setActiveTex({
          texture: tex,
          aspect: img.naturalWidth / Math.max(img.naturalHeight, 1),
        });
      } catch {
        // Fallback procedural monogram CanvasTexture remains active cleanly
      }
    };

    void tryLoadPortrait();

    return () => {
      cancelled = true;
      controller.abort();
      if (loadedTexture) {
        loadedTexture.dispose();
      }
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [hasPortrait]);

  useLayoutEffect(() => {
    if (portraitEl) {
      trackRef.current = portraitEl;
    }
  }, [portraitEl]);

  if (!portraitEl) return null;

  return (
    <View key={getElementKey(portraitEl)} track={trackRef} index={2}>
      <PerspectiveCamera makeDefault position={[0, 0, 3]} fov={30} near={0.1} far={20} />
      <PortraitPlane
        portraitEl={portraitEl}
        texture={activeTex.texture}
        texAspect={activeTex.aspect}
      />
    </View>
  );
}
