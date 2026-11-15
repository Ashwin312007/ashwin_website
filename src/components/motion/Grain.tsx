"use client";

import React from "react";

export function Grain() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-35 opacity-[0.038]"
      aria-hidden="true"
      style={{
        backgroundImage:
          "radial-gradient(rgba(255, 255, 255, 0.9) 1px, transparent 0)",
        backgroundSize: "22px 22px",
      }}
    />
  );
}
