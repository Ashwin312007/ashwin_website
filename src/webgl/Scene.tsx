"use client";

import { useEffect, useRef } from "react";
import { View } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useAppStore } from "@/store/useAppStore";
import { PortraitHalftone } from "./About/PortraitHalftone";
import { RibbonField } from "./Background/RibbonField";
import { CameraRig } from "./CameraRig";
import { PeristalticCore } from "./Core/PeristalticCore";
import { Monogram } from "./Footer/Monogram";
import { TerrainDome } from "./Footer/TerrainDome";
import { StarField } from "./Particles/StarField";
import { Effects } from "./post/Effects";
import { StudioEnvironment } from "./StudioEnvironment";

function ViewportGuard() {
  // Priority 0: ensure full-canvas viewport & scissor before EffectComposer (priority 1)
  useFrame(({ gl, size, setEvents, events }) => {
    gl.setViewport(0, 0, size.width, size.height);
    gl.setScissorTest(false);
    if (typeof document !== "undefined" && events.connected !== document.body) {
      setEvents({ connected: document.body });
    }
  }, 0);

  return null;
}

function ViewportRestorer() {
  // Priority 3: restore full-canvas viewport & scissor after drei <View index={2}>
  useFrame(({ gl, size, setEvents, events }) => {
    gl.setViewport(0, 0, size.width, size.height);
    gl.setScissorTest(false);
    if (typeof document !== "undefined" && events.connected !== document.body) {
      setEvents({ connected: document.body });
    }
  }, 3);

  return null;
}

function ReadinessReporter() {
  const { gl, scene, camera } = useThree();
  const stageRef = useRef({
    compiled: false,
    frames: 0,
    done: false,
  });

  useEffect(() => {
    if (stageRef.current.compiled) return;
    stageRef.current.compiled = true;

    try {
      gl.compile(scene, camera);
    } catch {
      // Allow render loop to compile remaining passes if needed
    }

    const store = useAppStore.getState();
    if (!store.webglReady) {
      store.set({ webglProgress: Math.max(store.webglProgress, 0.45) });
    }
  }, [gl, scene, camera]);

  useFrame(() => {
    const st = stageRef.current;
    if (st.done) return;

    st.frames += 1;
    const store = useAppStore.getState();

    if (st.frames === 1) {
      store.set({ webglProgress: Math.max(store.webglProgress, 0.7) });
    } else if (st.frames === 2) {
      store.set({ webglProgress: Math.max(store.webglProgress, 0.88) });
    } else if (st.frames >= 3) {
      st.done = true;
      store.set({ webglProgress: 1, webglReady: true });
    }
  });

  return null;
}

export interface SceneProps {
  hasPortrait?: boolean;
}

export function Scene({ hasPortrait = false }: SceneProps) {
  return (
    <>
      <color attach="background" args={["#0A0A0A"]} />
      <ViewportGuard />
      <StudioEnvironment />
      <CameraRig />
      <RibbonField />
      <StarField />
      <PeristalticCore />
      <Monogram />
      <TerrainDome />
      <PortraitHalftone hasPortrait={hasPortrait} />
      <View.Port />
      <Effects />
      <ViewportRestorer />
      <ReadinessReporter />
    </>
  );
}
