"use client";

import { useEffect, useRef } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import * as THREE from "three";

gsap.registerPlugin(ScrollTrigger);

export function CameraRig() {
  const { camera } = useThree();
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const progressRef = useRef({ value: 0 });

  useEffect(() => {
    // We animate a dummy object to track progress from 0 to 1 based on scroll
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: "#scroll-container",
        start: "top top",
        end: "bottom bottom",
        scrub: 1, // Smooth scrubbing
      },
    });

    tl.to(progressRef.current, {
      value: 1,
      ease: "none",
    });

    timelineRef.current = tl;

    return () => {
      tl.kill();
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  useFrame(() => {
    const p = progressRef.current.value;

    // Define key camera positions [x, y, z] and lookAt [x, y, z]
    // Chapter 1: Intro
    const pos1 = new THREE.Vector3(0, 0, 8);
    const look1 = new THREE.Vector3(0, 0, 0);

    // Chapter 2: NASA HERC (Zoom to part)
    const pos2 = new THREE.Vector3(4, 2, 4);
    const look2 = new THREE.Vector3(0, 0, 0);

    // Chapter 3: Autonomy
    const pos3 = new THREE.Vector3(-4, -1, 3);
    const look3 = new THREE.Vector3(0, 0, 0);

    // Chapter 4: VSLAM / Point Cloud
    const pos4 = new THREE.Vector3(0, -4, -10);
    const look4 = new THREE.Vector3(0, -5, -20); // Looking at point cloud

    // Chapter 5: Skills
    const pos5 = new THREE.Vector3(0, 10, -5);
    const look5 = new THREE.Vector3(0, 0, -5);

    const currentPos = new THREE.Vector3();
    const currentLook = new THREE.Vector3();

    if (p < 0.25) {
      // 0 to 0.25
      const t = p / 0.25;
      currentPos.lerpVectors(pos1, pos2, t);
      currentLook.lerpVectors(look1, look2, t);
    } else if (p < 0.5) {
      // 0.25 to 0.5
      const t = (p - 0.25) / 0.25;
      currentPos.lerpVectors(pos2, pos3, t);
      currentLook.lerpVectors(look2, look3, t);
    } else if (p < 0.75) {
      // 0.5 to 0.75
      const t = (p - 0.5) / 0.25;
      currentPos.lerpVectors(pos3, pos4, t);
      currentLook.lerpVectors(look3, look4, t);
    } else {
      // 0.75 to 1.0
      const t = (p - 0.75) / 0.25;
      currentPos.lerpVectors(pos4, pos5, t);
      currentLook.lerpVectors(look4, look5, t);
    }

    camera.position.lerp(currentPos, 0.1); // Smooth interpolation
    // Assuming camera has a custom property or we just use lookAt
    camera.lookAt(currentLook);
  });

  return null;
}
