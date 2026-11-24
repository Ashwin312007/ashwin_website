"use client";

import type { ReactNode } from "react";
import { A11yProvider } from "./A11yProvider";
import { SmoothScroll } from "./SmoothScroll";
import { AudioProvider } from "./AudioProvider";
import { TransitionProvider } from "./TransitionProvider";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <A11yProvider>
      <SmoothScroll>
        <AudioProvider>
          <TransitionProvider>{children}</TransitionProvider>
        </AudioProvider>
      </SmoothScroll>
    </A11yProvider>
  );
}
